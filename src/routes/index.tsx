import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Onboarding } from "@/components/app/onboarding";
import { Shell } from "@/components/app/shell";
import { BootScreen } from "@/components/app/boot";
import { LoginScreen } from "@/components/app/login-screen";
import { useDesk } from "@/lib/store";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { loadMyProfile, saveMyProfile } from "@/lib/fan-club";

type Search = { night?: string; group?: string };

export const Route = createFileRoute("/")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    night: typeof s.night === "string" ? s.night : undefined,
    group: typeof s.group === "string" ? s.group : undefined,
  }),
  component: Home,
});

function Home() {
  const { night, group } = Route.useSearch();
  const { user, isPending } = useCurrentUserState();
  const onboarded = useDesk((s) => s.onboarded);
  const guest = useDesk((s) => s.guest);
  const setView = useDesk((s) => s.setView);
  const setNight = useDesk((s) => s.setNight);
  const setGroupCode = useDesk((s) => s.setGroupCode);
  const hydrate = useDesk((s) => s.hydrate);
  const displayName = useDesk((s) => s.displayName);
  const nightName = useDesk((s) => s.nightName);
  const [profileReady, setProfileReady] = useState(false);

  useEffect(() => {
    if (isPending) return;
    if (!user) {
      setProfileReady(true);
      return;
    }
    let live = true;
    void loadMyProfile()
      .then((p) => {
        if (!live) return;
        if (p) {
          hydrate(p);
        } else {
          const s = useDesk.getState();
          if (s.onboarded && s.clubId && s.playerId) {
            void saveMyProfile({
              data: {
                displayName: s.displayName,
                clubId: s.clubId,
                playerId: s.playerId,
                shirtNo: s.shirtNo,
                photo: s.photo,
              },
            });
          }
        }
        setProfileReady(true);
      })
      .catch(() => {
        if (live) setProfileReady(true);
      });
    return () => {
      live = false;
    };
  }, [user, isPending, hydrate]);

  useEffect(() => {
    if (!night) return;
    const code = night.toUpperCase();
    setNight(nightName || displayName || "Fan", code);
    setView("club");
  }, [night, setNight, setView, nightName, displayName]);

  useEffect(() => {
    if (!group) return;
    setGroupCode(group.toUpperCase());
    setView("club");
  }, [group, setGroupCode, setView]);

  if (!user && !guest) return <LoginScreen />;
  if (!profileReady && user) return <BootScreen />;
  if (!onboarded) return <Onboarding />;
  return <Shell night={night?.toUpperCase()} group={group?.toUpperCase()} />;
}
