import { useMemo, useState } from "react";
import { computeTable, nextMatch, opponentOf, simulateNext, type Standing } from "@/data/ucl";
import { projectedTable } from "@/lib/forecast";
import { useDesk } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Crest } from "./crest";
import { FormStrip } from "./form-strip";
import { cn } from "@/lib/utils";

function bandLabel(band: Standing["band"]) {
  return band === "r16" ? "R16" : band === "playoff" ? "PO" : "OUT";
}

export function TableView() {
  const clubId = useDesk((s) => s.clubId);
  const rows = computeTable();
  const proj = useMemo(() => projectedTable(), []);
  const projPos = useMemo(() => new Map(proj.map((r) => [r.team.id, r.pos])), [proj]);
  const next = clubId ? nextMatch(clubId) : undefined;
  const opp = next && clubId ? opponentOf(next, clubId) : null;
  const [hypo, setHypo] = useState<"W" | "D" | "L" | null>(null);
  const sim = clubId && hypo ? simulateNext(clubId, hypo) : null;
  const mine = clubId ? rows.find((r) => r.team.id === clubId) : null;
  const mineProj = clubId ? proj.find((r) => r.team.id === clubId) : null;

  return (
    <div className="space-y-6 pb-8">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-subtle">League phase</p>
        <h1 className="mt-1 font-display text-3xl font-semibold">The 36</h1>
        <p className="mt-2 text-sm text-muted">
          Top 8 to the round of 16. 9–24 play off. 25–36 are out in January.
        </p>
      </div>

      {mine && next && opp && (
        <section className="rounded-3xl p-5 panel">
          <p className="text-xs uppercase tracking-wide text-subtle">What if · vs {opp.short}</p>
          <p className="mt-2 text-sm text-muted">
            You sit P{mine.pos} · {bandLabel(mine.band)}. Tap a result for the next night.
          </p>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {(["W", "D", "L"] as const).map((r) => (
              <Button key={r} variant={hypo === r ? "default" : "outline"} onClick={() => setHypo(r)}>
                {r === "W" ? "Win" : r === "D" ? "Draw" : "Loss"}
              </Button>
            ))}
          </div>
          {sim && (
            <p className="mt-4 text-sm">
              After a {hypo === "W" ? "win" : hypo === "D" ? "draw" : "loss"} you would sit{" "}
              <span className="font-medium">P{sim.next.pos}</span> · {bandLabel(sim.next.band)}
              {sim.next.band !== sim.current.band ? " — band changes." : "."}
            </p>
          )}
          {mineProj && (
            <p className="mt-2 text-xs text-subtle">
              Model finish after 8 nights: P{mineProj.pos} · {bandLabel(mineProj.band)} (remaining scores filled
              from the desk model).
            </p>
          )}
        </section>
      )}

      <div className="overflow-hidden rounded-3xl border border-border">
        <div className="grid grid-cols-[2rem_1fr_repeat(5,2.1rem)] gap-1 bg-elevated px-3 py-2 text-xs uppercase tracking-wide text-subtle sm:grid-cols-[2.4rem_1fr_repeat(9,2.2rem)]">
          <span>#</span>
          <span>Club</span>
          <span className="text-right">P</span>
          <span className="hidden text-right sm:block">W</span>
          <span className="hidden text-right sm:block">D</span>
          <span className="hidden text-right sm:block">L</span>
          <span className="text-right">GD</span>
          <span className="text-right">Pts</span>
          <span className="hidden text-right sm:block">Proj</span>
          <span className="text-right">Band</span>
        </div>
        {rows.map((r) => {
          const mineRow = r.team.id === clubId;
          const ppos = projPos.get(r.team.id);
          return (
            <div
              key={r.team.id}
              className={cn(
                "grid grid-cols-[2rem_1fr_repeat(5,2.1rem)] items-center gap-1 border-t border-border px-3 py-2.5 text-sm sm:grid-cols-[2.4rem_1fr_repeat(9,2.2rem)]",
                mineRow ? "bg-elevated" : "bg-surface",
              )}
            >
              <span className="tabular text-muted">{r.pos}</span>
              <span className="flex min-w-0 items-center gap-2">
                <Crest team={r.team} size="sm" />
                <span className="truncate font-medium">{r.team.short}</span>
                <span className="hidden sm:inline">
                  <FormStrip teamId={r.team.id} n={3} />
                </span>
              </span>
              <span className="text-right tabular text-muted">{r.played}</span>
              <span className="hidden text-right tabular text-muted sm:block">{r.won}</span>
              <span className="hidden text-right tabular text-muted sm:block">{r.drawn}</span>
              <span className="hidden text-right tabular text-muted sm:block">{r.lost}</span>
              <span className="text-right tabular">{r.gd > 0 ? `+${r.gd}` : r.gd}</span>
              <span className="text-right font-medium tabular">{r.pts}</span>
              <span className="hidden text-right tabular text-subtle sm:block">{ppos ?? "–"}</span>
              <span className="flex justify-end">
                <Badge tone={r.band} className="hidden sm:inline-flex">
                  {bandLabel(r.band)}
                </Badge>
                <span className="text-xs uppercase text-subtle sm:hidden">{bandLabel(r.band)}</span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
