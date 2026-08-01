import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/mongodb';

/**
 * Live figures for the landing page.
 *
 * The page used to claim "500+ Happy Customers" — a number nobody could stand
 * behind. These come from the operating database the console runs on, so they
 * are true today and keep growing without anyone editing marketing copy:
 *
 *   rides    — duties in the daily book that actually earned money. Each is at
 *              least one ride and usually several, so the figure under-claims.
 *   drivers  — currently employed drivers.
 *   vehicles — cars on the fleet.
 *
 * Rounded down to a clean "N+" so a live number never reads as made up.
 */

export const revalidate = 3600;

const floorTo = (n: number, step: number) => Math.floor(n / step) * step;

export async function GET() {
  try {
    await connectDB();
    const db = mongoose.connection.db!;

    const [earningDuties, drivers, vehicles] = await Promise.all([
      db.collection('dailysettlements').countDocuments({ totalEarnings: { $gt: 0 } }),
      db.collection('drivers').countDocuments({ active: { $ne: false } }),
      db.collection('vehicles').countDocuments({}),
    ]);

    return NextResponse.json({
      // 573 → "550+"; small numbers are shown as they are.
      ridesLabel: earningDuties >= 100 ? `${floorTo(earningDuties, 50)}+` : String(earningDuties),
      rides: earningDuties,
      drivers,
      vehicles,
      since: 2025, // first entries in the offline invoice register
    });
  } catch (err) {
    console.error('GET /api/stats failed:', err);
    // The landing page must render regardless — it falls back to wording that
    // makes no numeric claim.
    return NextResponse.json({ error: 'unavailable' }, { status: 503 });
  }
}
