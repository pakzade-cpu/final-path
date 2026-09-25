import { create } from "zustand";
import { persist } from "zustand/middleware";

export type View = "live" | "desk" | "table" | "forecast" | "final" | "club" | "me";

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
  setView: (v: View) => void;
  setFinal: (a: string | null, b: string | null) => void;
  setReminders: (on: boolean) => void;
  setNight: (name: string, code: string | null) => void;
  setGroupCode: (code: string | null) => void;
  reset: () => void;
};

export const useDesk = create<State>()(
  persist(
    (set) => ({
      displayName: "",
      clubId: null,
      playerId: null,
      shirtNo: 10,
      photo: null,
      onboarded: false,
      view: "live",
      finalA: null,
      finalB: null,
      reminders: false,
      nightName: "",
      nightCode: null,
      groupCode: null,
      setProfile: (p) =>
        set({
          displayName: p.displayName,
          clubId: p.clubId,
          playerId: p.playerId,
          shirtNo: p.shirtNo,
          photo: p.photo,
          onboarded: true,
          view: "live",
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
      setView: (view) => set({ view }),
      setFinal: (finalA, finalB) => set({ finalA, finalB }),
      setReminders: (reminders) => set({ reminders }),
      setNight: (nightName, nightCode) => set({ nightName, nightCode }),
      setGroupCode: (groupCode) => set({ groupCode, view: groupCode ? "club" : "club" }),
      reset: () =>
        set({
          displayName: "",
          clubId: null,
          playerId: null,
          shirtNo: 10,
          photo: null,
          onboarded: false,
          view: "desk",
          finalA: null,
          finalB: null,
          reminders: false,
        }),
    }),
    {
      name: "world-soccer-desk",
      partialize: (s) => ({
        displayName: s.displayName,
        clubId: s.clubId,
        playerId: s.playerId,
        shirtNo: s.shirtNo,
        photo: s.photo,
        onboarded: s.onboarded,
        finalA: s.finalA,
        finalB: s.finalB,
        reminders: s.reminders,
        nightName: s.nightName,
        groupCode: s.groupCode,
      }),
    },
  ),
);
