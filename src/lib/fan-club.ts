import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { MATCHES, getTeam, gradePick, activeMatchday, matchesOnMd } from "@/data/ucl";

const CODE = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function code6() {
  return Array.from({ length: 6 }, () => CODE[Math.floor(Math.random() * CODE.length)]).join("");
}

function id12() {
  return Array.from({ length: 12 }, () => CODE[Math.floor(Math.random() * CODE.length)]).join("");
}

export type FanProfile = {
  userId: string;
  displayName: string;
  clubId: string;
  playerId: string;
  shirtNo: number;
  photo: string | null;
};

export type GroupSummary = {
  id: string;
  name: string;
  ownerId: string;
  members: number;
};

export type ChallengeRow = {
  id: string;
  groupId: string;
  matchId: string;
  kind: "score" | "lineup";
  teamId: string | null;
  createdBy: string;
  locked: boolean;
  submitted: number;
  mine: PickPayload | null;
  picks: PublicPick[] | null;
};

export type PickPayload = {
  homeGoals: number | null;
  awayGoals: number | null;
  starters: string[];
  subs: string[];
  firstOff: string | null;
  firstOn: string | null;
};

export type PublicPick = PickPayload & {
  userId: string;
  displayName: string;
  clubId: string | null;
  shirtNo: number;
  photo: string | null;
  points: number;
};

type ProfileRow = {
  user_id: string;
  display_name: string;
  club_id: string;
  player_id: string;
  shirt_no: number | string;
  photo: string | null;
};

function toProfile(r: ProfileRow): FanProfile {
  return {
    userId: r.user_id,
    displayName: r.display_name,
    clubId: r.club_id,
    playerId: r.player_id,
    shirtNo: Number(r.shirt_no),
    photo: r.photo,
  };
}

function matchById(id: string) {
  return MATCHES.find((m) => m.id === id);
}

function isLocked(matchId: string) {
  const m = matchById(matchId);
  if (!m) return true;
  return Date.now() >= new Date(m.kickoff).getTime();
}

function scorePoints(matchId: string, home: number | null, away: number | null): number {
  const m = matchById(matchId);
  if (!m || m.hg == null || m.ag == null || home == null || away == null) return 0;
  if (home === m.hg && away === m.ag) return 5;
  const pred = Math.sign(home - away);
  const real = Math.sign(m.hg - m.ag);
  return pred === real ? 2 : 0;
}

async function assertMember(sql: Awaited<ReturnType<typeof getSql>>, groupId: string, userId: string) {
  const rows = await sql<{ user_id: string }>`
    select user_id from fan_members where group_id = ${groupId} and user_id = ${userId} limit 1
  `;
  if (!rows[0]) throw new Error("Not in this group");
}

export const loadMyProfile = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<FanProfile | null> => {
    const sql = await getSql();
    const rows = await sql<ProfileRow>`
      select user_id, display_name, club_id, player_id, shirt_no, photo
      from fan_profiles where user_id = ${context.userId} limit 1
    `;
    return rows[0] ? toProfile(rows[0]) : null;
  });

export const saveMyProfile = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { displayName: string; clubId: string; playerId: string; shirtNo: number; photo: string | null }) => {
    const displayName = input.displayName.trim().slice(0, 24);
    const clubId = input.clubId.slice(0, 8);
    const playerId = input.playerId.slice(0, 40);
    const shirtNo = Math.min(99, Math.max(1, Math.round(Number(input.shirtNo) || 10)));
    const photo = input.photo && input.photo.startsWith("data:image/") && input.photo.length < 120_000 ? input.photo : null;
    if (displayName.length < 2) throw new Error("Name is too short");
    getTeam(clubId);
    return { displayName, clubId, playerId, shirtNo, photo };
  })
  .handler(async ({ context, data }): Promise<FanProfile> => {
    const sql = await getSql();
    await sql`
      insert into fan_profiles (user_id, display_name, club_id, player_id, shirt_no, photo, updated_at)
      values (${context.userId}, ${data.displayName}, ${data.clubId}, ${data.playerId}, ${data.shirtNo}, ${data.photo}, now())
      on conflict (user_id) do update set
        display_name = excluded.display_name,
        club_id = excluded.club_id,
        player_id = excluded.player_id,
        shirt_no = excluded.shirt_no,
        photo = excluded.photo,
        updated_at = now()
    `;
    return { userId: context.userId, ...data };
  });

