/* ─────────────────────────────────────────────────────────────
   CSC Travels — Fare Rules (shared: API + client)
   ─────────────────────────────────────────────────────────────
   Implements the circular "Fare Structure for Intracity and Outstation
   Travel" issued by CSC Travels Services Pvt. Ltd.

     Intracity one-way    ₹20/km  +  empty return leg at ₹8.5/km
     Intracity round trip entire journey distance at ₹20/km
     Outstation           ₹12/km hatchback, ₹14/km sedan
     8-hour package       vehicle only; excludes driver, fuel, toll, parking

     Discounts apply to the BASE FARE only — 10% cooperative members,
     25% official/employee travel. Toll, parking and night stay are billed
     on actuals and sit outside the discount.

   These functions are pure: they take a RateCard (see lib/rateCard.ts, which
   pulls the live card from CSCBilling) so the website, the rider app and the
   driver app all price identically off one published source.

   REPLACES the previous "< 40 km → ₹20/km, ≥ 40 km → ₹12/km + ₹100 fuel
   surcharge" rule, which did not match the circular: it had no empty-return
   leg, no vehicle-class split for outstation, and no member discount.
──────────────────────────────────────────────────────────────── */

import type { RateCard, RiderTier, VehicleClass } from './rateCard'

export type TripKind =
  | 'city_one_way'
  | 'city_round_trip'
  | 'outstation_one_way'
  | 'outstation_round_trip'
  | 'hourly'

/** Legacy wire values still accepted by /api/rides. */
export type TripType = 'one_way' | 'round_trip'

export const TRIP_LABELS: Record<TripKind, string> = {
  city_one_way: 'City · One-way',
  city_round_trip: 'City · Round trip',
  outstation_one_way: 'Outstation · One-way',
  outstation_round_trip: 'Outstation · Round trip',
  hourly: '8 Hour Package',
}

export const isOutstation = (t: TripKind) => t.startsWith('outstation')
export const isRoundTrip = (t: TripKind) => t.endsWith('round_trip')

/** Maps the old two-value tripType onto the current kinds. */
export function toTripKind(tripType: string | undefined, outstation = false): TripKind {
  if (tripType === 'round_trip') return outstation ? 'outstation_round_trip' : 'city_round_trip'
  if (tripType === 'hourly') return 'hourly'
  return outstation ? 'outstation_one_way' : 'city_one_way'
}

export interface FareLine {
  label: string
  detail?: string
  amount: number
}

export interface FareBreakdown {
  tripKind: TripKind
  /** Road distance one way, km. */
  oneWayKm: number
  /** Distance actually charged (doubled for round trips). */
  chargedKm: number
  baseLines: FareLine[]
  baseFare: number
  discountLabel: string
  discountPct: number
  discountAmount: number
  extraLines: FareLine[]
  extrasTotal: number
  totalFare: number
  minimumApplied: boolean
  notes: string[]
}

export interface FareInput {
  oneWayKm: number
  tripKind: TripKind
  vehicle?: VehicleClass
  tier?: RiderTier
  tollAmount?: number
  parkingAmount?: number
  nightStays?: number
}

const round = (n: number) => Math.round(n)
const km = (n: number) => `${n.toFixed(1)} km`

/** Vehicle classes the card prices for a given trip kind. */
export function availableVehicles(rates: RateCard, tripKind: TripKind): VehicleClass[] {
  if (isOutstation(tripKind)) {
    return rates.vehicles.filter(v => typeof rates.outstation.perKm[v.id] === 'number').map(v => v.id)
  }
  if (tripKind === 'hourly') {
    const pkg = rates.hourly[0]
    return rates.vehicles.filter(v => typeof pkg?.price[v.id] === 'number').map(v => v.id)
  }
  return rates.vehicles.map(v => v.id)
}

