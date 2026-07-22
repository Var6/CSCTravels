import { NextRequest } from 'next/server'
import { jsonResponse, errorResponse, corsHeaders } from '@/lib/auth'
import { routeBetween } from '@/lib/geoServices'

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() })
}

/**
 * GET /api/location/route?fromLat=25.59&fromLng=85.13&toLat=25.61&toLng=85.14
 *
 * Road distance and duration for the fare preview. Google Routes API when a
 * server key is set, OSRM otherwise — see lib/geoServices.ts.
 *
 * /api/rides recomputes this server-side at booking time rather than trusting
 * the number the browser saw, so the quote and the bill agree.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const nums = ['fromLat', 'fromLng', 'toLat', 'toLng'].map(k => {
      const v = searchParams.get(k)
      return v === null ? NaN : parseFloat(v)
    })

    if (nums.some(n => !Number.isFinite(n))) {
      return errorResponse('fromLat, fromLng, toLat, toLng are required')
    }

    const [fromLat, fromLng, toLat, toLng] = nums
    const result = await routeBetween({ lat: fromLat, lng: fromLng }, { lat: toLat, lng: toLng })

    if (!result) return errorResponse('No route found', 404)

    return jsonResponse({
      success: true,
      route: {
        distance: result.distanceKm,   // km
        duration: result.durationMin,  // minutes
        geometry: { type: 'LineString', coordinates: result.geometry },
        source: result.source,
      },
    })
  } catch (err) {
    console.error('[route]', err)
    return errorResponse('Server error', 500)
  }
}
