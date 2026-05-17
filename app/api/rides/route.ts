import { NextRequest } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Ride, { calculateFare, generateOtp } from '@/lib/models/Ride'
import { getAuthUser, jsonResponse, errorResponse, corsHeaders } from '@/lib/auth'

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() })
}

// GET /api/rides — list rides for the authenticated user (or all for admin/driver)
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

    const filter: Record<string, unknown> = {}
    if (auth.role === 'user')   filter.userId   = auth.userId
    if (auth.role === 'driver') filter.driverId = auth.userId
    if (status) filter.status = status

    const [rides, total] = await Promise.all([
      Ride.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('userId',   'name phone')
        .populate('driverId', 'vehicleNumber vehicleModel'),
      Ride.countDocuments(filter),
    ])

    return jsonResponse({
      success: true,
      rides,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    })
  } catch (err) {
    console.error('[rides GET]', err)
    return errorResponse('Server error', 500)
  }
}

// POST /api/rides — request a new ride
export async function POST(req: NextRequest) {
  try {
    const auth = getAuthUser(req)
    if (!auth) return errorResponse('Unauthorized', 401)
    if (auth.role === 'driver') return errorResponse('Drivers cannot book rides', 403)

    await connectDB()

    const body = await req.json()
    const { pickup, dropoff, tripType = 'one_way', paymentMode, scheduledAt } = body

    if (!pickup?.address  || pickup?.lat  == null || pickup?.lng  == null)
      return errorResponse('Valid pickup location is required')
    if (!dropoff?.address || dropoff?.lat == null || dropoff?.lng == null)
      return errorResponse('Valid dropoff location is required')
    if (!['one_way', 'round_trip'].includes(tripType))
      return errorResponse('tripType must be one_way or round_trip')

    // Haversine distance (one-way, in km)
    const R    = 6371
    const dLat = ((dropoff.lat - pickup.lat) * Math.PI) / 180
    const dLng = ((dropoff.lng - pickup.lng) * Math.PI) / 180
    const a    =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((pickup.lat  * Math.PI) / 180) *
      Math.cos((dropoff.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2
    const oneWayKm = Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 10) / 10

    const breakdown        = calculateFare(oneWayKm, tripType)
    const estimatedDuration = Math.round((oneWayKm / 30) * 60) // 30 km/h avg

    const ride = await Ride.create({
      userId: auth.userId,
      pickup,
      dropoff,
      vehicleType:    'cab',
      tripType,
      distance:       oneWayKm,
      fare:           breakdown.totalFare,
      fareBreakdown:  breakdown,
      duration:       estimatedDuration,
      otp:            generateOtp(),
      paymentMode:    paymentMode || 'cash',
      ...(scheduledAt && { scheduledAt: new Date(scheduledAt) }),
    })

    return jsonResponse({ success: true, message: 'Ride requested successfully', ride }, 201)
  } catch (err) {
    console.error('[rides POST]', err)
    return errorResponse('Server error', 500)
  }
}
