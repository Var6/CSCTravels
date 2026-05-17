import { NextRequest } from 'next/server'
import { jsonResponse, errorResponse, corsHeaders } from '@/lib/auth'

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() })
}

// GET /api/location/reverse?lat=25.5941&lng=85.1376
// Reverse geocode coordinates → address using Nominatim
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const lat = searchParams.get('lat')
    const lng = searchParams.get('lng')

    if (!lat || !lng) return errorResponse('lat and lng query params are required')

    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'CSCTravels/1.0 (booking@csctravels.com)',
        'Accept-Language': 'en',
      },
    })

    if (!res.ok) return errorResponse('Reverse geocoding service unavailable', 502)

    const data = await res.json()

    if (data.error) return errorResponse('Location not found', 404)

    return jsonResponse({
      success: true,
      location: {
        address: data.display_name,
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        details: data.address,
      },
    })
  } catch (err) {
    console.error('[reverse geocode]', err)
    return errorResponse('Server error', 500)
  }
}
