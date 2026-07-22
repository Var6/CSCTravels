import { NextRequest } from 'next/server'
import { jsonResponse, errorResponse, corsHeaders } from '@/lib/auth'
import { searchPlaces } from '@/lib/geoServices'

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() })
}

/**
 * GET /api/location/geocode?address=Patna+Railway+Station
 *
 * Place search for the booking form. Google Places when GOOGLE_MAPS_SERVER_KEY
 * is set, OpenStreetMap Nominatim otherwise — see lib/geoServices.ts.
 *
 * The response shape is unchanged from the Nominatim-only version, so the
 * booking page works with either provider.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const address = searchParams.get('address')

    if (!address) return errorResponse('address query param is required')

    const places = await searchPlaces(address)

    return jsonResponse({
      success: true,
      results: places.map(p => ({
        address: p.address,
        name: p.name,
        lat: p.lat,
        lng: p.lng,
      })),
    })
  } catch (err) {
    console.error('[geocode]', err)
    return errorResponse('Server error', 500)
  }
}
