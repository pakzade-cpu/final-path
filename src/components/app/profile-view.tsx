import { useMemo, useRef, useState } from "react";
import { Camera } from "lucide-react";
import { TEAMS, findPlayer, getTeam } from "@/data/ucl";
import { shirtNumber } from "@/data/squads";
import { resizePhoto } from "@/lib/photo";
import { saveMyProfile } from "@/lib/fan-club";
import { useDesk } from "@/lib/store";
import { UserButton } from "@/lib/auth/gates";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { KitCard } from "./kit";
import { ShirtNumber } from "./stepper";
import { Crest } from "./crest";
import { toast } from "sonner";

export function ProfileView() {
  const displayName = useDesk((s) => s.displayName);
  const clubId = useDesk((s) => s.clubId)!;
  const playerId = useDesk((s) => s.playerId)!;
  const shirtNo = useDesk((s) => s.shirtNo);
  const photo = useDesk((s) => s.photo);
  const patch = useDesk((s) => s.patchProfile);
  const setProfile = useDesk((s) => s.setProfile);
  const reset = useDesk((s) => s.reset);
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const club = getTeam(clubId);
  const player = findPlayer(playerId)?.player;

  const clubs = useMemo(() => {
    const n = q.trim().toLowerCase();
    if (!n) return TEAMS;
    return TEAMS.filter(
      (t) =>
        t.name.toLowerCase().includes(n) ||
        t.short.toLowerCase().includes(n) ||
        t.country.toLowerCase().includes(n),
    );
  }, [q]);

  async function onPhoto(file: File | undefined) {
    if (!file) return;
    try {
      const data = await resizePhoto(file);
      patch({ photo: data });
    } catch {
      toast.error("Could not read that photo");
    }
  }

  async function save() {
    setBusy(true);
    try {
      const next = {
        displayName: displayName.trim(),
        clubId,
        playerId,
        shirtNo,
        photo,
      };
      await saveMyProfile({ data: next });
      setProfile(next);
      toast.success("Kit saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6 pb-8">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-subtle">Your kit</p>
        <h1 className="mt-1 font-display text-3xl font-semibold">Edit profile</h1>
        <p className="mt-2 text-sm text-muted">
          Photo prints on the shirt. Pick a number. Friends in a group see this kit.
        </p>
        <div className="mt-3">
          <UserButton />
        </div>
      </div>

      <section className="flex flex-col items-center gap-5 rounded-3xl p-6 panel">
        <KitCard
          team={club}
          name={displayName}
          number={shirtNo}
          photo={photo}
          size="lg"
          onPhotoClick={() => fileRef.current?.click()}
        />
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => void onPhoto(e.target.files?.[0])}
        />
        <Button variant="outline" onClick={() => fileRef.current?.click()}>
          <Camera /> {photo ? "Change photo on shirt" : "Put your photo on the shirt"}
        </Button>
        <ShirtNumber value={shirtNo} onChange={(n) => patch({ shirtNo: n })} />
      </section>

      <section className="space-y-3 rounded-3xl p-5 panel">
        <label className="text-xs uppercase tracking-wide text-subtle" htmlFor="pname">
          Display name
        </label>
        <Input
          id="pname"
          value={displayName}
          maxLength={24}
          onChange={(e) => patch({ displayName: e.target.value })}
        />
      </section>

      <section className="space-y-3">
        <p className="text-xs uppercase tracking-wide text-subtle">Club</p>
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search clubs" />
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {clubs.map((t) => {
            const on = t.id === clubId;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  const nextPlayer = t.players[0]?.id ?? playerId;
                  patch({
                    clubId: t.id,
                    playerId: t.id === clubId ? playerId : nextPlayer,
                    shirtNo: t.id === clubId ? shirtNo : shirtNumber(nextPlayer, shirtNo),
                  });
                }}
                className={`flex min-h-12 items-center gap-3 rounded-xl border px-3 py-3 text-left ${
                  on ? "border-primary bg-elevated" : "border-border bg-surface/80"
                }`}
              >
                <Crest team={t} size="sm" />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium">{t.name}</span>
                  <span className="block text-xs text-subtle">{t.country}</span>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="space-y-2">
        <p className="text-xs uppercase tracking-wide text-subtle">Player you follow</p>
        {club.players.map((p) => {
          const on = p.id === playerId;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => patch({ playerId: p.id, shirtNo: shirtNumber(p.id, shirtNo) })}
              className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left ${
                on ? "border-primary bg-elevated" : "border-border bg-surface/80"
              }`}
            >
              <span>
                <span className="block text-sm font-medium">{p.name}</span>
                <span className="text-xs uppercase tracking-wide text-subtle">{p.pos}</span>
              </span>
              <span className="font-display text-lg tabular text-muted">{shirtNumber(p.id)}</span>
            </button>
          );
        })}
      </section>

      {player && (
        <p className="text-sm text-muted">
          Following {player.name} · shirt {shirtNo}
        </p>
      )}

      <Button className="w-full" disabled={busy || displayName.trim().length < 2} onClick={() => void save()}>
        {busy ? "Saving…" : "Save kit"}
      </Button>
      <Button variant="ghost" className="w-full text-subtle" onClick={reset}>
        Switch club
      </Button>
    </div>
  );
}
