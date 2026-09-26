# World Soccer

**Aras Studio presents World Soccer** — a personal Champions League **2026/27** desk. Hang your kit, fill the matchday card, challenge friends, pick Madrid.

Road: League phase → Play-off → Round of 16 → Quarter-finals → Semi-finals → **Metropolitano, 5 June 2027**.

## What’s in the desk

- **Kit** — favourite club colours on a generic shirt, your photo on the chest, the number you want
- **Table** — live 36-team Swiss table, form strips, what-if (W/D/L) on the next fixture, projected finish
- **Card** — all 18 games on a matchday; exact score **5 pts**, correct result **2 pts**; locks at kickoff
- **Club** — invite friends with a share code, group leaderboard, sealed score + XI / first-sub challenges
- **Final** — your pick for who lifts it in Madrid, plus the road map
- Sign in with **X** or **Google**

Scoring is not a €100m fantasy. It is a forecast desk: scores, lineups, and a group board.

Kits use each club’s colours on an original shirt template — no manufacturer marks and no replica artwork.

## Run it

Needs **Node 22**.

```bash
git clone https://github.com/pakzade-cpu/final-path.git
cd final-path
npm install
npm run dev
```

Then open the URL Vite prints (default port 8080).

### Auth & database

- **Hosted on Grok App Builder** — Google / X sign-in and Postgres are already wired.
- **On your machine** — the app uses a local Postgres-compatible store (PGLite) so you can still hang a kit and fill a card. Set `DATABASE_URL` to a real Postgres URL if you want a shared database.

Migrations live in [`migrations/`](migrations/). `npm run build` applies them.

## Stack

React 19 · TanStack Start · Tailwind v4 · Better Auth · Neon / PGLite

## Repo

Public source: [github.com/pakzade-cpu/final-path](https://github.com/pakzade-cpu/final-path). Clone it, fork it, or share the link.

Friends join **the desk** with a Club invite code — GitHub is the source, not the dressing room.

A product of **Aras Studio**.
