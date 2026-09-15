import { formFor } from "@/data/ucl";
import { cn } from "@/lib/utils";

export function FormStrip({ teamId, n = 5 }: { teamId: string; n?: number }) {
  const form = formFor(teamId, n);
  if (form.length === 0) return <span className="text-xs text-subtle">—</span>;
  return (
    <span className="inline-flex gap-0.5" aria-label={`Form ${form.join(" ")}`}>
      {form.map((r, i) => (
        <span
          key={`${r}-${i}`}
          className={cn(
            "grid size-5 place-items-center rounded-sm text-xs font-semibold leading-none",
            r === "W" && "bg-win/15 text-win",
            r === "D" && "bg-draw/15 text-draw",
            r === "L" && "bg-loss/15 text-loss",
          )}
        >
          {r}
        </span>
      ))}
    </span>
  );
}
