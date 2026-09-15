import { ArrowRight } from "lucide-react";
import { squadFor, type SquadPlayer } from "@/data/squads";
import { getTeam } from "@/data/ucl";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export type LineupState = {
  starters: string[];
  subs: string[];
  firstOff: string | null;
  firstOn: string | null;
};

export function LineupPick({
  teamId,
  value,
  onChange,
  disabled,
}: {
  teamId: string;
  value: LineupState;
  onChange: (v: LineupState) => void;
  disabled?: boolean;
}) {
  const team = getTeam(teamId);
  const squad = squadFor(teamId);
  const role = (id: string): "start" | "bench" | "out" => {
    if (value.starters.includes(id)) return "start";
    if (value.subs.includes(id)) return "bench";
    return "out";
  };

  function cycle(p: SquadPlayer) {
    if (disabled) return;
    const r = role(p.id);
    let starters = value.starters.filter((x) => x !== p.id);
    let subs = value.subs.filter((x) => x !== p.id);
    if (r === "out") {
      if (starters.length < 11) starters = [...starters, p.id];
      else if (subs.length < 5) subs = [...subs, p.id];
    } else if (r === "start") {
      if (subs.length < 5) subs = [...subs, p.id];
    }
    const firstOff = starters.includes(value.firstOff ?? "") ? value.firstOff : null;
    const firstOn = subs.includes(value.firstOn ?? "") ? value.firstOn : null;
    onChange({ starters, subs, firstOff, firstOn });
  }

  const byId = Object.fromEntries(squad.map((p) => [p.id, p]));
  const starters = value.starters.map((id) => byId[id]).filter(Boolean);
  const rows = {
    FW: starters.filter((p) => p.pos === "FW"),
    MF: starters.filter((p) => p.pos === "MF"),
    DF: starters.filter((p) => p.pos === "DF"),
    GK: starters.filter((p) => p.pos === "GK"),
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm text-muted">{team.short} XI · tap to cycle Start / Bench / Out</p>
        <span className="text-xs tabular text-subtle">
          {value.starters.length}/11 · {value.subs.length}/5
        </span>
      </div>

      <div className="space-y-4 rounded-3xl bg-pitch px-3 py-4 text-pitch-fg">
        {(["FW", "MF", "DF", "GK"] as const).map((pos) => (
          <div key={pos} className="flex flex-wrap items-center justify-center gap-2">
            {rows[pos].length === 0 ? (
              <span className="text-xs uppercase tracking-wide opacity-60">{pos}</span>
            ) : (
              rows[pos].map((p) => (
                <span
                  key={p.id}
                  className="inline-flex min-w-14 flex-col items-center rounded-lg bg-fg/20 px-2 py-1"
                >
                  <span className="font-display text-sm tabular leading-none">{p.num}</span>
                  <span className="max-w-16 truncate text-xs">{p.name.split(" ").pop()}</span>
                </span>
              ))
            )}
          </div>
        ))}
      </div>

      <div className="grid gap-1.5">
        {squad.map((p) => {
          const r = role(p.id);
          return (
            <button
              key={p.id}
              type="button"
              disabled={disabled}
              onClick={() => cycle(p)}
              className={cn(
                "flex min-h-12 items-center justify-between rounded-xl border px-3 py-2 text-left",
                r === "start" && "border-primary bg-elevated",
                r === "bench" && "border-playoff/40 bg-surface",
                r === "out" && "border-border bg-surface/70",
              )}
            >
              <span>
                <span className="mr-2 font-display text-sm tabular text-subtle">{p.num}</span>
                <span className="text-sm font-medium text-fg">{p.name}</span>
                <span className="ml-2 text-xs uppercase tracking-wide text-subtle">{p.pos}</span>
              </span>
              <Badge tone={r === "start" ? "r16" : r === "bench" ? "playoff" : "out"}>
                {r === "start" ? "Start" : r === "bench" ? "Bench" : "Out"}
              </Badge>
            </button>
          );
        })}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1 text-xs uppercase tracking-wide text-subtle">
          First player off
          <select
            disabled={disabled || value.starters.length === 0}
            className="flex h-11 w-full rounded-md border border-border bg-elevated px-3 text-sm text-fg"
            value={value.firstOff ?? ""}
            onChange={(e) => onChange({ ...value, firstOff: e.target.value || null })}
          >
            <option value="">Not set</option>
            {value.starters.map((id) => (
              <option key={id} value={id}>
                {byId[id]?.name ?? id}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1 text-xs uppercase tracking-wide text-subtle">
          First player on
          <select
            disabled={disabled || value.subs.length === 0}
            className="flex h-11 w-full rounded-md border border-border bg-elevated px-3 text-sm text-fg"
            value={value.firstOn ?? ""}
            onChange={(e) => onChange({ ...value, firstOn: e.target.value || null })}
          >
            <option value="">Not set</option>
            {value.subs.map((id) => (
              <option key={id} value={id}>
                {byId[id]?.name ?? id}
              </option>
            ))}
          </select>
        </label>
      </div>
      {value.firstOff && value.firstOn && (
        <p className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-elevated px-3 py-3 text-sm">
          <span className="font-medium">{byId[value.firstOff]?.name ?? "Off"}</span>
          <ArrowRight className="size-4 text-subtle" />
          <span className="font-medium">{byId[value.firstOn]?.name ?? "On"}</span>
        </p>
      )}
    </div>
  );
}
