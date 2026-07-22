/**
 * The live CSC Travels rate card, fetched from CSCBilling.
 *
 * Deliberately NOT a fourth hardcoded copy of the prices. CSCBilling publishes
 * the card at GET /api/rates and the mobile apps already read it from there, so
 * the website reads the same source. Management revises a fare in one place and
 * the website, the rider app and the driver app all follow.
 *
 * The bundled DEFAULT_RATES below is a fallback for when that fetch fails — it
 * mirrors the circular "Fare Structure for Intracity and Outstation Travel". A
 * booking must never fail because a price list was briefly unreachable.
 */

export type VehicleClass = 'hatchback' | 'sedan' | 'suv' | 'traveller' | 'bus';
export type RiderTier = 'public' | 'member' | 'official';

export interface RateCard {
  version: string;
  effectiveFrom: string;
  currency: 'INR';
  city: { perKm: number; returnEmptyPerKm: number; minKm: number; minFare: number };
  outstation: { perKm: Partial<Record<VehicleClass, number>>; nightStayCharge: number };
  hourly: Array<{
    id: string; label: string; hours: number;
    price: Partial<Record<VehicleClass, number>>;
    includes: string[]; excludes: string[];
  }>;
  discounts: Record<RiderTier, { pct: number; label: string; proof: string }>;
  vehicles: Array<{ id: VehicleClass; label: string; examples: string; seats: number }>;
  notes: string[];
}

export const DEFAULT_RATES: RateCard = {
  version: 'bundled-2026-07',
  effectiveFrom: '2026-07-01',
  currency: 'INR',
  city: { perKm: 20, returnEmptyPerKm: 8.5, minKm: 3, minFare: 100 },
  outstation: { perKm: { hatchback: 12, sedan: 14 }, nightStayCharge: 500 },
  hourly: [{
    id: 'pkg-8h', label: '8 Hours — Vehicle Only', hours: 8,
    price: { hatchback: 1400, sedan: 1600, suv: 1800 },
    includes: ['Vehicle'], excludes: ['Driver', 'Fuel', 'Toll', 'Parking'],
  }],
  discounts: {
    public: { pct: 0, label: 'Regular', proof: '' },
    member: { pct: 10, label: 'Cooperative Member', proof: 'Membership ID required at pickup' },
    official: { pct: 25, label: 'Official / Employee', proof: 'Official authorisation required; subject to management approval' },
  },
  vehicles: [
    { id: 'hatchback', label: 'Hatchback', examples: 'Swift, WagonR, i10', seats: 4 },
    { id: 'sedan', label: 'Sedan', examples: 'Dzire, Aura, Amaze', seats: 4 },
    { id: 'suv', label: 'SUV', examples: 'Ertiga, Innova', seats: 6 },
  ],
  notes: [
    'Fuel and vehicle maintenance are included in the applicable fare calculation.',
    'Toll tax, parking fees and night stay charges are billed separately on actuals.',
    'Fixed rate — no surge pricing. Final bill follows the vehicle meter reading.',
  ],
};

const BILLING_URL = process.env.BILLING_URL || 'https://app.csctravels.com';
const TTL_MS = 5 * 60 * 1000;

let cache: { card: RateCard; at: number } | null = null;

function merge(remote: Partial<RateCard>): RateCard {
  const d = DEFAULT_RATES;
  return {
    ...d,
    ...remote,
    city: { ...d.city, ...remote.city },
    outstation: {
      ...d.outstation,
      ...remote.outstation,
      perKm: { ...d.outstation.perKm, ...remote.outstation?.perKm },
    },
    hourly: remote.hourly?.length ? remote.hourly : d.hourly,
    discounts: { ...d.discounts, ...remote.discounts },
    vehicles: remote.vehicles?.length ? remote.vehicles : d.vehicles,
    notes: remote.notes?.length ? remote.notes : d.notes,
  };
}

/**
 * Server-side only. Falls back to the last good card, then to the bundled one —
 * pricing degrades, it never throws.
 */
export async function getRateCard(): Promise<RateCard> {
  if (cache && Date.now() - cache.at < TTL_MS) return cache.card;

  try {
    const res = await fetch(`${BILLING_URL}/api/rates`, {
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) throw new Error(`rates HTTP ${res.status}`);

    const json = await res.json();
    const card = merge((json?.rates ?? json) as Partial<RateCard>);
    if (!card?.city?.perKm) throw new Error('rate card missing city.perKm');

    cache = { card, at: Date.now() };
    return card;
  } catch (e) {
    console.warn('[rates] falling back:', e instanceof Error ? e.message : e);
    return cache?.card ?? DEFAULT_RATES;
  }
}
