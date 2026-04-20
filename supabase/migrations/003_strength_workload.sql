-- ============================================================
-- PitchBack �� Strength & Workload Schema
-- Tables: strength_sessions, strength_exercises, power_tests, workload_weekly
-- ============================================================

-- =========================
-- 1. STRENGTH SESSIONS
-- =========================
create table public.strength_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  body_weight numeric,
  session_name text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create index idx_strength_sessions_user_date on public.strength_sessions(user_id, date);
alter table public.strength_sessions enable row level security;

create policy "Users CRUD own strength sessions" on public.strength_sessions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create trigger set_updated_at before update on public.strength_sessions
  for each row execute procedure public.update_updated_at_column();

-- =========================
-- 2. STRENGTH EXERCISES
-- =========================
create table public.strength_exercises (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.strength_sessions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  exercise_name text not null,
  sets integer,
  reps integer,
  weight numeric,
  rpe integer check (rpe between 1 and 10),
  set_type text,
  sort_order integer default 0,
  created_at timestamptz default now() not null
);

create index idx_strength_exercises_session on public.strength_exercises(session_id);
alter table public.strength_exercises enable row level security;

create policy "Users CRUD own strength exercises" on public.strength_exercises
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- =========================
-- 3. POWER TESTS
-- =========================
create table public.power_tests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  test_type text not null check (test_type in ('broad_jump', 'vertical_jump', 'rotational_mb_throw', 'grip_strength')),
  value numeric not null,
  unit text not null,
  bilateral_side text check (bilateral_side in ('left', 'right', 'both')),
  created_at timestamptz default now() not null
);

create index idx_power_tests_user_date on public.power_tests(user_id, date);
alter table public.power_tests enable row level security;

create policy "Users CRUD own power tests" on public.power_tests
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- =========================
-- 4. WORKLOAD WEEKLY
-- =========================
create table public.workload_weekly (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  week_start date not null,
  pitch_count integer default 0,
  throwing_sessions integer default 0,
  acwr numeric,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  unique(user_id, week_start)
);

create index idx_workload_weekly_user on public.workload_weekly(user_id, week_start);
alter table public.workload_weekly enable row level security;

create policy "Users CRUD own workload data" on public.workload_weekly
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create trigger set_updated_at before update on public.workload_weekly
  for each row execute procedure public.update_updated_at_column();
