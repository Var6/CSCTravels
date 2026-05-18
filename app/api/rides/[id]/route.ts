import { NextRequest } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Trip from '@/lib/models/Trip'
import { getAuthUser, jsonResponse, errorResponse, corsHeaders } from '@/lib/auth'

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() })
}

// GET /api/rides/[id] — the signed-in customer can fetch their own trip.
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = getAuthUser(req)
    if (!auth) return errorResponse('Unauthorized', 401)

    await connectDB()
    const { id } = await params
    const trip = await Trip.findById(id).lean()
    if (!trip) return errorResponse('Ride not found', 404)
    if (trip.customer.id.toString() !== auth.customerId) return errorResponse('Forbidden', 403)

    return jsonResponse({ success: true, ride: trip })
  } catch (err) {
    console.error('[ride GET]', err)
    return errorResponse('Server error', 500)
  }
}

// PUT /api/rides/[id] — customer can rate a completed trip.
// Driver actions (accept/start/complete) live in the dispatch/driver app, not here.
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = getAuthUser(req)
    if (!auth) return errorResponse('Unauthorized', 401)

    await connectDB()
    const { id } = await params
    const body = await req.json()
    const { action, rating, feedback } = body

    const trip = await Trip.findById(id)
    if (!trip) return errorResponse('Ride not found', 404)
    if (trip.customer.id.toString() !== auth.customerId) return errorResponse('Forbidden', 403)

    if (action === 'rate') {
      if (trip.status !== 'completed') return errorResponse('Can only rate completed rides')
      if (typeof rating !== 'number' || rating < 1 || rating > 5)
        return errorResponse('Rating must be between 1 and 5')
      const note = `Rating: ${rating}/5${feedback ? ` — ${String(feedback)}` : ''}`
      trip.notes = trip.notes ? `${trip.notes}\n${note}` : note
      await trip.save()
      return jsonResponse({ success: true })
    }

    return errorResponse('Invalid action')
  } catch (err) {
    console.error('[ride PUT]', err)
    return errorResponse('Server error', 500)
  }
}
