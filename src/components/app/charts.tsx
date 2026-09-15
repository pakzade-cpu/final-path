import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";
import type { Team } from "@/data/ucl";
import { pathToFinal } from "@/lib/forecast";

export function RadarCompare({ a, b }: { a: Team; b: Team }) {
  const data = [
    { k: "Attack", a: a.attack, b: b.attack },
    { k: "Defence", a: a.defense, b: b.defense },
    { k: "Tempo", a: a.tempo, b: b.tempo },
    { k: "Depth", a: a.depth, b: b.depth },
    { k: "Europe", a: a.europe, b: b.europe },
  ];
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="72%">
          <PolarGrid stroke="var(--color-border)" />
          <PolarAngleAxis dataKey="k" tick={{ fill: "var(--color-muted)", fontSize: 11 }} />
          <PolarRadiusAxis domain={[40, 100]} tick={false} axisLine={false} />
          <Radar dataKey="a" stroke="var(--color-fg)" fill="var(--color-fg)" fillOpacity={0.18} />
          <Radar dataKey="b" stroke="var(--color-muted)" fill="var(--color-muted)" fillOpacity={0.08} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function FinalOddsChart({ highlight }: { highlight?: string | null }) {
  const rows = pathToFinal()
    .slice(0, 10)
    .map((r) => ({
      name: r.team.short,
      id: r.team.id,
      pct: Math.round(r.finalPct * 1000) / 10,
    }));
  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={rows} layout="vertical" margin={{ left: 8, right: 12, top: 4, bottom: 4 }}>
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="name"
            width={44}
            tick={{ fill: "var(--color-muted)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: "var(--color-elevated)" }}
            contentStyle={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              borderRadius: 8,
              color: "var(--color-fg)",
              fontSize: 12,
            }}
            formatter={(v) => [`${v}%`, "Final"]}
          />
          <Bar dataKey="pct" radius={[0, 4, 4, 0]}>
            {rows.map((r) => (
              <Cell
                key={r.id}
                fill={r.id === highlight ? "var(--color-fg)" : "var(--color-primary)"}
                fillOpacity={r.id === highlight ? 1 : 0.45}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
