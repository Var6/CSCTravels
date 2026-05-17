import { NextRequest } from 'next/server'
import { jsonResponse, errorResponse, corsHeaders } from '@/lib/auth'

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() })
}

// GET /api/location/geocode?address=Patna+Railway+Station
// Uses OpenStreetMap Nominatim — free, no API key required
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const address = searchParams.get('address')

    if (!address) return errorResponse('address query param is required')

    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&addressdetails=1&limit=5&countrycodes=in`

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'CSCTravels/1.0 (booking@csctravels.com)',
        'Accept-Language': 'en',
      },
    })

    if (!res.ok) return errorResponse('Geocoding service unavailable', 502)

    const data = await res.json()

    const results = data.map((item: Record<string, unknown>) => ({
      address: item.display_name,
      lat: parseFloat(item.lat as string),
      lng: parseFloat(item.lon as string),
      type: item.type,
      importance: item.importance,
    }))

    return jsonResponse({ success: true, results })
  } catch (err) {
    console.error('[geocode]', err)
    return errorResponse('Server error', 500)
  }
}