export function calculateFare(rates: RateCard, input: FareInput): FareBreakdown {
  const {
    oneWayKm,
    tripKind,
    vehicle = 'hatchback',
    tier = 'public',
    tollAmount = 0,
    parkingAmount = 0,
    nightStays = 0,
  } = input

  const baseLines: FareLine[] = []
  const extraLines: FareLine[] = []
  const notes: string[] = []
  let minimumApplied = false
  let chargedKm = oneWayKm

  if (tripKind === 'hourly') {
    chargedKm = 0
    const pkg = rates.hourly[0]
    const price = pkg?.price[vehicle]
    if (pkg && typeof price === 'number') {
      baseLines.push({ label: pkg.label, detail: `${pkg.hours} hours`, amount: price })
      if (pkg.excludes.length) notes.push(`Excludes ${pkg.excludes.join(', ').toLowerCase()}.`)
    } else {
      notes.push('This package is not offered for the selected vehicle.')
    }
  } else if (isOutstation(tripKind)) {
    const perKm = rates.outstation.perKm[vehicle]
    chargedKm = isRoundTrip(tripKind) ? oneWayKm * 2 : oneWayKm
    if (typeof perKm === 'number') {
      baseLines.push({
        label: isRoundTrip(tripKind) ? 'Outstation — round trip' : 'Outstation — one-way',
        detail: `${km(chargedKm)} × ₹${perKm}`,
        amount: chargedKm * perKm,
      })
      notes.push('Charged on the vehicle meter reading at trip close.')
    } else {
      notes.push('Outstation travel is not offered for the selected vehicle.')
    }
    if (nightStays > 0) {
      extraLines.push({
        label: 'Driver night stay',
        detail: `${nightStays} × ₹${rates.outstation.nightStayCharge}`,
        amount: nightStays * rates.outstation.nightStayCharge,
      })
    }
  } else if (tripKind === 'city_round_trip') {
    chargedKm = oneWayKm * 2
    baseLines.push({
      label: 'City round trip',
      detail: `${km(chargedKm)} × ₹${rates.city.perKm}`,
      amount: chargedKm * rates.city.perKm,
    })
  } else {
    // City one-way — outbound at the full rate, plus the empty return leg.
    baseLines.push({
      label: 'City ride',
      detail: `${km(oneWayKm)} × ₹${rates.city.perKm}`,
      amount: oneWayKm * rates.city.perKm,
    })
    baseLines.push({
      label: 'Return (empty vehicle)',
      detail: `${km(oneWayKm)} × ₹${rates.city.returnEmptyPerKm}`,
      amount: oneWayKm * rates.city.returnEmptyPerKm,
    })
  }

  let baseFare = round(baseLines.reduce((s, l) => s + l.amount, 0))

  if (!isOutstation(tripKind) && tripKind !== 'hourly' && baseFare > 0 && baseFare < rates.city.minFare) {
    baseFare = rates.city.minFare
    minimumApplied = true
  }

  const tierCfg = rates.discounts[tier] ?? rates.discounts.public
  const discountPct = tierCfg?.pct ?? 0
  const discountAmount = round((baseFare * discountPct) / 100)
  if (discountPct > 0 && tierCfg.proof) notes.push(`${tierCfg.proof}.`)

  if (tollAmount > 0) extraLines.push({ label: 'Toll tax', detail: 'on actuals', amount: tollAmount })
  if (parkingAmount > 0) extraLines.push({ label: 'Parking', detail: 'on actuals', amount: parkingAmount })

  const extrasTotal = round(extraLines.reduce((s, l) => s + l.amount, 0))

  return {
    tripKind,
    oneWayKm,
    chargedKm: parseFloat(chargedKm.toFixed(1)),
    baseLines: baseLines.map(l => ({ ...l, amount: round(l.amount) })),
    baseFare,
    discountLabel: tierCfg?.label ?? 'Regular',
    discountPct,
    discountAmount,
    extraLines,
    extrasTotal,
    totalFare: baseFare - discountAmount + extrasTotal,
    minimumApplied,
    notes: [...notes, ...rates.notes],
  }
}

export const formatINR = (n: number) =>
  '₹' + Math.round(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })
