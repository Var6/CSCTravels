import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Customer from '@/lib/models/Customer'
import { signToken, comparePassword, corsHeaders, errorResponse } from '@/lib/auth'

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() })
}

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const body = await req.json()
    // Support: { identifier, password }, { email, password }, or { phone, password }.
    const password = String(body.password ?? '')
    const raw = String(body.identifier ?? body.email ?? body.phone ?? '').trim()
    if (!raw || !password) return errorResponse('Identifier and password are required')

    const query = /@/.test(raw)
      ? { email: raw.toLowerCase() }
      : { phone: raw.replace(/\s+/g, '') }

    const customer = await Customer.findOne(query).select('+passwordHash')
    if (!customer || !customer.passwordHash) return errorResponse('Invalid credentials', 401)

    const ok = await comparePassword(password, customer.passwordHash)
    if (!ok) return errorResponse('Invalid credentials', 401)
    if (customer.status !== 'active') return errorResponse('Account is not active', 403)

    const token = signToken({
      customerId: customer._id!.toString(),
      role: 'customer',
      ...(customer.companyId ? { companyId: customer.companyId.toString() } : {}),
    })

    const res = NextResponse.json({
      success: true,
      token,
      user: {
        _id: customer._id,
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
        role: 'customer',
      },
    }, { headers: corsHeaders() })
    res.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })
    return res
  } catch (err) {
    console.error('[login]', err)
    return errorResponse('Server error', 500)
  }
}
