/** Domestic leagues on the public scores board. The Champions desk stays separate. */
export const FOOTBALL_LEAGUES = [
  { id: "4328", name: "Premier League", feed: "English Premier League", country: "England" },
  { id: "4329", name: "Championship", feed: "English League Championship", country: "England" },
  { id: "4330", name: "Premiership", feed: "Scottish Premier League", country: "Scotland" },
  { id: "4331", name: "Bundesliga", feed: "German Bundesliga", country: "Germany" },
  { id: "4332", name: "Serie A", feed: "Italian Serie A", country: "Italy" },
  { id: "4334", name: "Ligue 1", feed: "French Ligue 1", country: "France" },
  { id: "4335", name: "La Liga", feed: "Spanish La Liga", country: "Spain" },
  { id: "4337", name: "Eredivisie", feed: "Dutch Eredivisie", country: "Netherlands" },
  { id: "4338", name: "Pro League", feed: "Belgian Pro League", country: "Belgium" },
  { id: "4339", name: "Süper Lig", feed: "Turkish Super Lig", country: "Türkiye" },
  { id: "4344", name: "Primeira Liga", feed: "Portuguese Primeira Liga", country: "Portugal" },
  { id: "4346", name: "MLS", feed: "American Major League Soccer", country: "USA" },
  { id: "4351", name: "Brasileirão", feed: "Brazilian Serie A", country: "Brazil" },
  { id: "4356", name: "A-League", feed: "Australian A-League", country: "Australia" },
  { id: "4399", name: "2. Bundesliga", feed: "German 2. Bundesliga", country: "Germany" },
  { id: "4675", name: "Super League", feed: "Swiss Super League", country: "Switzerland" },
] as const;

export type FootballLeagueId = (typeof FOOTBALL_LEAGUES)[number]["id"];
