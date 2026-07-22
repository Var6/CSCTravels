import { NextRequest } from 'next/server'
import mongoose from 'mongoose'
import { connectDB } from '@/lib/mongodb'
import Customer from '@/lib/models/Customer'
import Trip from '@/lib/models/Trip'
import { calculateFare, toTripKind, type TripKind } from '@/lib/fareUtils'
import { getRateCard, type RiderTier, type VehicleClass } from '@/lib/rateCard'
import { routeBetween, haversineKm, looksOutstation } from '@/lib/geoServices'
import { getAuthUser, jsonResponse, errorResponse, corsHeaders } from '@/lib/auth'

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() })
}

function generateOtp(): string {
  return Math.floor(1000 + Math.random() * 9000).toString()
}

// Map a Trip document to the wire shape the existing Booking UI expects.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toRide(t: any) {
  return {
    _id: t._id,
    tripNumber: t.tripNumber,
    pickup: { address: t.route?.pickup ?? '' },
    dropoff: { address: t.route?.dropoff ?? '' },
    vehicleType: 'cab',
    status: t.status === 'ongoing'  ? 'in_progress'
          : t.status === 'accepted' ? 'accepted'
          : t.status === 'pending'  ? 'pending'
          : t.status,
    fare: t.charges?.totalFare ?? 0,
    distance: t.odometer?.totalKm ?? t.charges?.distanceCost
                ? Math.round(((t.charges?.distanceCost ?? 0) / Math.max(1, t.charges?.costPerKm ?? 20)) * 10) / 10
                : 0,
    otp: t.otp ?? '',
    paymentMode: t.payment?.method ?? 'cash',
    paymentStatus: t.payment?.status ?? 'pending',
    scheduledAt: t.timing?.tripDate,
    createdAt: t.createdAt,
    driver: t.driver?.driverId ? {
      name: t.driver.name,
      phone: t.driver.phone,
      vehicleNumber: t.vehicle?.plate,
      vehicleModel:  t.vehicle?.model,
    } : null,
  }
}

// GET /api/rides — list rides for the signed-in customer
export async function GET(req: NextRequest) {
  try {
    const auth = getAuthUser(req)
    if (!auth) return errorResponse('Unauthorized', 401)
    await connectDB()

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const page   = Math.max(1, parseInt(searchParams.get('page')  || '1'))
    const limit  = Math.min(50, parseInt(searchParams.get('limit') || '10'))
    const skip   = (page - 1) * limit

    const filter: Record<string, unknown> = { 'customer.id': auth.customerId }
    if (status) filter.status = status === 'in_progress' ? 'ongoing' : status

    const [trips, total] = await Promise.all([
      Trip.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Trip.countDocuments(filter),
    ])

    return jsonResponse({
      success: true,
      rides: trips.map(toRide),
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    })
  } catch (err) {
    console.error('[rides GET]', err)
    return errorResponse('Server error', 500)
  }
}

