import { formatKickoff, getTeam, type Match } from "@/data/ucl";

const KEY = "world-soccer-notified";

function notified(): Set<string> {
  try {
    const raw = sessionStorage.getItem(KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

function mark(id: string) {
  const set = notified();
  set.add(id);
  sessionStorage.setItem(KEY, JSON.stringify([...set]));
}

export async function enableNotifications(): Promise<boolean> {
  if (typeof Notification === "undefined") return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;
  const res = await Notification.requestPermission();
  return res === "granted";
}

export function tickReminder(match: Match, clubId: string) {
  if (typeof Notification === "undefined") return;
  if (Notification.permission !== "granted") return;
  const start = new Date(match.kickoff).getTime();
  const now = Date.now();
  const ms = start - now;
  const home = getTeam(match.home);
  const away = getTeam(match.away);
  const title = `${home.short} vs ${away.short}`;
  const body = `Kick-off ${formatKickoff(match.kickoff)}. Your ${getTeam(clubId).short} night.`;
  if (ms <= 0 || ms > 2 * 60 * 60 * 1000) return;
  const id = `${match.id}-soon`;
  if (notified().has(id)) return;
  new Notification(title, { body, tag: id });
  mark(id);
}

export function fireKickoffPing(match: Match, clubId: string) {
  if (typeof Notification === "undefined") return;
  if (Notification.permission !== "granted") return;
  const start = new Date(match.kickoff).getTime();
  const now = Date.now();
  if (now < start - 60_000 || now > start + 10 * 60_000) return;
  const id = `${match.id}-ko`;
  if (notified().has(id)) return;
  const home = getTeam(match.home);
  const away = getTeam(match.away);
  new Notification(`${home.short} vs ${away.short} — live`, {
    body: `${getTeam(clubId).name} · open World Soccer for the night desk.`,
    tag: id,
  });
  mark(id);
}
