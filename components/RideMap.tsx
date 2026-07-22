'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

/**
 * Google Maps ride map.
 *
 * Replaces the previous Leaflet/OpenStreetMap version. Two rendering paths, in
 * order of preference:
 *
 *  1. Maps JavaScript API — pan, zoom, the real thing. Needs a *browser* key,
 *     which is a different credential from GOOGLE_MAPS_SERVER_KEY: web-service
 *     keys cannot be referrer-restricted, so shipping that one to the browser
 *     would let anyone bill the account. Set
 *     NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY, restricted to your domains.
 *
 *  2. Google Static Maps, proxied through /api/maps/static so the server key
 *     never leaves the server. Not interactive, but it is a Google map and it
 *     works with the key that is already configured.
 *
 * Props are unchanged from the Leaflet version, so callers need no edits.
 */

interface Props {
  pickup: { address: string; lat: number; lng: number } | null
  dropoff: { address: string; lat: number; lng: number } | null
  routeCoords: [number, number][] | null
}

const BROWSER_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY ?? ''
const PATNA = { lat: 25.5941, lng: 85.1376 }

/* ------------------------------------------------------------------ *
 * Script loading
 * ------------------------------------------------------------------ */

let loaderPromise: Promise<void> | null = null

/** Loads the Maps JS API once per page, however many maps mount. */
function loadGoogleMaps(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((window as any).google?.maps) return Promise.resolve()
  if (loaderPromise) return loaderPromise

  loaderPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script')
    script.src =
      `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(BROWSER_KEY)}` +
      `&libraries=geometry&loading=async&v=weekly`
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = () => {
      // Let a later mount retry rather than caching the failure forever.
      loaderPromise = null
      reject(new Error('Could not load Google Maps'))
    }
    document.head.appendChild(script)
  })

  return loaderPromise
}

/* ------------------------------------------------------------------ *
 * Polyline encoding (for the static fallback)
 * ------------------------------------------------------------------ */

/**
 * Google's polyline algorithm. Needed because a route can be hundreds of
 * points and a static map URL has a length limit — the encoded form fits where
 * a list of raw coordinates would not.
 */
function encodePolyline(points: [number, number][]): string {
  let lastLat = 0
  let lastLng = 0
  let out = ''

  const encodeValue = (value: number) => {
    let v = value < 0 ? ~(value << 1) : value << 1
    let chunk = ''
    while (v >= 0x20) {
      chunk += String.fromCharCode((0x20 | (v & 0x1f)) + 63)
      v >>= 5
    }
    chunk += String.fromCharCode(v + 63)
    return chunk
  }

  for (const [lat, lng] of points) {
    const latE5 = Math.round(lat * 1e5)
    const lngE5 = Math.round(lng * 1e5)
    out += encodeValue(latE5 - lastLat)
    out += encodeValue(lngE5 - lastLng)
    lastLat = latE5
    lastLng = lngE5
  }
  return out
}

/** Thins a dense route so the encoded path stays inside the URL limit. */
function simplify(points: [number, number][], max = 100): [number, number][] {
  if (points.length <= max) return points
  const step = Math.ceil(points.length / max)
  const out = points.filter((_, i) => i % step === 0)
  const last = points[points.length - 1]
  if (out[out.length - 1] !== last) out.push(last)
  return out
}

/* ------------------------------------------------------------------ *
 * Component
 * ------------------------------------------------------------------ */

export default function RideMap({ pickup, dropoff, routeCoords }: Props) {
  // No browser key configured, or the script failed — fall back to a Google
  // static image rather than back to OpenStreetMap.
  const [useStatic, setUseStatic] = useState(!BROWSER_KEY)

  if (useStatic) {
    return <StaticMap pickup={pickup} dropoff={dropoff} routeCoords={routeCoords} />
  }
  return (
    <InteractiveMap
      pickup={pickup}
      dropoff={dropoff}
      routeCoords={routeCoords}
      onFailure={() => setUseStatic(true)}
    />
  )
}

