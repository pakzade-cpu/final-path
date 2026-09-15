import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Copy, Radio, Share2, Users } from "lucide-react";
import { useP2PRoom } from "@/lib/multiplayer";
import {
  formatKickoff,
  getTeam,
  nextKickoff,
  nextMatch,
  upcomingOnDay,
} from "@/data/ucl";
import { forecastMatch, pct } from "@/lib/forecast";
import { copyText, nativeShare, shareNightCopy, xIntent } from "@/lib/share";
import { useDesk } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Crest } from "./crest";
import { Countdown } from "./countdown";
import { toast } from "sonner";

function code6(): string {
  const a = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 6 }, () => a[Math.floor(Math.random() * a.length)]).join("");
}

type ChatLine = { from: string; name: string; text: string; at: number };

function NightRoom({
  code,
  name,
  clubId,
}: {
  code: string;
  name: string;
  clubId: string;
}) {
  const p2p = useP2PRoom({ room: `fp-${code}`, name: `${name} · ${getTeam(clubId).short}` });
  const [lines, setLines] = useState<ChatLine[]>([]);
  const [draft, setDraft] = useState("");
  const [picks, setPicks] = useState<Record<string, string>>({});
  const next = nextMatch(clubId) ?? nextKickoff();
  const slate = upcomingOnDay();
  const club = getTeam(clubId);

  useEffect(() => {
    return p2p.onMessage((_from, data) => {
      const msg = data as { t?: string; name?: string; text?: string; pick?: string; from?: string };
      if (msg.t === "chat" && msg.name && msg.text) {
        const name = msg.name;
        const text = msg.text;
        setLines((xs) => [...xs.slice(-40), { from: msg.from ?? "", name, text, at: Date.now() }]);
      }
      if (msg.t === "pick" && msg.from && msg.pick && msg.name) {
        setPicks((p) => ({ ...p, [msg.from!]: `${msg.name}: ${msg.pick}` }));
      }
    });
  }, [p2p.onMessage]);

  useEffect(() => {
    if (!p2p.joined) return;
    p2p.send({ t: "hello", name, club: club.short });
  }, [p2p.joined, p2p.send, name, club.short]);

  function sendChat() {
    const text = draft.trim();
    if (!text) return;
    p2p.send({ t: "chat", name, text, from: p2p.selfId });
    setLines((xs) => [...xs, { from: p2p.selfId, name, text, at: Date.now() }]);
    setDraft("");
  }

  function sharePick(label: string) {
    p2p.send({ t: "pick", from: p2p.selfId, name, pick: label });
    setPicks((p) => ({ ...p, [p2p.selfId]: `${name}: ${label}` }));
    toast.success("Pick sent to the room");
  }

  const liveUrl = `${typeof window !== "undefined" ? window.location.origin : ""}?night=${code}`;

  async function invite() {
    const text = shareNightCopy(code, club.name, liveUrl);
    const ok = await nativeShare("Join my UCL night", text, liveUrl);
    if (!ok) window.open(xIntent(text), "_blank", "noopener,noreferrer");
  }

  return (
    <div className="space-y-5 pb-8">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-subtle">Night desk</p>
          <h1 className="mt-1 font-display text-3xl font-semibold">Room {code}</h1>
          <p className="mt-2 flex items-center gap-2 text-sm text-muted">
            <Users className="size-4" />
            {p2p.peers.length + 1} in the room
            {p2p.joined ? "" : " · connecting"}
          </p>
        </div>
        <Badge>{club.short}</Badge>
      </div>

      <div className="flex gap-2">
        <Button className="flex-1" onClick={invite}>
          <Share2 /> Invite on X
        </Button>
        <Button
          variant="outline"
          className="flex-1"
          onClick={async () => {
            const ok = await copyText(liveUrl);
            toast[ok ? "success" : "error"](ok ? "Link copied" : "Could not copy");
          }}
        >
          <Copy /> Copy link
        </Button>
      </div>

      {next && (
        <section className="rounded-3xl p-5 panel">
          <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-subtle">
            <Radio className="size-3.5" /> Shared live board
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Crest team={getTeam(next.home)} />
              <span className="font-medium">{getTeam(next.home).short}</span>
            </div>
            <span className="text-xs text-muted">{formatKickoff(next.kickoff)}</span>
            <div className="flex items-center gap-2">
              <span className="font-medium">{getTeam(next.away).short}</span>
              <Crest team={getTeam(next.away)} />
            </div>
          </div>
          <div className="mt-4">
            <Countdown iso={next.kickoff} />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {(["Home", "Draw", "Away"] as const).map((lab) => {
              const m = forecastMatch(next);
              const tag =
                lab === "Home"
                  ? `${getTeam(next.home).short} ${pct(m.homeWin)}`
                  : lab === "Away"
                    ? `${getTeam(next.away).short} ${pct(m.awayWin)}`
                    : `Draw ${pct(m.draw)}`;
              return (
                <Button key={lab} size="sm" variant="outline" onClick={() => sharePick(tag)}>
                  {lab}
                </Button>
              );
            })}
          </div>
        </section>
      )}

      {slate.length > 0 && (
        <section>
          <h2 className="mb-2 font-display text-lg">That night's slate</h2>
          <div className="space-y-2">
            {slate.slice(0, 8).map((m) => (
              <div
                key={m.id}
                className="flex items-center justify-between rounded-xl border border-border bg-surface px-3 py-2.5 text-sm"
              >
                <span className="flex items-center gap-2">
                  <Crest team={getTeam(m.home)} size="sm" />
                  {getTeam(m.home).short} vs {getTeam(m.away).short}
                  <Crest team={getTeam(m.away)} size="sm" />
                </span>
                <span className="text-xs tabular text-muted">
                  {new Date(m.kickoff).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {Object.keys(picks).length > 0 && (
        <section className="rounded-2xl px-4 py-3 panel">
          <p className="text-xs uppercase tracking-wide text-subtle">Room picks</p>
          <ul className="mt-2 space-y-1 text-sm text-muted">
            {Object.values(picks).map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </section>
      )}

      <section className="rounded-3xl p-4 panel">
        <p className="text-xs uppercase tracking-wide text-subtle">Room chat</p>
        <div className="mt-3 max-h-48 space-y-2 overflow-y-auto">
          {lines.length === 0 && <p className="text-sm text-subtle">No lines yet. Invite a friend.</p>}
          {lines.map((l, i) => (
            <p key={`${l.at}-${i}`} className="text-sm">
              <span className="text-muted">{l.name}: </span>
              <span>{l.text}</span>
            </p>
          ))}
        </div>
        <div className="mt-3 flex gap-2">
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Say something"
            onKeyDown={(e) => {
              if (e.key === "Enter") sendChat();
            }}
          />
          <Button onClick={sendChat}>Send</Button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {p2p.peers.map((p) => (
            <Badge key={p.id} tone={p.connectionState === "failed" ? "loss" : "default"}>
              {p.name || p.id}
              {p.connectionState === "failed" ? " · blocked" : ""}
            </Badge>
          ))}
        </div>
      </section>
    </div>
  );
}

export function NightView({ preset }: { preset?: string }) {
  const navigate = useNavigate({ from: "/" });
  const displayName = useDesk((s) => s.displayName);
  const clubId = useDesk((s) => s.clubId)!;
  const nightName = useDesk((s) => s.nightName);
  const nightCode = useDesk((s) => s.nightCode);
  const setNight = useDesk((s) => s.setNight);
  const [join, setJoin] = useState(preset ?? "");

  const name = nightName || displayName || "Fan";
  const active = nightCode || (preset && /^[A-Z0-9]{4,8}$/i.test(preset) ? preset.toUpperCase() : null);
  const roomKey = useMemo(() => active, [active]);

  function goRoom(c: string) {
    setNight(name, c);
    void navigate({ search: { night: c } });
  }

  if (roomKey) {
    return (
      <div>
        <NightRoom key={roomKey} code={roomKey} name={name} clubId={clubId} />
        <Button
          variant="ghost"
          className="w-full text-subtle"
          onClick={() => {
            setNight(name, null);
            void navigate({ search: {} });
          }}
        >
          Leave night
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-subtle">Watch together</p>
        <h1 className="mt-1 font-display text-3xl font-semibold">Open a night</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Share a room with friends. Same countdown, same slate, live chat — then post the link on X.
        </p>
      </div>
      <div className="space-y-3 rounded-3xl p-5 panel">
        <label className="text-xs uppercase tracking-wide text-subtle">Your name in the room</label>
        <Input defaultValue={name} onBlur={(e) => setNight(e.target.value.trim() || name, null)} />
        <Button className="w-full" onClick={() => goRoom(code6())}>
          Create night
        </Button>
      </div>
      <div className="space-y-3 rounded-3xl p-5 panel">
        <label className="text-xs uppercase tracking-wide text-subtle">Join with a code</label>
        <Input
          value={join}
          onChange={(e) => setJoin(e.target.value.toUpperCase())}
          placeholder="ABC123"
          maxLength={8}
        />
        <Button variant="outline" className="w-full" disabled={join.length < 4} onClick={() => goRoom(join.trim().toUpperCase())}>
          Join friends
        </Button>
      </div>
    </div>
  );
}