export const listMyGroups = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<GroupSummary[]> => {
    const sql = await getSql();
    const rows = await sql<{ id: string; name: string; owner_id: string; members: number }>`
      select g.id, g.name, g.owner_id,
        (select count(*) from fan_members m where m.group_id = g.id)::int as members
      from fan_groups g
      join fan_members me on me.group_id = g.id
      where me.user_id = ${context.userId}
      order by g.created_at desc
    `;
    return rows.map((r) => ({ id: r.id, name: r.name, ownerId: r.owner_id, members: Number(r.members) }));
  });

export const createGroup = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((name: string) => {
    const n = name.trim().slice(0, 32);
    if (n.length < 2) throw new Error("Name the group");
    return n;
  })
  .handler(async ({ context, data: name }): Promise<GroupSummary> => {
    const sql = await getSql();
    let id = code6();
    for (let i = 0; i < 6; i++) {
      const exists = await sql<{ id: string }>`select id from fan_groups where id = ${id} limit 1`;
      if (!exists[0]) break;
      id = code6();
    }
    await sql`insert into fan_groups (id, name, owner_id) values (${id}, ${name}, ${context.userId})`;
    await sql`insert into fan_members (group_id, user_id) values (${id}, ${context.userId})`;
    return { id, name, ownerId: context.userId, members: 1 };
  });

export const joinGroup = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((code: string) => code.trim().toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8))
  .handler(async ({ context, data: id }): Promise<GroupSummary> => {
    const sql = await getSql();
    const g = await sql<{ id: string; name: string; owner_id: string }>`
      select id, name, owner_id from fan_groups where id = ${id} limit 1
    `;
    if (!g[0]) throw new Error("No group with that code");
    await sql`
      insert into fan_members (group_id, user_id) values (${g[0].id}, ${context.userId})
      on conflict do nothing
    `;
    const count = await sql<{ n: number }>`select count(*)::int as n from fan_members where group_id = ${g[0].id}`;
    return { id: g[0].id, name: g[0].name, ownerId: g[0].owner_id, members: Number(count[0]?.n ?? 1) };
  });

export const getGroupBoard = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((groupId: string) => groupId.trim().toUpperCase().slice(0, 8))
  .handler(async ({ context, data: groupId }): Promise<{
    group: GroupSummary;
    members: FanProfile[];
    challenges: ChallengeRow[];
    slateMd: number;
    slate: SlateRow[];
  }> => {
    const sql = await getSql();
    await assertMember(sql, groupId, context.userId);
    const g = await sql<{ id: string; name: string; owner_id: string }>`
      select id, name, owner_id from fan_groups where id = ${groupId} limit 1
    `;
    if (!g[0]) throw new Error("Group missing");
    const members = await sql<ProfileRow>`
      select p.user_id, p.display_name, p.club_id, p.player_id, p.shirt_no, p.photo
      from fan_members m
      join fan_profiles p on p.user_id = m.user_id
      where m.group_id = ${groupId}
      order by m.joined_at
    `;
    const challenges = await sql<{
      id: string;
      group_id: string;
      match_id: string;
      kind: string;
      team_id: string | null;
      created_by: string;
    }>`
      select id, group_id, match_id, kind, team_id, created_by
      from fan_challenges where group_id = ${groupId}
      order by created_at desc
    `;
    const out: ChallengeRow[] = [];
    for (const c of challenges) {
      const locked = isLocked(c.match_id);
      const picks = await sql<{
        user_id: string;
        home_goals: number | null;
        away_goals: number | null;
        starters: string | null;
        subs: string | null;
        first_off: string | null;
        first_on: string | null;
      }>`
        select user_id, home_goals, away_goals, starters, subs, first_off, first_on
        from fan_picks where challenge_id = ${c.id}
      `;
      const mineRow = picks.find((p) => p.user_id === context.userId);
      const parseList = (s: string | null) => {
        if (!s) return [] as string[];
        try {
          const v = JSON.parse(s) as unknown;
          return Array.isArray(v) ? v.filter((x) => typeof x === "string") : [];
        } catch {
          return [];
        }
      };
      const toPayload = (p: (typeof picks)[number]): PickPayload => ({
        homeGoals: p.home_goals == null ? null : Number(p.home_goals),
        awayGoals: p.away_goals == null ? null : Number(p.away_goals),
        starters: parseList(p.starters),
        subs: parseList(p.subs),
        firstOff: p.first_off,
        firstOn: p.first_on,
      });
      let publicPicks: PublicPick[] | null = null;
      if (locked) {
        const profs = new Map(members.map((m) => [m.user_id, m]));
        publicPicks = picks.map((p) => {
          const payload = toPayload(p);
          const pr = profs.get(p.user_id);
          return {
            ...payload,
            userId: p.user_id,
            displayName: pr?.display_name ?? "Fan",
            clubId: pr?.club_id ?? null,
            shirtNo: pr ? Number(pr.shirt_no) : 10,
            photo: pr?.photo ?? null,
            points: scorePoints(c.match_id, payload.homeGoals, payload.awayGoals),
          };
        });
      }
      out.push({
        id: c.id,
        groupId: c.group_id,
        matchId: c.match_id,
        kind: c.kind === "lineup" ? "lineup" : "score",
        teamId: c.team_id,
        createdBy: c.created_by,
        locked,
        submitted: picks.length,
        mine: mineRow ? toPayload(mineRow) : null,
        picks: publicPicks,
      });
    }
    const count = members.length;
    const slateMd = activeMatchday();
    const names = new Map(
      members.map((m) => [m.user_id, { displayName: m.display_name, clubId: m.club_id }]),
    );
    const slate = await slateTableFor(sql, groupId, names, slateMd);
    return {
      group: { id: g[0].id, name: g[0].name, ownerId: g[0].owner_id, members: count },
      members: members.map(toProfile),
      challenges: out,
      slateMd,
      slate,
    };
  });

