import { Share2 } from "lucide-react";
import { FINAL, ROAD, computeTable, getTeam } from "@/data/ucl";
import { pathToFinal, pct } from "@/lib/forecast";
import { nativeShare, xIntent } from "@/lib/share";
import { useDesk } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Crest } from "./crest";
import { FinalOddsChart } from "./charts";
import { Sources } from "./sources";
import { toast } from "sonner";

export function FinalView() {
  const clubId = useDesk((s) => s.clubId);
  const displayName = useDesk((s) => s.displayName);
  const finalA = useDesk((s) => s.finalA);
  const finalB = useDesk((s) => s.finalB);
  const setFinal = useDesk((s) => s.setFinal);
  const odds = pathToFinal();

  function pick(id: string) {
    if (finalA === id) {
      setFinal(finalB, null);
      return;
    }
    if (finalB === id) {
      setFinal(finalA, null);
      return;
    }
    if (!finalA) setFinal(id, null);
    else if (!finalB && id !== finalA) setFinal(finalA, id);
    else setFinal(id, null);
  }

  async function sharePick() {
    if (!finalA || !finalB) {
      toast.error("Pick two clubs for Madrid night");
      return;
    }
    const a = getTeam(finalA);
    const b = getTeam(finalB);
    const text = `${displayName}'s Madrid night: ${a.name} vs ${b.name}.\nUCL final · 5 June 2027 · Estadio Metropolitano.\nTracked on World Soccer ${window.location.origin}`;
    const ok = await nativeShare("World Soccer", text, window.location.origin);
    if (!ok) window.open(xIntent(text), "_blank", "noopener,noreferrer");
  }

  return (
    <div className="space-y-6 pb-8">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-subtle">The final</p>
        <h1 className="mt-1 font-display text-3xl font-semibold">Who walks out in Madrid?</h1>
        <p className="mt-2 text-sm text-muted">
          5 June 2027 · {FINAL.venue}. Pick two. Share it on X.
        </p>
      </div>

      <ol className="grid grid-cols-3 gap-2 sm:grid-cols-6">
        {ROAD.map((step) => {
          const row = clubId ? computeTable().find((r) => r.team.id === clubId) : null;
          const here = step.id === "league";
          const door =
            (step.id === "r16" && row?.band === "r16") ||
            (step.id === "playoff" && row?.band === "playoff");
          return (
            <li
              key={step.id}
              className={`rounded-2xl px-2 py-3 text-center panel ${here || door ? "ring-1 ring-primary/30" : ""}`}
            >
              <p className="font-display text-sm">{step.label}</p>
              <p className="mt-1 text-xs text-subtle">{step.note}</p>
            </li>
          );
        })}
      </ol>

      <section className="rounded-3xl p-5 panel">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <FinalSlot teamId={finalA} label="Finalist" />
          <span className="font-display text-muted">vs</span>
          <FinalSlot teamId={finalB} label="Finalist" />
        </div>
        <Button className="mt-5 w-full" disabled={!finalA || !finalB} onClick={sharePick}>
          <Share2 /> Share pick on X
        </Button>
      </section>

      <section className="rounded-3xl p-5 panel">
        <h2 className="font-display text-lg">Model board</h2>
        <p className="mt-1 text-xs text-subtle">Chance of reaching the Metropolitano, from rating + MD1.</p>
        <FinalOddsChart highlight={clubId} />
      </section>

      <section>
        <h2 className="mb-3 font-display text-lg">Tap two clubs</h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {odds.map((row) => {
            const on = row.team.id === finalA || row.team.id === finalB;
            const mine = row.team.id === clubId;
            return (
              <button
                key={row.team.id}
                type="button"
                onClick={() => pick(row.team.id)}
                className={`flex items-center gap-2 rounded-xl border px-3 py-3 text-left ${
                  on ? "border-primary bg-elevated" : "border-border bg-surface hover:bg-elevated"
                }`}
              >
                <Crest team={row.team} size="sm" />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium">
                    {row.team.short}
                    {mine ? " · you" : ""}
                  </span>
                  <span className="text-[11px] tabular text-subtle">{pct(row.finalPct)}</span>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <Sources show={["model", "results", "code"]} />
    </div>
  );
}

function FinalSlot({ teamId, label }: { teamId: string | null; label: string }) {
  if (!teamId) {
    return (
      <div className="flex h-28 flex-col items-center justify-center rounded-2xl border border-dashed border-border text-xs uppercase tracking-wide text-subtle">
        {label}
      </div>
    );
  }
  const t = getTeam(teamId);
  return (
    <div className="flex h-28 flex-col items-center justify-center gap-2 rounded-2xl border border-border bg-elevated">
      <Crest team={t} />
      <span className="text-sm font-medium">{t.short}</span>
    </div>
  );
}
