-- Run in Supabase SQL Editor AFTER 001 and 002.
-- Adds drivers + booking trip-lifecycle columns + driver attendance.

-- ============ DRIVERS ============
create table public.drivers (
  id            uuid primary key references auth.users(id) on delete cascade,
  full_name     text not null,
  phone         text not null,
  email         text,
  license_no    text,
  status        text not null default 'offline'
                check (status in ('available', 'on_trip', 'offline')),
  vehicle_plate text,
  base_salary   numeric(10,2) not null default 0,
  per_km_rate   numeric(6,2)  not null default 0,
  rating        numeric(3,2)  not null default 0,
  trips_count   int           not null default 0,
  active        boolean       not null default true,
  created_at    timestamptz   not null default now(),
  updated_at    timestamptz   not null default now()
);

create trigger drivers_set_updated_at
before update on public.drivers
for each row execute function public.set_updated_at();

alter table public.drivers enable row level security;

create policy "driver reads own row"
  on public.drivers for select to authenticated
  using (auth.uid() = id);

create policy "driver updates own status row"
  on public.drivers for update to authenticated
  using (auth.uid() = id) with check (auth.uid() = id);

-- ============ BOOKINGS: trip-lifecycle columns ============
alter table public.bookings
  add column if not exists driver_id        uuid references public.drivers(id) on delete set null,
  add column if not exists start_odometer   numeric(10,1),
  add column if not exists end_odometer     numeric(10,1),
  add column if not exists actual_start_at  timestamptz,
  add column if not exists actual_end_at    timestamptz,
  add column if not exists payment_method   text check (payment_method in ('cash','upi','card','wallet')),
  add column if not exists payment_status   text not null default 'pending' check (payment_status in ('pending','paid'));

create index if not exists bookings_driver_id_idx on public.bookings (driver_id, created_at desc);

-- Drivers can see:
--   * pending bookings (unassigned) so they can accept them
--   * any booking assigned to them
create policy "driver reads available + own trips"
  on public.bookings for select to authenticated
  using (
    driver_id = auth.uid()
    or (driver_id is null and status = 'pending'
        and exists (select 1 from public.drivers d
                    where d.id = auth.uid() and d.active = true))
  );

-- Drivers can update bookings assigned to them OR claim an unassigned pending
-- booking by stamping their own id into driver_id.
create policy "driver claims or updates own trips"
  on public.bookings for update to authenticated
  using (
    driver_id = auth.uid()
    or (driver_id is null and status = 'pending'
        and exists (select 1 from public.drivers d
                    where d.id = auth.uid() and d.active = true))
  )
  with check (driver_id = auth.uid());

-- ============ DRIVER ATTENDANCE ============
create table public.driver_attendance (
  id          uuid primary key default gen_random_uuid(),
  driver_id   uuid not null references public.drivers(id) on delete cascade,
  date        date not null,
  status      text not null check (status in ('present','absent','holiday')),
  km_driven   numeric(8,1) not null default 0,
  notes       text,
  created_at  timestamptz not null default now(),
  unique (driver_id, date)
);

alter table public.driver_attendance enable row level security;

create policy "driver manages own attendance"
  on public.driver_attendance for all to authenticated
  using (driver_id = auth.uid())
  with check (driver_id = auth.uid());
