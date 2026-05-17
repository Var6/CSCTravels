import { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/mongodb'
import User from '@/lib/models/User'
import { getAuthUser, jsonResponse, errorResponse, corsHeaders } from '@/lib/auth'

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() })
}

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthUser(req)
    if (!auth) return errorResponse('Unauthorized', 401)

    const { currentPassword, newPassword } = await req.json()
    if (!currentPassword || !newPassword)
      return errorResponse('currentPassword and newPassword are required', 400)
    if (newPassword.length < 6)
      return errorResponse('New password must be at least 6 characters', 400)

    await connectDB()
    const user = await User.findById(auth.userId).select('+password')
    if (!user) return errorResponse('User not found', 404)

    const valid = await bcrypt.compare(currentPassword, user.password)
    if (!valid) return errorResponse('Current password is incorrect', 400)

    user.password = newPassword
    await user.save()

    return jsonResponse({ success: true, message: 'Password changed successfully' })
  } catch (err) {
    console.error('[password POST]', err)
    return errorResponse('Server error', 500)
  }
}
