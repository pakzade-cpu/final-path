import { APP_NAME, STUDIO_NAME } from "./brand";

/** Desk-knowledge answers so the copilot still works without an xAI key. */
export function localDeskReply(message: string): string {
  const q = message.toLowerCase();

  if (/(score|scoring|points|card|exact|prediction)/.test(q)) {
    return [
      "Matchday card scoring:",
      "• Exact score = 5 points",
      "• Correct result only (W/D/L) = 2 points",
      "• Anything else = 0",
      "Picks lock at kick-off. Open Card in the bottom nav to fill all 18 games.",
    ].join("\n");
  }

  if (/(table|what-?if|stand|swiss|top 8|play-?off)/.test(q)) {
    return [
      "The 36-team Swiss table:",
      "• Top 8 go straight to the round of 16",
      "• Places 9–24 play a knockout play-off",
      "• 25–36 are out",
      "On Table, tap W / D / L on your next fixture to see how a result would move your band.",
    ].join("\n");
  }

  if (/(kit|shirt|photo|number)/.test(q)) {
    return "Your kit is a generic shirt painted in your club’s colours — no manufacturer logos. Tap the kit on Desk (or your chip in the header) to change the photo and number.";
  }

  if (/(final|madrid|metropolitano|winner)/.test(q)) {
    return "The final is 5 June 2027 at Estadio Metropolitano, Madrid. Open Final to lock two clubs for the night, then share the pick.";
  }

  if (/(favorite|favourite|follow|region|map|world)/.test(q)) {
    return "Start on Champions League, or open World to pick a continent. Star clubs as favourites — Favs then shows only those teams’ latest results and next kick-offs. Compare puts two clubs side by side like a PlayStation substitution screen.";
  }

  if (/(club|invite|friend|leaderboard)/.test(q)) {
    return "Club is the friends board. Create a group, share the code, and everyone fills the same 18-game card. Scores lock at kick-off.";
  }

  if (/(live|scoreboard|feed)/.test(q)) {
    return "Live pulls real fixtures from the public football feed (TheSportsDB). Filter by league, or keep Favs open if you only want the clubs you follow.";
  }

  if (/(hello|hi |hey|help|what can)/.test(q)) {
    return `${APP_NAME} by ${STUDIO_NAME}. Ask me how the card is scored, how the table works, how to hang a kit, or how World / favourites / Compare work.`;
  }

  return [
    `I'm the ${APP_NAME} desk assistant (local answers while Grok is not connected).`,
    "Try: “How is the card scored?”, “What does top 8 mean?”, “How do favourites work?”, or “When is the final?”",
  ].join("\n");
}
