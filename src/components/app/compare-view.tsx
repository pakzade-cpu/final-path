import { TEAMS, getTeam } from "@/data/ucl";
import { useDesk } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Crest } from "./crest";

const STATS = [
  { key: "attack", label: "ATT" },
  { key: "defense", label: "DEF" },
  { key: "tempo", label: "PAC" },
  { key: "depth", label: "DEP" },
  { key: "europe", label: "EUR" },
] as const;

function meter(value: number) {
  return Math.max(4, Math.min(100, value));
}

export function CompareView() {
  const compareA = useDesk((s) => s.compareA) ?? "liv";
  const compareB = useDesk((s) => s.compareB) ?? "rma";
  const setCompare = useDesk((s) => s.setCompare);
  const favoriteIds = useDesk((s) => s.favoriteIds);
  const a = getTeam(compareA);
  const b = getTeam(compareB);
  const pool = favoriteIds.length >= 2 ? TEAMS.filter((t) => favoriteIds.includes(t.id)) : TEAMS;

  return (
    <div className="space-y-5 pb-8">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-subtle">Substitution screen</p>
        <h1 className="mt-1 font-display text-3xl font-semibold">Compare</h1>
        <p className="mt-2 text-sm text-muted">
          Two clubs, one strip of bars — the PlayStation substitution read. Green is the stronger side on that line.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <label className="text-xs text-subtle">
          Left
          <select
            className="mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-fg"
            value={a.id}
            onChange={(e) => setCompare(e.target.value, b.id)}
          >
            {pool.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs text-subtle">
          Right
          <select
            className="mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-fg"
            value={b.id}
            onChange={(e) => setCompare(a.id, e.target.value)}
          >
            {pool.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <section className="overflow-hidden rounded-3xl p-4 panel">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <div className="flex flex-col items-center gap-2 text-center">
            <Crest team={a} size="lg" />
            <p className="font-display text-sm font-semibold">{a.short}</p>
            <p className="text-[11px] text-subtle">{a.name}</p>
          </div>
          <p className="font-display text-xs tracking-[0.2em] text-subtle">VS</p>
          <div className="flex flex-col items-center gap-2 text-center">
            <Crest team={b} size="lg" />
            <p className="font-display text-sm font-semibold">{b.short}</p>
            <p className="text-[11px] text-subtle">{b.name}</p>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {STATS.map((stat) => {
            const left = a[stat.key];
            const right = b[stat.key];
            return (
              <div key={stat.key} className="grid grid-cols-[2.2rem_1fr_auto_1fr_2.2rem] items-center gap-2">
                <span
                  className={cn(
                    "text-right font-display text-sm tabular",
                    left > right ? "text-emerald-600" : left < right ? "text-rose-500" : "text-muted",
                  )}
                >
                  {left}
                </span>
                <div className="h-2 overflow-hidden rounded-full bg-elevated">
                  <div
                    className={cn("ml-auto h-full rounded-full", left >= right ? "bg-emerald-600" : "bg-rose-400")}
                    style={{ width: `${meter(left)}%` }}
                  />
                </div>
                <span className="w-8 text-center text-[10px] font-semibold tracking-wide text-subtle">{stat.label}</span>
                <div className="h-2 overflow-hidden rounded-full bg-elevated">
                  <div
                    className={cn("h-full rounded-full", right >= left ? "bg-emerald-600" : "bg-rose-400")}
                    style={{ width: `${meter(right)}%` }}
                  />
                </div>
                <span
                  className={cn(
                    "font-display text-sm tabular",
                    right > left ? "text-emerald-600" : right < left ? "text-rose-500" : "text-muted",
                  )}
                >
                  {right}
                </span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
