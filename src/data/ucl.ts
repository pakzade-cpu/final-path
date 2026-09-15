export type Pos = "GK" | "DF" | "MF" | "FW";

export type Player = {
  id: string;
  name: string;
  pos: Pos;
  goals: number;
};

export type Team = {
  id: string;
  name: string;
  short: string;
  country: string;
  pot: 1 | 2 | 3 | 4;
  color: string;
  ink: string;
  stadium: string;
  attack: number;
  defense: number;
  tempo: number;
  depth: number;
  europe: number;
  players: Player[];
};

export type Match = {
  id: string;
  md: number;
  kickoff: string;
  home: string;
  away: string;
  hg?: number;
  ag?: number;
};

export const FINAL = {
  date: "2027-06-05T21:00:00+02:00",
  venue: "Estadio Metropolitano",
  city: "Madrid",
};

export const TEAMS: Team[] = [
  {
    id: "psg",
    name: "Paris Saint-Germain",
    short: "PSG",
    country: "France",
    pot: 1,
    color: "#004170",
    ink: "#e8eef5",
    stadium: "Parc des Princes",
    attack: 92,
    defense: 84,
    tempo: 88,
    depth: 91,
    europe: 94,
    players: [
      { id: "psg-torres", name: "Ferran Torres", pos: "FW", goals: 3 },
      { id: "psg-dembele", name: "Ousmane Dembélé", pos: "FW", goals: 2 },
      { id: "psg-vitinha", name: "Vitinha", pos: "MF", goals: 0 },
      { id: "psg-hakimi", name: "Achraf Hakimi", pos: "DF", goals: 1 },
      { id: "psg-neves", name: "João Neves", pos: "MF", goals: 0 },
    ],
  },
  {
    id: "bay",
    name: "Bayern Munich",
    short: "BAY",
    country: "Germany",
    pot: 1,
    color: "#dc052d",
    ink: "#fff5f5",
    stadium: "Allianz Arena",
    attack: 91,
    defense: 86,
    tempo: 87,
    depth: 90,
    europe: 93,
    players: [
      { id: "bay-kane", name: "Harry Kane", pos: "FW", goals: 1 },
      { id: "bay-olise", name: "Michael Olise", pos: "MF", goals: 2 },
      { id: "bay-musiala", name: "Jamal Musiala", pos: "MF", goals: 1 },
      { id: "bay-kimmich", name: "Joshua Kimmich", pos: "MF", goals: 0 },
      { id: "bay-davies", name: "Alphonso Davies", pos: "DF", goals: 0 },
    ],
  },
  {
    id: "rma",
    name: "Real Madrid",
    short: "RMA",
    country: "Spain",
    pot: 1,
    color: "#febe10",
    ink: "#111111",
    stadium: "Santiago Bernabéu",
    attack: 90,
    defense: 82,
    tempo: 86,
    depth: 92,
    europe: 96,
    players: [
      { id: "rma-mbappe", name: "Kylian Mbappé", pos: "FW", goals: 1 },
      { id: "rma-bellingham", name: "Jude Bellingham", pos: "MF", goals: 0 },
      { id: "rma-vinicius", name: "Vinícius Júnior", pos: "FW", goals: 1 },
      { id: "rma-valverde", name: "Federico Valverde", pos: "MF", goals: 0 },
      { id: "rma-courtois", name: "Thibaut Courtois", pos: "GK", goals: 0 },
    ],
  },
  {
    id: "liv",
    name: "Liverpool",
    short: "LIV",
    country: "England",
    pot: 1,
    color: "#c8102e",
    ink: "#fff5f5",
    stadium: "Anfield",
    attack: 86,
    defense: 83,
    tempo: 90,
    depth: 85,
    europe: 88,
    players: [
      { id: "liv-salah", name: "Mohamed Salah", pos: "FW", goals: 1 },
      { id: "liv-mac", name: "Alexis Mac Allister", pos: "MF", goals: 1 },
      { id: "liv-vvd", name: "Virgil van Dijk", pos: "DF", goals: 0 },
      { id: "liv-szobo", name: "Dominik Szoboszlai", pos: "MF", goals: 0 },
      { id: "liv-alisson", name: "Alisson", pos: "GK", goals: 0 },
    ],
  },
  {
    id: "int",
    name: "Inter Milan",
    short: "INT",
    country: "Italy",
    pot: 1,
    color: "#010e80",
    ink: "#eef1ff",
    stadium: "San Siro",
    attack: 84,
    defense: 88,
    tempo: 74,
    depth: 84,
    europe: 90,
    players: [
      { id: "int-lautaro", name: "Lautaro Martínez", pos: "FW", goals: 1 },
      { id: "int-barella", name: "Nicolò Barella", pos: "MF", goals: 0 },
      { id: "int-bastoni", name: "Alessandro Bastoni", pos: "DF", goals: 0 },
      { id: "int-thuram", name: "Marcus Thuram", pos: "FW", goals: 0 },
      { id: "int-sommer", name: "Yann Sommer", pos: "GK", goals: 0 },
    ],
  },
  {
    id: "mci",
    name: "Manchester City",
    short: "MCI",
    country: "England",
    pot: 1,
    color: "#6cabdd",
    ink: "#0b1a28",
    stadium: "Etihad Stadium",
    attack: 89,
    defense: 85,
    tempo: 82,
    depth: 93,
    europe: 95,
    players: [
      { id: "mci-haaland", name: "Erling Haaland", pos: "FW", goals: 2 },
      { id: "mci-foden", name: "Phil Foden", pos: "MF", goals: 0 },
      { id: "mci-rodri", name: "Rodri", pos: "MF", goals: 0 },
      { id: "mci-bernardo", name: "Bernardo Silva", pos: "MF", goals: 0 },
      { id: "mci-doku", name: "Jérémy Doku", pos: "FW", goals: 0 },
    ],
  },
  {
    id: "ars",
    name: "Arsenal",
    short: "ARS",
    country: "England",
    pot: 1,
    color: "#ef0107",
    ink: "#fff5f5",
    stadium: "Emirates Stadium",
    attack: 85,
    defense: 87,
    tempo: 80,
    depth: 86,
    europe: 89,
    players: [
      { id: "ars-saka", name: "Bukayo Saka", pos: "FW", goals: 1 },
      { id: "ars-odegaard", name: "Martin Ødegaard", pos: "MF", goals: 0 },
      { id: "ars-rice", name: "Declan Rice", pos: "MF", goals: 0 },
      { id: "ars-saliba", name: "William Saliba", pos: "DF", goals: 0 },
      { id: "ars-raya", name: "David Raya", pos: "GK", goals: 0 },
    ],
  },
  {
    id: "bar",
    name: "Barcelona",
    short: "BAR",
    country: "Spain",
    pot: 1,
    color: "#a50044",
    ink: "#fff5f8",
    stadium: "Spotify Camp Nou",
    attack: 93,
    defense: 78,
    tempo: 91,
    depth: 84,
    europe: 91,
    players: [
      { id: "bar-yamal", name: "Lamine Yamal", pos: "FW", goals: 1 },
      { id: "bar-raphinha", name: "Raphinha", pos: "FW", goals: 2 },
      { id: "bar-pedri", name: "Pedri", pos: "MF", goals: 1 },
      { id: "bar-cubarsi", name: "Pau Cubarsí", pos: "DF", goals: 0 },
      { id: "bar-dejong", name: "Frenkie de Jong", pos: "MF", goals: 0 },
    ],
  },
  {
    id: "atm",
    name: "Atlético Madrid",
    short: "ATL",
    country: "Spain",
    pot: 1,
    color: "#ce3524",
    ink: "#fff6f4",
    stadium: "Estadio Metropolitano",
    attack: 80,
    defense: 89,
    tempo: 68,
    depth: 82,
    europe: 87,
    players: [
      { id: "atm-alvarez", name: "Julián Álvarez", pos: "FW", goals: 1 },
      { id: "atm-griezmann", name: "Antoine Griezmann", pos: "FW", goals: 0 },
      { id: "atm-oblak", name: "Jan Oblak", pos: "GK", goals: 0 },
      { id: "atm-llorente", name: "Marcos Llorente", pos: "MF", goals: 0 },
      { id: "atm-depaul", name: "Rodrigo De Paul", pos: "MF", goals: 0 },
    ],
  },
  {
    id: "bvb",
    name: "Borussia Dortmund",
    short: "BVB",
    country: "Germany",
    pot: 2,
    color: "#fde100",
    ink: "#111111",
    stadium: "Signal Iduna Park",
    attack: 83,
    defense: 74,
    tempo: 86,
    depth: 78,
    europe: 82,
    players: [
      { id: "bvb-guirassy", name: "Serhou Guirassy", pos: "FW", goals: 2 },
      { id: "bvb-brandt", name: "Julian Brandt", pos: "MF", goals: 1 },
      { id: "bvb-adeyemi", name: "Karim Adeyemi", pos: "FW", goals: 0 },
      { id: "bvb-schlotterbeck", name: "Nico Schlotterbeck", pos: "DF", goals: 0 },
      { id: "bvb-kobel", name: "Gregor Kobel", pos: "GK", goals: 0 },
    ],
  },
  {
    id: "rom",
    name: "Roma",
    short: "ROM",
    country: "Italy",
    pot: 2,
    color: "#8e1f2f",
    ink: "#fff4f4",
    stadium: "Stadio Olimpico",
    attack: 76,
    defense: 80,
    tempo: 70,
    depth: 75,
    europe: 79,
    players: [
      { id: "rom-dybala", name: "Paulo Dybala", pos: "FW", goals: 1 },
      { id: "rom-pellegrini", name: "Lorenzo Pellegrini", pos: "MF", goals: 0 },
      { id: "rom-ndicka", name: "Evan Ndicka", pos: "DF", goals: 0 },
      { id: "rom-svilar", name: "Mile Svilar", pos: "GK", goals: 0 },
      { id: "rom-dovbyk", name: "Artem Dovbyk", pos: "FW", goals: 0 },
    ],
  },
  {
    id: "scp",
    name: "Sporting CP",
    short: "SCP",
    country: "Portugal",
    pot: 2,
    color: "#008057",
    ink: "#f3fff8",
    stadium: "Estádio José Alvalade",
    attack: 81,
    defense: 77,
    tempo: 78,
    depth: 76,
    europe: 80,
    players: [
      { id: "scp-trincao", name: "Francisco Trincão", pos: "FW", goals: 1 },
      { id: "scp-hjulmand", name: "Morten Hjulmand", pos: "MF", goals: 0 },
      { id: "scp-goncalves", name: "Pedro Gonçalves", pos: "MF", goals: 1 },
      { id: "scp-diomande", name: "Ousmane Diomande", pos: "DF", goals: 0 },
      { id: "scp-gyokeres", name: "Viktor Gyökeres", pos: "FW", goals: 1 },
    ],
  },
  {
    id: "avl",
    name: "Aston Villa",
    short: "AVL",
    country: "England",
    pot: 2,
    color: "#670e36",
    ink: "#fff4f7",
    stadium: "Villa Park",
    attack: 79,
    defense: 78,
    tempo: 76,
    depth: 77,
    europe: 81,
    players: [
      { id: "avl-watkins", name: "Ollie Watkins", pos: "FW", goals: 2 },
      { id: "avl-rogers", name: "Morgan Rogers", pos: "MF", goals: 1 },
      { id: "avl-martinez", name: "Emiliano Martínez", pos: "GK", goals: 0 },
      { id: "avl-tielemans", name: "Youri Tielemans", pos: "MF", goals: 0 },
      { id: "avl-digne", name: "Lucas Digne", pos: "DF", goals: 0 },
    ],
  },
  {
    id: "por",
    name: "Porto",
    short: "POR",
    country: "Portugal",
    pot: 2,
    color: "#003893",
    ink: "#eef3ff",
    stadium: "Estádio do Dragão",
    attack: 75,
    defense: 80,
    tempo: 72,
    depth: 74,
    europe: 83,
    players: [
      { id: "por-costa", name: "Diogo Costa", pos: "GK", goals: 0 },
      { id: "por-pepe", name: "Pepê", pos: "FW", goals: 0 },
      { id: "por-eustaquio", name: "Stephen Eustáquio", pos: "MF", goals: 0 },
      { id: "por-galeno", name: "Galeno", pos: "FW", goals: 0 },
      { id: "por-otavio", name: "Otávio", pos: "MF", goals: 0 },
    ],
  },
  {
    id: "mun",
    name: "Manchester United",
    short: "MUN",
    country: "England",
    pot: 2,
    color: "#da291c",
    ink: "#fff5f4",
    stadium: "Old Trafford",
    attack: 82,
    defense: 75,
    tempo: 79,
    depth: 80,
    europe: 84,
    players: [
      { id: "mun-bruno", name: "Bruno Fernandes", pos: "MF", goals: 1 },
      { id: "mun-mainoo", name: "Kobbie Mainoo", pos: "MF", goals: 0 },
      { id: "mun-amad", name: "Amad Diallo", pos: "FW", goals: 2 },
      { id: "mun-deligt", name: "Matthijs de Ligt", pos: "DF", goals: 0 },
      { id: "mun-onana", name: "André Onana", pos: "GK", goals: 0 },
    ],
  },
  {
    id: "clu",
    name: "Club Brugge",
    short: "CLU",
    country: "Belgium",
    pot: 2,
    color: "#0057b8",
    ink: "#eef5ff",
    stadium: "Jan Breydel Stadium",
    attack: 73,
    defense: 72,
    tempo: 75,
    depth: 70,
    europe: 74,
    players: [
      { id: "clu-vanaken", name: "Hans Vanaken", pos: "MF", goals: 1 },
      { id: "clu-skov", name: "Andreas Skov Olsen", pos: "FW", goals: 1 },
      { id: "clu-mechele", name: "Brandon Mechele", pos: "DF", goals: 0 },
      { id: "clu-jashari", name: "Ardon Jashari", pos: "MF", goals: 0 },
      { id: "clu-mijatovic", name: "Milan Mijatović", pos: "GK", goals: 0 },
    ],
  },
  {
    id: "bet",
    name: "Real Betis",
    short: "BET",
    country: "Spain",
    pot: 2,
    color: "#0bb363",
    ink: "#062016",
    stadium: "Benito Villamarín",
    attack: 78,
    defense: 73,
    tempo: 77,
    depth: 72,
    europe: 76,
    players: [
      { id: "bet-bartra", name: "Marc Bartra", pos: "DF", goals: 2 },
      { id: "bet-isco", name: "Isco", pos: "MF", goals: 0 },
      { id: "bet-antony", name: "Antony", pos: "FW", goals: 1 },
      { id: "bet-fornals", name: "Pablo Fornals", pos: "MF", goals: 0 },
      { id: "bet-rui", name: "Rui Silva", pos: "GK", goals: 0 },
    ],
  },
  {
    id: "psv",
    name: "PSV Eindhoven",
    short: "PSV",
    country: "Netherlands",
    pot: 2,
    color: "#ed1c24",
    ink: "#fff5f5",
    stadium: "Philips Stadion",
    attack: 80,
    defense: 74,
    tempo: 84,
    depth: 76,
    europe: 78,
    players: [
      { id: "psv-dejong", name: "Luuk de Jong", pos: "FW", goals: 1 },
      { id: "psv-lang", name: "Noa Lang", pos: "FW", goals: 0 },
      { id: "psv-schouten", name: "Jerdy Schouten", pos: "MF", goals: 0 },
      { id: "psv-bakayoko", name: "Johan Bakayoko", pos: "FW", goals: 0 },
      { id: "psv-benitez", name: "Walter Benítez", pos: "GK", goals: 0 },
    ],
  },
  {
    id: "fey",
    name: "Feyenoord",
    short: "FEY",
    country: "Netherlands",
    pot: 3,
    color: "#ff3300",
    ink: "#fff6f2",
    stadium: "De Kuip",
    attack: 77,
    defense: 70,
    tempo: 81,
    depth: 71,
    europe: 75,
    players: [
      { id: "fey-paixao", name: "Igor Paixão", pos: "FW", goals: 1 },
      { id: "fey-timber", name: "Quinten Timber", pos: "MF", goals: 0 },
      { id: "fey-hancko", name: "Dávid Hancko", pos: "DF", goals: 0 },
      { id: "fey-gimenez", name: "Santiago Giménez", pos: "FW", goals: 0 },
      { id: "fey-bijlow", name: "Justin Bijlow", pos: "GK", goals: 0 },
    ],
  },
  {
    id: "lil",
    name: "Lille",
    short: "LIL",
    country: "France",
    pot: 3,
    color: "#e01e32",
    ink: "#fff4f5",
    stadium: "Stade Pierre-Mauroy",
    attack: 76,
    defense: 75,
    tempo: 73,
    depth: 73,
    europe: 77,
    players: [
      { id: "lil-david", name: "Jonathan David", pos: "FW", goals: 1 },
      { id: "lil-haraldsson", name: "Hákon Haraldsson", pos: "MF", goals: 1 },
      { id: "lil-alexsandro", name: "Alexsandro", pos: "DF", goals: 0 },
      { id: "lil-cabella", name: "Rémy Cabella", pos: "MF", goals: 0 },
      { id: "lil-chevalier", name: "Lucas Chevalier", pos: "GK", goals: 0 },
    ],
  },
  {
    id: "bod",
    name: "Bodø/Glimt",
    short: "BOD",
    country: "Norway",
    pot: 3,
    color: "#ffdd00",
    ink: "#161200",
    stadium: "Aspmyra Stadion",
    attack: 74,
    defense: 66,
    tempo: 88,
    depth: 64,
    europe: 70,
    players: [
      { id: "bod-hogh", name: "Kasper Høgh", pos: "FW", goals: 0 },
      { id: "bod-berg", name: "Patrick Berg", pos: "MF", goals: 0 },
      { id: "bod-saltnes", name: "Ulrik Saltnes", pos: "MF", goals: 0 },
      { id: "bod-bjorkan", name: "Fredrik Bjørkan", pos: "DF", goals: 0 },
      { id: "bod-haikin", name: "Nikita Haikin", pos: "GK", goals: 0 },
    ],
  },
  {
    id: "nap",
    name: "Napoli",
    short: "NAP",
    country: "Italy",
    pot: 3,
    color: "#12a0d7",
    ink: "#061820",
    stadium: "Diego Armando Maradona",
    attack: 81,
    defense: 79,
    tempo: 75,
    depth: 80,
    europe: 85,
    players: [
      { id: "nap-mctominay", name: "Scott McTominay", pos: "MF", goals: 0 },
      { id: "nap-lukaku", name: "Romelu Lukaku", pos: "FW", goals: 0 },
      { id: "nap-lobotka", name: "Stanislav Lobotka", pos: "MF", goals: 0 },
      { id: "nap-diLorenzo", name: "Giovanni Di Lorenzo", pos: "DF", goals: 0 },
      { id: "nap-meret", name: "Alex Meret", pos: "GK", goals: 0 },
    ],
  },
  {
    id: "rbl",
    name: "RB Leipzig",
    short: "RBL",
    country: "Germany",
    pot: 3,
    color: "#dd0747",
    ink: "#fff4f6",
    stadium: "Red Bull Arena",
    attack: 79,
    defense: 72,
    tempo: 85,
    depth: 77,
    europe: 80,
    players: [
      { id: "rbl-openda", name: "Loïs Openda", pos: "FW", goals: 1 },
      { id: "rbl-baumgartner", name: "Christoph Baumgartner", pos: "MF", goals: 0 },
      { id: "rbl-simons", name: "Xavi Simons", pos: "MF", goals: 0 },
      { id: "rbl-orban", name: "Willi Orbán", pos: "DF", goals: 0 },
      { id: "rbl-gulacsi", name: "Péter Gulácsi", pos: "GK", goals: 0 },
    ],
  },
  {
    id: "vil",
    name: "Villarreal",
    short: "VIL",
    country: "Spain",
    pot: 3,
    color: "#ffe014",
    ink: "#161400",
    stadium: "Estadio de la Cerámica",
    attack: 77,
    defense: 74,
    tempo: 72,
    depth: 73,
    europe: 78,
    players: [
      { id: "vil-baena", name: "Álex Baena", pos: "MF", goals: 1 },
      { id: "vil-moreno", name: "Gerard Moreno", pos: "FW", goals: 1 },
      { id: "vil-ayoze", name: "Ayoze Pérez", pos: "FW", goals: 0 },
      { id: "vil-parejo", name: "Dani Parejo", pos: "MF", goals: 0 },
      { id: "vil-diez", name: "Luiz Júnior", pos: "GK", goals: 0 },
    ],
  },
  {
    id: "fen",
    name: "Fenerbahçe",
    short: "FEN",
    country: "Türkiye",
    pot: 3,
    color: "#002e6e",
    ink: "#fff8dc",
    stadium: "Şükrü Saracoğlu",
    attack: 78,
    defense: 71,
    tempo: 76,
    depth: 75,
    europe: 73,
    players: [
      { id: "fen-dzeko", name: "Edin Džeko", pos: "FW", goals: 1 },
      { id: "fen-tadic", name: "Dušan Tadić", pos: "MF", goals: 0 },
      { id: "fen-fred", name: "Fred", pos: "MF", goals: 0 },
      { id: "fen-tete", name: "Tete", pos: "FW", goals: 0 },
      { id: "fen-livakovic", name: "Dominik Livaković", pos: "GK", goals: 0 },
    ],
  },
  {
    id: "sha",
    name: "Shakhtar Donetsk",
    short: "SHA",
    country: "Ukraine",
    pot: 3,
    color: "#e36209",
    ink: "#1a0e04",
    stadium: "Arena AufSchalke",
    attack: 72,
    defense: 70,
    tempo: 78,
    depth: 68,
    europe: 76,
    players: [
      { id: "sha-sudakov", name: "Heorhiy Sudakov", pos: "MF", goals: 1 },
      { id: "sha-bondarenko", name: "Artem Bondarenko", pos: "MF", goals: 0 },
      { id: "sha-sikan", name: "Danylo Sikan", pos: "FW", goals: 0 },
      { id: "sha-matviyenko", name: "Mykola Matviyenko", pos: "DF", goals: 0 },
      { id: "sha-riznyk", name: "Dmytro Riznyk", pos: "GK", goals: 0 },
    ],
  },
  {
    id: "gal",
    name: "Galatasaray",
    short: "GAL",
    country: "Türkiye",
    pot: 3,
    color: "#a90432",
    ink: "#fff6e8",
    stadium: "RAMS Park",
    attack: 82,
    defense: 70,
    tempo: 80,
    depth: 76,
    europe: 77,
    players: [
      { id: "gal-osimhen", name: "Victor Osimhen", pos: "FW", goals: 1 },
      { id: "gal-icardi", name: "Mauro Icardi", pos: "FW", goals: 0 },
      { id: "gal-torreira", name: "Lucas Torreira", pos: "MF", goals: 0 },
      { id: "gal-mertens", name: "Dries Mertens", pos: "FW", goals: 0 },
      { id: "gal-muslera", name: "Fernando Muslera", pos: "GK", goals: 0 },
    ],
  },
  {
    id: "com",
    name: "Como",
    short: "COM",
    country: "Italy",
    pot: 4,
    color: "#1b4f8a",
    ink: "#eef5ff",
    stadium: "Stadio Giuseppe Sinigaglia",
    attack: 75,
    defense: 71,
    tempo: 74,
    depth: 66,
    europe: 62,
    players: [
      { id: "com-paz", name: "Nico Paz", pos: "MF", goals: 1 },
      { id: "com-diao", name: "Assane Diao", pos: "FW", goals: 2 },
      { id: "com-cutrone", name: "Patrick Cutrone", pos: "FW", goals: 1 },
      { id: "com-perrone", name: "Máximo Perrone", pos: "MF", goals: 0 },
      { id: "com-reina", name: "Pepe Reina", pos: "GK", goals: 0 },
    ],
  },
  {
    id: "stu",
    name: "VfB Stuttgart",
    short: "VFB",
    country: "Germany",
    pot: 4,
    color: "#e32219",
    ink: "#fff5f4",
    stadium: "MHPArena",
    attack: 80,
    defense: 72,
    tempo: 83,
    depth: 71,
    europe: 72,
    players: [
      { id: "stu-demirovic", name: "Ermedin Demirović", pos: "FW", goals: 3 },
      { id: "stu-undav", name: "Deniz Undav", pos: "FW", goals: 0 },
      { id: "stu-stiller", name: "Angelo Stiller", pos: "MF", goals: 0 },
      { id: "stu-fuhrich", name: "Chris Führich", pos: "MF", goals: 0 },
      { id: "stu-nubel", name: "Alexander Nübel", pos: "GK", goals: 0 },
    ],
  },
  {
    id: "len",
    name: "Lens",
    short: "RCL",
    country: "France",
    pot: 4,
    color: "#d03232",
    ink: "#fff5f4",
    stadium: "Stade Bollaert-Delelis",
    attack: 74,
    defense: 73,
    tempo: 79,
    depth: 68,
    europe: 71,
    players: [
      { id: "len-sotoca", name: "Florian Sotoca", pos: "FW", goals: 1 },
      { id: "len-said", name: "Wesley Saïd", pos: "FW", goals: 1 },
      { id: "len-frankowski", name: "Przemysław Frankowski", pos: "MF", goals: 1 },
      { id: "len-danso", name: "Kevin Danso", pos: "DF", goals: 0 },
      { id: "len-samba", name: "Brice Samba", pos: "GK", goals: 0 },
    ],
  },
  {
    id: "sla",
    name: "Slavia Prague",
    short: "SLA",
    country: "Czechia",
    pot: 4,
    color: "#d21034",
    ink: "#fff5f6",
    stadium: "Fortuna Arena",
    attack: 73,
    defense: 74,
    tempo: 77,
    depth: 67,
    europe: 70,
    players: [
      { id: "sla-sturm", name: "Danijel Šturm", pos: "FW", goals: 2 },
      { id: "sla-chytil", name: "Mojmír Chytil", pos: "FW", goals: 0 },
      { id: "sla-provod", name: "Lukáš Provod", pos: "MF", goals: 0 },
      { id: "sla-holek", name: "Tomáš Holeš", pos: "DF", goals: 0 },
      { id: "sla-mandous", name: "Aleš Mandous", pos: "GK", goals: 0 },
    ],
  },
  {
    id: "aek",
    name: "AEK Athens",
    short: "AEK",
    country: "Greece",
    pot: 4,
    color: "#ffcd00",
    ink: "#161200",
    stadium: "OPAP Arena",
    attack: 70,
    defense: 72,
    tempo: 69,
    depth: 65,
    europe: 68,
    players: [
      { id: "aek-garcia", name: "Levi García", pos: "FW", goals: 1 },
      { id: "aek-pineda", name: "Orbelín Pineda", pos: "MF", goals: 0 },
      { id: "aek-ljubicic", name: "Robert Ljubičić", pos: "MF", goals: 0 },
      { id: "aek-vida", name: "Domagoj Vida", pos: "DF", goals: 0 },
      { id: "aek-strakosha", name: "Thomas Strakosha", pos: "GK", goals: 0 },
    ],
  },
  {
    id: "lsk",
    name: "LASK",
    short: "LSK",
    country: "Austria",
    pot: 4,
    color: "#000000",
    ink: "#f3f3f3",
    stadium: "Raiffeisen Arena",
    attack: 68,
    defense: 69,
    tempo: 71,
    depth: 62,
    europe: 64,
    players: [
      { id: "lsk-ljubicic", name: "Marin Ljubičić", pos: "FW", goals: 0 },
      { id: "lsk-flecker", name: "Florian Flecker", pos: "MF", goals: 0 },
      { id: "lsk-zulj", name: "Robert Žulj", pos: "MF", goals: 0 },
      { id: "lsk-andrade", name: "Andrés Andrade", pos: "DF", goals: 0 },
      { id: "lsk-lawal", name: "Tobias Lawal", pos: "GK", goals: 0 },
    ],
  },
  {
    id: "vik",
    name: "Viking",
    short: "VIK",
    country: "Norway",
    pot: 4,
    color: "#1d4c8c",
    ink: "#eef4ff",
    stadium: "Lyse Arena",
    attack: 69,
    defense: 66,
    tempo: 75,
    depth: 60,
    europe: 61,
    players: [
      { id: "vik-tripic", name: "Zlatko Tripić", pos: "FW", goals: 1 },
      { id: "vik-svendsen", name: "Sander Svendsen", pos: "FW", goals: 0 },
      { id: "vik-bell", name: "Joe Bell", pos: "MF", goals: 0 },
      { id: "vik-haugen", name: "Kristoffer Haugen", pos: "DF", goals: 0 },
      { id: "vik-dekeukeleire", name: "Arjan de Keukeleire", pos: "GK", goals: 0 },
    ],
  },
  {
    id: "sab",
    name: "Sabah",
    short: "SAB",
    country: "Azerbaijan",
    pot: 4,
    color: "#0a3d91",
    ink: "#eef4ff",
    stadium: "Bank Respublika Arena",
    attack: 64,
    defense: 63,
    tempo: 68,
    depth: 55,
    europe: 52,
    players: [
      { id: "sab-nuriyev", name: "Anatoliy Nuriyev", pos: "MF", goals: 0 },
      { id: "sab-ickson", name: "Ickson", pos: "FW", goals: 0 },
      { id: "sab-letaa", name: "Jesse Sekidika", pos: "FW", goals: 0 },
      { id: "sab-hasanalizade", name: "Badavi Hüseynov", pos: "DF", goals: 0 },
      { id: "sab-balakishiyeva", name: "Yusif Bameyi", pos: "GK", goals: 0 },
    ],
  },
  {
    id: "slo",
    name: "Slovan Bratislava",
    short: "SLO",
    country: "Slovakia",
    pot: 4,
    color: "#0b4ea2",
    ink: "#eef4ff",
    stadium: "Tehelné pole",
    attack: 67,
    defense: 64,
    tempo: 70,
    depth: 58,
    europe: 63,
    players: [
      { id: "slo-barseghyan", name: "Tigran Barseghyan", pos: "FW", goals: 1 },
      { id: "slo-strelec", name: "David Strelec", pos: "FW", goals: 0 },
      { id: "slo-chakvetadze", name: "Guram Kashia", pos: "DF", goals: 0 },
      { id: "slo-kucka", name: "Juraj Kucka", pos: "MF", goals: 0 },
      { id: "slo-takac", name: "Dominik Takáč", pos: "GK", goals: 0 },
    ],
  },
];

