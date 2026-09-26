import { useEffect, useRef, useState } from "react";
import { Sparkles, X, Send } from "lucide-react";
import { askAssistant, type ChatTurn } from "@/lib/assistant";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
  tone?: "normal" | "notice";
};

const GREETING: Message = {
  id: "greeting",
  role: "assistant",
  text: "Hi — ask me about Champions League scoring, the table, kits, World regions, favourites, or team compare. I'll answer from the desk (and Grok when a key is set).",
};

function newId() {
  return Math.random().toString(36).slice(2);
}

export function Assistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, busy, open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  async function send() {
    const text = draft.trim();
    if (!text || busy) return;
    const userMsg: Message = { id: newId(), role: "user", text };
    const history: ChatTurn[] = messages
      .filter((m) => m.id !== "greeting" && m.tone !== "notice")
      .map((m) => ({ role: m.role, content: m.text }));
    setMessages((prev) => [...prev, userMsg]);
    setDraft("");
    setBusy(true);
    try {
      const res = await askAssistant({ data: { message: text, history } });
      if (res.ok) {
        setMessages((prev) => [...prev, { id: newId(), role: "assistant", text: res.reply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { id: newId(), role: "assistant", text: res.message, tone: "notice" },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: newId(),
          role: "assistant",
          text: "Something went wrong reaching the assistant. Please try again in a moment.",
          tone: "notice",
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open assistant"
          className="fixed bottom-20 right-4 z-30 grid size-12 place-items-center rounded-full bg-primary text-primary-fg shadow-lg shadow-primary/30 transition-transform duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] hover:opacity-90 active:scale-95 sm:bottom-6"
        >
          <Sparkles className="size-5" />
        </button>
      )}

      {open && (
        <div className="fixed bottom-20 right-4 z-30 flex h-[32rem] max-h-[calc(100dvh-8rem)] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-3xl border border-border bg-surface shadow-2xl sm:bottom-6">
          <header className="flex items-center justify-between border-b border-border bg-bg/60 px-4 py-3 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <span className="grid size-8 place-items-center rounded-full bg-elevated text-primary">
                <Sparkles className="size-4" />
              </span>
              <div>
                <p className="font-display text-sm tracking-[0.14em]">ASSISTANT</p>
                <p className="text-[11px] uppercase tracking-[0.16em] text-subtle">
                  Powered by Grok
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close assistant"
              className="grid size-8 place-items-center rounded-full text-subtle transition-colors hover:bg-elevated hover:text-fg"
            >
              <X className="size-4" />
            </button>
          </header>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
              >
                <div
                  className={cn(
                    "max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm leading-relaxed",
                    m.role === "user"
                      ? "bg-primary text-primary-fg"
                      : m.tone === "notice"
                        ? "border border-border bg-elevated text-muted"
                        : "bg-elevated text-fg",
                  )}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {busy && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1 rounded-2xl bg-elevated px-3 py-2.5">
                  <span className="size-1.5 animate-bounce rounded-full bg-subtle [animation-delay:-0.3s]" />
                  <span className="size-1.5 animate-bounce rounded-full bg-subtle [animation-delay:-0.15s]" />
                  <span className="size-1.5 animate-bounce rounded-full bg-subtle" />
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2 border-t border-border bg-bg/60 px-3 py-3 backdrop-blur-md">
            <Input
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Ask about scoring, the table…"
              disabled={busy}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void send();
                }
              }}
            />
            <Button
              size="icon"
              aria-label="Send message"
              disabled={busy || !draft.trim()}
              onClick={() => void send()}
            >
              <Send />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
