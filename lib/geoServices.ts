/**
 * Geocoding and routing — Google first, OpenStreetMap as fallback.
 *
 * Server-side only. GOOGLE_MAPS_SERVER_KEY is the same backend key CSCBilling
 * uses; it is a genuine secret, because Google's web-service APIs cannot be
 * restricted to an app or a referrer the way the Maps SDK keys can. It must
 * never be sent to the browser — every call here happens in a route handler.
 *
 * Google has two generations of these APIs and a project may have either
 * enabled, so each function tries the current one (Places API New / Routes API)
 * then the legacy one, then falls back to Nominatim/OSRM. With no key at all
 * the OSM path still works, which is what the site ran on before.
 *
 * Both paths are normalised to the same return shape, so callers never know
 * which one answered.
 */

const KEY = process.env.GOOGLE_MAPS_SERVER_KEY || ''
const UA = 'CSCTravels/1.0 (booking@csctravels.com)'

export const googleEnabled = () => KEY.length > 0

export interface Place {
  name: string
  address: string
  lat: number
  lng: number
}

export interface RouteResult {
  /** Road distance in km, one decimal. */
  distanceKm: number
  durationMin: number
  /** GeoJSON LineString coordinates, [lng, lat] pairs. Empty if unavailable. */
  geometry: [number, number][]
  source: 'routes_api' | 'directions_legacy' | 'osrm'
}

// ---------------------------------------------------------------------------
// Search / geocode
// ---------------------------------------------------------------------------

async function googleSearch(query: string): Promise<Place[]> {
  // Places API (New) — Text Search.
  const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': KEY,
      'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.location',
    },
    body: JSON.stringify({
      textQuery: query,
      includedRegionCodes: ['in'],
      languageCode: 'en',
      maxResultCount: 6,
    }),
    signal: AbortSignal.timeout(8000),
  })

  if (!res.ok) {
    const body = await res.json().catch(() => null)
    // Log server-side only — Google's message can name the project or key.
    console.warn('[geo] places_new searchText', res.status, body?.error?.message ?? '')
    throw new Error(`places_new ${res.status}`)
  }

  const data = await res.json()
  return (data.places ?? []).map((p: Record<string, any>) => ({
    name: p.displayName?.text ?? p.formattedAddress ?? '',
    address: p.formattedAddress ?? '',
    lat: p.location?.latitude,
    lng: p.location?.longitude,
  })).filter((p: Place) => Number.isFinite(p.lat) && Number.isFinite(p.lng))
}

async function osmSearch(query: string): Promise<Place[]> {
  const params = new URLSearchParams({
    q: query, format: 'json', limit: '6', countrycodes: 'in', addressdetails: '1',
  })
  const res = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, {
    headers: { 'User-Agent': UA, 'Accept-Language': 'en' },
    signal: AbortSignal.timeout(8000),
  })
  if (!res.ok) return []

  const data = (await res.json()) as Array<Record<string, any>>
  return data.map(d => ({
    name: String(d.display_name).split(',')[0].trim(),
    address: String(d.display_name),
    lat: parseFloat(d.lat),
    lng: parseFloat(d.lon),
  }))
}

export async function searchPlaces(query: string): Promise<Place[]> {
  const q = query.trim()
  if (q.length < 3) return []

  if (googleEnabled()) {
    try {
      const hits = await googleSearch(q)
      if (hits.length) return hits
    } catch {
      // fall through to OSM
    }
  }

  try {
    return await osmSearch(q)
  } catch (e) {
    console.error('[geo] search failed', e)
    return []
  }
}

// ---------------------------------------------------------------------------
// Reverse geocode
// ---------------------------------------------------------------------------

export async function reverseGeocode(lat: number, lng: number): Promise<Place | null> {
  if (googleEnabled()) {
    try {
      const params = new URLSearchParams({ latlng: `${lat},${lng}`, key: KEY, language: 'en' })
      const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?${params}`, {
        signal: AbortSignal.timeout(8000),
      })
      const data = await res.json()
      if (data.status === 'OK' && data.results?.length) {
        const r = data.results[0]
        return {
          name: r.formatted_address?.split(',')[0] ?? 'Selected location',
          address: r.formatted_address,
          lat, lng,
        }
      }
      if (data.status && data.status !== 'ZERO_RESULTS') {
        console.warn('[geo] google reverse', data.status, data.error_message ?? '')
      }
    } catch {
      // fall through
    }
  }

  try {
    const params = new URLSearchParams({ lat: String(lat), lon: String(lng), format: 'json' })
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?${params}`, {
      headers: { 'User-Agent': UA, 'Accept-Language': 'en' },
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) return null
    const d = await res.json()
    if (!d?.display_name) return null
    return {
      name: String(d.display_name).split(',')[0].trim(),
      address: String(d.display_name),
      lat, lng,
    }
  } catch (e) {
    console.error('[geo] reverse failed', e)
    return null
  }
}

// ---------------------------------------------------------------------------
// Routing
// ---------------------------------------------------------------------------

/** Google's encoded polyline → GeoJSON [lng, lat] pairs. */
export function decodePolyline(encoded: string): [number, number][] {
  const points: [number, number][] = []
  let index = 0, lat = 0, lng = 0

  while (index < encoded.length) {
    let shift = 0, result = 0, byte: number
    do { byte = encoded.charCodeAt(index++) - 63; result |= (byte & 0x1f) << shift; shift += 5 } while (byte >= 0x20)
    lat += result & 1 ? ~(result >> 1) : result >> 1

    shift = 0; result = 0
    do { byte = encoded.charCodeAt(index++) - 63; result |= (byte & 0x1f) << shift; shift += 5 } while (byte >= 0x20)
    lng += result & 1 ? ~(result >> 1) : result >> 1

    points.push([lng / 1e5, lat / 1e5])
  }
  return points
}

async function osrmRoute(
  from: { lat: number; lng: number },
  to: { lat: number; lng: number },
): Promise<RouteResult | null> {
  const url =
    `https://router.project-osrm.org/route/v1/driving/` +
    `${from.lng},${from.lat};${to.lng},${to.lat}?overview=full&geometries=geojson`

  const res = await fetch(url, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(10000) })
  if (!res.ok) return null

  const data = await res.json()
  const r = data.routes?.[0]
  if (data.code !== 'Ok' || !r) return null

  return {
    distanceKm: Math.round((r.distance / 1000) * 10) / 10,
    durationMin: Math.round(r.duration / 60),
    geometry: r.geometry.coordinates as [number, number][],
    source: 'osrm',
  }
}