export const MATCHES: Match[] = [
  // MD1 — 8 Sep 2026
  { id: "m1-aek-lsk", md: 1, kickoff: "2026-09-08T21:00:00+02:00", home: "aek", away: "lsk", hg: 1, ag: 0 },
  { id: "m1-clu-avl", md: 1, kickoff: "2026-09-08T21:00:00+02:00", home: "clu", away: "avl", hg: 2, ag: 3 },
  { id: "m1-bvb-vil", md: 1, kickoff: "2026-09-08T21:00:00+02:00", home: "bvb", away: "vil", hg: 3, ag: 2 },
  { id: "m1-por-mci", md: 1, kickoff: "2026-09-08T21:00:00+02:00", home: "por", away: "mci", hg: 0, ag: 2 },
  { id: "m1-lil-bet", md: 1, kickoff: "2026-09-08T21:00:00+02:00", home: "lil", away: "bet", hg: 2, ag: 3 },
  { id: "m1-rma-int", md: 1, kickoff: "2026-09-08T21:00:00+02:00", home: "rma", away: "int", hg: 2, ag: 1 },
  // MD1 — 9 Sep 2026
  { id: "m1-bar-fey", md: 1, kickoff: "2026-09-09T18:45:00+02:00", home: "bar", away: "fey", hg: 5, ag: 1 },
  { id: "m1-stu-vik", md: 1, kickoff: "2026-09-09T18:45:00+02:00", home: "stu", away: "vik", hg: 3, ag: 1 },
  { id: "m1-liv-atm", md: 1, kickoff: "2026-09-09T21:00:00+02:00", home: "liv", away: "atm", hg: 2, ag: 1 },
  { id: "m1-psg-slo", md: 1, kickoff: "2026-09-09T21:00:00+02:00", home: "psg", away: "slo", hg: 6, ag: 1 },
  { id: "m1-scp-gal", md: 1, kickoff: "2026-09-09T21:00:00+02:00", home: "scp", away: "gal", hg: 3, ag: 1 },
  { id: "m1-nap-ars", md: 1, kickoff: "2026-09-09T21:00:00+02:00", home: "nap", away: "ars", hg: 0, ag: 1 },
  // MD1 — 10 Sep 2026
  { id: "m1-fen-rom", md: 1, kickoff: "2026-09-10T18:45:00+02:00", home: "fen", away: "rom", hg: 1, ag: 1 },
  { id: "m1-psv-sha", md: 1, kickoff: "2026-09-10T18:45:00+02:00", home: "psv", away: "sha", hg: 1, ag: 1 },
  { id: "m1-com-rbl", md: 1, kickoff: "2026-09-10T21:00:00+02:00", home: "com", away: "rbl", hg: 4, ag: 1 },
  { id: "m1-bay-bod", md: 1, kickoff: "2026-09-10T21:00:00+02:00", home: "bay", away: "bod", hg: 5, ag: 0 },
  { id: "m1-mun-sab", md: 1, kickoff: "2026-09-10T21:00:00+02:00", home: "mun", away: "sab", hg: 4, ag: 0 },
  { id: "m1-sla-len", md: 1, kickoff: "2026-09-10T21:00:00+02:00", home: "sla", away: "len", hg: 2, ag: 3 },
  // MD2 — 13 Oct 2026
  { id: "m2-len-scp", md: 2, kickoff: "2026-10-13T18:45:00+02:00", home: "len", away: "scp" },
  { id: "m2-sab-sla", md: 2, kickoff: "2026-10-13T18:45:00+02:00", home: "sab", away: "sla" },
  { id: "m2-ars-lil", md: 2, kickoff: "2026-10-13T21:00:00+02:00", home: "ars", away: "lil" },
  { id: "m2-atm-mun", md: 2, kickoff: "2026-10-13T21:00:00+02:00", home: "atm", away: "mun" },
  { id: "m2-int-clu", md: 2, kickoff: "2026-10-13T21:00:00+02:00", home: "int", away: "clu" },
  { id: "m2-gal-bar", md: 2, kickoff: "2026-10-13T21:00:00+02:00", home: "gal", away: "bar" },
  { id: "m2-rbl-psv", md: 2, kickoff: "2026-10-13T21:00:00+02:00", home: "rbl", away: "psv" },
  { id: "m2-vik-bay", md: 2, kickoff: "2026-10-13T21:00:00+02:00", home: "vik", away: "bay" },
  { id: "m2-vil-nap", md: 2, kickoff: "2026-10-13T21:00:00+02:00", home: "vil", away: "nap" },
  // MD2 — 14 Oct 2026
  { id: "m2-fey-com", md: 2, kickoff: "2026-10-14T18:45:00+02:00", home: "fey", away: "com" },
  { id: "m2-lsk-liv", md: 2, kickoff: "2026-10-14T18:45:00+02:00", home: "lsk", away: "liv" },
  { id: "m2-rom-rma", md: 2, kickoff: "2026-10-14T21:00:00+02:00", home: "rom", away: "rma" },
  { id: "m2-avl-fen", md: 2, kickoff: "2026-10-14T21:00:00+02:00", home: "avl", away: "fen" },
  { id: "m2-sha-aek", md: 2, kickoff: "2026-10-14T21:00:00+02:00", home: "sha", away: "aek" },
  { id: "m2-bod-bvb", md: 2, kickoff: "2026-10-14T21:00:00+02:00", home: "bod", away: "bvb" },
  { id: "m2-mci-psg", md: 2, kickoff: "2026-10-14T21:00:00+02:00", home: "mci", away: "psg" },
  { id: "m2-bet-por", md: 2, kickoff: "2026-10-14T21:00:00+02:00", home: "bet", away: "por" },
  { id: "m2-slo-stu", md: 2, kickoff: "2026-10-14T21:00:00+02:00", home: "slo", away: "stu" },
  // MD3 — 20 Oct 2026
  { id: "m3-fen-sla", md: 3, kickoff: "2026-10-20T21:00:00+02:00", home: "fen", away: "sla" },
  { id: "m3-sab-bvb", md: 3, kickoff: "2026-10-20T21:00:00+02:00", home: "sab", away: "bvb" },
  { id: "m3-rom-slo", md: 3, kickoff: "2026-10-20T21:00:00+02:00", home: "rom", away: "slo" },
  { id: "m3-por-psv", md: 3, kickoff: "2026-10-20T21:00:00+02:00", home: "por", away: "psv" },
  { id: "m3-liv-vil", md: 3, kickoff: "2026-10-20T21:00:00+02:00", home: "liv", away: "vil" },
  { id: "m3-mci-aek", md: 3, kickoff: "2026-10-20T21:00:00+02:00", home: "mci", away: "aek" },
  { id: "m3-psg-bar", md: 3, kickoff: "2026-10-20T21:00:00+02:00", home: "psg", away: "bar" },
  { id: "m3-nap-bod", md: 3, kickoff: "2026-10-20T21:00:00+02:00", home: "nap", away: "bod" },
  { id: "m3-stu-atm", md: 3, kickoff: "2026-10-20T21:00:00+02:00", home: "stu", away: "atm" },
  // MD3 — 21 Oct 2026
  { id: "m3-com-mun", md: 3, kickoff: "2026-10-21T18:45:00+02:00", home: "com", away: "mun" },
  { id: "m3-lil-gal", md: 3, kickoff: "2026-10-21T18:45:00+02:00", home: "lil", away: "gal" },
  { id: "m3-avl-vik", md: 3, kickoff: "2026-10-21T21:00:00+02:00", home: "avl", away: "vik" },
  { id: "m3-clu-len", md: 3, kickoff: "2026-10-21T21:00:00+02:00", home: "clu", away: "len" },
  { id: "m3-bay-ars", md: 3, kickoff: "2026-10-21T21:00:00+02:00", home: "bay", away: "ars" },
  { id: "m3-int-sha", md: 3, kickoff: "2026-10-21T21:00:00+02:00", home: "int", away: "sha" },
  { id: "m3-rma-rbl", md: 3, kickoff: "2026-10-21T21:00:00+02:00", home: "rma", away: "rbl" },
  { id: "m3-bet-fey", md: 3, kickoff: "2026-10-21T21:00:00+02:00", home: "bet", away: "fey" },
  { id: "m3-scp-lsk", md: 3, kickoff: "2026-10-21T21:00:00+02:00", home: "scp", away: "lsk" },
  // MD4 — 3 Nov 2026
  { id: "m4-sha-scp", md: 4, kickoff: "2026-11-03T21:00:00+01:00", home: "sha", away: "scp" },
  { id: "m4-gal-stu", md: 4, kickoff: "2026-11-03T21:00:00+01:00", home: "gal", away: "stu" },
  { id: "m4-atm-bay", md: 4, kickoff: "2026-11-03T21:00:00+01:00", home: "atm", away: "bay" },
  { id: "m4-bar-avl", md: 4, kickoff: "2026-11-03T21:00:00+01:00", home: "bar", away: "avl" },
  { id: "m4-fey-int", md: 4, kickoff: "2026-11-03T21:00:00+01:00", home: "fey", away: "int" },
  { id: "m4-bod-lil", md: 4, kickoff: "2026-11-03T21:00:00+01:00", home: "bod", away: "lil" },
  { id: "m4-lsk-slo", md: 4, kickoff: "2026-11-03T21:00:00+01:00", home: "lsk", away: "slo" },
  { id: "m4-mun-rom", md: 4, kickoff: "2026-11-03T21:00:00+01:00", home: "mun", away: "rom" },
  { id: "m4-vil-psg", md: 4, kickoff: "2026-11-03T21:00:00+01:00", home: "vil", away: "psg" },
  // MD4 — 4 Nov 2026
  { id: "m4-aek-rma", md: 4, kickoff: "2026-11-04T18:45:00+01:00", home: "aek", away: "rma" },
  { id: "m4-fen-liv", md: 4, kickoff: "2026-11-04T18:45:00+01:00", home: "fen", away: "liv" },
  { id: "m4-bvb-bet", md: 4, kickoff: "2026-11-04T21:00:00+01:00", home: "bvb", away: "bet" },
  { id: "m4-por-nap", md: 4, kickoff: "2026-11-04T21:00:00+01:00", home: "por", away: "nap" },
  { id: "m4-psv-clu", md: 4, kickoff: "2026-11-04T21:00:00+01:00", home: "psv", away: "clu" },
  { id: "m4-rbl-mci", md: 4, kickoff: "2026-11-04T21:00:00+01:00", home: "rbl", away: "mci" },
  { id: "m4-len-com", md: 4, kickoff: "2026-11-04T21:00:00+01:00", home: "len", away: "com" },
  { id: "m4-sla-ars", md: 4, kickoff: "2026-11-04T21:00:00+01:00", home: "sla", away: "ars" },
  { id: "m4-vik-sab", md: 4, kickoff: "2026-11-04T21:00:00+01:00", home: "vik", away: "sab" },
  // MD5 — 24 Nov 2026
  { id: "m5-bod-lsk", md: 5, kickoff: "2026-11-24T21:00:00+01:00", home: "bod", away: "lsk" },
  { id: "m5-gal-avl", md: 5, kickoff: "2026-11-24T21:00:00+01:00", home: "gal", away: "avl" },
  { id: "m5-ars-bvb", md: 5, kickoff: "2026-11-24T21:00:00+01:00", home: "ars", away: "bvb" },
  { id: "m5-com-aek", md: 5, kickoff: "2026-11-24T21:00:00+01:00", home: "com", away: "aek" },
  { id: "m5-fey-por", md: 5, kickoff: "2026-11-24T21:00:00+01:00", home: "fey", away: "por" },
  { id: "m5-mci-nap", md: 5, kickoff: "2026-11-24T21:00:00+01:00", home: "mci", away: "nap" },
  { id: "m5-rbl-len", md: 5, kickoff: "2026-11-24T21:00:00+01:00", home: "rbl", away: "len" },
  { id: "m5-rma-psv", md: 5, kickoff: "2026-11-24T21:00:00+01:00", home: "rma", away: "psv" },
  { id: "m5-slo-bet", md: 5, kickoff: "2026-11-24T21:00:00+01:00", home: "slo", away: "bet" },
  // MD5 — 25 Nov 2026
  { id: "m5-sab-bar", md: 5, kickoff: "2026-11-25T18:45:00+01:00", home: "sab", away: "bar" },
  { id: "m5-sla-vil", md: 5, kickoff: "2026-11-25T21:00:00+01:00", home: "sla", away: "vil" },
  { id: "m5-atm-vik", md: 5, kickoff: "2026-11-25T21:00:00+01:00", home: "atm", away: "vik" },
  { id: "m5-clu-liv", md: 5, kickoff: "2026-11-25T21:00:00+01:00", home: "clu", away: "liv" },
  { id: "m5-int-stu", md: 5, kickoff: "2026-11-25T21:00:00+01:00", home: "int", away: "stu" },
  { id: "m5-sha-fen", md: 5, kickoff: "2026-11-25T21:00:00+01:00", home: "sha", away: "fen" },
  { id: "m5-lil-bay", md: 5, kickoff: "2026-11-25T21:00:00+01:00", home: "lil", away: "bay" },
  { id: "m5-psg-rom", md: 5, kickoff: "2026-11-25T21:00:00+01:00", home: "psg", away: "rom" },
  { id: "m5-scp-mun", md: 5, kickoff: "2026-11-25T21:00:00+01:00", home: "scp", away: "mun" },
  // MD6 — 8 Dec 2026
  { id: "m6-vik-fey", md: 6, kickoff: "2026-12-08T18:45:00+01:00", home: "vik", away: "fey" },
  { id: "m6-vil-sab", md: 6, kickoff: "2026-12-08T21:00:00+01:00", home: "vil", away: "sab" },
  { id: "m6-aek-gal", md: 6, kickoff: "2026-12-08T21:00:00+01:00", home: "aek", away: "gal" },
  { id: "m6-rom-scp", md: 6, kickoff: "2026-12-08T21:00:00+01:00", home: "rom", away: "scp" },
  { id: "m6-avl-psg", md: 6, kickoff: "2026-12-08T21:00:00+01:00", home: "avl", away: "psg" },
  { id: "m6-bar-mci", md: 6, kickoff: "2026-12-08T21:00:00+01:00", home: "bar", away: "mci" },
  { id: "m6-bay-sla", md: 6, kickoff: "2026-12-08T21:00:00+01:00", home: "bay", away: "sla" },
  { id: "m6-mun-rbl", md: 6, kickoff: "2026-12-08T21:00:00+01:00", home: "mun", away: "rbl" },
  { id: "m6-nap-clu", md: 6, kickoff: "2026-12-08T21:00:00+01:00", home: "nap", away: "clu" },
  // MD6 — 9 Dec 2026
  { id: "m6-bet-com", md: 6, kickoff: "2026-12-09T21:00:00+01:00", home: "bet", away: "com" },
  { id: "m6-slo-sha", md: 6, kickoff: "2026-12-09T21:00:00+01:00", home: "slo", away: "sha" },
  { id: "m6-ars-rma", md: 6, kickoff: "2026-12-09T21:00:00+01:00", home: "ars", away: "rma" },
  { id: "m6-bvb-int", md: 6, kickoff: "2026-12-09T21:00:00+01:00", home: "bvb", away: "int" },
  { id: "m6-lsk-fen", md: 6, kickoff: "2026-12-09T21:00:00+01:00", home: "lsk", away: "fen" },
  { id: "m6-liv-por", md: 6, kickoff: "2026-12-09T21:00:00+01:00", home: "liv", away: "por" },
  { id: "m6-psv-atm", md: 6, kickoff: "2026-12-09T21:00:00+01:00", home: "psv", away: "atm" },
  { id: "m6-len-bod", md: 6, kickoff: "2026-12-09T21:00:00+01:00", home: "len", away: "bod" },
  { id: "m6-stu-lil", md: 6, kickoff: "2026-12-09T21:00:00+01:00", home: "stu", away: "lil" },
  // MD7 — 19 Jan 2027
  { id: "m7-bod-atm", md: 7, kickoff: "2027-01-19T18:45:00+01:00", home: "bod", away: "atm" },
  { id: "m7-gal-fey", md: 7, kickoff: "2027-01-19T21:00:00+01:00", home: "gal", away: "fey" },
  { id: "m7-aek-rom", md: 7, kickoff: "2027-01-19T21:00:00+01:00", home: "aek", away: "rom" },
  { id: "m7-avl-bvb", md: 7, kickoff: "2027-01-19T21:00:00+01:00", home: "avl", away: "bvb" },
  { id: "m7-int-liv", md: 7, kickoff: "2027-01-19T21:00:00+01:00", home: "int", away: "liv" },
  { id: "m7-por-sla", md: 7, kickoff: "2027-01-19T21:00:00+01:00", home: "por", away: "sla" },
  { id: "m7-lil-slo", md: 7, kickoff: "2027-01-19T21:00:00+01:00", home: "lil", away: "slo" },
  { id: "m7-rma-lsk", md: 7, kickoff: "2027-01-19T21:00:00+01:00", home: "rma", away: "lsk" },
  { id: "m7-stu-clu", md: 7, kickoff: "2027-01-19T21:00:00+01:00", home: "stu", away: "clu" },
  // MD7 — 20 Jan 2027
  { id: "m7-fen-vil", md: 7, kickoff: "2027-01-20T21:00:00+01:00", home: "fen", away: "vil" },
  { id: "m7-sab-nap", md: 7, kickoff: "2027-01-20T21:00:00+01:00", home: "sab", away: "nap" },
  { id: "m7-com-psg", md: 7, kickoff: "2027-01-20T21:00:00+01:00", home: "com", away: "psg" },
  { id: "m7-mun-bay", md: 7, kickoff: "2027-01-20T21:00:00+01:00", home: "mun", away: "bay" },
  { id: "m7-rbl-sha", md: 7, kickoff: "2027-01-20T21:00:00+01:00", home: "rbl", away: "sha" },
  { id: "m7-len-mci", md: 7, kickoff: "2027-01-20T21:00:00+01:00", home: "len", away: "mci" },
  { id: "m7-bet-ars", md: 7, kickoff: "2027-01-20T21:00:00+01:00", home: "bet", away: "ars" },
  { id: "m7-scp-bar", md: 7, kickoff: "2027-01-20T21:00:00+01:00", home: "scp", away: "bar" },
  { id: "m7-vik-psv", md: 7, kickoff: "2027-01-20T21:00:00+01:00", home: "vik", away: "psv" },
  // MD8 — 27 Jan 2027
  { id: "m8-ars-sab", md: 8, kickoff: "2027-01-27T21:00:00+01:00", home: "ars", away: "sab" },
  { id: "m8-rom-lil", md: 8, kickoff: "2027-01-27T21:00:00+01:00", home: "rom", away: "lil" },
  { id: "m8-atm-fen", md: 8, kickoff: "2027-01-27T21:00:00+01:00", home: "atm", away: "fen" },
  { id: "m8-bvb-aek", md: 8, kickoff: "2027-01-27T21:00:00+01:00", home: "bvb", away: "aek" },
  { id: "m8-clu-bod", md: 8, kickoff: "2027-01-27T21:00:00+01:00", home: "clu", away: "bod" },
  { id: "m8-bay-bet", md: 8, kickoff: "2027-01-27T21:00:00+01:00", home: "bay", away: "bet" },
  { id: "m8-bar-com", md: 8, kickoff: "2027-01-27T21:00:00+01:00", home: "bar", away: "com" },
  { id: "m8-sha-rma", md: 8, kickoff: "2027-01-27T21:00:00+01:00", home: "sha", away: "rma" },
  { id: "m8-fey-rbl", md: 8, kickoff: "2027-01-27T21:00:00+01:00", home: "fey", away: "rbl" },
  { id: "m8-lsk-por", md: 8, kickoff: "2027-01-27T21:00:00+01:00", home: "lsk", away: "por" },
  { id: "m8-liv-len", md: 8, kickoff: "2027-01-27T21:00:00+01:00", home: "liv", away: "len" },
  { id: "m8-mci-scp", md: 8, kickoff: "2027-01-27T21:00:00+01:00", home: "mci", away: "scp" },
  { id: "m8-psg-gal", md: 8, kickoff: "2027-01-27T21:00:00+01:00", home: "psg", away: "gal" },
  { id: "m8-psv-stu", md: 8, kickoff: "2027-01-27T21:00:00+01:00", home: "psv", away: "stu" },
  { id: "m8-sla-avl", md: 8, kickoff: "2027-01-27T21:00:00+01:00", home: "sla", away: "avl" },
  { id: "m8-nap-vik", md: 8, kickoff: "2027-01-27T21:00:00+01:00", home: "nap", away: "vik" },
  { id: "m8-vil-mun", md: 8, kickoff: "2027-01-27T21:00:00+01:00", home: "vil", away: "mun" },
  { id: "m8-slo-int", md: 8, kickoff: "2027-01-27T21:00:00+01:00", home: "slo", away: "int" },
];

