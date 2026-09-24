import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  CalendarPlus,
  Share2,
} from "lucide-react";
import {
  PULSES,
  computeTable,
  findPlayer,
  formatKickoff,
  getTeam,
  lastMatch,
  nextMatch,
  opponentOf,
  resultFor,
  scoreline,
} from "@/data/ucl";
import { forecastMatch, pathToFinal, pct, remainingStrength } from "@/lib/forecast";
import { copyText, downloadIcs, icsForMatch, nativeShare, shareMatchCopy, xIntent } from "@/lib/share";
import { enableNotifications, fireKickoffPing, tickReminder } from "@/lib/reminders";
import { useDesk } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Crest } from "./crest";
import { FormStrip } from "./form-strip";
import { KitCard } from "./kit";
import { useSlateSummary } from "./slate-card";
import { Countdown } from "./countdown";
import { FinalOddsChart, RadarCompare } from "./charts";
import { Sources } from "./sources";
import { toast } from "sonner";

export function Desk() {
  const displayName = useDesk((s) => s.displayName);
  const clubId = useDesk((s) => s.clubId)!;
  const playerId = useDesk((s) => s.playerId)!;
  const reminders = useDesk((s) => s.reminders);
  const setReminders = useDesk((s) => s.setReminders);
  const setView = useDesk((s) => s.setView);
  const finalA = useDesk((s) => s.finalA);
  const finalB = useDesk((s) => s.finalB);
  const shirtNo = useDesk((s) => s.shirtNo);
  const photo = useDesk((s) => s.photo);
  const club = getTeam(clubId);
  const player = findPlayer(playerId)?.player;
  const table = useMemo(() => computeTable(), []);
  const row = table.find((r) => r.team.id === clubId)!;
  const next = nextMatch(clubId);
  const last = lastMatch(clubId);
  const opp = next ? opponentOf(next, clubId) : null;
  const model = next ? forecastMatch(next) : null;
  const path = pathToFinal().find((p) => p.team.id === clubId);
  const sos = remainingStrength(clubId);
  const [pulse, setPulse] = useState(0);
  const slate = useSlateSummary();

  useEffect(() => {
    const id = window.setInterval(() => setPulse((n) => (n + 1) % PULSES.length), 7000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (!reminders || !next) return;
    tickReminder(next, clubId);
    fireKickoffPing(next, clubId);
    const id = window.setInterval(() => {
      tickReminder(next, clubId);
      fireKickoffPing(next, clubId);
    }, 30_000);
    return () => window.clearInterval(id);
  }, [reminders, next, clubId]);

  const lastTone = last ? resultFor(last, clubId) : null;

  async function onRemind() {
    const ok = await enableNotifications();
    setReminders(true);
    if (next) downloadIcs(`${club.short}-ucl.md${next.md}.ics`, icsForMatch(next));
    toast.success(ok ? "Reminder on — calendar file saved" : "Calendar file saved. Notifications blocked in this browser.");
  }

  async function onShare() {
    if (!next) return;
    const url = window.location.origin;
    const text = shareMatchCopy({
      name: displayName,
      clubId,
      match: next,
      scoreHint: model ? `${model.score} · ${pct(clubId === next.home ? model.homeWin : model.awayWin)} win` : undefined,
      finalA,
      finalB,
      url,
    });
    const shared = await nativeShare("Final Path", text, url);
    if (!shared) {
      window.open(xIntent(text), "_blank", "noopener,noreferrer");
    }
  }

  return (
    <div className="space-y-6 pb-8">
      <header className="flex flex-col items-center gap-5 sm:flex-row sm:items-start sm:justify-between">
        <button type="button" onClick={() => setView("me")} aria-label="Edit kit" className="shrink-0">
          <KitCard team={club} name={displayName} number={shirtNo} photo={photo} size="lg" />
        </button>
        <div className="min-w-0 text-center sm:pt-6 sm:text-left">
          <p className="text-xs uppercase tracking-[0.2em] text-subtle">
            {displayName} · {club.country}
          </p>
          <h1 className="mt-1 font-display text-3xl font-semibold leading-none text-fg sm:text-4xl">
            {club.name}
          </h1>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
            <Badge tone={row.band}>{row.band === "r16" ? "Top 8 pace" : row.band === "playoff" ? "Play-off band" : "Outside 24"}</Badge>
            <span className="text-xs text-muted">
              P{row.pos} · {row.pts} pts · {row.gf}–{row.ga}
            </span>
            <FormStrip teamId={clubId} />
          </div>
          <p className="mt-3 text-sm text-muted">
            Shirt {shirtNo}
            {player ? ` · following ${player.name}` : ""}. Tap the kit to change photo and number.
          </p>
        </div>
      </header>

      <p className="rounded-xl px-4 py-3 text-sm text-muted panel">{PULSES[pulse]}</p>

      <button
        type="button"
        onClick={() => setView("forecast")}
        className="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left panel"
      >
        <span>
          <span className="block text-xs uppercase tracking-wide text-subtle">MD{slate.md} card</span>
          <span className="text-sm font-medium">
            {slate.filled}/{slate.total} scores in
            {slate.todo ? ` · ${slate.todo} still open` : ""}
          </span>
        </span>
        <span className="font-display text-xl tabular">{slate.pts} pts</span>
      </button>

      {next && opp && model && (
        <section className="overflow-hidden rounded-3xl p-5 panel">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs uppercase tracking-[0.18em] text-subtle">Next · MD{next.md}</p>
            <p className="text-xs text-muted">{formatKickoff(next.kickoff)}</p>
          </div>
          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <Crest team={getTeam(next.home)} />
              <div className="min-w-0">
                <p className="truncate font-medium text-fg">{getTeam(next.home).short}</p>
                <p className="text-[11px] text-subtle">Home</p>
              </div>
            </div>
            <p className="font-display text-sm text-muted">vs</p>
            <div className="flex min-w-0 items-center gap-3">
              <div className="min-w-0 text-right">
                <p className="truncate font-medium text-fg">{getTeam(next.away).short}</p>
                <p className="text-[11px] text-subtle">Away</p>
              </div>
              <Crest team={getTeam(next.away)} />
            </div>
          </div>
          <div className="mt-5">
            <Countdown iso={next.kickoff} />
          </div>
          <p className="mt-4 text-sm text-muted">
            Model {model.score} · {club.short} {pct(clubId === next.home ? model.homeWin : model.awayWin)} to win
            {next.home === clubId ? ` at ${club.stadium}` : ` at ${opp.stadium}`}
          </p>
          <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Button onClick={onRemind} variant={reminders ? "quiet" : "default"}>
              <Bell /> {reminders ? "Reminded" : "Remind me"}
            </Button>
            <Button variant="outline" onClick={() => next && downloadIcs(`${club.short}.ics`, icsForMatch(next))}>
              <CalendarPlus /> Calendar
            </Button>
            <Button variant="outline" onClick={() => setView("forecast")}>
              Full card
            </Button>
            <Button variant="outline" onClick={onShare}>
              <Share2 /> Share
            </Button>
          </div>
          <Button className="mt-3 w-full" variant="quiet" onClick={() => setView("club")}>
            Challenge friends on this night
          </Button>
        </section>
      )}

      <section className="grid gap-4 md:grid-cols-2">
        {opp && (
          <div className="rounded-3xl p-5 panel">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg">Club vs next</h2>
              <span className="text-xs text-subtle">
                {club.short} / {opp.short}
              </span>
            </div>
            <RadarCompare a={club} b={opp} />
            <p className="text-xs text-muted">
              Remaining nights sit at {sos.toFixed(0)} opponent rating. {path ? `${pct(path.finalPct)} to reach Madrid.` : ""}
            </p>
          </div>
        )}
        <div className="rounded-3xl p-5 panel">
          <h2 className="font-display text-lg">Path to the final</h2>
          <FinalOddsChart highlight={clubId} />
          <Button variant="quiet" className="mt-2 w-full" onClick={() => setView("final")}>
            Lock a Madrid night pick
          </Button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        {last && (
          <div className="rounded-3xl p-5 panel">
            <p className="text-xs uppercase tracking-[0.18em] text-subtle">Last night · MD{last.md}</p>
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Crest team={getTeam(last.home)} size="sm" />
                <span className="text-sm">{getTeam(last.home).short}</span>
              </div>
              <span className="font-display text-2xl tabular">{scoreline(last)}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm">{getTeam(last.away).short}</span>
                <Crest team={getTeam(last.away)} size="sm" />
              </div>
            </div>
            {lastTone && (
              <div className="mt-3">
                <Badge tone={lastTone === "W" ? "win" : lastTone === "L" ? "loss" : "draw"}>
                  {lastTone === "W" ? "Win" : lastTone === "L" ? "Loss" : "Draw"}
                </Badge>
              </div>
            )}
          </div>
        )}
        {player && (
          <div className="rounded-3xl p-5 panel">
            <p className="text-xs uppercase tracking-[0.18em] text-subtle">Your player</p>
            <p className="mt-2 font-display text-2xl">{player.name}</p>
            <p className="mt-1 text-sm text-muted">
              {player.pos} · {player.goals} league-phase goal{player.goals === 1 ? "" : "s"}
            </p>
            <p className="mt-4 text-xs leading-relaxed text-subtle">
              Tracked against the 36. Goal tallies are the compiled Matchday 1 list.
            </p>
          </div>
        )}
      </section>

      <Sources show={["results", "squads", "ratings", "model", "code"]} />
    </div>
  );
}

export async function copyDeskLink() {
  const ok = await copyText(window.location.href);
  if (ok) toast.success("Link copied");
}