function InteractiveMap({
  pickup, dropoff, routeCoords, onFailure,
}: Props & { onFailure: () => void }) {
  const holder = useRef<HTMLDivElement | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const map = useRef<any>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markers = useRef<any[]>([])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const line = useRef<any>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false

    loadGoogleMaps()
      .then(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const g = (window as any).google?.maps
        if (cancelled || !holder.current || !g) return
        map.current = new g.Map(holder.current, {
          center: PATNA,
          zoom: 13,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          // Keeps the map from swallowing the page scroll on mobile.
          gestureHandling: 'cooperative',
        })
        setReady(true)
      })
      .catch(() => {
        if (!cancelled) onFailure()
      })

    return () => { cancelled = true }
  }, [onFailure])

  // Redraw markers and the route whenever the trip changes.
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const g = (window as any).google?.maps
    if (!ready || !map.current || !g) return

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    markers.current.forEach((m: any) => m.setMap(null))
    markers.current = []
    line.current?.setMap(null)
    line.current = null

    const dot = (colour: string) => ({
      path: g.SymbolPath.CIRCLE,
      scale: 8,
      fillColor: colour,
      fillOpacity: 1,
      strokeColor: '#ffffff',
      strokeWeight: 3,
    })

    const bounds = new g.LatLngBounds()
    let anyPoint = false

    if (pickup) {
      markers.current.push(new g.Marker({
        position: { lat: pickup.lat, lng: pickup.lng },
        map: map.current,
        icon: dot('#f97316'),
        title: pickup.address,
      }))
      bounds.extend({ lat: pickup.lat, lng: pickup.lng })
      anyPoint = true
    }

    if (dropoff) {
      markers.current.push(new g.Marker({
        position: { lat: dropoff.lat, lng: dropoff.lng },
        map: map.current,
        icon: dot('#ef4444'),
        title: dropoff.address,
      }))
      bounds.extend({ lat: dropoff.lat, lng: dropoff.lng })
      anyPoint = true
    }

    if (routeCoords && routeCoords.length > 1) {
      const path = routeCoords.map(([lat, lng]) => ({ lat, lng }))
      line.current = new g.Polyline({
        path,
        map: map.current,
        strokeColor: '#f97316',
        strokeOpacity: 0.85,
        strokeWeight: 5,
      })
      path.forEach((p) => bounds.extend(p))
      anyPoint = true
    }

    if (!anyPoint) return
    if (pickup && dropoff) {
      map.current.fitBounds(bounds, 60)
    } else {
      map.current.setCenter(bounds.getCenter())
      map.current.setZoom(14)
    }
  }, [ready, pickup, dropoff, routeCoords])

  // Detach overlays on unmount so a re-mount does not leave ghosts behind.
  useEffect(() => () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    markers.current.forEach((m: any) => m.setMap(null))
    line.current?.setMap(null)
  }, [])

  return <div ref={holder} style={{ width: '100%', height: '100%' }} />
}

function StaticMap({ pickup, dropoff, routeCoords }: Props) {
  const src = useMemo(() => {
    if (!pickup && !dropoff) return null
    const params = new URLSearchParams()
    if (pickup) params.set('pickup', `${pickup.lat},${pickup.lng}`)
    if (dropoff) params.set('dropoff', `${dropoff.lat},${dropoff.lng}`)
    if (routeCoords && routeCoords.length > 1) {
      params.set('path', encodePolyline(simplify(routeCoords)))
    }
    return `/api/maps/static?${params.toString()}`
  }, [pickup, dropoff, routeCoords])

  if (!src) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-neutral-100 text-neutral-500 text-sm">
        Choose a pickup point to see it on the map
      </div>
    )
  }

  return (
    <div className="relative w-full h-full bg-neutral-100">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={
          pickup && dropoff
            ? `Route from ${pickup.address} to ${dropoff.address}`
            : `Map of ${(pickup ?? dropoff)?.address ?? 'the selected location'}`
        }
        className="w-full h-full object-cover"
      />
    </div>
  )
}
