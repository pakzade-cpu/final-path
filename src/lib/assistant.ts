import { createServerFn } from "@tanstack/react-start";
import { localDeskReply } from "./assistant-local";

export type ChatRole = "user" | "assistant";

export type ChatTurn = {
  role: ChatRole;
  content: string;
};

export type AssistantReply =
  | { ok: true; reply: string }
  | { ok: false; reason: "unconfigured" | "upstream" | "timeout" | "empty"; message: string };

type ChatInput = {
  message: string;
  history?: ChatTurn[];
};

const XAI_ENDPOINT = "https://api.x.ai/v1/chat/completions";
const DEFAULT_MODEL = "grok-2-latest";
const MAX_HISTORY = 12;
const MAX_MESSAGE = 2_000;
const TIMEOUT_MS = 30_000;

const SYSTEM_PROMPT = [
  "You are the Assistant for World Soccer, a Champions League forecast desk by Aras Studio.",
  "Help users get the most out of the app and answer general football / UEFA Champions League questions.",
  "The app covers: building a personal kit (club, player, shirt number, photo);",
  "the 36-team league-phase table with a what-if that recomputes standings from hypothetical results;",
  "a matchday prediction card scored as 5 points for an exact score and 2 points for the correct result (win/draw/loss);",
  "a fan club / leaderboard where friends compare their prediction points;",
  "and a final pick where users lock in who they think reaches and wins the final in Madrid.",
  "Keep answers concise, friendly and practical. When asked about scoring, be precise:",
  "exact score = 5 points, correct result only = 2 points, otherwise 0.",
  "If a question is outside football or this app, answer briefly and steer back to how the app can help.",
].join(" ");

function clampContent(value: unknown): string {
  return typeof value === "string" ? value.trim().slice(0, MAX_MESSAGE) : "";
}

function sanitizeHistory(history: ChatTurn[] | undefined): ChatTurn[] {
  if (!Array.isArray(history)) return [];
  return history
    .map((turn) => ({
      role: turn?.role === "assistant" ? ("assistant" as const) : ("user" as const),
      content: clampContent(turn?.content),
    }))
    .filter((turn) => turn.content.length > 0)
    .slice(-MAX_HISTORY);
}

type XaiChoice = { message?: { content?: unknown } };
type XaiResponse = { choices?: XaiChoice[] };

export const askAssistant = createServerFn({ method: "POST" })
  .validator((input: ChatInput) => {
    const message = clampContent(input?.message);
    if (!message) throw new Error("Ask a question first");
    return { message, history: sanitizeHistory(input?.history) };
  })
  .handler(async ({ data }): Promise<AssistantReply> => {
    const apiKey = process.env.XAI_API_KEY?.trim();
    if (!apiKey) {
      return { ok: true, reply: localDeskReply(data.message) };
    }

    const model = process.env.XAI_MODEL?.trim() || DEFAULT_MODEL;
    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...data.history.map((turn) => ({ role: turn.role, content: turn.content })),
      { role: "user", content: data.message },
    ];

    try {
      const res = await fetch(XAI_ENDPOINT, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ model, messages, stream: false }),
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });

      if (!res.ok) {
        return {
          ok: false,
          reason: "upstream",
          message: "The assistant service returned an error. Please try again in a moment.",
        };
      }

      const json = (await res.json()) as XaiResponse;
      const reply = clampContent(json?.choices?.[0]?.message?.content);
      if (!reply) {
        return {
          ok: false,
          reason: "empty",
          message: "The assistant didn't have a reply for that. Try rephrasing your question.",
        };
      }
      return { ok: true, reply };
    } catch (err) {
      const timedOut = err instanceof DOMException && err.name === "TimeoutError";
      return {
        ok: false,
        reason: timedOut ? "timeout" : "upstream",
        message: timedOut
          ? "The assistant took too long to respond. Please try again."
          : "The assistant couldn't be reached right now. Please try again in a moment.",
      };
    }
  });
