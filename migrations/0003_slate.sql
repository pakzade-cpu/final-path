create table if not exists fan_slate_picks (
  user_id      text not null,
  match_id     text not null,
  home_goals   integer not null,
  away_goals   integer not null,
  submitted_at timestamptz not null default now(),
  primary key (user_id, match_id)
);
create index if not exists fan_slate_picks_match_idx on fan_slate_picks (match_id);
