import { Star } from "lucide-react";
import { TEAMS } from "@/data/ucl";
import { getRegion, leaguesInRegion, teamsInRegion } from "@/data/world";
import { useDesk } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Crest } from "./crest";
import { WorldMap } from "./world-map";

export function WorldView() {
  const regionId = useDesk((s) => s.regionId);
  const setRegion = useDesk((s) => s.setRegion);
  const favoriteIds = useDesk((s) => s.favoriteIds);
  const toggleFavorite = useDesk((s) => s.toggleFavorite);
  const setCompare = useDesk((s) => s.setCompare);
  const setView = useDesk((s) => s.setView);
  const matterId = useDesk((s) => s.matterId);
  const setMatter = useDesk((s) => s.setMatter);

  const region = regionId ? getRegion(regionId) : null;
  const clubs = regionId ? teamsInRegion(regionId) : [];
  const leagues = regionId ? leaguesInRegion(regionId) : [];

  return (
    <div className="space-y-5 pb-8">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-subtle">World Soccer</p>
        <h1 className="mt-1 font-display text-3xl font-semibold">Pick a region</h1>
        <p className="mt-2 text-sm text-muted">
          Champions League is the default desk. Use the map when you want another continent — tap in, read the board, star the clubs you follow.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => {
            setMatter("ucl");
            setRegion("europe");
            setView("desk");
          }}
          className={cn(
            "rounded-2xl border px-3 py-3 text-left",
            matterId === "ucl" ? "border-primary bg-elevated" : "border-border bg-surface",
          )}
        >
          <p className="text-[11px] uppercase tracking-wide text-subtle">Default</p>
          <p className="font-display text-sm font-semibold">Champions League</p>
        </button>
        <button
          type="button"
          onClick={() => setMatter("world")}
          className={cn(
            "rounded-2xl border px-3 py-3 text-left",
            matterId === "world" ? "border-primary bg-elevated" : "border-border bg-surface",
          )}
        >
          <p className="text-[11px] uppercase tracking-wide text-subtle">Explore</p>
          <p className="font-display text-sm font-semibold">World map</p>
        </button>
      </div>

      <WorldMap selected={regionId} onSelect={setRegion} />

      {region && (
        <section className="space-y-3 rounded-3xl p-5 panel">
          <p className="text-xs uppercase tracking-[0.18em] text-subtle">{region.name}</p>
          <h2 className="font-display text-2xl font-semibold">{region.blurb}</h2>
          <p className="text-sm leading-relaxed text-muted">{region.hint}</p>

          {leagues.length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-wide text-subtle">Leagues in view</p>
              <p className="mt-1 text-sm">{leagues.map((l) => l.name).join(" · ")}</p>
            </div>
          )}

          {clubs.length > 0 ? (
            <div className="grid gap-2">
              {clubs.map((team) => {
                const on = favoriteIds.includes(team.id);
                return (
                  <div
                    key={team.id}
                    className="flex items-center gap-3 rounded-2xl border border-border bg-surface px-3 py-2"
                  >
                    <Crest team={team} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{team.name}</p>
                      <p className="text-[11px] text-subtle">{team.country}</p>
                    </div>
                    <button
                      type="button"
                      aria-label={on ? `Unfollow ${team.name}` : `Follow ${team.name}`}
                      onClick={() => toggleFavorite(team.id)}
                      className={on ? "text-primary" : "text-subtle"}
                    >
                      <Star className={cn("size-5", on && "fill-current")} />
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted">
              No Champions League club is based here. Open Live for the domestic board, or star a European side from the 36.
            </p>
          )}

          <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={() => setView("favorites")}>
              Open favourites
            </Button>
            {favoriteIds.length >= 2 && (
              <Button size="sm" variant="outline" onClick={() => setCompare(favoriteIds[0], favoriteIds[1])}>
                Compare
              </Button>
            )}
            {regionId === "europe" && (
              <Button size="sm" variant="outline" onClick={() => setView("desk")}>
                Champions desk
              </Button>
            )}
          </div>
        </section>
      )}

      {!region && (
        <p className="text-sm text-muted">
          {TEAMS.length} Champions League clubs sit on this map. Tap Europe to walk into the 26/27 desk.
        </p>
      )}
    </div>
  );
}
