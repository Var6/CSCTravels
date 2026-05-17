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
    const { name, email, phone, password, role } = body

    if (!name || !email || !phone || !password) {
      return errorResponse('name, email, phone, and password are required')
    }

    if (password.length < 6) {
      return errorResponse('Password must be at least 6 characters')
    }

    // Only allow user/driver self-registration; admin must be created by another admin
    const allowedRoles = ['user', 'driver']
    const assignedRole = allowedRoles.includes(role) ? role : 'user'

    const existing = await User.findOne({ $or: [{ email }, { phone }] })
    if (existing) {
      return errorResponse(
        existing.email === email ? 'Email already registered' : 'Phone already registered',
        409
      )
    }

    const user = await User.create({ name, email, phone, password, role: assignedRole })
    const token = signToken({ userId: user._id.toString(), role: user.role })

    return jsonResponse(
      {
        success: true,
        message: 'Registration successful',
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          isActive: user.isActive,
        },
      },
      201
    )
  } catch (err) {
    console.error('[register]', err)
    return errorResponse('Server error', 500)
  }
}
