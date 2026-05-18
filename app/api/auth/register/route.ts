import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Customer from '@/lib/models/Customer'
import { signToken, hashPassword, corsHeaders, errorResponse } from '@/lib/auth'

const PHONE_RE = /^[6-9]\d{9}$/
const EMAIL_RE = /^\S+@\S+\.\S+$/

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() })
}

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const body = await req.json()
    const name = String(body.name ?? '').trim()
    const phone = String(body.phone ?? '').replace(/\s+/g, '')
    const email = body.email ? String(body.email).trim().toLowerCase() : undefined
    const password = String(body.password ?? '')
    const address = body.address ? String(body.address).trim() : undefined
    const companyId = process.env.PUBLIC_COMPANY_ID || undefined

    if (!name) return errorResponse('Name required')
    if (!PHONE_RE.test(phone)) return errorResponse('Enter a valid 10-digit Indian mobile')
    if (email && !EMAIL_RE.test(email)) return errorResponse('Invalid email')
    if (password.length < 6) return errorResponse('Password must be at least 6 characters')

    // Claim an existing staff-created customer if phone matches and no password yet.
    let customer = await Customer.findOne({ phone }).select('+passwordHash')
    if (customer?.passwordHash) {
      return errorResponse('An account with this phone already exists. Please sign in.', 409)
    }
    if (!customer && email) {
      const byEmail = await Customer.findOne({ email })
      if (byEmail) return errorResponse('An account with this email already exists.', 409)
    }

    const passwordHash = await hashPassword(password)
    if (customer) {
      customer.name = customer.name || name
      customer.email = customer.email || email
      customer.address = customer.address || address
      customer.passwordHash = passwordHash
      if (!customer.companyId && companyId) customer.companyId = companyId as never
      await customer.save()
    } else {
      customer = await Customer.create({
        name, phone, email, address, passwordHash,
        ...(companyId ? { companyId } : {}),
      })
    }

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
    }, { status: 201, headers: corsHeaders() })
    res.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })
    return res
  } catch (err) {
    console.error('[register]', err)
    return errorResponse('Server error', 500)
  }
}
