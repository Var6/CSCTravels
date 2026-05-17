import { NextRequest } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Driver from '@/lib/models/Driver'
import { jsonResponse, errorResponse, corsHeaders } from '@/lib/auth'

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() })
}

// GET /api/location/nearby?lat=25.5941&lng=85.1376&radius=5&vehicleType=cab
// Find available drivers near a location using MongoDB 2dsphere index
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const lat = parseFloat(searchParams.get('lat') || '')
    const lng = parseFloat(searchParams.get('lng') || '')
    const radiusKm = parseFloat(searchParams.get('radius') || '5')
    const vehicleType = searchParams.get('vehicleType')

    if (isNaN(lat) || isNaN(lng)) return errorResponse('lat and lng are required')

    await connectDB()

    const filter: Record<string, unknown> = {
      isAvailable: true,
      isApproved: true,
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [lng, lat] },
          $maxDistance: radiusKm * 1000, // metres
        },
      },
    }

    if (vehicleType) filter.vehicleType = vehicleType

    const drivers = await Driver.find(filter)
      .limit(10)
      .populate('userId', 'name phone avatar')
      .select('-__v')

    return jsonResponse({
      success: true,
      count: drivers.length,
      drivers: drivers.map((d) => ({
        _id: d._id,
        vehicleType: d.vehicleType,
        vehicleNumber: d.vehicleNumber,
        vehicleModel: d.vehicleModel,
        rating: d.rating,
        totalRides: d.totalRides,
        location: {
          lat: d.location.coordinates[1],
          lng: d.location.coordinates[0],
        },
        driver: d.userId,
      })),
    })
  } catch (err) {
    console.error('[nearby]', err)
    return errorResponse('Server error', 500)
  }
}
