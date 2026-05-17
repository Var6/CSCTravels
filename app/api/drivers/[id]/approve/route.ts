import { NextRequest } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Driver from '@/lib/models/Driver'
import { getAuthUser, jsonResponse, errorResponse, corsHeaders } from '@/lib/auth'

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() })
}

// PUT /api/drivers/[id]/approve — admin approves or rejects a driver
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = getAuthUser(req)
    if (!auth) return errorResponse('Unauthorized', 401)
    if (auth.role !== 'admin') return errorResponse('Admin only', 403)

    await connectDB()
    const { id } = await params
    const body = await req.json()
    const { approve } = body // boolean

    const driver = await Driver.findByIdAndUpdate(
      id,
      { isApproved: Boolean(approve) },
      { new: true }
    ).populate('userId', 'name phone email')

    if (!driver) return errorResponse('Driver not found', 404)

    return jsonResponse({
      success: true,
      message: approve ? 'Driver approved' : 'Driver rejected',
      driver,
    })
  } catch (err) {
    console.error('[driver approve]', err)
    return errorResponse('Server error', 500)
  }
}
