import { useMemo, useRef, useState } from "react";
import { Camera, Star } from "lucide-react";
import { TEAMS } from "@/data/ucl";
import { MATTERS, teamsInRegion, type MatterId, type RegionId } from "@/data/world";
import { shirtNumber } from "@/data/squads";
import { resizePhoto } from "@/lib/photo";
import { saveMyProfile } from "@/lib/fan-club";
import { useDesk } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Crest } from "./crest";
import { KitCard } from "./kit";
import { ShirtNumber } from "./stepper";
import { StarMark } from "./mark";
import { WorldMap } from "./world-map";
import { Assistant } from "./assistant";
import { toast } from "sonner";

type Step = "name" | "matter" | "club" | "region" | "kit";

export function Onboarding() {
  const setProfile = useDesk((s) => s.setProfile);
  const setMatter = useDesk((s) => s.setMatter);
  const setRegion = useDesk((s) => s.setRegion);
  const toggleFavorite = useDesk((s) => s.toggleFavorite);
  const favoriteIds = useDesk((s) => s.favoriteIds);
  const [step, setStep] = useState<Step>("name");
  const [name, setName] = useState("");
  const [q, setQ] = useState("");
  const [matter, setMatterLocal] = useState<MatterId>("ucl");
  const [regionId, setRegionLocal] = useState<RegionId | null>(null);
  const [clubId, setClubId] = useState<string | null>(null);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [shirtNo, setShirtNo] = useState(10);
  const [photo, setPhoto] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const clubs = useMemo(() => {
    const pool = regionId && matter === "world" ? teamsInRegion(regionId) : TEAMS;
    const n = q.trim().toLowerCase();
    if (!n) return pool;
    return pool.filter(
      (t) =>
        t.name.toLowerCase().includes(n) ||
        t.short.toLowerCase().includes(n) ||
        t.country.toLowerCase().includes(n),
    );
  }, [q, regionId, matter]);

  const club = TEAMS.find((t) => t.id === clubId);

  function pickClub(id: string) {
    setClubId(id);
    const team = TEAMS.find((t) => t.id === id);
    const first = team?.players[0];
    if (first) {
      setPlayerId(first.id);
      setShirtNo(shirtNumber(first.id, 10));
    }
  }

  async function finish() {
    const home = clubId ?? favoriteIds[0] ?? TEAMS[0].id;
    const team = TEAMS.find((t) => t.id === home) ?? TEAMS[0];
    const player = playerId ?? team.players[0]?.id ?? `${team.id}-fan`;
    const payload = {
      displayName: name.trim() || "Fan",
      clubId: home,
      playerId: player,
      shirtNo,
      photo,
    };
    setMatter(matter);
    if (regionId) setRegion(regionId);
    if (home && !favoriteIds.includes(home)) toggleFavorite(home);
    setBusy(true);
    try {
      await saveMyProfile({ data: payload });
    } catch {
      toast.error("Saved on this device — sign-in sync can retry later.");
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
          <p className="font-display text-sm tracking-[0.22em] text-fg">WORLD SOCCER</p>
          <p className="text-xs text-subtle">Aras Studio · start as a fan</p>
        </div>
      </div>

      {step === "name" && (
        <section className="relative z-10 flex flex-1 flex-col justify-center gap-8">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-subtle">Your desk</p>
            <h1 className="mt-3 max-w-lg font-display text-4xl font-semibold leading-[1.05] text-fg sm:text-5xl">
              Enter as a normal user
            </h1>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
              Just a name. Next you choose Champions League — or open the world map and follow a region.
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
            <Button className="w-full" disabled={name.trim().length < 2} onClick={() => setStep("matter")}>
              Continue
            </Button>
          </div>
        </section>
      )}

      {step === "matter" && (
        <section className="relative z-10 flex flex-1 flex-col gap-5">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-subtle">What are you here for</p>
            <h2 className="mt-2 font-display text-3xl font-semibold">Champions League first</h2>
            <p className="mt-2 text-sm text-muted">
              The desk opens on the 36. World regions are optional — pick a continent when you want that map.
            </p>
          </div>
          <div className="grid gap-2">
            {MATTERS.map((item) => {
              const on = matter === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setMatterLocal(item.id)}
                  className={cn(
                    "rounded-2xl border px-4 py-4 text-left",
                    on ? "border-primary bg-elevated" : "border-border bg-surface/80",
                  )}
                >
                  {item.featured && (
                    <p className="text-[11px] uppercase tracking-wide text-primary">Default</p>
                  )}
                  <p className="font-display text-lg font-semibold">{item.name}</p>
                  <p className="mt-1 text-sm text-muted">{item.blurb}</p>
                </button>
              );
            })}
          </div>
          <div className="flex gap-2 pb-8">
            <Button variant="outline" className="flex-1" onClick={() => setStep("name")}>
              Back
            </Button>
            <Button
              className="flex-1"
              onClick={() => setStep(matter === "world" ? "region" : "club")}
            >
              {matter === "world" ? "Open the map" : "Pick a club"}
            </Button>
          </div>
        </section>
      )}

      {step === "region" && (
        <section className="relative z-10 flex flex-1 flex-col gap-5">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-subtle">World map</p>
            <h2 className="mt-2 font-display text-3xl font-semibold">Choose a region</h2>
            <p className="mt-2 text-sm text-muted">Tap a continent, then star the clubs you want updates for.</p>
          </div>
          <WorldMap
            selected={regionId}
            onSelect={(id) => {
              setRegionLocal(id);
              setRegion(id);
            }}
          />
          {regionId && (
            <div className="grid gap-2">
              {teamsInRegion(regionId).map((team) => {
                const on = favoriteIds.includes(team.id);
                return (
                  <button
                    key={team.id}
                    type="button"
                    onClick={() => {
                      pickClub(team.id);
                      if (!on) toggleFavorite(team.id);
                    }}
                    className="flex items-center gap-3 rounded-xl border border-border bg-surface px-3 py-3 text-left"
                  >
                    <Crest team={team} size="sm" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{team.name}</span>
                      <span className="text-[11px] text-subtle">{team.country}</span>
                    </span>
                    <Star className={cn("size-4", on ? "fill-current text-primary" : "text-subtle")} />
                  </button>
                );
              })}
              {teamsInRegion(regionId).length === 0 && (
                <p className="text-sm text-muted">
                  No UCL club is based here. Continue and pick a Champions League side as your home shirt.
                </p>
              )}
            </div>
          )}
          <div className="flex gap-2 pb-8">
            <Button variant="outline" className="flex-1" onClick={() => setStep("matter")}>
              Back
            </Button>
            <Button className="flex-1" onClick={() => setStep("club")}>
              Choose a home club
            </Button>
          </div>
        </section>
      )}

      {step === "club" && (
        <section className="relative z-10 flex flex-1 flex-col gap-5">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-subtle">The 36</p>
            <h2 className="mt-2 font-display text-3xl font-semibold">Your home club</h2>
          </div>
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search clubs" />
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {clubs.map((t) => {
              const on = t.id === clubId;
              const fav = favoriteIds.includes(t.id);
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => pickClub(t.id)}
                  className={`flex items-center gap-3 rounded-xl border px-3 py-3 text-left transition-colors ${
                    on ? "border-primary bg-elevated" : "border-border bg-surface/80 hover:bg-elevated"
                  }`}
                >
                  <Crest team={t} size="sm" />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-fg">{t.name}</span>
                    <span className="block text-[11px] text-subtle">
                      {t.country}
                      {fav ? " · following" : ""}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
          <div className="flex gap-2 pb-8">
            <Button variant="outline" className="flex-1" onClick={() => setStep(matter === "world" ? "region" : "matter")}>
              Back
            </Button>
            <Button className="flex-1" disabled={!clubId} onClick={() => setStep("kit")}>
              Make your kit
            </Button>
          </div>
        </section>
      )}

      {step === "kit" && club && (
        <section className="relative z-10 flex flex-1 flex-col gap-5">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-subtle">Your shirt</p>
            <h2 className="mt-2 font-display text-3xl font-semibold">Photo on the kit</h2>
            <p className="mt-2 text-sm text-muted">Optional. Club colours only — no manufacturer marks.</p>
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
            <Button variant="outline" className="flex-1" onClick={() => setStep("club")}>
              Back
            </Button>
            <Button className="flex-1" disabled={busy} onClick={() => void finish()}>
              {busy ? "Saving…" : "Open Champions League"}
            </Button>
          </div>
        </section>
      )}
      <Assistant />
    </div>
  );
}
