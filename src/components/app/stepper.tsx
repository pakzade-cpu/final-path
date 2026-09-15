import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ShirtNumber({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="flex items-center justify-center gap-4">
      <Button
        type="button"
        variant="outline"
        size="icon"
        aria-label="Lower shirt number"
        onClick={() => onChange(Math.max(1, value - 1))}
      >
        <Minus />
      </Button>
      <span className="w-16 text-center font-display text-5xl font-semibold tabular leading-none">{value}</span>
      <Button
        type="button"
        variant="outline"
        size="icon"
        aria-label="Raise shirt number"
        onClick={() => onChange(Math.min(99, value + 1))}
      >
        <Plus />
      </Button>
    </div>
  );
}

export function ScoreStepper({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-xs uppercase tracking-wide text-subtle">{label}</span>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label={`Lower ${label}`}
          onClick={() => onChange(Math.max(0, value - 1))}
        >
          <Minus />
        </Button>
        <span className="w-10 text-center font-display text-4xl font-semibold tabular leading-none">{value}</span>
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label={`Raise ${label}`}
          onClick={() => onChange(Math.min(15, value + 1))}
        >
          <Plus />
        </Button>
      </div>
    </div>
  );
}

export function CompactScore({
  home,
  away,
  onHome,
  onAway,
  disabled,
}: {
  home: number;
  away: number;
  onHome: (n: number) => void;
  onAway: (n: number) => void;
  disabled?: boolean;
}) {
  const bump = (side: "h" | "a", d: number) => {
    if (disabled) return;
    if (side === "h") onHome(Math.min(15, Math.max(0, home + d)));
    else onAway(Math.min(15, Math.max(0, away + d)));
  };
  const cell = (side: "h" | "a", value: number) => (
    <span className="inline-flex items-center">
      <button
        type="button"
        disabled={disabled}
        aria-label={side === "h" ? "Lower home" : "Lower away"}
        className="grid size-9 place-items-center rounded-md text-lg text-muted disabled:opacity-40"
        onClick={() => bump(side, -1)}
      >
        −
      </button>
      <span className="w-6 text-center font-display text-xl tabular leading-none">{value}</span>
      <button
        type="button"
        disabled={disabled}
        aria-label={side === "h" ? "Raise home" : "Raise away"}
        className="grid size-9 place-items-center rounded-md text-lg text-muted disabled:opacity-40"
        onClick={() => bump(side, 1)}
      >
        +
      </button>
    </span>
  );
  return (
    <div className="flex items-center">
      {cell("h", home)}
      <span className="px-0.5 text-subtle">–</span>
      {cell("a", away)}
    </div>
  );
}
