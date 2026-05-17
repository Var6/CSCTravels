import { NextRequest } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Driver from '@/lib/models/Driver'
import User from '@/lib/models/User'
import { getAuthUser, jsonResponse, errorResponse, corsHeaders } from '@/lib/auth'

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() })
}

// GET /api/drivers — admin: all drivers; driver: own profile
export async function GET(req: NextRequest) {
  try {
    const auth = getAuthUser(req)
    if (!auth) return errorResponse('Unauthorized', 401)

    await connectDB()

    if (auth.role === 'driver') {
      const driver = await Driver.findOne({ userId: auth.userId }).populate('userId', 'name phone email')
      if (!driver) return errorResponse('Driver profile not found', 404)
      return jsonResponse({ success: true, driver })
    }

    if (auth.role !== 'admin') return errorResponse('Forbidden', 403)

    const { searchParams } = new URL(req.url)
    const isAvailable = searchParams.get('isAvailable')
    const isApproved = searchParams.get('isApproved')

    const filter: Record<string, unknown> = {}
    if (isAvailable !== null) filter.isAvailable = isAvailable === 'true'
    if (isApproved !== null) filter.isApproved = isApproved === 'true'

    const drivers = await Driver.find(filter).populate('userId', 'name phone email')
    return jsonResponse({ success: true, count: drivers.length, drivers })
  } catch (err) {
    console.error('[drivers GET]', err)
    return errorResponse('Server error', 500)
  }
}

// POST /api/drivers — driver registers their vehicle profile
export async function POST(req: NextRequest) {
  try {
    const auth = getAuthUser(req)
    if (!auth) return errorResponse('Unauthorized', 401)
    if (auth.role !== 'driver') return errorResponse('Only drivers can register a vehicle profile', 403)

    await connectDB()

    const existing = await Driver.findOne({ userId: auth.userId })
    if (existing) return errorResponse('Driver profile already exists', 409)

    const body = await req.json()
    const { vehicleType, vehicleNumber, vehicleModel, licenseNumber } = body

    if (!vehicleType || !vehicleNumber || !vehicleModel || !licenseNumber) {
      return errorResponse('vehicleType, vehicleNumber, vehicleModel, licenseNumber are required')
    }

    const driver = await Driver.create({
      userId: auth.userId,
      vehicleType,
      vehicleNumber,
      vehicleModel,
      licenseNumber,
    })

    // Ensure user role is driver
    await User.findByIdAndUpdate(auth.userId, { role: 'driver' })

    return jsonResponse({ success: true, message: 'Driver profile created. Pending approval.', driver }, 201)
  } catch (err) {
    console.error('[drivers POST]', err)
    return errorResponse('Server error', 500)
  }
}
