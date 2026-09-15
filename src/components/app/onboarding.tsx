import { useMemo, useRef, useState } from "react";
import { Camera } from "lucide-react";
import { TEAMS } from "@/data/ucl";
import { shirtNumber } from "@/data/squads";
import { resizePhoto } from "@/lib/photo";
import { saveMyProfile } from "@/lib/fan-club";
import { useDesk } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Crest } from "./crest";
import { KitCard } from "./kit";
import { ShirtNumber } from "./stepper";
import { StarMark } from "./mark";
import { toast } from "sonner";

export function Onboarding() {
  const setProfile = useDesk((s) => s.setProfile);
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [name, setName] = useState("");
  const [q, setQ] = useState("");
  const [clubId, setClubId] = useState<string | null>(null);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [shirtNo, setShirtNo] = useState(10);
  const [photo, setPhoto] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

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

  const club = TEAMS.find((t) => t.id === clubId);

  async function finish() {
    if (!clubId || !playerId) return;
    const payload = {
      displayName: name.trim(),
      clubId,
      playerId,
      shirtNo,
      photo,
    };
    setBusy(true);
    try {
      await saveMyProfile({ data: payload });
    } catch {
      toast.error("Kit saved on this device — sign-in sync can retry later.");
    } finally {
      setProfile(payload);
      setBusy(false);
    }
  }

  return (
    <div className="relative mx-auto flex min-h-dvh w-full max-w-3xl flex-col px-4 py-10 sm:px-6">
      <div className="stadium-wash" />
      <div className="relative z-10 mb-10 flex items-center gap-3 text-muted">
        <StarMark className="size-7 text-primary" />
        <div>
          <p className="font-display text-sm tracking-[0.22em] text-fg">FINAL PATH</p>
          <p className="text-xs text-subtle">Champions League 2026/27</p>
        </div>
      </div>

      {step === 1 && (
        <section className="relative z-10 flex flex-1 flex-col justify-center gap-8">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-subtle">Your desk</p>
            <h1 className="mt-3 max-w-lg font-display text-4xl font-semibold leading-[1.05] text-fg sm:text-5xl">
              Who is sitting this European campaign?
            </h1>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
              A personal chart desk for the 36. Your club, your kit, the next kick-off, and a guess at Madrid.
            </p>
          </div>
          <div className="max-w-sm space-y-3 rounded-3xl p-5 panel">
            <label className="text-xs uppercase tracking-[0.16em] text-subtle" htmlFor="name">
              Display name
            </label>
            <Input
              id="name"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              maxLength={24}
            />
            <Button className="w-full" disabled={name.trim().length < 2} onClick={() => setStep(2)}>
              Choose a club
            </Button>
          </div>
        </section>
      )}

      {step === 2 && (
        <section className="relative z-10 flex flex-1 flex-col gap-5">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-subtle">The 36</p>
            <h2 className="mt-2 font-display text-3xl font-semibold">Pick your club</h2>
          </div>
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search clubs" />
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {clubs.map((t) => {
              const on = t.id === clubId;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setClubId(t.id)}
                  className={`flex items-center gap-3 rounded-xl border px-3 py-3 text-left transition-colors ${
                    on ? "border-primary bg-elevated" : "border-border bg-surface/80 hover:bg-elevated"
                  }`}
                >
                  <Crest team={t} size="sm" />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-fg">{t.name}</span>
                    <span className="block text-[11px] text-subtle">
                      {t.country} · Pot {t.pot}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
          <div className="flex gap-2 pb-8">
            <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button className="flex-1" disabled={!clubId} onClick={() => setStep(3)}>
              Choose a player
            </Button>
          </div>
        </section>
      )}

      {step === 3 && club && (
        <section className="relative z-10 flex flex-1 flex-col gap-5">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-subtle">{club.name}</p>
            <h2 className="mt-2 font-display text-3xl font-semibold">Who do you follow?</h2>
          </div>
          <div className="grid gap-2">
            {club.players.map((p) => {
              const on = p.id === playerId;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setPlayerId(p.id);
                    setShirtNo(shirtNumber(p.id, 10));
                  }}
                  className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left ${
                    on ? "border-primary bg-elevated" : "border-border bg-surface/80 hover:bg-elevated"
                  }`}
                >
                  <span>
                    <span className="block text-sm font-medium text-fg">{p.name}</span>
                    <span className="text-[11px] uppercase tracking-wide text-subtle">{p.pos}</span>
                  </span>
                  <span className="font-display text-lg tabular text-muted">{shirtNumber(p.id)}</span>
                </button>
              );
            })}
          </div>
          <div className="flex gap-2 pb-8">
            <Button variant="outline" className="flex-1" onClick={() => setStep(2)}>
              Back
            </Button>
            <Button className="flex-1" disabled={!playerId} onClick={() => setStep(4)}>
              Make your kit
            </Button>
          </div>
        </section>
      )}

      {step === 4 && club && (
        <section className="relative z-10 flex flex-1 flex-col gap-5">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-subtle">Your shirt</p>
            <h2 className="mt-2 font-display text-3xl font-semibold">Photo on the kit</h2>
            <p className="mt-2 text-sm text-muted">Tap the chest to print your photo. Pick the number you want.</p>
          </div>
          <div className="flex flex-col items-center gap-5 rounded-3xl p-6 panel">
            <KitCard
              team={club}
              name={name}
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
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                try {
                  setPhoto(await resizePhoto(file));
                } catch {
                  toast.error("Could not read that photo");
                }
              }}
            />
            <Button variant="outline" onClick={() => fileRef.current?.click()}>
              <Camera /> {photo ? "Change photo on shirt" : "Put your photo on the shirt"}
            </Button>
            <ShirtNumber value={shirtNo} onChange={setShirtNo} />
          </div>
          <div className="flex gap-2 pb-8">
            <Button variant="outline" className="flex-1" onClick={() => setStep(3)}>
              Back
            </Button>
            <Button className="flex-1" disabled={busy} onClick={() => void finish()}>
              {busy ? "Saving…" : "Open the desk"}
            </Button>
          </div>
        </section>
      )}
    </div>
  );
}
