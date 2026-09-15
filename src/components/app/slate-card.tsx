import { useEffect, useMemo, useState } from "react";
import { ListChecks } from "lucide-react";
import {
  MATCHES,
  activeMatchday,
  formatKickoff,
  getTeam,
  gradePick,
  matchesOnMd,
} from "@/data/ucl";
import { forecastMatch } from "@/lib/forecast";
import { loadMySlate, saveSlatePicks, type SlatePick } from "@/lib/fan-club";
import { useDesk } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Crest } from "./crest";
import { FormStrip } from "./form-strip";
import { CompactScore } from "./stepper";
import { toast } from "sonner";

function parseModel(score: string): [number, number] {
  const [h, a] = score.split("–").map((n) => Number(n));
  return [Number.isFinite(h) ? h : 1, Number.isFinite(a) ? a : 1];
}

export function SlateCard({ compact }: { compact?: boolean }) {
  const clubId = useDesk((s) => s.clubId)!;
  const setView = useDesk((s) => s.setView);
  const [md, setMd] = useState(activeMatchday);
  const [picks, setPicks] = useState<Record<string, { h: number; a: number }>>({});
  const [busy, setBusy] = useState(false);
  const fixtures = useMemo(() => matchesOnMd(md), [md]);

  useEffect(() => {
    void loadMySlate()
      .then((rows) => {
        setPicks((prev) => {
          const next = { ...prev };
          for (const r of rows) next[r.matchId] = { h: r.homeGoals, a: r.awayGoals };
          return next;
        });
      })
      .catch(() => undefined);
  }, []);

  const stats = useMemo(() => {
    let pts = 0;
    let exact = 0;
    let result = 0;
    let todo = 0;
    for (const m of fixtures) {
      const p = picks[m.id];
      if (!p) {
        if (m.hg == null) todo += 1;
        continue;
      }
      const g = gradePick(m, p.h, p.a);
      pts += g.points;
      if (g.tag === "exact") exact += 1;
      if (g.tag === "result") result += 1;
      if (g.tag === "open") todo += 0;
    }
    return { pts, exact, result, todo, filled: fixtures.filter((m) => picks[m.id]).length };
  }, [fixtures, picks]);

  function setScore(id: string, h: number, a: number) {
    setPicks((p) => ({ ...p, [id]: { h, a } }));
  }

  function fillModel() {
    setPicks((prev) => {
      const next = { ...prev };
      for (const m of fixtures) {
        if (m.hg != null || next[m.id]) continue;
        const [h, a] = parseModel(forecastMatch(m).score);
        next[m.id] = { h, a };
      }
      return next;
    });
  }

  async function save() {
    const payload: SlatePick[] = fixtures
      .filter((m) => picks[m.id] && new Date(m.kickoff).getTime() > Date.now())
      .map((m) => ({ matchId: m.id, homeGoals: picks[m.id].h, awayGoals: picks[m.id].a }));
    if (payload.length === 0) {
      toast.error("Nothing left to lock on this matchday");
      return;
    }
    setBusy(true);
    try {
      const res = await saveSlatePicks({ data: { picks: payload } });
      toast.success(`Card saved · ${res.saved} scores`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save card");
    } finally {
      setBusy(false);
    }
  }

  const list = compact ? fixtures.filter((m) => m.home === clubId || m.away === clubId || picks[m.id] == null).slice(0, 6) : fixtures;

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-subtle">Matchday card</p>
          <h2 className="mt-1 font-display text-2xl font-semibold">MD{md} · 18 games</h2>
          <p className="mt-1 text-sm text-muted">
            Exact 5 · result 2 · locks at kick-off. {stats.filled}/{fixtures.length} in
            {stats.todo ? ` · ${stats.todo} still open` : ""}.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="font-display text-2xl tabular">{stats.pts}</span>
          <span className="text-subtle">pts</span>
        </div>
      </div>

      <div className="flex gap-1 overflow-x-auto">
        {Array.from({ length: 8 }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setMd(n)}
            className={`min-h-10 min-w-10 rounded-full px-3 text-xs ${
              n === md ? "bg-primary text-primary-fg" : "bg-elevated text-muted"
            }`}
          >
            {n}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-3xl border border-border">
        {list.map((m) => {
          const home = getTeam(m.home);
          const away = getTeam(m.away);
          const mine = m.home === clubId || m.away === clubId;
          const locked = Date.now() >= new Date(m.kickoff).getTime();
          const pick = picks[m.id] ?? (m.hg != null ? { h: 0, a: 0 } : { h: 0, a: 0 });
          const hasPick = Boolean(picks[m.id]);
          const grade = hasPick ? gradePick(m, pick.h, pick.a) : null;
          return (
            <div
              key={m.id}
              className={`border-t border-border px-3 py-2.5 first:border-t-0 ${mine ? "bg-elevated" : "bg-surface/90"}`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Crest team={home} size="sm" />
                    <span className="truncate text-sm font-medium">{home.short}</span>
                    <FormStrip teamId={home.id} n={3} />
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <Crest team={away} size="sm" />
                    <span className="truncate text-sm font-medium">{away.short}</span>
                    <FormStrip teamId={away.id} n={3} />
                  </div>
                </div>
                {m.hg != null ? (
                  <div className="text-right">
                    <p className="font-display text-lg tabular">
                      {m.hg}–{m.ag}
                    </p>
                    {hasPick && grade && (
                      <Badge tone={grade.tag === "exact" ? "win" : grade.tag === "result" ? "r16" : "out"}>
                        {grade.tag === "open" ? "In" : `${grade.points} pts`}
                      </Badge>
                    )}
                    {hasPick && (
                      <p className="text-xs text-subtle">
                        you {pick.h}–{pick.a}
                      </p>
                    )}
                  </div>
                ) : (
                  <CompactScore
                    home={hasPick ? pick.h : 0}
                    away={hasPick ? pick.a : 0}
                    onHome={(h) => setScore(m.id, h, picks[m.id]?.a ?? 0)}
                    onAway={(a) => setScore(m.id, picks[m.id]?.h ?? 0, a)}
                    disabled={locked}
                  />
                )}
              </div>
              <p className="mt-1 text-xs text-subtle">{formatKickoff(m.kickoff)}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button variant="outline" onClick={fillModel}>
          Fill from model
        </Button>
        <Button disabled={busy} onClick={() => void save()}>
          {busy ? "Saving…" : "Lock my card"}
        </Button>
      </div>
      {compact && (
        <Button variant="quiet" className="w-full" onClick={() => setView("forecast")}>
          <ListChecks /> Open the full 18
        </Button>
      )}
      <p className="text-xs text-subtle">
        {MATCHES.filter((m) => m.hg == null).length} league-phase games still to play. Knockouts will
        double points from the play-off on.
      </p>
    </section>
  );
}

export function useSlateSummary() {
  const [picks, setPicks] = useState<SlatePick[]>([]);
  const md = activeMatchday();
  useEffect(() => {
    void loadMySlate()
      .then(setPicks)
      .catch(() => setPicks([]));
  }, []);
  const fixtures = matchesOnMd(md);
  const filled = fixtures.filter((m) => picks.some((p) => p.matchId === m.id)).length;
  const todo = fixtures.filter((m) => m.hg == null && !picks.some((p) => p.matchId === m.id)).length;
  let pts = 0;
  let exact = 0;
  for (const m of fixtures) {
    const p = picks.find((x) => x.matchId === m.id);
    if (!p) continue;
    const g = gradePick(m, p.homeGoals, p.awayGoals);
    pts += g.points;
    if (g.tag === "exact") exact += 1;
  }
  return { md, filled, todo, pts, exact, total: fixtures.length };
}
