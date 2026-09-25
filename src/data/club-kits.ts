/**
 * Club-color palettes for the generic shirt template.
 *
 * Colors only — no manufacturer marks, no crests, no replica kit artwork.
 * Unknown clubs fall back to the team's existing color/ink pair.
 */
export type KitPalette = {
  body: string;
  sleeve: string;
  trim: string;
};

const DEFAULT_KIT: KitPalette = {
  body: "#1a2332",
  sleeve: "#c9b48a",
  trim: "#f7f4ee",
};

const KITS: Record<string, KitPalette> = {
  psg: { body: "#004170", sleeve: "#da291c", trim: "#ffffff" },
  bay: { body: "#dc052d", sleeve: "#ffffff", trim: "#0c1c3c" },
  rma: { body: "#f4f6f8", sleeve: "#00529f", trim: "#febe10" },
  liv: { body: "#c8102e", sleeve: "#ffffff", trim: "#f6eb61" },
  int: { body: "#010e80", sleeve: "#1a1a1a", trim: "#ffffff" },
  mci: { body: "#6cabdd", sleeve: "#1c2c5b", trim: "#ffffff" },
  ars: { body: "#ef0107", sleeve: "#ffffff", trim: "#9c824a" },
  bar: { body: "#a50044", sleeve: "#004d98", trim: "#edbb00" },
  atm: { body: "#ce3524", sleeve: "#ffffff", trim: "#272e61" },
  bvb: { body: "#fde100", sleeve: "#111111", trim: "#111111" },
  rom: { body: "#8e1f2f", sleeve: "#c9a227", trim: "#f7f4ee" },
  scp: { body: "#008057", sleeve: "#ffffff", trim: "#f5c518" },
  avl: { body: "#670e36", sleeve: "#95bfe5", trim: "#ffffff" },
  por: { body: "#003893", sleeve: "#ffffff", trim: "#c9a227" },
  mun: { body: "#da291c", sleeve: "#111111", trim: "#ffffff" },
  clu: { body: "#0057b8", sleeve: "#111111", trim: "#ffffff" },
  bet: { body: "#0bb363", sleeve: "#ffffff", trim: "#c9a227" },
  psv: { body: "#ed1c24", sleeve: "#ffffff", trim: "#111111" },
  fey: { body: "#ff3300", sleeve: "#ffffff", trim: "#111111" },
  lil: { body: "#e01e32", sleeve: "#001e41", trim: "#ffffff" },
  bod: { body: "#ffdd00", sleeve: "#111111", trim: "#111111" },
  nap: { body: "#12a0d7", sleeve: "#ffffff", trim: "#0b1f3a" },
  rbl: { body: "#e32219", sleeve: "#ffffff", trim: "#0c1c3c" },
  vil: { body: "#ffe14d", sleeve: "#00529f", trim: "#00529f" },
  fen: { body: "#0a2240", sleeve: "#f7d117", trim: "#ffffff" },
  sha: { body: "#ee7203", sleeve: "#111111", trim: "#ffffff" },
  gal: { body: "#a90432", sleeve: "#fdb913", trim: "#0c1c3c" },
  com: { body: "#0b1f4b", sleeve: "#ffffff", trim: "#c9a227" },
  stu: { body: "#ffffff", sleeve: "#e30613", trim: "#111111" },
  len: { body: "#e8b923", sleeve: "#e30613", trim: "#0c1c3c" },
  sla: { body: "#d21034", sleeve: "#ffffff", trim: "#0c1c3c" },
  aek: { body: "#f5c518", sleeve: "#111111", trim: "#111111" },
  lsk: { body: "#111111", sleeve: "#ffffff", trim: "#f5c518" },
  vik: { body: "#0b1f4b", sleeve: "#ffffff", trim: "#e30613" },
  sab: { body: "#111111", sleeve: "#ffffff", trim: "#e30613" },
  slo: { body: "#ffffff", sleeve: "#0c1c3c", trim: "#e30613" },
};

export function kitFor(clubId: string, fallback?: { color: string; ink: string }): KitPalette {
  const mapped = KITS[clubId];
  if (mapped) return mapped;
  if (fallback) {
    return { body: fallback.color, sleeve: fallback.ink, trim: fallback.ink };
  }
  return DEFAULT_KIT;
}