export const teamById: Record<string, Team> = Object.fromEntries(TEAMS.map((t) => [t.id, t]));

export function getTeam(id: string): Team {
  const t = teamById[id];
  if (!t) throw new Error(`Unknown team ${id}`);
  return t;
}

export type Standing = {
  team: Team;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  gd: number;
  pts: number;
  pos: number;
  band: "r16" | "playoff" | "out";
};

let tableCache: Standing[] | null = null;

export function computeTableFrom(matches: readonly Match[]): Standing[] {
  const map = new Map<string, Standing>();
  for (const t of TEAMS) {
    map.set(t.id, {
      team: t,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      gf: 0,
      ga: 0,
      gd: 0,
      pts: 0,
      pos: 0,
      band: "out",
    });
  }
  for (const m of matches) {
    if (m.hg == null || m.ag == null) continue;
    const h = map.get(m.home);
    const a = map.get(m.away);
    if (!h || !a) continue;
    h.played += 1;
    a.played += 1;
    h.gf += m.hg;
    h.ga += m.ag;
    a.gf += m.ag;
    a.ga += m.hg;
    if (m.hg > m.ag) {
      h.won += 1;
      a.lost += 1;
      h.pts += 3;
    } else if (m.hg < m.ag) {
      a.won += 1;
      h.lost += 1;
      a.pts += 3;
    } else {
      h.drawn += 1;
      a.drawn += 1;
      h.pts += 1;
      a.pts += 1;
    }
  }
  const rows = [...map.values()].map((r) => ({ ...r, gd: r.gf - r.ga }));
  rows.sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf || a.team.name.localeCompare(b.team.name));
  return rows.map((r, i) => ({
    ...r,
    pos: i + 1,
    band: i < 8 ? "r16" : i < 24 ? "playoff" : "out",
  }));
}

