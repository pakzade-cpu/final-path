import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Copy, Share2, Swords, Users } from "lucide-react";
import {
  MATCHES,
  formatKickoff,
  getTeam,
  nextMatch,
  scoreline,
} from "@/data/ucl";
import {
  createChallenge,
  createGroup,
  getGroupBoard,
  joinGroup,
  listMyGroups,
  submitPick,
  type ChallengeRow,
  type GroupSummary,
} from "@/lib/fan-club";
import { copyText, nativeShare, shareGroupCopy, xIntent } from "@/lib/share";
import { useDesk } from "@/lib/store";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Crest } from "./crest";
import { KitCard, KitChip } from "./kit";
import { LineupPick, type LineupState } from "./lineup-pick";
import { NightView } from "./night-view";
import { ScoreStepper } from "./stepper";
import { toast } from "sonner";

function upcoming() {
  return MATCHES.filter((m) => m.hg == null && new Date(m.kickoff).getTime() > Date.now()).slice(0, 24);
}

export function ClubView({ presetGroup, night }: { presetGroup?: string; night?: string }) {
  const groupCode = useDesk((s) => s.groupCode);
  const setGroupCode = useDesk((s) => s.setGroupCode);
  const active = (presetGroup || groupCode || "").toUpperCase() || null;

  if (active) {
    return (
      <GroupBoard
        code={active}
        onLeave={() => {
          setGroupCode(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-8 pb-8">
      <GroupsHome />
      <NightView preset={night} />
    </div>
  );
}

function GroupsHome() {
  const setGroupCode = useDesk((s) => s.setGroupCode);
  const navigate = useNavigate({ from: "/" });
  const displayName = useDesk((s) => s.displayName);
  const clubId = useDesk((s) => s.clubId)!;
  const [groups, setGroups] = useState<GroupSummary[]>([]);
  const [name, setName] = useState(`${displayName}'s club`);
  const [join, setJoin] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void listMyGroups()
      .then(setGroups)
      .catch(() => setGroups([]));
  }, []);

  async function create() {
    setBusy(true);
    try {
      const g = await createGroup({ data: name });
      setGroupCode(g.id);
      void navigate({ search: { group: g.id } });
      toast.success("Group open");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not create");
    } finally {
      setBusy(false);
    }
  }

  async function joinNow() {
    setBusy(true);
    try {
      const g = await joinGroup({ data: join });
      setGroupCode(g.id);
      void navigate({ search: { group: g.id } });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not join");
    } finally {
      setBusy(false);
    }
  }

  async function shareApp() {
    const url = window.location.origin;
    const text = `Join me on Final Path — Champions League 26/27 desk, kits, and forecast challenges.\n${url}`;
    const ok = await nativeShare("Final Path", text, url);
    if (!ok) window.open(xIntent(text), "_blank", "noopener,noreferrer");
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-subtle">Friends</p>
        <h1 className="mt-1 font-display text-3xl font-semibold">Your club</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Make a group, share the code on X. Everyone fills the 18-game matchday card; scores lock at kick-off.
        </p>
      </div>

      <Button variant="outline" className="w-full" onClick={() => void shareApp()}>
        <Share2 /> Share Final Path on X
      </Button>

      {groups.length > 0 && (
        <section className="space-y-2">
          <p className="text-xs uppercase tracking-wide text-subtle">Your groups</p>
          {groups.map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => {
                setGroupCode(g.id);
                void navigate({ search: { group: g.id } });
              }}
              className="flex min-h-14 w-full items-center justify-between rounded-2xl border border-border bg-surface/90 px-4 py-3 text-left"
            >
              <span>
                <span className="block font-medium">{g.name}</span>
                <span className="text-xs text-subtle">
                  {g.id} · {g.members} in the club
                </span>
              </span>
              <Users className="size-4 text-subtle" />
            </button>
          ))}
        </section>
      )}

      <section className="space-y-3 rounded-3xl p-5 panel">
        <label className="text-xs uppercase tracking-wide text-subtle">New group</label>
        <Input value={name} maxLength={32} onChange={(e) => setName(e.target.value)} />
        <Button className="w-full" disabled={busy || name.trim().length < 2} onClick={() => void create()}>
          Create group
        </Button>
      </section>

      <section className="space-y-3 rounded-3xl p-5 panel">
        <label className="text-xs uppercase tracking-wide text-subtle">Join with a code</label>
        <Input
          value={join}
          maxLength={8}
          placeholder="ABC123"
          onChange={(e) => setJoin(e.target.value.toUpperCase())}
        />
        <Button variant="outline" className="w-full" disabled={busy || join.length < 4} onClick={() => void joinNow()}>
          Join friends
        </Button>
        <p className="text-xs text-subtle">{getTeam(clubId).short} kit travels with you into the group.</p>
      </section>
    </div>
  );
}

