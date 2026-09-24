import { LayoutGrid, Radio, Swords, Table2, Target, Trophy } from "lucide-react";
import { useDesk, type View } from "@/lib/store";
import { getTeam } from "@/data/ucl";
import { cn } from "@/lib/utils";
import { UserButton } from "@/lib/auth/gates";
import { ScoresView } from "./scores-view";
import { Desk } from "./desk";
import { TableView } from "./table-view";
import { ForecastView } from "./forecast-view";
import { FinalView } from "./final-view";
import { ClubView } from "./club-view";
import { ProfileView } from "./profile-view";
import { StarMark } from "./mark";
import { KitChip } from "./kit";
import { Button } from "@/components/ui/button";

const NAV: { id: View; label: string; icon: typeof LayoutGrid }[] = [
  { id: "live", label: "Live", icon: Radio },
  { id: "desk", label: "Desk", icon: LayoutGrid },
  { id: "table", label: "Table", icon: Table2 },
  { id: "forecast", label: "Card", icon: Target },
  { id: "final", label: "Final", icon: Trophy },
  { id: "club", label: "Club", icon: Swords },
];

export function Shell({ night, group }: { night?: string; group?: string }) {
  const view = useDesk((s) => s.view);
  const setView = useDesk((s) => s.setView);
  const reset = useDesk((s) => s.reset);
  const clubId = useDesk((s) => s.clubId);
  const photo = useDesk((s) => s.photo);
  const shirtNo = useDesk((s) => s.shirtNo);
  const club = clubId ? getTeam(clubId) : null;

  return (
    <div className="relative min-h-dvh bg-bg text-fg">
      <div className="stadium-wash" />
      <header className="sticky top-0 z-20 border-b border-border bg-bg/70 px-4 py-3 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <StarMark className="size-6 text-primary" />
            <div className="min-w-0">
              <p className="font-display text-sm tracking-[0.18em]">FINAL PATH</p>
              <p className="text-xs uppercase tracking-[0.16em] text-subtle">
                {view === "live" ? "Football" : "UCL 26/27"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {club && (
              <button type="button" onClick={() => setView("me")} aria-label="Edit kit">
                <KitChip team={club} photo={photo} number={shirtNo} />
              </button>
            )}
            <div className="hidden min-w-0 sm:block">
              <UserButton />
            </div>
            <Button variant="ghost" size="sm" className="hidden text-subtle lg:inline-flex" onClick={reset}>
              Switch club
            </Button>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-3xl px-4 pt-6 pb-28">
        {view === "live" && <ScoresView />}
        {view === "desk" && <Desk />}
        {view === "table" && <TableView />}
        {view === "forecast" && <ForecastView />}
        {view === "final" && <FinalView />}
        {view === "club" && <ClubView presetGroup={group} night={night} />}
        {view === "me" && <ProfileView />}
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-bg/85 pb-[env(safe-area-inset-bottom)] backdrop-blur-md">
        <div className="mx-auto grid max-w-3xl grid-cols-6">
          {NAV.map((item) => {
            const Icon = item.icon;
            const on = view === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setView(item.id)}
                className={cn(
                  "flex min-h-14 flex-col items-center justify-center gap-1 text-xs",
                  on ? "text-fg" : "text-subtle",
                )}
              >
                <Icon className="size-5" strokeWidth={on ? 2.2 : 1.7} />
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
