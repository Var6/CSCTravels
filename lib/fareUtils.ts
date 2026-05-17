/* ─────────────────────────────────────────────────────────────
   CSC Travels — Fare Rules (shared: API + client)
   ─────────────────────────────────────────────────────────────
   One-way:
     < 40 km   →  ₹20/km
     ≥ 40 km   →  ₹12/km  +  ₹100 fuel surcharge

   Round-trip  (charged on total distance = one-way × 2):
     total < 80 km   →  ₹20/km
     total ≥ 80 km   →  ₹12/km  (no fuel surcharge)
──────────────────────────────────────────────────────────────── */

export const FUEL_SURCHARGE       = 100   // ₹  (one-way long trips)
export const RATE_STANDARD        = 20    // ₹/km
export const RATE_LONG            = 12    // ₹/km
export const THRESHOLD_ONE_WAY    = 40    // km
export const THRESHOLD_ROUND_TRIP = 80    // km total

export type TripType = 'one_way' | 'round_trip'

export interface FareBreakdown {
  tripType:   TripType
  oneWayKm:   number
  chargedKm:  number   // one-way or round-trip total
  ratePerKm:  number
  baseFare:   number
  fuelCharge: number
  totalFare:  number
}

export function calculateFare(oneWayKm: number, tripType: TripType): FareBreakdown {
  const chargedKm =
    tripType === 'round_trip'
      ? parseFloat((oneWayKm * 2).toFixed(1))
      : oneWayKm

  let ratePerKm: number
  let fuelCharge = 0

  if (tripType === 'round_trip') {
    ratePerKm = chargedKm >= THRESHOLD_ROUND_TRIP ? RATE_LONG : RATE_STANDARD
  } else {
    if (oneWayKm >= THRESHOLD_ONE_WAY) {
      ratePerKm  = RATE_LONG
      fuelCharge = FUEL_SURCHARGE
    } else {
      ratePerKm = RATE_STANDARD
    }
  }

  const baseFare  = Math.round(ratePerKm * chargedKm)
  const totalFare = baseFare + fuelCharge

  return { tripType, oneWayKm, chargedKm, ratePerKm, baseFare, fuelCharge, totalFare }
}