function GroupBoard({ code, onLeave }: { code: string; onLeave: () => void }) {
  const navigate = useNavigate({ from: "/" });
  const user = useCurrentUser();
  const clubId = useDesk((s) => s.clubId)!;
  const shirtNo = useDesk((s) => s.shirtNo);
  const photo = useDesk((s) => s.photo);
  const setView = useDesk((s) => s.setView);
  const [board, setBoard] = useState<Awaited<ReturnType<typeof getGroupBoard>> | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  async function reload() {
    try {
      const b = await getGroupBoard({ data: code });
      setBoard(b);
      setErr(null);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not load group");
    }
  }

  useEffect(() => {
    void joinGroup({ data: code })
      .then(() => reload())
      .catch((e) => setErr(e instanceof Error ? e.message : "Could not join"));
  }, [code]);

  async function invite() {
    const url = `${window.location.origin}?group=${code}`;
    const text = shareGroupCopy(board?.group.name ?? "Club", code, getTeam(clubId).name, url);
    const ok = await nativeShare("Join my UCL club", text, url);
    if (!ok) window.open(xIntent(text), "_blank", "noopener,noreferrer");
  }

  const table = useMemo(() => {
    if (!board) return [];
    const map = new Map<string, { name: string; pts: number; clubId: string | null; photo: string | null; shirtNo: number }>();
    for (const m of board.members) {
      map.set(m.userId, { name: m.displayName, pts: 0, clubId: m.clubId, photo: m.photo, shirtNo: m.shirtNo });
    }
    for (const c of board.challenges) {
      for (const p of c.picks ?? []) {
        const row = map.get(p.userId) ?? {
          name: p.displayName,
          pts: 0,
          clubId: p.clubId,
          photo: p.photo,
          shirtNo: p.shirtNo,
        };
        row.pts += p.points;
        map.set(p.userId, row);
      }
    }
    return [...map.values()].sort((a, b) => b.pts - a.pts);
  }, [board]);

  if (err) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-loss">{err}</p>
        <Button variant="outline" onClick={onLeave}>
          Back
        </Button>
      </div>
    );
  }
  if (!board) return <p className="text-sm text-muted">Opening the club…</p>;

  const open = board.challenges.find((c) => c.id === openId) ?? null;

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-subtle">Group {board.group.id}</p>
          <h1 className="mt-1 font-display text-3xl font-semibold">{board.group.name}</h1>
          <p className="mt-2 flex items-center gap-2 text-sm text-muted">
            <Users className="size-4" /> {board.group.members} kits in the room
          </p>
        </div>
        <KitChip team={getTeam(clubId)} photo={photo} number={shirtNo} />
      </div>

      <div className="flex gap-2">
        <Button className="flex-1" onClick={() => void invite()}>
          <Share2 /> Invite on X
        </Button>
        <Button
          variant="outline"
          className="flex-1"
          onClick={async () => {
            const ok = await copyText(`${window.location.origin}?group=${code}`);
            toast[ok ? "success" : "error"](ok ? "Link copied" : "Could not copy");
          }}
        >
          <Copy /> Copy link
        </Button>
      </div>

      <section className="rounded-3xl p-5 panel">
        <p className="mb-3 text-xs uppercase tracking-wide text-subtle">The dressing room</p>
        <div className="flex gap-5 overflow-x-auto pb-1">
          {board.members.map((m) => (
            <KitCard
              key={m.userId}
              team={getTeam(m.clubId)}
              name={m.displayName}
              number={m.shirtNo}
              photo={m.photo}
              size="md"
            />
          ))}
        </div>
      </section>

      <Button variant="outline" className="w-full" onClick={() => setView("forecast")}>
        Fill the matchday card
      </Button>

      {board.slate.length > 0 && (
        <section className="overflow-hidden rounded-3xl border border-border">
          <div className="bg-elevated px-4 py-2 text-xs uppercase tracking-wide text-subtle">
            MD{board.slateMd} card · exact 5 · result 2
          </div>
          {board.slate.map((r, i) => (
            <div
              key={r.userId}
              className="flex items-center justify-between border-t border-border bg-surface/90 px-4 py-2.5 text-sm"
            >
              <span className="flex min-w-0 items-center gap-2">
                <span className="w-5 tabular text-subtle">{i + 1}</span>
                {r.clubId ? <Crest team={getTeam(r.clubId)} size="sm" /> : null}
                <span className="truncate">{r.displayName}</span>
              </span>
              <span className="shrink-0 text-right">
                <span className="font-display tabular">{r.pts} pts</span>
                <span className="ml-2 text-xs text-subtle">
                  {r.filled} in · {r.open} open
                </span>
              </span>
            </div>
          ))}
        </section>
      )}

      {table.length > 0 && (
        <section className="overflow-hidden rounded-3xl border border-border">
          <div className="bg-elevated px-4 py-2 text-[10px] uppercase tracking-wide text-subtle">Challenge table</div>
          {table.map((r, i) => (
            <div
              key={`${r.name}-${i}`}
              className="flex items-center justify-between border-t border-border bg-surface/90 px-4 py-2.5 text-sm"
            >
              <span className="flex items-center gap-2">
                <span className="w-5 tabular text-subtle">{i + 1}</span>
                {r.clubId ? <Crest team={getTeam(r.clubId)} size="sm" /> : null}
                {r.name}
              </span>
              <span className="font-display tabular">{r.pts} pts</span>
            </div>
          ))}
        </section>
      )}

      <NewChallenge
        groupId={board.group.id}
        onMade={(id) => {
          setOpenId(id);
          void reload();
        }}
      />

      <section className="space-y-2">
        <p className="text-xs uppercase tracking-wide text-subtle">Open challenges</p>
        {board.challenges.length === 0 && (
          <p className="text-sm text-muted">None yet. Post a match before the next kick-off.</p>
        )}
        {board.challenges.map((c) => {
          const m = MATCHES.find((x) => x.id === c.matchId);
          if (!m) return null;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setOpenId(c.id === openId ? null : c.id)}
              className="flex min-h-14 w-full items-center justify-between rounded-2xl border border-border bg-surface/90 px-4 py-3 text-left"
            >
              <span>
                <span className="flex items-center gap-2 text-sm font-medium">
                  <Swords className="size-3.5 text-subtle" />
                  {getTeam(m.home).short} {scoreline(m)} {getTeam(m.away).short}
                </span>
                <span className="text-xs text-subtle">
                  {c.kind === "lineup" ? `Score + XI · ${c.teamId ? getTeam(c.teamId).short : ""}` : "Score"} · {c.submitted} in
                  {c.locked ? " · locked" : ""}
                </span>
              </span>
              <Badge tone={c.locked ? "out" : c.mine ? "win" : "r16"}>{c.locked ? "Revealed" : c.mine ? "In" : "Open"}</Badge>
            </button>
          );
        })}
      </section>

      {open && (
        <ChallengeSheet
          challenge={open}
          me={user?.id ?? ""}
          onSaved={() => void reload()}
        />
      )}

      <Button
        variant="ghost"
        className="w-full text-subtle"
        onClick={() => {
          onLeave();
          void navigate({ search: {} });
        }}
      >
        Leave group view
      </Button>
    </div>
  );
}

