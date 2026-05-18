import { jsonResponse, corsHeaders } from '@/lib/auth'

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() })
}

// Nearby-driver lookup is not wired in the current CSCBilling-aligned schema
// (drivers don't store geo location yet). Returns an empty list for compat
// with callers; the dispatch dashboard at app.csctravels.com assigns drivers
// manually for now.
export async function GET() {
  return jsonResponse({ success: true, count: 0, drivers: [] })
}