export const createChallenge = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { groupId: string; matchId: string; kind: "score" | "lineup"; teamId?: string | null }) => {
    const groupId = input.groupId.trim().toUpperCase().slice(0, 8);
    const matchId = input.matchId.slice(0, 32);
    const m = matchById(matchId);
    if (!m) throw new Error("Unknown match");
    if (Date.now() >= new Date(m.kickoff).getTime()) throw new Error("That match has kicked off");
    const kind = input.kind === "lineup" ? "lineup" : "score";
    let teamId: string | null = null;
    if (kind === "lineup") {
      if (input.teamId !== m.home && input.teamId !== m.away) throw new Error("Pick a side");
      teamId = input.teamId ?? null;
    }
    return { groupId, matchId, kind, teamId };
  })
  .handler(async ({ context, data }): Promise<{ id: string }> => {
    const sql = await getSql();
    await assertMember(sql, data.groupId, context.userId);
    const id = id12();
    await sql`
      insert into fan_challenges (id, group_id, match_id, kind, team_id, created_by)
      values (${id}, ${data.groupId}, ${data.matchId}, ${data.kind}, ${data.teamId}, ${context.userId})
    `;
    return { id };
  });

export const submitPick = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { challengeId: string; homeGoals?: number | null; awayGoals?: number | null; starters?: string[]; subs?: string[]; firstOff?: string | null; firstOn?: string | null }) => {
    const challengeId = input.challengeId.slice(0, 16);
    const homeGoals = input.homeGoals == null ? null : Math.min(15, Math.max(0, Math.round(Number(input.homeGoals))));
    const awayGoals = input.awayGoals == null ? null : Math.min(15, Math.max(0, Math.round(Number(input.awayGoals))));
    const starters = (input.starters ?? []).filter((x) => typeof x === "string").slice(0, 11);
    const subs = (input.subs ?? []).filter((x) => typeof x === "string").slice(0, 5);
    const firstOff = input.firstOff?.slice(0, 40) ?? null;
    const firstOn = input.firstOn?.slice(0, 40) ?? null;
    return { challengeId, homeGoals, awayGoals, starters, subs, firstOff, firstOn };
  })
  .handler(async ({ context, data }): Promise<{ ok: true }> => {
    const sql = await getSql();
    const ch = await sql<{ id: string; group_id: string; match_id: string; kind: string }>`
      select id, group_id, match_id, kind from fan_challenges where id = ${data.challengeId} limit 1
    `;
    if (!ch[0]) throw new Error("Challenge missing");
    await assertMember(sql, ch[0].group_id, context.userId);
    if (isLocked(ch[0].match_id)) throw new Error("Picks are locked — kick-off has passed");
    const starters = JSON.stringify(data.starters);
    const subs = JSON.stringify(data.subs);
    await sql`
      insert into fan_picks (challenge_id, user_id, home_goals, away_goals, starters, subs, first_off, first_on, submitted_at)
      values (${data.challengeId}, ${context.userId}, ${data.homeGoals}, ${data.awayGoals}, ${starters}, ${subs}, ${data.firstOff}, ${data.firstOn}, now())
      on conflict (challenge_id, user_id) do update set
        home_goals = excluded.home_goals,
        away_goals = excluded.away_goals,
        starters = excluded.starters,
        subs = excluded.subs,
        first_off = excluded.first_off,
        first_on = excluded.first_on,
        submitted_at = now()
    `;
    return { ok: true };
  });

