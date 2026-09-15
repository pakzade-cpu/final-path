import { StarMark } from "./mark";

export function BootScreen() {
  return (
    <div className="relative grid min-h-dvh place-items-center px-6">
      <div className="stadium-wash" />
      <div className="relative z-10 flex flex-col items-center gap-4 text-center">
        <StarMark className="size-10 text-primary" />
        <p className="font-display text-sm tracking-[0.22em]">FINAL PATH</p>
        <p className="text-sm text-muted">Opening the desk…</p>
      </div>
    </div>
  );
}