function NewChallenge({ groupId, onMade }: { groupId: string; onMade: (id: string) => void }) {
  const clubId = useDesk((s) => s.clubId)!;
  const next = nextMatch(clubId);
  const [matchId, setMatchId] = useState(next?.id ?? upcoming()[0]?.id ?? "");
  const [kind, setKind] = useState<"score" | "lineup">("lineup");
  const [side, setSide] = useState<"home" | "away">(next?.home === clubId ? "home" : next?.away === clubId ? "away" : "home");
  const [busy, setBusy] = useState(false);
  const match = MATCHES.find((m) => m.id === matchId);

  async function go() {
    if (!match) return;
    setBusy(true);
    try {
      const res = await createChallenge({
        data: {
          groupId,
          matchId: match.id,
          kind,
          teamId: kind === "lineup" ? (side === "home" ? match.home : match.away) : null,
        },
      });
      toast.success("Challenge posted");
      onMade(res.id);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not post");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="space-y-3 rounded-3xl p-5 panel">
      <p className="text-xs uppercase tracking-wide text-subtle">New challenge</p>
      <select
        className="flex h-11 w-full rounded-md border border-border bg-elevated px-3 text-sm"
        value={matchId}
        onChange={(e) => {
          const id = e.target.value;
          setMatchId(id);
          const m = MATCHES.find((x) => x.id === id);
          if (!m) return;
          if (m.home === clubId) setSide("home");
          else if (m.away === clubId) setSide("away");
        }}
      >
        {upcoming().map((m) => (
          <option key={m.id} value={m.id}>
            MD{m.md} · {getTeam(m.home).short} vs {getTeam(m.away).short} · {formatKickoff(m.kickoff)}
          </option>
        ))}
      </select>
      <div className="grid grid-cols-2 gap-2">
        <Button variant={kind === "score" ? "default" : "outline"} onClick={() => setKind("score")}>
          Score
        </Button>
        <Button variant={kind === "lineup" ? "default" : "outline"} onClick={() => setKind("lineup")}>
          Score + XI
        </Button>
      </div>
      {kind === "lineup" && match && (
        <div className="grid grid-cols-2 gap-2">
          <Button variant={side === "home" ? "quiet" : "outline"} onClick={() => setSide("home")}>
            {getTeam(match.home).short} XI
          </Button>
          <Button variant={side === "away" ? "quiet" : "outline"} onClick={() => setSide("away")}>
            {getTeam(match.away).short} XI
          </Button>
        </div>
      )}
      <Button className="w-full" disabled={busy || !matchId} onClick={() => void go()}>
        Post to the group
      </Button>
    </section>
  );
}

function ChallengeSheet({
  challenge,
  me,
  onSaved,
}: {
  challenge: ChallengeRow;
  me: string;
  onSaved: () => void;
}) {
  const match = MATCHES.find((m) => m.id === challenge.matchId);
  const [home, setHome] = useState(challenge.mine?.homeGoals ?? 0);
  const [away, setAway] = useState(challenge.mine?.awayGoals ?? 0);
  const [lineup, setLineup] = useState<LineupState>({
    starters: challenge.mine?.starters ?? [],
    subs: challenge.mine?.subs ?? [],
    firstOff: challenge.mine?.firstOff ?? null,
    firstOn: challenge.mine?.firstOn ?? null,
  });
  const [busy, setBusy] = useState(false);
  if (!match) return null;
  const homeT = getTeam(match.home);
  const awayT = getTeam(match.away);

  async function save() {
    setBusy(true);
    try {
      await submitPick({
        data: {
          challengeId: challenge.id,
          homeGoals: home,
          awayGoals: away,
          starters: lineup.starters,
          subs: lineup.subs,
          firstOff: lineup.firstOff,
          firstOn: lineup.firstOn,
        },
      });
      toast.success(challenge.locked ? "Locked" : "Pick in");
      onSaved();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not submit");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="space-y-4 rounded-3xl p-5 panel">
      <div>
        <p className="text-xs uppercase tracking-wide text-subtle">
          {challenge.kind === "lineup" ? "Score, XI and first sub" : "Score guess"} · MD{match.md}
        </p>
        <h2 className="mt-1 font-display text-2xl">
          {homeT.short} vs {awayT.short}
        </h2>
        <p className="text-sm text-muted">{formatKickoff(match.kickoff)}</p>
      </div>

      {!challenge.locked && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <ScoreStepper label={homeT.short} value={home} onChange={setHome} />
            <ScoreStepper label={awayT.short} value={away} onChange={setAway} />
          </div>
          {challenge.kind === "lineup" && challenge.teamId && (
            <LineupPick teamId={challenge.teamId} value={lineup} onChange={setLineup} />
          )}
          <Button className="w-full" disabled={busy} onClick={() => void save()}>
            {busy ? "Saving…" : challenge.mine ? "Update pick" : "Lock my pick"}
          </Button>
          <p className="text-xs text-subtle">
            {challenge.submitted} submitted. Friends’ cards stay sealed until kick-off.
          </p>
        </>
      )}

      {challenge.locked && challenge.picks && (
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-wide text-subtle">Revealed</p>
          {challenge.picks
            .slice()
            .sort((a, b) => b.points - a.points)
            .map((p) => (
              <PickCard key={p.userId} pick={p} matchHome={homeT.short} matchAway={awayT.short} mine={p.userId === me} kind={challenge.kind} teamId={challenge.teamId} />
            ))}
        </div>
      )}
    </section>
  );
}

function PickCard({
  pick,
  matchHome,
  matchAway,
  mine,
  kind,
  teamId,
}: {
  pick: NonNullable<ChallengeRow["picks"]>[number];
  matchHome: string;
  matchAway: string;
  mine: boolean;
  kind: ChallengeRow["kind"];
  teamId: string | null;
}) {
  return (
    <div className="rounded-2xl border border-border bg-elevated px-4 py-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium">
          {pick.displayName}
          {mine ? " · you" : ""}
        </span>
        <span className="font-display tabular text-sm">{pick.points} pts</span>
      </div>
      <p className="mt-1 text-sm text-muted">
        {matchHome} {pick.homeGoals ?? "–"}–{pick.awayGoals ?? "–"} {matchAway}
      </p>
      {kind === "lineup" && teamId && (pick.starters.length > 0 || pick.subs.length > 0) && (
        <p className="mt-2 text-xs leading-relaxed text-subtle">
          XI {pick.starters.length} · bench {pick.subs.length}
          {pick.firstOff && pick.firstOn ? " · first substitution locked in" : ""}
        </p>
      )}
    </div>
  );
}
