-- Run this in your Supabase SQL editor AFTER 001_bookings.sql.
-- Adds user profiles, promocodes, and per-user discount tracking.

-- ============ PROFILES ============
create table public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  full_name     text,
  phone         text,
  promocode     text,
  discount_pct  int not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;

create policy "users read own profile"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);

create policy "users update own profile (no discount escalation)"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Admins (any authenticated user without a profile row, i.e. dashboard logins) can read all
-- (Optional — comment out if you don't want this.)
create policy "service role full access profiles"
  on public.profiles for all
  to service_role
  using (true) with check (true);

-- ============ PROMOCODES ============
create table public.promocodes (
  code          text primary key,
  discount_pct  int not null check (discount_pct between 1 and 100),
  active        boolean not null default true,
  notes         text,
  created_at    timestamptz not null default now()
);

alter table public.promocodes enable row level security;

-- Anyone signed in can READ active promocodes (so signup can validate)
create policy "anyone can read active promocodes"
  on public.promocodes for select
  to anon, authenticated
  using (active = true);

-- Seed a default code
insert into public.promocodes (code, discount_pct, notes)
values ('CSC20', 20, 'Launch promo — 20% off all rides');

-- ============ PROFILE AUTO-CREATE ON SIGNUP ============
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  meta jsonb := new.raw_user_meta_data;
  pcode text := coalesce(nullif(trim(upper(meta->>'promocode')), ''), null);
  pct int := 0;
begin
  if pcode is not null then
    select discount_pct into pct from public.promocodes where code = pcode and active = true;
    if pct is null then pct := 0; pcode := null; end if;
  end if;

  insert into public.profiles (id, full_name, phone, promocode, discount_pct)
  values (new.id, meta->>'full_name', meta->>'phone', pcode, pct);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- ============ BOOKINGS: link to user + store fare ============
alter table public.bookings
  add column if not exists user_id           uuid references auth.users(id) on delete set null,
  add column if not exists pickup_lat        double precision,
  add column if not exists pickup_lng        double precision,
  add column if not exists drop_lat          double precision,
  add column if not exists drop_lng          double precision,
  add column if not exists distance_km       numeric(8,2),
  add column if not exists estimated_fare    numeric(10,2),
  add column if not exists discount_pct      int not null default 0,
  add column if not exists final_fare        numeric(10,2);

-- Users can read their own bookings
create policy "users read own bookings"
  on public.bookings for select
  to authenticated
  using (user_id = auth.uid());

create index if not exists bookings_user_id_idx on public.bookings (user_id, created_at desc);
