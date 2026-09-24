import { useEffect, useMemo, useState } from "react";
import { Radio } from "lucide-react";
import { FOOTBALL_LEAGUES } from "@/data/football-leagues";
import {
  loadFootballBoard,
  type FootballBoard,
  type FootballClub,
  type FootballFixture,
} from "@/lib/football-board";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

function when(iso: string | null): string {
  if (!iso) return "Kickoff TBC";
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

function BadgeImg({ src, name }: { src: string | null; name: string }) {
  if (!src) {
    return (
      <span className="grid size-7 shrink-0 place-items-center rounded-full bg-elevated text-[10px] font-medium">
        {name.slice(0, 2).toUpperCase()}
      </span>
    );
  }
  return <img src={src} alt="" className="size-7 shrink-0 object-contain" />;
}

function MatchRow({ match }: { match: FootballFixture }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface px-3 py-3">
      <div className="min-w-0 flex-1 space-y-1.5">
        <Side name={match.home.name} badge={match.home.badge} score={match.home.score} live={match.status === "live"} />
        <Side name={match.away.name} badge={match.away.badge} score={match.away.score} live={match.status === "live"} />
      </div>
      <div className="w-24 shrink-0 text-right">
        <p className={cn("text-xs font-medium tabular", match.status === "live" ? "text-primary" : "text-muted")}>
          {match.status === "live" ? match.minute || "Live" : when(match.kickoff)}
        </p>
        <p className="mt-1 truncate text-[11px] text-subtle">{match.league}</p>
      </div>
    </div>
  );
}

function Side({
  name,
  badge,
  score,
  live,
}: {
  name: string;
  badge: string | null;
  score: string | null;
  live: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <BadgeImg src={badge} name={name} />
      <span className="min-w-0 flex-1 truncate text-sm font-medium">{name}</span>
      {live && <span className="w-6 text-right font-display text-lg tabular">{score ?? "0"}</span>}
    </div>
  );
}

function matchesClub(match: FootballFixture, club: FootballClub | null) {
  if (!club) return true;
  return match.home.id === club.id || match.away.id === club.id || match.home.name === club.name || match.away.name === club.name;
}

export function ScoresView() {
  const [board, setBoard] = useState<FootballBoard | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [leagueId, setLeagueId] = useState<string>("all");
  const [clubId, setClubId] = useState<string | null>(null);

  async function refresh() {
    try {
      const next = await loadFootballBoard();
      setBoard(next);
      setError(null);
    } catch {
      setError("The scores feed did not answer.");
    }
  }

  useEffect(() => {
    let stop = false;
    let timer = 0;
    async function tick() {
      try {
        const next = await loadFootballBoard();
        if (stop) return;
        setBoard(next);
        setError(null);
        timer = window.setTimeout(tick, next.complete ? 60_000 : 8_000);
      } catch {
        if (stop) return;
        setError("The scores feed did not answer.");
        timer = window.setTimeout(tick, 8_000);
      }
    }
    void tick();
    return () => {
      stop = true;
      window.clearTimeout(timer);
    };
  }, []);

  const leagueName = FOOTBALL_LEAGUES.find((league) => league.id === leagueId)?.name;
  const clubs = useMemo(() => {
    if (!board) return [];
    if (!leagueName) return board.clubs;
    return board.clubs.filter((club) => club.league === leagueName || club.leagueId === leagueId);
  }, [board, leagueId, leagueName]);
  const club = clubs.find((item) => item.id === clubId) ?? null;

  const live = (board?.live ?? []).filter((match) => {
    const leagueOk = leagueId === "all" || match.leagueId === leagueId || match.league === leagueName;
    return leagueOk && matchesClub(match, club);
  });
  const upcoming = (board?.upcoming ?? []).filter((match) => {
    const leagueOk = leagueId === "all" || match.leagueId === leagueId || match.league === leagueName;
    return leagueOk && matchesClub(match, club);
  });

  return (
    <div className="space-y-6 pb-8">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-subtle">Football · before the Champions desk</p>
        <h1 className="mt-1 font-display text-3xl font-semibold">Clubs, live, upcoming</h1>
        <p className="mt-2 text-sm text-muted">
          Every club the public feed publishes for these leagues, then the matches that are on now and next.
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        <Button size="sm" variant={leagueId === "all" ? "default" : "outline"} onClick={() => { setLeagueId("all"); setClubId(null); }}>
          All
        </Button>
        {FOOTBALL_LEAGUES.map((league) => (
          <Button
            key={league.id}
            size="sm"
            variant={leagueId === league.id ? "default" : "outline"}
            onClick={() => {
              setLeagueId(league.id);
              setClubId(null);
            }}
          >
            {league.name}
          </Button>
        ))}
      </div>

      <section>
        <div className="mb-3 flex items-baseline justify-between gap-3">
          <h2 className="font-display text-lg">Clubs</h2>
          <span className="text-xs text-subtle">
            {board ? `${clubs.length} clubs${board.complete ? "" : " · loading the rest"}` : "Loading"}
          </span>
        </div>
        {!board && !error && <p className="text-sm text-muted">Opening the club list…</p>}
        {error && !board && <p className="text-sm text-muted">{error}</p>}
        {board && clubs.length === 0 && <p className="text-sm text-muted">No clubs came back for this league.</p>}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {clubs.map((item) => {
            const on = item.id === clubId;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setClubId(on ? null : item.id)}
                className={cn(
                  "flex w-24 shrink-0 flex-col items-center gap-2 rounded-2xl border px-2 py-3 text-center",
                  on ? "border-primary bg-elevated" : "border-border bg-surface",
                )}
              >
                <BadgeImg src={item.badge} name={item.name} />
                <span className="line-clamp-2 text-[11px] leading-tight font-medium">{item.name}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-display text-lg">
            <Radio className="size-4 text-primary" /> Live
          </h2>
          <Button size="sm" variant="ghost" onClick={() => void refresh()}>
            Refresh
          </Button>
        </div>
        {board && live.length === 0 && <p className="text-sm text-muted">Nothing is live in this feed right now.</p>}
        {live.map((match) => (
          <MatchRow key={match.id} match={match} />
        ))}
      </section>

      <section className="space-y-2">
        <h2 className="font-display text-lg">Upcoming</h2>
        {board && upcoming.length === 0 && <p className="text-sm text-muted">No upcoming fixture in this feed.</p>}
        {upcoming.map((match) => (
          <MatchRow key={match.id} match={match} />
        ))}
      </section>

      <footer className="rounded-3xl px-5 py-4 panel">
        <p className="text-xs uppercase tracking-[0.2em] text-subtle">Sources</p>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Live matches, the next fixture in each league, and the club row come from TheSportsDB’s public soccer feed.
          That feed returns ten clubs per league and one upcoming game, plus whatever is live across football. The
          Champions desk is still the compiled 2026/27 card.
        </p>
      </footer>
    </div>
  );
}
