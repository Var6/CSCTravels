import { NextRequest } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Customer from '@/lib/models/Customer'
import { getAuthUser, jsonResponse, errorResponse, corsHeaders } from '@/lib/auth'

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() })
}

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthUser(req)
    if (!auth) return errorResponse('Unauthorized', 401)

    await connectDB()
    const customer = await Customer.findById(auth.customerId).lean()
    if (!customer) return errorResponse('Customer not found', 404)

    return jsonResponse({
      success: true,
      user: {
        _id: customer._id,
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
        address: customer.address,
        totalRides: customer.totalRides,
        role: 'customer',
      },
    })
  } catch (err) {
    console.error('[me]', err)
    return errorResponse('Server error', 500)
  }
}
