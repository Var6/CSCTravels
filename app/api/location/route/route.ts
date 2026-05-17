import { NextRequest } from 'next/server'
import { jsonResponse, errorResponse, corsHeaders } from '@/lib/auth'

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() })
}

// GET /api/location/route?fromLat=25.59&fromLng=85.13&toLat=25.61&toLng=85.14
// Uses OSRM (Open Source Routing Machine) — free, no API key required
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const fromLat = searchParams.get('fromLat')
    const fromLng = searchParams.get('fromLng')
    const toLat = searchParams.get('toLat')
    const toLng = searchParams.get('toLng')

    if (!fromLat || !fromLng || !toLat || !toLng) {
      return errorResponse('fromLat, fromLng, toLat, toLng are required')
    }

    // OSRM public demo server — for production, host your own
    const url = `https://router.project-osrm.org/route/v1/driving/${fromLng},${fromLat};${toLng},${toLat}?overview=full&geometries=geojson&steps=true`

    const res = await fetch(url, {
      headers: { 'User-Agent': 'CSCTravels/1.0 (booking@csctravels.com)' },
    })

    if (!res.ok) return errorResponse('Routing service unavailable', 502)

    const data = await res.json()

    if (data.code !== 'Ok' || !data.routes?.length) {
      return errorResponse('No route found', 404)
    }

    const route = data.routes[0]
    const distanceKm = Math.round((route.distance / 1000) * 10) / 10
    const durationMin = Math.round(route.duration / 60)

    return jsonResponse({
      success: true,
      route: {
        distance: distanceKm,       // km
        duration: durationMin,      // minutes
        geometry: route.geometry,   // GeoJSON LineString for map rendering
        steps: route.legs[0]?.steps?.map((s: Record<string, unknown>) => ({
          instruction: (s.maneuver as Record<string, unknown>)?.type,
          name: s.name,
          distance: Math.round((s.distance as number) / 10) / 100,
          duration: Math.round((s.duration as number) / 60),
        })),
      },
    })
  } catch (err) {
    console.error('[route]', err)
    return errorResponse('Server error', 500)
  }
}
