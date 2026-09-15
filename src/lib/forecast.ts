import { getTeam, type Match, type Team, TEAMS, MATCHES, computeTable, computeTableFrom, type Standing } from "@/data/ucl";

export type Outcome = {
  homeWin: number;
  draw: number;
  awayWin: number;
  xgHome: number;
  xgAway: number;
  score: string;
  keys: string[];
};

function poisson(k: number, lambda: number): number {
  let p = Math.exp(-lambda);
  for (let i = 1; i <= k; i++) p *= lambda / i;
  return p;
}

function expectedGoals(att: Team, def: Team, home: boolean): number {
  const base = 1.38;
  const a = att.attack / 78;
  const d = (108 - def.defense) / 78;
  const md1Boost = (() => {
    const table = computeTable();
    const row = table.find((r) => r.team.id === att.id);
    if (!row || row.played === 0) return 1;
    if (row.won) return 1.04;
    if (row.lost) return 0.97;
    return 1;
  })();
  return Math.max(0.25, base * a * d * (home ? 1.14 : 0.9) * md1Boost);
}

export function forecastMatch(match: Match): Outcome {
  const home = getTeam(match.home);
  const away = getTeam(match.away);
  const xgHome = expectedGoals(home, away, true);
  const xgAway = expectedGoals(away, home, false);
  const maxG = 6;
  let homeWin = 0;
  let draw = 0;
  let awayWin = 0;
  let bestP = 0;
  let score = "1–1";
  for (let h = 0; h <= maxG; h++) {
    for (let a = 0; a <= maxG; a++) {
      const p = poisson(h, xgHome) * poisson(a, xgAway);
      if (h > a) homeWin += p;
      else if (h < a) awayWin += p;
      else draw += p;
      if (p > bestP) {
        bestP = p;
        score = `${h}–${a}`;
      }
    }
  }
  const tot = homeWin + draw + awayWin || 1;
  const keys: string[] = [];
  if (home.attack - away.defense > 10) keys.push(`${home.short} can stretch ${away.short} in transition`);
  if (away.defense > 84) keys.push(`${away.short} sit in a low, organised block`);
  if (Math.abs(home.tempo - away.tempo) > 12) keys.push("Tempo mismatch — first 20 minutes decide the night");
  if (home.europe - away.europe > 15) keys.push(`${home.short} hold the European pedigree edge`);
  if (away.europe - home.europe > 15) keys.push(`${away.short} are the heavier European side`);
  if (keys.length === 0) keys.push("Margins are thin — set pieces and the first goal swing it");
  return {
    homeWin: homeWin / tot,
    draw: draw / tot,
    awayWin: awayWin / tot,
    xgHome: Math.round(xgHome * 10) / 10,
    xgAway: Math.round(xgAway * 10) / 10,
    score,
    keys: keys.slice(0, 3),
  };
}

export function rating(team: Team): number {
  const table = computeTable();
  const row = table.find((r) => r.team.id === team.id);
  const form = row ? row.pts * 4 + row.gd * 1.4 : 0;
  return team.attack * 0.28 + team.defense * 0.26 + team.europe * 0.28 + team.depth * 0.12 + form;
}

export type PathRow = {
  team: Team;
  rating: number;
  finalPct: number;
  r16Pct: number;
};

export function pathToFinal(): PathRow[] {
  const rated = TEAMS.map((t) => ({ team: t, rating: rating(t) }));
  const max = Math.max(...rated.map((r) => r.rating));
  const min = Math.min(...rated.map((r) => r.rating));
  const shifted = rated.map((r) => ({
    ...r,
    weight: Math.pow((r.rating - min + 4) / (max - min + 4), 2.4),
  }));
  const sum = shifted.reduce((s, r) => s + r.weight, 0);
  return shifted
    .map((r) => ({
      team: r.team,
      rating: r.rating,
      finalPct: r.weight / sum,
      r16Pct: Math.min(0.92, 0.12 + (r.rating - 60) / 90),
    }))
    .sort((a, b) => b.finalPct - a.finalPct);
}

export function remainingStrength(teamId: string): number {
  const left = MATCHES.filter(
    (m) => (m.home === teamId || m.away === teamId) && m.hg == null,
  );
  if (left.length === 0) return 0;
  const avg =
    left.reduce((s, m) => {
      const opp = getTeam(m.home === teamId ? m.away : m.home);
      return s + rating(opp);
    }, 0) / left.length;
  return avg;
}

export function pct(n: number): string {
  return `${Math.round(n * 100)}%`;
}

export function projectedTable(): Standing[] {
  const filled = MATCHES.map((m) => {
    if (m.hg != null && m.ag != null) return m;
    const f = forecastMatch(m);
    const parts = f.score.split("–").map((n) => Number(n));
    return { ...m, hg: parts[0] ?? 1, ag: parts[1] ?? 1 };
  });
  return computeTableFrom(filled);
}