export function computeTable(): Standing[] {
  if (!tableCache) tableCache = computeTableFrom(MATCHES);
  return tableCache;
}

export function matchesOnMd(md: number): Match[] {
  return MATCHES.filter((m) => m.md === md).sort(
    (a, b) => new Date(a.kickoff).getTime() - new Date(b.kickoff).getTime(),
  );
}

export function activeMatchday(now = Date.now()): number {
  const open = MATCHES.filter((m) => m.hg == null && new Date(m.kickoff).getTime() > now);
  if (open.length) return Math.min(...open.map((m) => m.md));
  return Math.max(...MATCHES.map((m) => m.md));
}

export function formFor(teamId: string, n = 5): ("W" | "D" | "L")[] {
  return matchesFor(teamId)
    .filter((m) => m.hg != null)
    .sort((a, b) => new Date(a.kickoff).getTime() - new Date(b.kickoff).getTime())
    .slice(-n)
    .map((m) => resultFor(m, teamId)!)
    .filter(Boolean);
}

export function gradePick(
  match: Match,
  home: number,
  away: number,
): { points: number; tag: "exact" | "result" | "miss" | "open" } {
  if (match.hg == null || match.ag == null) return { points: 0, tag: "open" };
  if (home === match.hg && away === match.ag) return { points: 5, tag: "exact" };
  const pred = Math.sign(home - away);
  const real = Math.sign(match.hg - match.ag);
  if (pred === real) return { points: 2, tag: "result" };
  return { points: 0, tag: "miss" };
}

