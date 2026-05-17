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
    console.error('[me]', err)
    return errorResponse('Server error', 500)
  }
}
