import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { BookingInput, VehicleKind, TripKind } from '@/types/booking';

const VEHICLES: VehicleKind[] = ['car', 'bus', 'traveler'];
const TRIPS: TripKind[] = ['one_way', 'round_trip', 'outstation', 'hourly'];

function bad(msg: string, status = 400) {
  return NextResponse.json({ error: msg }, { status });
}

export async function POST(req: Request) {
  let body: Partial<BookingInput>;
  try {
    body = await req.json();
  } catch {
    return bad('Invalid JSON');
  }

  const required = ['customer_name', 'phone', 'pickup', 'drop_location', 'pickup_at', 'vehicle_type', 'trip_type'] as const;
  for (const f of required) {
    if (!body[f] || String(body[f]).trim() === '') return bad(`Missing field: ${f}`);
  }

  if (!VEHICLES.includes(body.vehicle_type as VehicleKind)) return bad('Invalid vehicle_type');
  if (!TRIPS.includes(body.trip_type as TripKind)) return bad('Invalid trip_type');

  const phone = String(body.phone).replace(/\s+/g, '');
  if (!/^\+?\d{10,15}$/.test(phone)) return bad('Invalid phone number');

  const pickupAt = new Date(body.pickup_at!);
  if (isNaN(pickupAt.getTime())) return bad('Invalid pickup_at');
  if (pickupAt.getTime() < Date.now() - 5 * 60 * 1000) return bad('Pickup time is in the past');

  const passengers = Number(body.passengers) || 1;
  if (passengers < 1 || passengers > 60) return bad('Passengers must be 1-60');

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('bookings')
    .insert({
      customer_name: String(body.customer_name).trim(),
      phone,
      email: body.email?.trim() || null,
      pickup: String(body.pickup).trim(),
      drop_location: String(body.drop_location).trim(),
      pickup_at: pickupAt.toISOString(),
      return_at: body.return_at ? new Date(body.return_at).toISOString() : null,
      vehicle_type: body.vehicle_type,
      trip_type: body.trip_type,
      passengers,
      notes: body.notes?.trim() || null,
    })
    .select('id')
    .single();

  if (error) {
    console.error('booking insert failed', error);
    return bad('Could not save booking. Please try again.', 500);
  }

  return NextResponse.json({ id: data.id, ok: true }, { status: 201 });
}
