import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Badge({
  className,
  tone = "default",
  children,
}: {
  className?: string;
  tone?: "default" | "win" | "loss" | "draw" | "r16" | "playoff" | "out";
  children: ReactNode;
}) {
  const tones: Record<string, string> = {
    default: "border-border text-muted",
    win: "border-win/40 text-win",
    loss: "border-loss/40 text-loss",
    draw: "border-draw/40 text-draw",
    r16: "border-r16/40 text-r16",
    playoff: "border-playoff/40 text-playoff",
    out: "border-out/40 text-out",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