export function simulateNext(
  clubId: string,
  result: "W" | "D" | "L",
): { current: Standing; next: Standing; table: Standing[] } | null {
  const fixture = nextMatch(clubId);
  const current = computeTable().find((r) => r.team.id === clubId);
  if (!fixture || !current) return null;
  const homeClub = fixture.home === clubId;
  let hg = 1;
  let ag = 1;
  if (result === "W") {
    hg = homeClub ? 2 : 0;
    ag = homeClub ? 0 : 2;
  } else if (result === "L") {
    hg = homeClub ? 0 : 2;
    ag = homeClub ? 2 : 0;
  }
  const table = computeTableFrom([...MATCHES.filter((m) => m.id !== fixture.id), { ...fixture, hg, ag }]);
  const next = table.find((r) => r.team.id === clubId)!;
  return { current, next, table };
}

export const ROAD = [
  { id: "league", label: "League", note: "8 nights · 36 clubs" },
  { id: "playoff", label: "Play-off", note: "Places 9–24" },
  { id: "r16", label: "R16", note: "Top 8 + winners" },
  { id: "qf", label: "QF", note: "Eight left" },
  { id: "sf", label: "SF", note: "Four left" },
  { id: "final", label: "Madrid", note: "5 June 2027" },
] as const;


export function matchesFor(teamId: string): Match[] {
  return MATCHES.filter((m) => m.home === teamId || m.away === teamId);
}

