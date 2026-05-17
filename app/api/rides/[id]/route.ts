import { NextRequest } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Ride from '@/lib/models/Ride'
import { getAuthUser, jsonResponse, errorResponse, corsHeaders } from '@/lib/auth'

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() })
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = getAuthUser(req)
    if (!auth) return errorResponse('Unauthorized', 401)

    await connectDB()
    const { id } = await params
    const ride = await Ride.findById(id)
      .populate('userId', 'name phone')
      .populate('driverId', 'vehicleNumber vehicleModel vehicleType')

    if (!ride) return errorResponse('Ride not found', 404)

    // Users can only see their own rides
    if (auth.role === 'user' && ride.userId._id.toString() !== auth.userId) {
      return errorResponse('Forbidden', 403)
    }

    return jsonResponse({ success: true, ride })
  } catch (err) {
    console.error('[ride GET]', err)
    return errorResponse('Server error', 500)
  }
}

// PUT /api/rides/[id] — driver accepts ride or updates status
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = getAuthUser(req)
    if (!auth) return errorResponse('Unauthorized', 401)

    await connectDB()
    const { id } = await params
    const body = await req.json()
    const { action, rating, feedback } = body

    const ride = await Ride.findById(id)
    if (!ride) return errorResponse('Ride not found', 404)

    if (action === 'accept' && auth.role === 'driver') {
      if (ride.status !== 'pending') return errorResponse('Ride is not available')
      ride.driverId = auth.userId as unknown as typeof ride.driverId
      ride.status = 'accepted'
    } else if (action === 'start' && auth.role === 'driver') {
      if (ride.status !== 'accepted') return errorResponse('Ride must be accepted first')
      ride.status = 'in_progress'
      ride.startedAt = new Date()
    } else if (action === 'complete' && auth.role === 'driver') {
      if (ride.status !== 'in_progress') return errorResponse('Ride is not in progress')
      ride.status = 'completed'
      ride.completedAt = new Date()
      ride.paymentStatus = 'paid'
    } else if (action === 'rate' && auth.role === 'user') {
      if (ride.status !== 'completed') return errorResponse('Can only rate completed rides')
      if (rating < 1 || rating > 5) return errorResponse('Rating must be between 1 and 5')
      ride.rating = rating
      if (feedback) ride.feedback = feedback
    } else {
      return errorResponse('Invalid action or insufficient permissions')
    }

    await ride.save()
    return jsonResponse({ success: true, message: `Ride ${action} successful`, ride })
  } catch (err) {
    console.error('[ride PUT]', err)
    return errorResponse('Server error', 500)
  }
}