/**
 * Road distance between two points.
 *
 * This is the number the fare is built on, so it must be road distance and not
 * a straight line — the two differ by 20-40% in a city, which is the gap
 * between the price a customer is quoted and the price they are charged.
 */
export async function routeBetween(
  from: { lat: number; lng: number },
  to: { lat: number; lng: number },
): Promise<RouteResult | null> {
  if (googleEnabled()) {
    // Routes API (current generation).
    try {
      const res = await fetch('https://routes.googleapis.com/directions/v2:computeRoutes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': KEY,
          'X-Goog-FieldMask': 'routes.distanceMeters,routes.duration,routes.polyline.encodedPolyline',
        },
        body: JSON.stringify({
          origin: { location: { latLng: { latitude: from.lat, longitude: from.lng } } },
          destination: { location: { latLng: { latitude: to.lat, longitude: to.lng } } },
          travelMode: 'DRIVE',
          routingPreference: 'TRAFFIC_AWARE',
          polylineEncoding: 'ENCODED_POLYLINE',
          regionCode: 'IN',
          languageCode: 'en',
        }),
        signal: AbortSignal.timeout(10000),
      })

      if (res.ok) {
        const data = await res.json()
        const r = data.routes?.[0]
        if (r?.distanceMeters) {
          return {
            distanceKm: Math.round((r.distanceMeters / 1000) * 10) / 10,
            durationMin: Math.round((parseInt(String(r.duration).replace('s', ''), 10) || 0) / 60),
            geometry: r.polyline?.encodedPolyline ? decodePolyline(r.polyline.encodedPolyline) : [],
            source: 'routes_api',
          }
        }
      } else {
        const body = await res.json().catch(() => null)
        console.warn('[geo] routes_api', res.status, body?.error?.message ?? '')
      }
    } catch {
      // fall through
    }

    // Legacy Directions API.
    try {
      const params = new URLSearchParams({
        origin: `${from.lat},${from.lng}`,
        destination: `${to.lat},${to.lng}`,
        mode: 'driving', region: 'in', key: KEY,
      })
      const res = await fetch(`https://maps.googleapis.com/maps/api/directions/json?${params}`, {
        signal: AbortSignal.timeout(10000),
      })
      const data = await res.json()
      if (data.status === 'OK' && data.routes?.length) {
        const r = data.routes[0]
        const legs = r.legs ?? []
        return {
          distanceKm: Math.round((legs.reduce((s: number, l: any) => s + (l.distance?.value ?? 0), 0) / 1000) * 10) / 10,
          durationMin: Math.round(legs.reduce((s: number, l: any) => s + (l.duration?.value ?? 0), 0) / 60),
          geometry: r.overview_polyline?.points ? decodePolyline(r.overview_polyline.points) : [],
          source: 'directions_legacy',
        }
      }
      if (data.status) console.warn('[geo] directions_legacy', data.status, data.error_message ?? '')
    } catch {
      // fall through
    }
  }

  try {
    return await osrmRoute(from, to)
  } catch (e) {
    console.error('[geo] routing failed', e)
    return null
  }
}

/** Straight-line km. Only a last-resort fallback when routing is unavailable. */
export function haversineKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const R = 6371
  const dLat = ((b.lat - a.lat) * Math.PI) / 180
  const dLng = ((b.lng - a.lng) * Math.PI) / 180
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2
  return Math.round(2 * R * Math.asin(Math.sqrt(s)) * 10) / 10
}

/** Patna city centre — the reference for the intracity/outstation split. */
export const CITY_CENTRE = { lat: 25.5941, lng: 85.1376 }
export const CITY_RADIUS_KM = 25

export const looksOutstation = (drop: { lat: number; lng: number }) =>
  haversineKm(CITY_CENTRE, drop) > CITY_RADIUS_KM
