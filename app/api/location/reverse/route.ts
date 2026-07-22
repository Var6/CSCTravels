import { NextRequest } from 'next/server'
import { jsonResponse, errorResponse, corsHeaders } from '@/lib/auth'
import { reverseGeocode } from '@/lib/geoServices'

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() })
}

/**
 * GET /api/location/reverse?lat=25.5941&lng=85.1376
 *
 * Turns the browser's coordinates into an address for the "use my location"
 * button. Google Geocoding when a server key is set, Nominatim otherwise.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const latRaw = searchParams.get('lat')
    const lngRaw = searchParams.get('lng')

    if (!latRaw || !lngRaw) return errorResponse('lat and lng query params are required')

    const lat = parseFloat(latRaw)
    const lng = parseFloat(lngRaw)
    if (!Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) {
      return errorResponse('lat and lng must be valid coordinates')
    }

    const place = await reverseGeocode(lat, lng)
    if (!place) return errorResponse('Location not found', 404)

    return jsonResponse({
      success: true,
      location: { address: place.address, name: place.name, lat, lng },
    })
  } catch (err) {
    console.error('[reverse geocode]', err)
    return errorResponse('Server error', 500)
  }
}
