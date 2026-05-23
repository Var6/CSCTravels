import { NextRequest } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Customer from '@/lib/models/Customer'
import Trip from '@/lib/models/Trip'
import { getAuthUser, jsonResponse, errorResponse, corsHeaders } from '@/lib/auth'

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() })
}

// DELETE /api/account/delete
// Permanently removes the signed-in customer, anonymises any ongoing/completed
// trips (so financial records remain intact for billing/legal retention), and
// invalidates the session by deleting the auth cookie.
export async function DELETE(req: NextRequest) {
  try {
    const auth = getAuthUser(req)
    if (!auth) return errorResponse('Unauthorized', 401)

    await connectDB()
    const customer = await Customer.findById(auth.customerId)
    if (!customer) return errorResponse('Customer not found', 404)

    // Anonymise trips rather than deleting (financial records).
    await Trip.updateMany(
      { 'customer.id': customer._id },
      { $set: { 'customer.name': 'Deleted user', 'customer.phone': '' } }
    )

    await Customer.deleteOne({ _id: customer._id })

    const res = jsonResponse({ success: true, message: 'Account deleted' })
    res.headers.append(
      'Set-Cookie',
      'token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0'
    )
    return res
  } catch (err) {
    console.error('[account delete]', err)
    return errorResponse('Server error', 500)
  }
}
