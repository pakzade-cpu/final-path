import { getTeam, type Match, formatKickoff } from "@/data/ucl";
import { APP_NAME } from "@/lib/brand";

export function xIntent(text: string): string {
  return `https://x.com/intent/post?text=${encodeURIComponent(text)}`;
}

export function shareMatchCopy(opts: {
  name: string;
  clubId: string;
  match: Match;
  scoreHint?: string;
  finalA?: string | null;
  finalB?: string | null;
  url: string;
}): string {
  const club = getTeam(opts.clubId);
  const home = getTeam(opts.match.home);
  const away = getTeam(opts.match.away);
  const lines = [
    `${opts.name} · ${club.name} on ${APP_NAME}.`,
    `Next: ${home.short} vs ${away.short} — ${formatKickoff(opts.match.kickoff)}.`,
  ];
  if (opts.scoreHint) lines.push(`Model: ${opts.scoreHint}.`);
  if (opts.finalA && opts.finalB) {
    lines.push(`Madrid night pick: ${getTeam(opts.finalA).name} vs ${getTeam(opts.finalB).name}.`);
  }
  lines.push(`Join the desk: ${opts.url}`);
  return lines.join("\n");
}

export function shareNightCopy(code: string, clubName: string, url: string): string {
  return `Night is open. Watching Champions League 26/27 with ${clubName} on ${APP_NAME}.\nRoom ${code}\n${url}`;
}

export function shareGroupCopy(groupName: string, code: string, clubName: string, url: string): string {
  return `Join my ${APP_NAME} club — ${groupName}.\nWe pick scores, XIs and first subs before kick-off. I'm on ${clubName}.\nCode ${code}\n${url}`;
}

export async function nativeShare(title: string, text: string, url: string): Promise<boolean> {
  if (typeof navigator === "undefined" || !navigator.share) return false;
  try {
    await navigator.share({ title, text, url });
    return true;
  } catch {
    return false;
  }
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function icsForMatch(match: Match): string {
  const home = getTeam(match.home);
  const away = getTeam(match.away);
  const start = new Date(match.kickoff);
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
  const stamp = (d: Date) =>
    d
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}Z$/, "Z");
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:-//${APP_NAME}//UCL 26-27//EN`,
    "BEGIN:VEVENT",
    `UID:${match.id}@worldsoccer`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:UCL · ${home.name} vs ${away.name}`,
    `DESCRIPTION:${APP_NAME} reminder — Champions League 2026/27 matchday ${match.md}.`,
    `LOCATION:${home.stadium}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export function downloadIcs(filename: string, body: string) {
  const blob = new Blob([body], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
