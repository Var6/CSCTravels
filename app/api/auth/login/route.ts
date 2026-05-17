import { NextRequest } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import User from '@/lib/models/User'
import { signToken, jsonResponse, errorResponse, corsHeaders } from '@/lib/auth'

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() })
}

export async function POST(req: NextRequest) {
  try {
    await connectDB()

    const body = await req.json()
    const { identifier, password } = body // identifier = email or phone

    if (!identifier || !password) {
      return errorResponse('Email/phone and password are required')
    }

    const isEmail = identifier.includes('@')
    const query = isEmail ? { email: identifier.toLowerCase() } : { phone: identifier }

    const user = await User.findOne(query).select('+password')
    if (!user) {
      return errorResponse('Invalid credentials', 401)
    }

    if (!user.isActive) {
      return errorResponse('Account is deactivated. Contact support.', 403)
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return errorResponse('Invalid credentials', 401)
    }

    const token = signToken({ userId: user._id.toString(), role: user.role })

    return jsonResponse({
      success: true,
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isActive: user.isActive,
        isVerified: user.isVerified,
      },
    })
  } catch (err) {
    console.error('[login]', err)
    return errorResponse('Server error', 500)
  }
}
