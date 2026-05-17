import { NextRequest } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Ride from '@/lib/models/Ride'
import { getAuthUser, jsonResponse, errorResponse, corsHeaders } from '@/lib/auth'

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() })
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = getAuthUser(req)
    if (!auth) return errorResponse('Unauthorized', 401)

    await connectDB()
    const { id } = await params
    const body = await req.json().catch(() => ({}))
    const { reason } = body

    const ride = await Ride.findById(id)
    if (!ride) return errorResponse('Ride not found', 404)

    // User can cancel their own ride; driver/admin can cancel any
    if (auth.role === 'user' && ride.userId.toString() !== auth.userId) {
      return errorResponse('Forbidden', 403)
    }

    if (['completed', 'cancelled'].includes(ride.status)) {
      return errorResponse(`Cannot cancel a ${ride.status} ride`)
    }

    ride.status = 'cancelled'
    ride.cancelReason = reason || 'Cancelled by user'
    await ride.save()

    return jsonResponse({ success: true, message: 'Ride cancelled', ride })
  } catch (err) {
    console.error('[ride cancel]', err)
    return errorResponse('Server error', 500)
  }
}
