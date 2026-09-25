import { Star } from "lucide-react";
import {
  formatKickoff,
  getTeam,
  lastMatch,
  nextMatch,
  opponentOf,
  scoreline,
} from "@/data/ucl";
import { useDesk } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Crest } from "./crest";

export function FavoritesView() {
  const favoriteIds = useDesk((s) => s.favoriteIds);
  const toggleFavorite = useDesk((s) => s.toggleFavorite);
  const setView = useDesk((s) => s.setView);
  const setCompare = useDesk((s) => s.setCompare);

  if (favoriteIds.length === 0) {
    return (
      <div className="space-y-4 pb-8">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-subtle">Following</p>
          <h1 className="mt-1 font-display text-3xl font-semibold">Favourites</h1>
          <p className="mt-2 text-sm text-muted">
            Star clubs on World or in a region. This board then shows only those latest results and next nights.
          </p>
        </div>
        <Button onClick={() => setView("world")}>Open the world map</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-8">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-subtle">Following</p>
        <h1 className="mt-1 font-display text-3xl font-semibold">Favourites</h1>
        <p className="mt-2 text-sm text-muted">Latest updates for the clubs you follow — nothing else.</p>
      </div>

      <div className="space-y-3">
        {favoriteIds.map((id) => {
          const team = getTeam(id);
          const last = lastMatch(id);
          const next = nextMatch(id);
          const lastOpp = last ? opponentOf(last, id) : null;
          const nextOpp = next ? opponentOf(next, id) : null;
          return (
            <article key={id} className="rounded-3xl p-4 panel">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Crest team={team} />
                  <div>
                    <p className="font-display text-lg font-semibold">{team.name}</p>
                    <p className="text-xs text-subtle">
                      {team.country} · {team.stadium}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  aria-label={`Unfollow ${team.name}`}
                  onClick={() => toggleFavorite(id)}
                  className="text-primary"
                >
                  <Star className="size-5 fill-current" />
                </button>
              </div>
              <dl className="mt-4 grid gap-2 text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="text-subtle">Last</dt>
                  <dd className="text-right">
                    {last && lastOpp
                      ? `${last.home === id ? "vs" : "@"} ${lastOpp.short} · ${scoreline(last)}`
                      : "No result in yet"}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-subtle">Next</dt>
                  <dd className="text-right">
                    {next && nextOpp
                      ? `${next.home === id ? "vs" : "@"} ${nextOpp.short} · ${formatKickoff(next.kickoff)}`
                      : "No fixture locked"}
                  </dd>
                </div>
              </dl>
            </article>
          );
        })}
      </div>

      {favoriteIds.length >= 2 && (
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setCompare(favoriteIds[0], favoriteIds[1])}
        >
          Compare first two favourites
        </Button>
      )}
    </div>
  );
}
