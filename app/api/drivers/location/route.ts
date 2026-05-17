import { NextRequest } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Driver from '@/lib/models/Driver'
import { getAuthUser, jsonResponse, errorResponse, corsHeaders } from '@/lib/auth'

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() })
}

// PUT /api/drivers/location — driver updates their GPS location
export async function PUT(req: NextRequest) {
  try {
    const auth = getAuthUser(req)
    if (!auth) return errorResponse('Unauthorized', 401)
    if (auth.role !== 'driver') return errorResponse('Only drivers can update location', 403)

    await connectDB()

    const body = await req.json()
    const { lat, lng, isAvailable } = body

    if (lat == null || lng == null) return errorResponse('lat and lng are required')
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return errorResponse('Invalid coordinates')
    }

    const update: Record<string, unknown> = {
      'location.coordinates': [lng, lat],
      'location.updatedAt': new Date(),
    }
    if (isAvailable !== undefined) update.isAvailable = Boolean(isAvailable)

    const driver = await Driver.findOneAndUpdate(
      { userId: auth.userId },
      { $set: update },
      { new: true }
    )

    if (!driver) return errorResponse('Driver profile not found', 404)

    return jsonResponse({
      success: true,
      message: 'Location updated',
      location: { lat, lng },
      isAvailable: driver.isAvailable,
    })
  } catch (err) {
    console.error('[driver location]', err)
    return errorResponse('Server error', 500)
  }
}
