import { getRateCard } from '@/lib/rateCard'
import { jsonResponse, corsHeaders } from '@/lib/auth'

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() })
}

/**
 * GET /api/rates — the live fare structure, for the booking page.
 *
 * A thin passthrough of CSCBilling's published card (lib/rateCard.ts handles
 * the fetch, caching and fallback). The browser reads it from here rather than
 * from app.csctravels.com directly so there is one origin and one cache.
 *
 * Public: it is a published price list with no PII, and the fare preview has to
 * work before a visitor signs in.
 */
export async function GET() {
  const rates = await getRateCard()
  return jsonResponse({ success: true, rates })
}
