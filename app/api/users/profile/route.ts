import { NextRequest } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import User from '@/lib/models/User'
import { getAuthUser, jsonResponse, errorResponse, corsHeaders } from '@/lib/auth'

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() })
}

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthUser(req)
    if (!auth) return errorResponse('Unauthorized', 401)

    await connectDB()
    const user = await User.findById(auth.userId)
    if (!user) return errorResponse('User not found', 404)

    return jsonResponse({ success: true, user })
  } catch (err) {
    console.error('[profile GET]', err)
    return errorResponse('Server error', 500)
  }
}

export async function PUT(req: NextRequest) {
  try {
    const auth = getAuthUser(req)
    if (!auth) return errorResponse('Unauthorized', 401)

    await connectDB()
    const body = await req.json()

    // Fields the user is allowed to update
    const allowed = ['name', 'phone', 'address', 'emergencyContact', 'avatar']
    const updates: Record<string, string> = {}
    for (const key of allowed) {
      if (body[key] !== undefined) updates[key] = body[key]
    }

    const user = await User.findByIdAndUpdate(
      auth.userId,
      { $set: updates },
      { new: true, runValidators: true }
    )

    if (!user) return errorResponse('User not found', 404)

    return jsonResponse({ success: true, message: 'Profile updated', user })
  } catch (err) {
    console.error('[profile PUT]', err)
    return errorResponse('Server error', 500)
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const auth = getAuthUser(req)
    if (!auth) return errorResponse('Unauthorized', 401)

    await connectDB()
    const user = await User.findByIdAndUpdate(auth.userId, { isActive: false }, { new: true })
    if (!user) return errorResponse('User not found', 404)

    return jsonResponse({ success: true, message: 'Account deactivated successfully' })
  } catch (err) {
    console.error('[profile DELETE]', err)
    return errorResponse('Server error', 500)
  }
}
