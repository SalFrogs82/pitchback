-- ============================================================
-- PitchBack — Initial Schema Migration
-- Tables: profiles, rehab_logs, itp_sessions, goals, wellness_logs
-- All tables use UUID PKs, user_id FK to auth.users, RLS enabled
-- ============================================================

-- =========================
-- 1. PROFILES
-- =========================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  surgery_date date,
  target_return_date date,
  throw_hand text check (throw_hand in ('left', 'right')),
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =========================
-- 2. REHAB LOGS
-- =========================
create table public.rehab_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  phase integer not null check (phase between 1 and 5),
  rom_flexion numeric,
  rom_extension numeric,
  pain_level integer check (pain_level between 0 and 10),
  grip_strength numeric,
  notes text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  unique(user_id, date)
);

create index idx_rehab_logs_user_date on public.rehab_logs(user_id, date);

alter table public.rehab_logs enable row level security;

create policy "Users can view own rehab logs"
  on public.rehab_logs for select
  using (auth.uid() = user_id);

create policy "Users can insert own rehab logs"
  on public.rehab_logs for insert
  with check (auth.uid() = user_id);

create policy "Users can update own rehab logs"
  on public.rehab_logs for update
  using (auth.uid() = user_id);

create policy "Users can delete own rehab logs"
  on public.rehab_logs for delete
  using (auth.uid() = user_id);

-- =========================
-- 3. ITP SESSIONS
-- =========================
create table public.itp_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  step integer not null check (step between 1 and 13),
  distance integer, -- feet
  throw_count integer,
  intensity_pct integer check (intensity_pct between 0 and 100),
  pain_level integer check (pain_level between 0 and 10),
  advanced boolean default false,
  notes text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create index idx_itp_sessions_user_date on public.itp_sessions(user_id, date);

alter table public.itp_sessions enable row level security;

create policy "Users can view own ITP sessions"
  on public.itp_sessions for select
  using (auth.uid() = user_id);

create policy "Users can insert own ITP sessions"
  on public.itp_sessions for insert
  with check (auth.uid() = user_id);

create policy "Users can update own ITP sessions"
  on public.itp_sessions for update
  using (auth.uid() = user_id);

create policy "Users can delete own ITP sessions"
  on public.itp_sessions for delete
  using (auth.uid() = user_id);

-- =========================
-- 4. GOALS
-- =========================
create table public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category text not null check (category in ('velocity', 'movement', 'strength', 'rehab', 'custom')),
  title text not null,
  start_value numeric,
  current_value numeric,
  target_value numeric,
  unit text,
  target_date date,
  status text not null default 'active' check (status in ('active', 'completed', 'archived')),
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create index idx_goals_user on public.goals(user_id);

alter table public.goals enable row level security;

create policy "Users can view own goals"
  on public.goals for select
  using (auth.uid() = user_id);

create policy "Users can insert own goals"
  on public.goals for insert
  with check (auth.uid() = user_id);

create policy "Users can update own goals"
  on public.goals for update
  using (auth.uid() = user_id);

create policy "Users can delete own goals"
  on public.goals for delete
  using (auth.uid() = user_id);

-- =========================
-- 5. WELLNESS LOGS
-- =========================
create table public.wellness_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  sleep_hours numeric check (sleep_hours >= 0 and sleep_hours <= 24),
  sleep_quality integer check (sleep_quality between 1 and 5),
  mood integer check (mood between 1 and 5),
  soreness integer check (soreness between 1 and 5),
  energy integer check (energy between 1 and 5),
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  unique(user_id, date)
);

create index idx_wellness_logs_user_date on public.wellness_logs(user_id, date);

alter table public.wellness_logs enable row level security;

create policy "Users can view own wellness logs"
  on public.wellness_logs for select
  using (auth.uid() = user_id);

create policy "Users can insert own wellness logs"
  on public.wellness_logs for insert
  with check (auth.uid() = user_id);

create policy "Users can update own wellness logs"
  on public.wellness_logs for update
  using (auth.uid() = user_id);

create policy "Users can delete own wellness logs"
  on public.wellness_logs for delete
  using (auth.uid() = user_id);

-- =========================
-- 6. Updated_at trigger function
-- =========================
create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Apply updated_at triggers to all tables
create trigger set_updated_at before update on public.profiles
  for each row execute procedure public.update_updated_at_column();

create trigger set_updated_at before update on public.rehab_logs
  for each row execute procedure public.update_updated_at_column();

create trigger set_updated_at before update on public.itp_sessions
  for each row execute procedure public.update_updated_at_column();

create trigger set_updated_at before update on public.goals
  for each row execute procedure public.update_updated_at_column();

create trigger set_updated_at before update on public.wellness_logs
  for each row execute procedure public.update_updated_at_column();
