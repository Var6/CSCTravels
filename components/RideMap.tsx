'use client'

import { useEffect, useRef, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface Props {
  pickup:      { address: string; lat: number; lng: number } | null
  dropoff:     { address: string; lat: number; lng: number } | null
  routeCoords: [number, number][] | null
}

/* Safely fit/pan the map — guards against unmount races */
function FitBounds({ pickup, dropoff, routeCoords }: Props) {
  const map = useMap()
  const mounted = useRef(true)

  useEffect(() => {
    mounted.current = true
    return () => { mounted.current = false }
  }, [])

  useEffect(() => {
    if (!mounted.current) return
    try {
      if (routeCoords && routeCoords.length > 1) {
        map.fitBounds(L.latLngBounds(routeCoords), { padding: [40, 40] })
      } else if (pickup && dropoff) {
        map.fitBounds([[pickup.lat, pickup.lng], [dropoff.lat, dropoff.lng]], { padding: [60, 60] })
      } else if (pickup) {
        map.setView([pickup.lat, pickup.lng], 14)
      } else if (dropoff) {
        map.setView([dropoff.lat, dropoff.lng], 14)
      }
    } catch {
      /* map already unmounted — ignore */
    }
  }, [pickup, dropoff, routeCoords, map])

  return null
}

export default function RideMap({ pickup, dropoff, routeCoords }: Props) {
  const center: [number, number] = [25.5941, 85.1376]

  /* Fix Leaflet default icon paths (webpack breaks them) */
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (L.Icon.Default.prototype as any)._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    })
  }, [])

  /* Create icons lazily so Leaflet's pane system is ready */
  const pickupIcon = useMemo(() => L.divIcon({
    className: '',
    html: `<div style="background:#f97316;width:16px;height:16px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.35)"></div>`,
    iconSize:   [16, 16],
    iconAnchor: [8, 8],
  }), [])

  const dropoffIcon = useMemo(() => L.divIcon({
    className: '',
    html: `<div style="background:#ef4444;width:16px;height:16px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.35)"></div>`,
    iconSize:   [16, 16],
    iconAnchor: [8, 8],
  }), [])

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ width: '100%', height: '100%' }}
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {pickup && (
        <Marker position={[pickup.lat, pickup.lng]} icon={pickupIcon}>
          <Popup>{pickup.address.split(',').slice(0, 2).join(',')}</Popup>
        </Marker>
      )}

      {dropoff && (
        <Marker position={[dropoff.lat, dropoff.lng]} icon={dropoffIcon}>
          <Popup>{dropoff.address.split(',').slice(0, 2).join(',')}</Popup>
        </Marker>
      )}

      {routeCoords && routeCoords.length > 1 && (
        <Polyline
          positions={routeCoords}
          pathOptions={{ color: '#f97316', weight: 5, opacity: 0.85 }}
        />
      )}

      <FitBounds pickup={pickup} dropoff={dropoff} routeCoords={routeCoords} />
    </MapContainer>
  )
}
