import { NextRequest } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Trip from '@/lib/models/Trip'
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
    const reason = body?.reason ? String(body.reason) : 'Cancelled by customer'

    const trip = await Trip.findById(id)
    if (!trip) return errorResponse('Ride not found', 404)
    if (trip.customer.id.toString() !== auth.customerId) return errorResponse('Forbidden', 403)
    if (['completed', 'cancelled'].includes(trip.status))
      return errorResponse(`Cannot cancel a ${trip.status} ride`)

    trip.status = 'cancelled'
    trip.notes = trip.notes ? `${trip.notes}\nCancel reason: ${reason}` : `Cancel reason: ${reason}`
    await trip.save()

    return jsonResponse({ success: true, message: 'Ride cancelled' })
  } catch (err) {
    console.error('[ride cancel]', err)
    return errorResponse('Server error', 500)
  }
}
