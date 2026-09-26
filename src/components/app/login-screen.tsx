import { GROK_PROVIDERS, authEnabled, signIn } from "@/lib/auth/client";
import { useDesk } from "@/lib/store";
import { StarMark } from "./mark";
import { Assistant } from "./assistant";
import { Button } from "@/components/ui/button";

export function LoginScreen() {
  const enterAsGuest = useDesk((s) => s.enterAsGuest);
  return (
    <main className="relative grid min-h-dvh place-items-center overflow-hidden px-4 py-10">
      <div className="stadium-wash" />
      <div className="relative z-10 w-full max-w-sm space-y-6 rounded-3xl p-6 panel">
        <div className="flex items-center gap-3">
          <StarMark className="size-7 text-primary" />
          <div>
            <p className="font-display text-sm tracking-[0.2em]">WORLD SOCCER</p>
            <p className="text-xs text-subtle">Aras Studio · Champions League 2026/27</p>
          </div>
        </div>
        <div>
          <h1 className="font-display text-3xl font-semibold">Sign in to your desk</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Hang your club shirt with your photo and number, then challenge friends on scores and substitutions before kick-off.
          </p>
        </div>
        {authEnabled ? (
          <div className="space-y-2">
            {GROK_PROVIDERS.map((p) => (
              <Button
                key={p.providerId}
                className="w-full"
                variant={p.providerId === "grok-x" ? "default" : "outline"}
                onClick={() => signIn(p.providerId, { callbackURL: "/" })}
              >
                Continue with {p.label}
              </Button>
            ))}
            <Button className="w-full" variant="ghost" onClick={enterAsGuest}>
              Enter as a guest
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-muted">Sign-in is optional on this machine.</p>
            <Button className="w-full" onClick={enterAsGuest}>
              Enter as a guest
            </Button>
          </div>
        )}
      </div>
      <img
        src="/ball.jpg"
        alt=""
        className="pointer-events-none absolute -right-12 -bottom-10 z-[1] size-28 rounded-full object-cover shadow-soft sm:-right-10 sm:-bottom-6 sm:size-52"
      />
      <Assistant />
    </main>
  );
}