// POST /api/rides — customer requests a new ride (writes a pending Trip)
export async function POST(req: NextRequest) {
  try {
    const auth = getAuthUser(req)
    if (!auth) return errorResponse('Unauthorized', 401)
    await connectDB()

    const body = await req.json()
    const { pickup, dropoff, tripType = 'one_way', paymentMode = 'cash', scheduledAt } = body

    if (!pickup?.address  || pickup?.lat  == null || pickup?.lng  == null)
      return errorResponse('Valid pickup location is required')
    if (!dropoff?.address || dropoff?.lat == null || dropoff?.lng == null)
      return errorResponse('Valid dropoff location is required')

    const customer = await Customer.findById(auth.customerId)
    if (!customer) return errorResponse('Customer not found', 404)

    const from = { lat: Number(pickup.lat),  lng: Number(pickup.lng)  }
    const to   = { lat: Number(dropoff.lat), lng: Number(dropoff.lng) }

    /*
     * Bill on ROAD distance, recomputed here.
     *
     * This previously used a straight-line haversine while the booking page
     * quoted the customer an OSRM road distance — so the price shown and the
     * price charged disagreed by 20-40% on every city ride. Recomputing here
     * rather than trusting body.distanceKm keeps the server authoritative
     * without reintroducing that gap.
     */
    const routed = await routeBetween(from, to)
    const oneWayKm = routed?.distanceKm ?? haversineKm(from, to)

    /*
     * Record which engine produced the distance this fare was billed on.
     *
     * routeBetween degrades silently: Google Routes -> legacy Directions ->
     * OSRM -> straight line. Those disagree by enough to matter when the fare
     * is per kilometre, and without this the books cannot tell a Google-priced
     * ride from an OSRM-priced one after the fact. During a pilot that is the
     * difference between usable pricing data and unusable pricing data.
     */
    const distanceSource = routed?.source ?? 'haversine'
    if (!routed) {
      console.warn('[rides] routing unavailable, fell back to straight-line distance')
    } else if (routed.source === 'osrm') {
      console.warn(
        '[rides] priced on OSRM, not Google — enable the Routes API on the ' +
        'Google Cloud project so fares match the quoted distance',
      )
    }

    // The customer picks a trip type; whether it is an outstation run is a fact
    // about the destination, so it is derived rather than trusted from input.
    const outstation = looksOutstation(to)
    const tripKind: TripKind = body.tripKind ?? toTripKind(tripType, outstation)

    const rates = await getRateCard()
    const breakdown = calculateFare(rates, {
      oneWayKm,
      tripKind,
      vehicle: (body.vehicle as VehicleClass) ?? 'hatchback',
      tier: (body.riderTier as RiderTier) ?? 'public',
    })

    const companyIdRaw = auth.companyId ?? process.env.PUBLIC_COMPANY_ID
    if (!companyIdRaw) {
      return errorResponse(
        'PUBLIC_COMPANY_ID env var not set — cannot create a tenanted booking.',
        500,
      )
    }

    const pickupAt = scheduledAt ? new Date(scheduledAt) : new Date()
    const otp = generateOtp()

    const trip = await Trip.create({
      companyId: new mongoose.Types.ObjectId(companyIdRaw),
      source: 'web',
      // Provenance of the billed distance — see the note above.
      distanceSource,
      distanceKm: oneWayKm,
      customer: { id: customer._id, name: customer.name, phone: customer.phone },
      route: {
        pickup: pickup.address,
        dropoff: dropoff.address,
        // Storing coordinates is what lets a web booking reach a driver:
        // CSCBilling's dispatch sweep picks up any pending trip that has a
        // pickupPoint and offers it to the nearest on-duty drivers. Without
        // these the booking is still created, but staff must assign it by hand.
        pickupPoint: { type: 'Point', coordinates: [from.lng, from.lat] },
        dropPoint:   { type: 'Point', coordinates: [to.lng, to.lat] },
        estimatedKm: oneWayKm,
      },
      timing: {
        tripDate:  pickupAt,
        startTime: pickupAt.toISOString().slice(11, 16), // "HH:MM"
      },
      charges: {
        costPerKm:    rates.city.perKm,
        distanceCost: breakdown.baseFare,
        discount:     breakdown.discountAmount,
        subtotal:     breakdown.baseFare - breakdown.discountAmount,
        totalFare:    breakdown.totalFare,
      },
      pricing: {
        tripKind,
        riderTier:     (body.riderTier as RiderTier) ?? 'public',
        rateVersion:   rates.version,
        estimatedFare: breakdown.totalFare,
      },
      payment: { method: paymentMode, status: 'pending' },
      status:  'pending',
      otp,
      notes: body.notes ? String(body.notes) : undefined,
    })

    return jsonResponse({
      success: true,
      message: 'Ride requested successfully',
      ride: { ...toRide(trip.toObject()), distance: oneWayKm, otp },
      fare: breakdown,
      distanceSource,
    }, 201)
  } catch (err) {
    console.error('[rides POST]', err)
    return errorResponse(err instanceof Error ? err.message : 'Server error', 500)
  }
}
