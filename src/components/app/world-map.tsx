import { REGIONS, type RegionId } from "@/data/world";
import { cn } from "@/lib/utils";

const SHAPES: Record<RegionId, string> = {
  europe: "M 210 78 C 228 62 258 68 268 88 C 276 104 262 118 246 122 C 228 128 208 118 204 102 C 200 88 204 80 210 78 Z",
  asia: "M 268 86 C 298 70 348 74 372 96 C 390 114 378 138 352 146 C 322 154 286 140 274 120 C 266 106 260 94 268 86 Z",
  africa: "M 228 128 C 248 124 268 136 270 158 C 272 182 252 198 232 196 C 210 194 204 170 210 150 C 214 136 218 130 228 128 Z",
  americas: "M 78 70 C 108 58 128 78 122 108 C 118 138 98 168 84 198 C 70 188 62 150 68 118 C 72 92 70 76 78 70 Z",
  oceania: "M 352 168 C 372 160 392 172 390 188 C 388 202 368 208 352 200 C 340 194 342 174 352 168 Z",
};

export function WorldMap({
  selected,
  onSelect,
}: {
  selected: RegionId | null;
  onSelect: (id: RegionId) => void;
}) {
  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-elevated/60 p-3">
      <svg viewBox="0 0 440 230" className="h-auto w-full" role="img" aria-label="World regions">
        <rect width="440" height="230" fill="transparent" />
        {REGIONS.map((region) => {
          const on = selected === region.id;
          return (
            <path
              key={region.id}
              d={SHAPES[region.id]}
              role="button"
              tabIndex={0}
              aria-label={region.name}
              onClick={() => onSelect(region.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect(region.id);
                }
              }}
              className={cn(
                "cursor-pointer transition-colors",
                on ? "fill-primary/80 stroke-primary" : "fill-fg/20 stroke-border hover:fill-fg/35",
              )}
              strokeWidth="2"
            />
          );
        })}
      </svg>
      <div className="mt-3 flex flex-wrap gap-2">
        {REGIONS.map((region) => (
          <button
            key={region.id}
            type="button"
            onClick={() => onSelect(region.id)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs",
              selected === region.id ? "border-primary bg-primary text-primary-fg" : "border-border text-muted",
            )}
          >
            {region.name}
          </button>
        ))}
      </div>
    </div>
  );
}
