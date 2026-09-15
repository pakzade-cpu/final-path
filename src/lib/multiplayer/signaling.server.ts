import { z } from "zod";
import type { PeerRow, RtcPollResponse, SignalRow } from "./p2p";

const ID = z.string().regex(/^[a-zA-Z0-9_-]{1,64}$/);
const signalSchema = z.object({
  op: z.literal("signal"),
  room: ID,
  from: ID,
  to: ID,
  kind: z.enum(["offer", "answer", "ice"]),
  payload: z.unknown().refine((v) => v !== undefined && JSON.stringify(v).length <= 32_768, {
    message: "payload too large",
  }),
});
const leaveSchema = z.object({ op: z.literal("leave"), room: ID, peer: ID });
const postSchema = z.discriminatedUnion("op", [signalSchema, leaveSchema]);

const PEER_TTL_MS = 30_000;
const SIGNAL_TTL_MS = 60_000;

type MemPeer = { room: string; id: string; name: string; lastSeen: number };
type MemSignal = { id: number; room: string; to: string; from: string; kind: SignalRow["kind"]; payload: unknown; at: number };

const mem = globalThis as typeof globalThis & {
  __fpRtcPeers__?: Map<string, MemPeer>;
  __fpRtcSignals__?: MemSignal[];
  __fpRtcSeq__?: number;
};

function peersMap() {
  mem.__fpRtcPeers__ ??= new Map();
  return mem.__fpRtcPeers__;
}
function signalsList() {
  mem.__fpRtcSignals__ ??= [];
  return mem.__fpRtcSignals__;
}
function nextId() {
  mem.__fpRtcSeq__ = (mem.__fpRtcSeq__ ?? 0) + 1;
  return mem.__fpRtcSeq__;
}

function key(room: string, peer: string) {
  return `${room}::${peer}`;
}

function pruneMem() {
  const now = Date.now();
  const peers = peersMap();
  for (const [k, p] of peers) {
    if (now - p.lastSeen > PEER_TTL_MS) peers.delete(k);
  }
  mem.__fpRtcSignals__ = signalsList().filter((s) => now - s.at < SIGNAL_TTL_MS);
}

function rosterMem(room: string): PeerRow[] {
  const now = Date.now();
  return [...peersMap().values()]
    .filter((p) => p.room === room && now - p.lastSeen <= PEER_TTL_MS)
    .map((p) => ({ id: p.id, name: p.name }))
    .sort((a, b) => a.id.localeCompare(b.id))
    .slice(0, 32);
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}

async function handleGet(url: URL): Promise<Response> {
  const parsed = z
    .object({
      room: ID,
      peer: ID,
      name: z.string().max(64).default(""),
      since: z.coerce.number().int().min(0).default(0),
    })
    .safeParse({
      room: url.searchParams.get("room"),
      peer: url.searchParams.get("peer"),
      name: url.searchParams.get("name") ?? "",
      since: url.searchParams.get("since") ?? 0,
    });
  if (!parsed.success) return json({ error: "invalid query" }, 400);
  const { room, peer, name, since } = parsed.data;

  pruneMem();
  peersMap().set(key(room, peer), { room, id: peer, name, lastSeen: Date.now() });
  const signals: SignalRow[] = signalsList()
    .filter((s) => s.room === room && s.to === peer && s.id > since)
    .slice(0, 200)
    .map((s) => ({ id: s.id, from: s.from, kind: s.kind, payload: s.payload }));
  const body: RtcPollResponse = { peers: rosterMem(room), signals };
  return json(body);
}

async function handlePost(request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: "invalid JSON" }, 400);
  }
  const parsed = postSchema.safeParse(body);
  if (!parsed.success) return json({ error: "invalid request" }, 400);
  const msg = parsed.data;

  if (msg.op === "signal") {
    signalsList().push({
      id: nextId(),
      room: msg.room,
      to: msg.to,
      from: msg.from,
      kind: msg.kind,
      payload: msg.payload,
      at: Date.now(),
    });
  } else {
    peersMap().delete(key(msg.room, msg.peer));
  }
  return json({ ok: true });
}

export async function handleSignaling(request: Request): Promise<Response> {
  try {
    if (request.method === "GET") return await handleGet(new URL(request.url));
    if (request.method === "POST") return await handlePost(request);
    return json({ error: "method not allowed" }, 405);
  } catch (error) {
    console.error("[rtc] signaling error:", error);
    return json({ error: "signaling failed" }, 500);
  }
}
