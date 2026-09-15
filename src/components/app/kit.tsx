import type { Team } from "@/data/ucl";
import { useId } from "react";

function inkOn(hex: string): string {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return lum > 0.62 ? "#1a2332" : "#f7f4ee";
}

export function KitCard({
  team,
  name,
  number,
  photo,
  size = "md",
  onPhotoClick,
}: {
  team: Team;
  name: string;
  number: number;
  photo?: string | null;
  size?: "sm" | "md" | "lg";
  onPhotoClick?: () => void;
}) {
  const w = size === "lg" ? 196 : size === "sm" ? 112 : 148;
  const h = Math.round(w * 1.38);
  const ink = inkOn(team.color);
  const sleeve = team.ink;
  const uid = useId().replace(/:/g, "");
  const gid = `kit-${uid}`;
  const initial = (name.trim()[0] || team.short[0] || "?").toUpperCase();
  const label = name.trim().slice(0, 12).toUpperCase() || team.short;

  const wellClass =
    "absolute overflow-hidden rounded-full border border-fg/20 shadow-soft";
  const wellStyle = {
    left: "33.75%",
    top: "33.2%",
    width: "32.5%",
    height: "23.5%",
    background: team.color,
    color: ink,
  };
  const face = photo ? (
    <img src={photo} alt="" className="size-full object-cover" />
  ) : (
    <span
      className="grid size-full place-items-center font-display font-semibold"
      style={{ fontSize: size === "lg" ? 28 : size === "sm" ? 16 : 22 }}
    >
      {initial}
    </span>
  );

  return (
    <div className="flex flex-col items-center" style={{ width: w }}>
      <div className="relative" style={{ width: w, height: h }}>
        <svg viewBox="0 0 160 220" width={w} height={h} className="block drop-shadow-sm" aria-hidden>
          <defs>
            <linearGradient id={`${gid}-body`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={team.color} stopOpacity="1" />
              <stop offset="55%" stopColor={team.color} />
              <stop offset="100%" stopColor={sleeve} stopOpacity="0.35" />
            </linearGradient>
            <linearGradient id={`${gid}-shade`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fff" stopOpacity="0.14" />
              <stop offset="40%" stopColor="#000" stopOpacity="0" />
              <stop offset="100%" stopColor="#000" stopOpacity="0.18" />
            </linearGradient>
          </defs>
          <path
            d="M80 8 C73 8 72 16 80 20 C88 16 87 8 80 8 Z"
            fill="none"
            stroke="var(--color-subtle)"
            strokeWidth="1.6"
          />
          <path d="M80 20 L80 28" stroke="var(--color-subtle)" strokeWidth="1.6" />
          <path
            d="M34 34 Q80 24 126 34"
            fill="none"
            stroke="var(--color-subtle)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M42 38 C48 26 70 24 80 24 C90 24 112 26 118 38
               L138 50 L130 84 L114 76
               L114 196 Q114 208 80 208 Q46 208 46 196
               L46 76 L30 84 L22 50 Z"
            fill={`url(#${gid}-body)`}
            stroke="rgb(26 35 50 / 0.18)"
            strokeWidth="1.2"
          />
          <path d="M42 38 L22 50 L30 84 L46 76 L50 48 Z" fill={sleeve} opacity="0.92" />
          <path d="M118 38 L138 50 L130 84 L114 76 L110 48 Z" fill={sleeve} opacity="0.92" />
          <path d="M64 38 C70 52 90 52 96 38 L90 58 C86 50 74 50 70 58 Z" fill={sleeve} />
          <path
            d="M46 76 L46 196 Q46 208 80 208 Q114 208 114 196 L114 76"
            fill={`url(#${gid}-shade)`}
          />
          <text
            x="80"
            y="148"
            textAnchor="middle"
            fill={ink}
            fontFamily="Syne, sans-serif"
            fontSize="36"
            fontWeight="700"
          >
            {number}
          </text>
          <text
            x="80"
            y="172"
            textAnchor="middle"
            fill={ink}
            fontFamily="IBM Plex Sans, sans-serif"
            fontSize="9"
            letterSpacing="1.6"
            opacity="0.92"
          >
            {label}
          </text>
        </svg>
        {onPhotoClick ? (
          <button type="button" onClick={onPhotoClick} className={wellClass} style={wellStyle} aria-label={photo ? "Change photo on the shirt" : "Add photo to the shirt"}>
            {face}
          </button>
        ) : (
          <span className={wellClass} style={wellStyle}>
            {face}
          </span>
        )}
      </div>
    </div>
  );
}

export function KitChip({
  team,
  photo,
  number,
}: {
  team: Team;
  photo?: string | null;
  number: number;
}) {
  const ink = inkOn(team.color);
  return (
    <span className="relative inline-flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border">
      {photo ? (
        <img src={photo} alt="" className="size-full object-cover" />
      ) : (
        <span
          className="grid size-full place-items-center text-xs font-semibold"
          style={{ background: team.color, color: ink }}
        >
          {team.short.slice(0, 2)}
        </span>
      )}
      <span
        className="absolute -right-0.5 -bottom-0.5 grid size-5 place-items-center rounded-full border border-border font-display text-[10px] leading-none"
        style={{ background: team.color, color: ink }}
      >
        {number}
      </span>
    </span>
  );
}
