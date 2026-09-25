const LINES = {
  results:
    "Results and kickoffs are compiled in this desk. Matchday 1 is the nights of 8–10 September 2026. Later dates are the league-phase calendar. Not a live UEFA feed.",
  squads: "Shirt numbers and goal tallies are a compiled list from Matchday 1.",
  ratings: "Attack, defence, tempo, depth, and European weight are authored inputs for the model.",
  model:
    "Scores, projected places, and the Madrid board come from a Poisson model on those ratings, home edge, and Matchday 1 form.",
  grok: "The Grok brief is written on request by Grok (xAI). It does not cite a feed.",
} as const;

export type SourceKey = keyof typeof LINES | "code";

const REPO = "https://github.com/pakzade-cpu/final-path";

export function Sources({ show }: { show: SourceKey[] }) {
  return (
    <footer className="rounded-3xl px-5 py-4 panel">
      <p className="text-xs uppercase tracking-[0.2em] text-subtle">Sources</p>
      <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted">
        {show.map((key) => (
          <li key={key}>
            {key === "code" ? (
              <>
                World Soccer is an Aras Studio desk. Source is public at{" "}
                <a href={REPO} target="_blank" rel="noreferrer" className="underline underline-offset-2">
                  github.com/pakzade-cpu/final-path
                </a>
                .
              </>
            ) : (
              LINES[key]
            )}
          </li>
        ))}
      </ul>
    </footer>
  );
}
