import { FOOTBALL_LEAGUES } from "./football-leagues";
import { TEAMS, type Team } from "./ucl";

export type MatterId = "ucl" | "world";
export type RegionId = "europe" | "americas" | "africa" | "asia" | "oceania";

export type Matter = {
  id: MatterId;
  name: string;
  blurb: string;
  featured?: boolean;
};

export type Region = {
  id: RegionId;
  name: string;
  blurb: string;
  hint: string;
};

export const MATTERS: Matter[] = [
  {
    id: "ucl",
    name: "UEFA Champions League",
    blurb: "The 36-club 2026/27 desk — table, card, kit, and the road to Madrid.",
    featured: true,
  },
  {
    id: "world",
    name: "World regions",
    blurb: "Pick a continent on the map, walk in, and follow clubs from that area.",
  },
];

export const REGIONS: Region[] = [
  {
    id: "europe",
    name: "Europe",
    blurb: "Champions League country — the 36 and the big domestic leagues.",
    hint: "UCL 26/27 lives here. England, Spain, Italy, Germany, France and the rest of the continent.",
  },
  {
    id: "americas",
    name: "Americas",
    blurb: "MLS and Brasileirão nights, plus South and North American club football.",
    hint: "No UCL side is based here — follow the domestic boards and keep a European favourite on the desk.",
  },
  {
    id: "africa",
    name: "Africa",
    blurb: "Continental nights and the players Europe borrows every summer.",
    hint: "The live feed still carries African fixtures when they are on. Favourite a UCL club to pin updates.",
  },
  {
    id: "asia",
    name: "Asia",
    blurb: "Türkiye’s UCL nights sit on the edge of this map, with West Asian club football beside them.",
    hint: "Fenerbahçe and Galatasaray fly the Champions League flag. The rest of the continent is on the live board.",
  },
  {
    id: "oceania",
    name: "Oceania",
    blurb: "A-League and the long haul to Europe.",
    hint: "Follow the A-League on Live. Pin a UCL club if you still want Madrid updates.",
  },
];

const COUNTRY_REGION: Record<string, RegionId> = {
  England: "europe",
  Scotland: "europe",
  Germany: "europe",
  Italy: "europe",
  France: "europe",
  Spain: "europe",
  Netherlands: "europe",
  Belgium: "europe",
  Portugal: "europe",
  Norway: "europe",
  Austria: "europe",
  Czechia: "europe",
  Greece: "europe",
  Slovakia: "europe",
  Ukraine: "europe",
  Switzerland: "europe",
  Türkiye: "asia",
  Azerbaijan: "asia",
  USA: "americas",
  Brazil: "americas",
  Australia: "oceania",
};

export function regionOfCountry(country: string): RegionId {
  return COUNTRY_REGION[country] ?? "europe";
}

export function teamsInRegion(regionId: RegionId): Team[] {
  return TEAMS.filter((t) => regionOfCountry(t.country) === regionId);
}

export function leaguesInRegion(regionId: RegionId) {
  return FOOTBALL_LEAGUES.filter((l) => regionOfCountry(l.country) === regionId);
}

export function getMatter(id: MatterId | null | undefined): Matter {
  return MATTERS.find((m) => m.id === id) ?? MATTERS[0];
}

export function getRegion(id: RegionId | null | undefined): Region {
  return REGIONS.find((r) => r.id === id) ?? REGIONS[0];
}