export function lastMatch(teamId: string, now = Date.now()): Match | undefined {
  return matchesFor(teamId)
    .filter((m) => new Date(m.kickoff).getTime() <= now && m.hg != null)
    .sort((a, b) => new Date(b.kickoff).getTime() - new Date(a.kickoff).getTime())[0];
}

export function nextMatch(teamId: string, now = Date.now()): Match | undefined {
  return matchesFor(teamId)
    .filter((m) => new Date(m.kickoff).getTime() > now - 3 * 60 * 60 * 1000 && m.hg == null)
    .sort((a, b) => new Date(a.kickoff).getTime() - new Date(b.kickoff).getTime())[0];
}

export function nextKickoff(now = Date.now()): Match | undefined {
  return MATCHES.filter((m) => new Date(m.kickoff).getTime() > now && m.hg == null).sort(
    (a, b) => new Date(a.kickoff).getTime() - new Date(b.kickoff).getTime(),
  )[0];
}

export function upcomingOnDay(now = Date.now()): Match[] {
  const next = nextKickoff(now);
  if (!next) return [];
  const day = next.kickoff.slice(0, 10);
  return MATCHES.filter((m) => m.kickoff.startsWith(day));
}

export function opponentOf(match: Match, teamId: string): Team {
  return getTeam(match.home === teamId ? match.away : match.home);
}

