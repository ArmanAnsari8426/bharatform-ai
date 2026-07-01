-- ============================================================
-- BharatForm AI — Supabase Database Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- 1) PROFILES (extends auth.users with app data)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  email text,
  phone text,
  state text,
  role text default 'citizen',          -- citizen | admin | super-admin
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

-- Users can read/update only their own profile
create policy "read own profile"  on public.profiles for select using (auth.uid() = id);
create policy "insert own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "update own profile" on public.profiles for update using (auth.uid() = id);

-- Admins can read ALL profiles
create policy "admins read all profiles" on public.profiles for select using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin', 'super-admin'))
);

-- Enable Realtime for profiles table (crucial for Admin Dashboard live updates)
alter publication supabase_realtime add table public.profiles;

-- Auto-create a profile row when a new user signs up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, name, email, phone)
  values (new.id,
          coalesce(new.raw_user_meta_data->>'name', split_part(new.email,'@',1)),
          new.email,
          new.raw_user_meta_data->>'phone')
  on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 2) FEEDBACK (launch supporters)
create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  name text,
  state text,
  role text,
  rating int,
  improvement text,
  feedback text,
  created_at timestamptz default now()
);

alter table public.feedback enable row level security;
alter publication supabase_realtime add table public.feedback;

create policy "anyone can insert feedback" on public.feedback for insert with check (true);
create policy "read own feedback"          on public.feedback for select using (auth.uid() = user_id);
create policy "admins read all feedback"   on public.feedback for select using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin', 'super-admin'))
);

-- 3) TRANSACTIONS (payments)
create table if not exists public.transactions (
  id text primary key,                   -- e.g. BFR1234567890
  user_id uuid references auth.users(id) on delete set null,
  plan text,
  amount int,
  method text,
  status text default 'success',
  created_at timestamptz default now()
);

alter table public.transactions enable row level security;
alter publication supabase_realtime add table public.transactions;

create policy "insert own txn" on public.transactions for insert with check (auth.uid() = user_id);
create policy "read own txn"   on public.transactions for select using (auth.uid() = user_id);
create policy "admins read all txns" on public.transactions for select using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin', 'super-admin'))
);

-- 4) ADMIN CONTENT (services / scholarships / schemes added from admin)
create table if not exists public.content (
  id uuid primary key default gen_random_uuid(),
  kind text not null,                    -- service | scholarship | scheme
  data jsonb not null,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz default now()
);

alter table public.content enable row level security;
create policy "anyone can read content" on public.content for select using (true);
-- Restrict writes to admins (set profiles.role = 'admin' first)
create policy "admins manage content" on public.content for all
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','super-admin')));

-- 5) ANALYSES (Form analysis records)
create table if not exists public.analyses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  user_name text,
  user_email text,
  form_name text not null,
  form_number text,
  authority text,
  total_fields int,
  created_at timestamptz default now()
);

alter table public.analyses enable row level security;
alter publication supabase_realtime add table public.analyses;

create policy "insert own analysis" on public.analyses for insert with check (auth.uid() = user_id);
create policy "read own analysis"   on public.analyses for select using (auth.uid() = user_id);
create policy "admins read all analyses" on public.analyses for select using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin', 'super-admin'))
);
create policy "admins delete analyses" on public.analyses for delete using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin', 'super-admin'))
);

-- ============================================================
-- DONE. Then enable providers under Authentication → Providers:
--   • Email (password + OTP)
--   • Phone (SMS OTP — needs Twilio/MSG91)
--   • Google (OAuth — add Client ID/Secret)
-- ============================================================
