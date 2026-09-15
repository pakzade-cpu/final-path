import { useState } from "react";
import { ScanText } from "lucide-react";
import { formatKickoff, getTeam, matchesFor, nextMatch, scoreline } from "@/data/ucl";
import { grokMatchBrief, type GrokBrief } from "@/lib/ai-forecast";
import { forecastMatch, pct } from "@/lib/forecast";
import { useDesk } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Crest } from "./crest";
import { FormStrip } from "./form-strip";
import { RadarCompare } from "./charts";
import { SlateCard } from "./slate-card";
import { toast } from "sonner";

function Bar({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs text-muted">
        <span>{label}</span>
        <span className="tabular">{pct(value)}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-elevated">
        <div
          className={`h-full rounded-full ${accent ? "bg-fg" : "bg-primary/70"}`}
          style={{ width: `${Math.round(value * 100)}%` }}
        />
      </div>
    </div>
  );
}

export function ForecastView() {
  const clubId = useDesk((s) => s.clubId)!;
  const next = nextMatch(clubId);
  const rest = matchesFor(clubId).filter((m) => m.id !== next?.id);
  const [brief, setBrief] = useState<GrokBrief | null>(null);
  const [busy, setBusy] = useState(false);

  if (!next) {
    return (
      <div className="space-y-6 pb-8">
        <p className="text-muted">No remaining league-phase match for your club.</p>
        <SlateCard />
      </div>
    );
  }

  const home = getTeam(next.home);
  const away = getTeam(next.away);
  const model = forecastMatch(next);
  const mineHome = clubId === home.id;

  async function askGrok() {
    const fixture = nextMatch(clubId);
    if (!fixture) return;
    const h = getTeam(fixture.home);
    const a = getTeam(fixture.away);
    const m = forecastMatch(fixture);
    setBusy(true);
    try {
      const res = await grokMatchBrief({
        data: {
          prompt: `Champions League 2026/27 MD${fixture.md}. ${h.name} vs ${a.name} at ${h.stadium} on ${formatKickoff(fixture.kickoff)}. Local model: ${m.score}, home ${pct(m.homeWin)} / draw ${pct(m.draw)} / away ${pct(m.awayWin)}. Write a sharp preview for a fan of ${getTeam(clubId).name}.`,
        },
      });
      if (res.ok) setBrief(res.brief);
      else toast.error(res.error);
    } catch {
      toast.error("Grok brief failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6 pb-8">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-subtle">Match forecast · MD{next.md}</p>
        <h1 className="mt-1 font-display text-3xl font-semibold">
          {home.short} vs {away.short}
        </h1>
        <p className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted">
          {formatKickoff(next.kickoff)} · {home.stadium}
        </p>
        <div className="mt-2 flex gap-4">
          <span className="flex items-center gap-2 text-xs text-subtle">
            {home.short} <FormStrip teamId={home.id} />
          </span>
          <span className="flex items-center gap-2 text-xs text-subtle">
            {away.short} <FormStrip teamId={away.id} />
          </span>
        </div>
      </div>

      <section className="rounded-3xl p-5 panel">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Crest team={home} />
            <span className="font-medium">{home.name}</span>
          </div>
          <span className="font-display text-2xl tabular">{brief?.score ?? model.score}</span>
          <div className="flex items-center gap-3">
            <span className="font-medium">{away.name}</span>
            <Crest team={away} />
          </div>
        </div>
        <div className="mt-6 space-y-3">
          <Bar label={home.short} value={brief?.homeWin ?? model.homeWin} accent={mineHome} />
          <Bar label="Draw" value={brief?.draw ?? model.draw} />
          <Bar label={away.short} value={brief?.awayWin ?? model.awayWin} accent={!mineHome} />
        </div>
        <p className="mt-4 text-xs text-subtle">
          xG {model.xgHome} – {model.xgAway} · Poisson from attack, defence, home edge and MD1 form.
        </p>
      </section>

      <section className="rounded-3xl p-5 panel">
        <h2 className="font-display text-lg">Keys</h2>
        <ul className="mt-3 space-y-2 text-sm text-muted">
          {model.keys.map((k) => (
            <li key={k} className="border-l border-border pl-3">
              {k}
            </li>
          ))}
        </ul>
        <RadarCompare a={home} b={away} />
      </section>

      <section className="rounded-3xl p-5 panel">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-lg">Grok brief</h2>
          <Button size="sm" onClick={askGrok} disabled={busy}>
            <ScanText /> {busy ? "Reading the night…" : brief ? "Refresh" : "Ask Grok"}
          </Button>
        </div>
        {brief ? (
          <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted">
            <p className="text-fg">{brief.narrative}</p>
            <p>
              <span className="text-subtle">Key · </span>
              {brief.key}
            </p>
          </div>
        ) : (
          <p className="mt-3 text-sm text-subtle">
            Optional Grok read of this fixture. One tap — not on page load.
          </p>
        )}
      </section>

      <SlateCard />

      <section>
        <h2 className="mb-3 font-display text-lg">Rest of the path</h2>
        <div className="space-y-2">
          {rest.map((m) => {
            const h = getTeam(m.home);
            const a = getTeam(m.away);
            const done = m.hg != null;
            return (
              <div
                key={m.id}
                className="flex items-center justify-between rounded-xl border border-border bg-surface px-3 py-3"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <Badge>{`MD${m.md}`}</Badge>
                  <Crest team={h} size="sm" />
                  <span className="truncate text-sm">
                    {h.short} vs {a.short}
                  </span>
                  <Crest team={a} size="sm" />
                </div>
                <span className="shrink-0 text-xs tabular text-muted">
                  {done ? scoreline(m) : formatKickoff(m.kickoff)}
                </span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
