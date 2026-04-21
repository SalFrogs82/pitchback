-- ============================================================
-- PitchBack — Pitch Data Schema
-- Tables: pitch_sessions, pitches
-- ============================================================

-- =========================
-- 1. PITCH SESSIONS
-- =========================
create table public.pitch_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  session_type text,
  location text,
  total_pitches integer,
  csv_file_url text,
  notes text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create index idx_pitch_sessions_user_date on public.pitch_sessions(user_id, date);

alter table public.pitch_sessions enable row level security;

create policy "Users can view own pitch sessions"
  on public.pitch_sessions for select using (auth.uid() = user_id);
create policy "Users can insert own pitch sessions"
  on public.pitch_sessions for insert with check (auth.uid() = user_id);
create policy "Users can update own pitch sessions"
  on public.pitch_sessions for update using (auth.uid() = user_id);
create policy "Users can delete own pitch sessions"
  on public.pitch_sessions for delete using (auth.uid() = user_id);

create trigger set_updated_at before update on public.pitch_sessions
  for each row execute procedure public.update_updated_at_column();

-- =========================
-- 2. PITCHES
-- =========================
create table public.pitches (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.pitch_sessions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  pitch_number integer,
  pitch_type text check (pitch_type in ('fastball', 'changeup', 'riseball', 'curveball', 'dropball', 'screwball')),
  velocity numeric,
  spin_rate numeric,
  true_spin numeric,
  spin_efficiency numeric,
  spin_direction numeric,
  gyro_degree numeric,
  horizontal_break numeric,
  vertical_break numeric,
  release_height numeric,
  release_side numeric,
  extension numeric,
  strike_zone text,
  created_at timestamptz default now() not null
);

create index idx_pitches_session on public.pitches(session_id);
create index idx_pitches_user on public.pitches(user_id);

alter table public.pitches enable row level security;

create policy "Users can view own pitches"
  on public.pitches for select using (auth.uid() = user_id);
create policy "Users can insert own pitches"
  on public.pitches for insert with check (auth.uid() = user_id);
create policy "Users can update own pitches"
  on public.pitches for update using (auth.uid() = user_id);
create policy "Users can delete own pitches"
  on public.pitches for delete using (auth.uid() = user_id);
