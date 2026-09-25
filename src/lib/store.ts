import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { MatterId, RegionId } from "@/data/world";

export type View =
  | "world"
  | "live"
  | "desk"
  | "table"
  | "forecast"
  | "final"
  | "club"
  | "me"
  | "favorites"
  | "compare";

export type DeskProfile = {
  displayName: string;
  clubId: string;
  playerId: string;
  shirtNo: number;
  photo: string | null;
};

type State = {
  displayName: string;
  clubId: string | null;
  playerId: string | null;
  shirtNo: number;
  photo: string | null;
  onboarded: boolean;
  guest: boolean;
  matterId: MatterId;
  regionId: RegionId | null;
  favoriteIds: string[];
  compareA: string | null;
  compareB: string | null;
  view: View;
  finalA: string | null;
  finalB: string | null;
  reminders: boolean;
  nightName: string;
  nightCode: string | null;
  groupCode: string | null;
  setProfile: (p: DeskProfile) => void;
  patchProfile: (p: Partial<DeskProfile>) => void;
  hydrate: (p: DeskProfile) => void;
  enterAsGuest: () => void;
  setMatter: (matterId: MatterId) => void;
  setRegion: (regionId: RegionId | null) => void;
  toggleFavorite: (teamId: string) => void;
  setCompare: (a: string | null, b: string | null) => void;
  setView: (v: View) => void;
  setFinal: (a: string | null, b: string | null) => void;
  setReminders: (on: boolean) => void;
  setNight: (name: string, code: string | null) => void;
  setGroupCode: (code: string | null) => void;
  reset: () => void;
};

const empty = {
  displayName: "",
  clubId: null as string | null,
  playerId: null as string | null,
  shirtNo: 10,
  photo: null as string | null,
  onboarded: false,
  guest: false,
  matterId: "ucl" as MatterId,
  regionId: null as RegionId | null,
  favoriteIds: [] as string[],
  compareA: null as string | null,
  compareB: null as string | null,
  view: "desk" as View,
  finalA: null as string | null,
  finalB: null as string | null,
  reminders: false,
  nightName: "",
  nightCode: null as string | null,
  groupCode: null as string | null,
};

export const useDesk = create<State>()(
  persist(
    (set) => ({
      ...empty,
      view: "world",
      setProfile: (p) =>
        set({
          displayName: p.displayName,
          clubId: p.clubId,
          playerId: p.playerId,
          shirtNo: p.shirtNo,
          photo: p.photo,
          onboarded: true,
          view: "desk",
        }),
      patchProfile: (p) => set(p),
      hydrate: (p) =>
        set({
          displayName: p.displayName,
          clubId: p.clubId,
          playerId: p.playerId,
          shirtNo: p.shirtNo,
          photo: p.photo,
          onboarded: true,
        }),
      enterAsGuest: () => set({ guest: true }),
      setMatter: (matterId) => set({ matterId, regionId: matterId === "ucl" ? "europe" : null }),
      setRegion: (regionId) => set({ regionId }),
      toggleFavorite: (teamId) =>
        set((s) => ({
          favoriteIds: s.favoriteIds.includes(teamId)
            ? s.favoriteIds.filter((id) => id !== teamId)
            : [...s.favoriteIds, teamId],
        })),
      setCompare: (compareA, compareB) => set({ compareA, compareB, view: "compare" }),
      setView: (view) => set({ view }),
      setFinal: (finalA, finalB) => set({ finalA, finalB }),
      setReminders: (reminders) => set({ reminders }),
      setNight: (nightName, nightCode) => set({ nightName, nightCode }),
      setGroupCode: (groupCode) => set({ groupCode, view: "club" }),
      reset: () => set({ ...empty, guest: true, view: "world" }),
    }),
    {
      name: "world-soccer-desk",
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<State>;
        return {
          ...current,
          ...p,
          favoriteIds: Array.isArray(p.favoriteIds) ? p.favoriteIds : [],
          matterId: p.matterId ?? "ucl",
        };
      },
      partialize: (s) => ({
        displayName: s.displayName,
        clubId: s.clubId,
        playerId: s.playerId,
        shirtNo: s.shirtNo,
        photo: s.photo,
        onboarded: s.onboarded,
        guest: s.guest,
        matterId: s.matterId,
        regionId: s.regionId,
        favoriteIds: s.favoriteIds,
        compareA: s.compareA,
        compareB: s.compareB,
        finalA: s.finalA,
        finalB: s.finalB,
        reminders: s.reminders,
        nightName: s.nightName,
        groupCode: s.groupCode,
      }),
    },
  ),
);
