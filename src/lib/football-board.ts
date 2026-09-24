import { createServerFn } from "@tanstack/react-start";
import { FOOTBALL_LEAGUES } from "@/data/football-leagues";

export type FootballSide = {
  id: string;
  name: string;
  badge: string | null;
  score: string | null;
};

export type FootballClub = {
  id: string;
  name: string;
  badge: string | null;
  leagueId: string;
  league: string;
};

export type FootballFixture = {
  id: string;
  leagueId: string;
  league: string;
  kickoff: string | null;
  status: "live" | "upcoming";
  minute: string | null;
  home: FootballSide;
  away: FootballSide;
};

export type FootballBoard = {
  updatedAt: string;
  clubs: FootballClub[];
  live: FootballFixture[];
  upcoming: FootballFixture[];
  complete: boolean;
};

const FEED = "https://www.thesportsdb.com/api/v1/json/3";
const LIVE_TTL_MS = 20_000;
const BATCH = 4;

type LeagueSlice = { clubs: FootballClub[]; upcoming: FootballFixture[] };

const slices = new Map<string, LeagueSlice>();
const sliceMisses = new Map<string, number>();
let liveCache: { at: number; live: FootballFixture[] } | null = null;

type Raw = Record<string, unknown>;

function str(row: Raw, key: string): string {
  const value = row[key];
  return typeof value === "string" ? value.trim() : "";
}

function kickoff(row: Raw): string | null {
  const stamp = str(row, "strTimestamp") || str(row, "dateEvent");
  if (!stamp) return null;
  const iso = stamp.includes("T") ? stamp : `${stamp}T${str(row, "strTime") || "00:00:00"}`;
  const withZone = /[zZ]|[+-]\d{2}:?\d{2}$/.test(iso) ? iso : `${iso}Z`;
  const time = Date.parse(withZone);
  return Number.isNaN(time) ? null : new Date(time).toISOString();
}

function minute(row: Raw): string | null {
  const status = str(row, "strStatus").toUpperCase();
  const progress = str(row, "strProgress");
  if (status === "HT") return "HT";
  if (status === "ET" || status === "AET") return "ET";
  if (status === "P" || status === "PEN") return "Pens";
  if (progress && progress !== "0") return `${progress}'`;
  if (status && status !== "NS" && status !== "FT") return status;
  return null;
}

function side(row: Raw, which: "Home" | "Away"): FootballSide {
  return {
    id: str(row, `id${which}Team`),
    name: str(row, `str${which}Team`) || "TBC",
    badge: str(row, `str${which}TeamBadge`) || null,
    score: str(row, `int${which}Score`) || null,
  };
}

function fixture(row: Raw, status: "live" | "upcoming", leagueId: string): FootballFixture | null {
  const home = side(row, "Home");
  const away = side(row, "Away");
  const id = str(row, "idEvent") || str(row, "idLiveScore");
  if (!id || !home.name || !away.name) return null;
  return {
    id,
    leagueId: leagueId || str(row, "idLeague"),
    league: str(row, "strLeague") || "Football",
    kickoff: kickoff(row),
    status,
    minute: status === "live" ? minute(row) : null,
    home,
    away,
  };
}

async function readJson(path: string): Promise<Raw> {
  const res = await fetch(`${FEED}/${path}`, { signal: AbortSignal.timeout(12_000) });
  if (!res.ok) throw new Error(`Scores feed ${res.status}`);
  return (await res.json()) as Raw;
}

async function mapPool<T, R>(items: readonly T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const index = next;
      next += 1;
      out[index] = await fn(items[index]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, () => worker()));
  return out;
}

async function fetchSlice(league: (typeof FOOTBALL_LEAGUES)[number]): Promise<LeagueSlice> {
  const [teamsRaw, eventsRaw] = await Promise.all([
    readJson(`search_all_teams.php?l=${encodeURIComponent(league.feed)}`).catch(() => ({}) as Raw),
    readJson(`eventsnextleague.php?id=${league.id}`).catch(() => ({}) as Raw),
  ]);
  const teams = Array.isArray(teamsRaw.teams) ? (teamsRaw.teams as Raw[]) : [];
  const events = Array.isArray(eventsRaw.events) ? (eventsRaw.events as Raw[]) : [];
  const clubs: FootballClub[] = [];
  for (const team of teams) {
    const id = str(team, "idTeam");
    const name = str(team, "strTeam");
    if (!id || !name) continue;
    clubs.push({
      id,
      name,
      badge: str(team, "strBadge") || null,
      leagueId: league.id,
      league: league.name,
    });
  }
  const upcoming = events
    .map((event) => fixture(event, "upcoming", league.id))
    .filter((row): row is FootballFixture => row != null);
  return { clubs, upcoming };
}

async function fetchLive(): Promise<FootballFixture[]> {
  const liveRaw = await readJson("livescore.php?s=Soccer").catch(() => ({ livescore: [] }) as Raw);
  const liveRows = Array.isArray(liveRaw.livescore) ? (liveRaw.livescore as Raw[]) : [];
  const live: FootballFixture[] = [];
  const seen = new Set<string>();
  for (const event of liveRows) {
    const row = fixture(event, "live", str(event, "idLeague"));
    if (!row || seen.has(row.id)) continue;
    seen.add(row.id);
    live.push(row);
  }
  live.sort((a, b) => a.league.localeCompare(b.league) || a.home.name.localeCompare(b.home.name));
  return live;
}

function assemble(live: FootballFixture[]): FootballBoard {
  const clubs: FootballClub[] = [];
  const upcoming: FootballFixture[] = [];
  for (const league of FOOTBALL_LEAGUES) {
    const slice = slices.get(league.id);
    if (!slice) continue;
    clubs.push(...slice.clubs);
    upcoming.push(...slice.upcoming);
  }
  clubs.sort((a, b) => a.league.localeCompare(b.league) || a.name.localeCompare(b.name));
  upcoming.sort((a, b) => (a.kickoff ?? "").localeCompare(b.kickoff ?? ""));
  return {
    updatedAt: new Date().toISOString(),
    clubs,
    live,
    upcoming,
    complete: FOOTBALL_LEAGUES.every((league) => slices.has(league.id)),
  };
}

export const loadFootballBoard = createServerFn({ method: "GET" }).handler(async (): Promise<FootballBoard> => {
  const missing = FOOTBALL_LEAGUES.filter((league) => !slices.has(league.id)).slice(0, BATCH);
  if (missing.length) {
    const loaded = await mapPool(missing, 2, async (league) => ({ league, slice: await fetchSlice(league) }));
    for (const { league, slice } of loaded) {
      if (slice.clubs.length || slice.upcoming.length) {
        slices.set(league.id, slice);
        continue;
      }
      const misses = (sliceMisses.get(league.id) ?? 0) + 1;
      sliceMisses.set(league.id, misses);
      if (misses >= 2) slices.set(league.id, slice);
    }
  }

  if (!liveCache || Date.now() - liveCache.at >= LIVE_TTL_MS) {
    liveCache = { at: Date.now(), live: await fetchLive() };
  }
  return assemble(liveCache.live);
});
