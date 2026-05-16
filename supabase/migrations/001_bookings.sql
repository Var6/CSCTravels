-- Run this in your Supabase SQL editor (Project → SQL Editor → New query)

create type booking_status as enum ('pending', 'confirmed', 'completed', 'cancelled');

create type vehicle_kind as enum ('car', 'bus', 'traveler');

create type trip_kind as enum ('one_way', 'round_trip', 'outstation', 'hourly');

create table public.bookings (
  id              uuid primary key default gen_random_uuid(),
  customer_name   text not null,
  phone           text not null,
  email           text,
  pickup          text not null,
  drop_location   text not null,
  pickup_at       timestamptz not null,
  return_at       timestamptz,
  vehicle_type    vehicle_kind not null,
  trip_type       trip_kind not null default 'one_way',
  passengers      int not null default 1,
  notes           text,
  status          booking_status not null default 'pending',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index bookings_status_created_idx on public.bookings (status, created_at desc);
create index bookings_pickup_at_idx      on public.bookings (pickup_at desc);

-- updated_at trigger
create or replace function public.set_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

create trigger bookings_set_updated_at
before update on public.bookings
for each row execute function public.set_updated_at();

-- Row Level Security
alter table public.bookings enable row level security;

-- Public (anon) can INSERT new bookings only.
create policy "anon can create bookings"
  on public.bookings for insert
  to anon
  with check (true);

-- Authenticated users (admins) can read + update all bookings.
create policy "authenticated can read all bookings"
  on public.bookings for select
  to authenticated
  using (true);

create policy "authenticated can update bookings"
  on public.bookings for update
  to authenticated
  using (true)
  with check (true);
