import type { Team } from "@/data/ucl";
import { cn } from "@/lib/utils";

const sizes = {
  sm: "size-8 text-[10px]",
  md: "size-11 text-xs",
  lg: "size-16 text-sm",
};

export function Crest({
  team,
  size = "md",
  className,
}: {
  team: Team;
  size?: keyof typeof sizes;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full border border-border font-display font-semibold tracking-wide",
        sizes[size],
        className,
      )}
      style={{ background: team.color, color: team.ink }}
      aria-hidden
    >
      {team.short.slice(0, 3)}
    </span>
  );
}
