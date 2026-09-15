create table if not exists fan_profiles (
  user_id      text primary key,
  display_name text not null,
  club_id      text not null,
  player_id    text not null,
  shirt_no     integer not null default 10,
  photo        text,
  updated_at   timestamptz not null default now()
);

create table if not exists fan_groups (
  id         text primary key,
  name       text not null,
  owner_id   text not null,
  created_at timestamptz not null default now()
);

create table if not exists fan_members (
  group_id  text not null references fan_groups(id) on delete cascade,
  user_id   text not null,
  joined_at timestamptz not null default now(),
  primary key (group_id, user_id)
);
create index if not exists fan_members_user_idx on fan_members (user_id);

create table if not exists fan_challenges (
  id         text primary key,
  group_id   text not null references fan_groups(id) on delete cascade,
  match_id   text not null,
  kind       text not null,
  team_id    text,
  created_by text not null,
  created_at timestamptz not null default now()
);
create index if not exists fan_challenges_group_idx on fan_challenges (group_id);

create table if not exists fan_picks (
  challenge_id text not null references fan_challenges(id) on delete cascade,
  user_id      text not null,
  home_goals   integer,
  away_goals   integer,
  starters     text,
  subs         text,
  first_off    text,
  first_on     text,
  submitted_at timestamptz not null default now(),
  primary key (challenge_id, user_id)
);