export type SlatePick = {
  matchId: string;
  homeGoals: number;
  awayGoals: number;
};

export type SlateRow = {
  userId: string;
  displayName: string;
  clubId: string | null;
  pts: number;
  exact: number;
  result: number;
  filled: number;
  open: number;
};

export const loadMySlate = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<SlatePick[]> => {
    const sql = await getSql();
    const rows = await sql<{ match_id: string; home_goals: number | string; away_goals: number | string }>`
      select match_id, home_goals, away_goals from fan_slate_picks where user_id = ${context.userId}
    `;
    return rows.map((r) => ({
      matchId: r.match_id,
      homeGoals: Number(r.home_goals),
      awayGoals: Number(r.away_goals),
    }));
  });

export const saveSlatePicks = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { picks: SlatePick[] }) => {
    const picks = (input.picks ?? [])
      .slice(0, 36)
      .map((p) => ({
        matchId: String(p.matchId).slice(0, 32),
        homeGoals: Math.min(15, Math.max(0, Math.round(Number(p.homeGoals)))),
        awayGoals: Math.min(15, Math.max(0, Math.round(Number(p.awayGoals)))),
      }))
      .filter((p) => MATCHES.some((m) => m.id === p.matchId));
    return { picks };
  })
  .handler(async ({ context, data }): Promise<{ saved: number }> => {
    const sql = await getSql();
    let saved = 0;
    for (const p of data.picks) {
      const m = matchById(p.matchId);
      if (!m) continue;
      if (Date.now() >= new Date(m.kickoff).getTime()) continue;
      await sql`
        insert into fan_slate_picks (user_id, match_id, home_goals, away_goals, submitted_at)
        values (${context.userId}, ${p.matchId}, ${p.homeGoals}, ${p.awayGoals}, now())
        on conflict (user_id, match_id) do update set
          home_goals = excluded.home_goals,
          away_goals = excluded.away_goals,
          submitted_at = now()
      `;
      saved += 1;
    }
    return { saved };
  });

export async function slateTableFor(
  sql: Awaited<ReturnType<typeof getSql>>,
  groupId: string,
  names: Map<string, { displayName: string; clubId: string | null }>,
  md: number,
): Promise<SlateRow[]> {
  const rows = await sql<{
    user_id: string;
    match_id: string;
    home_goals: number | string;
    away_goals: number | string;
  }>`
    select s.user_id, s.match_id, s.home_goals, s.away_goals
    from fan_slate_picks s
    join fan_members m on m.user_id = s.user_id
    where m.group_id = ${groupId}
  `;
  const byUser = new Map<string, SlatePick[]>();
  for (const r of rows) {
    const list = byUser.get(r.user_id) ?? [];
    list.push({ matchId: r.match_id, homeGoals: Number(r.home_goals), awayGoals: Number(r.away_goals) });
    byUser.set(r.user_id, list);
  }
  const fixtures = matchesOnMd(md);
  return [...names.keys()]
    .map((id) => {
      const picks = byUser.get(id) ?? [];
      const map = new Map(picks.map((p) => [p.matchId, p]));
      let pts = 0;
      let exact = 0;
      let result = 0;
      let filled = 0;
      let open = 0;
      for (const m of fixtures) {
        const p = map.get(m.id);
        if (!p) {
          if (m.hg == null) open += 1;
          continue;
        }
        filled += 1;
        const g = gradePick(m, p.homeGoals, p.awayGoals);
        pts += g.points;
        if (g.tag === "exact") exact += 1;
        if (g.tag === "result") result += 1;
        if (g.tag === "open") open += 1;
      }
      const meta = names.get(id);
      return {
        userId: id,
        displayName: meta?.displayName ?? "Fan",
        clubId: meta?.clubId ?? null,
        pts,
        exact,
        result,
        filled,
        open,
      };
    })
    .sort((a, b) => b.pts - a.pts || b.exact - a.exact || a.displayName.localeCompare(b.displayName));
}