export function isHome(match: Match, teamId: string): boolean {
  return match.home === teamId;
}

export function topScorers(limit = 8): { player: Player; team: Team }[] {
  const rows: { player: Player; team: Team }[] = [];
  for (const t of TEAMS) {
    for (const p of t.players) {
      if (p.goals > 0) rows.push({ player: p, team: t });
    }
  }
  rows.sort((a, b) => b.player.goals - a.player.goals || a.player.name.localeCompare(b.player.name));
  return rows.slice(0, limit);
}

export function findPlayer(id: string): { player: Player; team: Team } | undefined {
  for (const t of TEAMS) {
    const p = t.players.find((x) => x.id === id);
    if (p) return { player: p, team: t };
  }
  return undefined;
}

export function formatKickoff(iso: string): string {
  const d = new Date(iso);
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(d);
}

export function scoreline(match: Match): string {
  if (match.hg == null || match.ag == null) return "vs";
  return `${match.hg}–${match.ag}`;
}

export function resultFor(match: Match, teamId: string): "W" | "D" | "L" | null {
  if (match.hg == null || match.ag == null) return null;
  const gf = match.home === teamId ? match.hg : match.ag;
  const ga = match.home === teamId ? match.ag : match.hg;
  if (gf > ga) return "W";
  if (gf < ga) return "L";
  return "D";
}

export const PULSES = [
  "Matchday 1 is in the book — 18 games, 67 goals, PSG top the 36 on +5.",
  "Ferran Torres and Ermedin Demirović share the golden boot on 3 after MD1.",
  "Como’s 4–1 over Leipzig is the loudest debut of the Swiss-system era.",
  "City host holders PSG on 14 October — the first true night of the league phase.",
  "Arsenal go to Bayern on 21 October; Madrid visit Roma on 14 October.",
  "Road to Madrid: the final is 5 June 2027 at the Metropolitano.",
  "Top 8 go straight to the round of 16. Places 9–24 play a knockout play-off.",
  "Sabah and Viking are in the 36 for the first time — every point is oxygen.",
];
