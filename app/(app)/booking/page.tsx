'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import Image from 'next/image'
import {
  MapPin, Navigation, Loader2, CheckCircle2, Clock,
  Car, LogOut, IndianRupee, Wallet, CreditCard,
  AlertCircle, X, ChevronRight, Phone,
  ArrowLeft, Star, LocateFixed, Fuel, RotateCcw,
  History, User, Lock, Edit3, Check, Eye, EyeOff,
  Mail, ShieldCheck, type LucideIcon,
} from 'lucide-react'
import { useAuth } from '@/lib/useAuth'
import { calculateFare, toTripKind, availableVehicles, type TripType, type FareBreakdown } from '@/lib/fareUtils'
import { DEFAULT_RATES, type RateCard, type RiderTier, type VehicleClass } from '@/lib/rateCard'

const RideMap = dynamic(() => import('@/components/RideMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-orange-50">
      <Loader2 size={28} className="animate-spin text-orange-400" />
    </div>
  ),
})

/* ─── Types ─── */
interface GeoResult { address: string; lat: number; lng: number }
interface Ride {
  _id: string
  pickup:  { address: string }
  dropoff: { address: string }
  vehicleType: string
  status: string
  fare: number
  distance: number
  duration: number
  otp: string
  createdAt: string
  tripType?: string
  rating?: number
}

type AppTab = 'book' | 'rides' | 'account'
type RideFilter = 'all' | 'active' | 'completed' | 'cancelled'

const STATUS_STYLE: Record<string, { dot: string; label: string; badge: string }> = {
  pending:     { dot: 'bg-amber-400',   label: 'Pending',    badge: 'bg-amber-50 text-amber-700 border-amber-200'  },
  accepted:    { dot: 'bg-blue-500',    label: 'Accepted',   badge: 'bg-blue-50 text-blue-700 border-blue-200'     },
  in_progress: { dot: 'bg-emerald-500', label: 'On the way', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  completed:   { dot: 'bg-gray-400',    label: 'Completed',  badge: 'bg-gray-50 text-gray-600 border-gray-200'     },
  cancelled:   { dot: 'bg-red-400',     label: 'Cancelled',  badge: 'bg-red-50 text-red-600 border-red-200'        },
}

/* ─── AddressInput ─── */
function AddressInput({ placeholder, value, onChange, onClear, icon }: {
  placeholder: string
  value: GeoResult | null
  onChange: (r: GeoResult) => void
  onClear: () => void
  icon: React.ReactNode
}) {
  const [query,   setQuery]   = useState(value?.address ?? '')
  const [results, setResults] = useState<GeoResult[]>([])
  const [open,    setOpen]    = useState(false)
  const [busy,    setBusy]    = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const ref   = useRef<HTMLDivElement>(null)

  useEffect(() => { if (value) setQuery(value.address) }, [value])

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  function change(val: string) {
    setQuery(val)
    if (!val) { onClear(); setResults([]); setOpen(false); return }
    if (timer.current) clearTimeout(timer.current)
    if (val.length < 3) return
    setBusy(true)
    timer.current = setTimeout(async () => {
      try {
        const res  = await fetch(`/api/location/geocode?address=${encodeURIComponent(val)}`)
        const data = await res.json()
        setResults(data.results ?? [])
        setOpen(true)
      } finally { setBusy(false) }
    }, 400)
  }

  return (
    <div ref={ref} className="relative">
      <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100 transition">
        <span className="shrink-0">{icon}</span>
        <input
          type="text" value={query}
          onChange={e => change(e.target.value)}
          onFocus={() => results.length && setOpen(true)}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none"
        />
        {busy && <Loader2 size={14} className="animate-spin text-gray-400 shrink-0" />}
        {!busy && value && (
          <button type="button" onClick={() => { onClear(); setQuery(''); setResults([]) }}>
            <X size={14} className="text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>
      {open && results.length > 0 && (
        <div className="absolute z-50 left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden max-h-56 overflow-y-auto">
          {results.map((r, i) => (
            <button key={i} type="button"
              onMouseDown={() => { onChange(r); setQuery(r.address); setOpen(false) }}
              className="w-full flex items-start gap-3 px-4 py-3 hover:bg-orange-50 border-b border-gray-50 last:border-0 text-left transition">
              <MapPin size={14} className="text-orange-400 mt-0.5 shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{r.address.split(',')[0]}</p>
                <p className="text-xs text-gray-400 truncate">{r.address.split(',').slice(1, 3).join(',')}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/* ══════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════ */
export default function BookingPage() {
  const router = useRouter()
  const { user, loading: authLoading, logout, authFetch, isLoggedIn } = useAuth()

  /* booking state */
  const [pickup,       setPickup]       = useState<GeoResult | null>(null)
  const [dropoff,      setDropoff]      = useState<GeoResult | null>(null)
  const [routeGeo,     setRouteGeo]     = useState<[number,number][] | null>(null)
  const [routeInfo,    setRouteInfo]    = useState<{ distance: number; duration: number } | null>(null)
  const [tripType,     setTripType]     = useState<TripType>('one_way')
  // Live fare structure, published by CSCBilling. Starts from the bundled copy
  // so the first paint has prices, then swaps to the live card.
  const [rates,        setRates]        = useState<RateCard>(DEFAULT_RATES)
  const [riderTier,    setRiderTier]    = useState<RiderTier>('public')
  const [vehicle,      setVehicle]      = useState<VehicleClass>('hatchback')
  const [payMode,      setPayMode]      = useState<'cash'|'online'>('cash')
  const [loadingRoute, setLoadingRoute] = useState(false)
  const [gpsLoading,   setGpsLoading]   = useState(false)
  const [booking,      setBooking]      = useState(false)
  const [bookedRide,   setBookedRide]   = useState<Ride | null>(null)
  const [bookErr,      setBookErr]      = useState('')

  /* rides */
  const [rides,        setRides]        = useState<Ride[]>([])
  const [ridesLoading, setRidesLoading] = useState(false)
  const [rideFilter,   setRideFilter]   = useState<RideFilter>('all')

  /* tab */
  const [tab, setTab] = useState<AppTab>('book')

  /* account edit state */
  const [editName,    setEditName]    = useState(false)
  const [nameVal,     setNameVal]     = useState('')
  const [nameLoading, setNameLoading] = useState(false)
  const [nameMsg,     setNameMsg]     = useState('')

  const [editPhone,    setEditPhone]    = useState(false)
  const [phoneVal,     setPhoneVal]     = useState('')
  const [phoneLoading, setPhoneLoading] = useState(false)
  const [phoneMsg,     setPhoneMsg]     = useState('')

  const [showPwForm,   setShowPwForm]   = useState(false)
  const [pwCurrent,    setPwCurrent]    = useState('')
  const [pwNew,        setPwNew]        = useState('')
  const [pwConfirm,    setPwConfirm]    = useState('')
  const [pwLoading,    setPwLoading]    = useState(false)
  const [pwMsg,        setPwMsg]        = useState<{ ok: boolean; text: string } | null>(null)
  const [showPwCur,    setShowPwCur]    = useState(false)
  const [showPwNew,    setShowPwNew]    = useState(false)

  /* auth guard */
  useEffect(() => {
    if (!authLoading && !isLoggedIn) router.push('/login?next=/booking')
  }, [authLoading, isLoggedIn, router])

  /* route */
  useEffect(() => {
    if (!pickup || !dropoff) { setRouteInfo(null); setRouteGeo(null); return }
    setLoadingRoute(true)
    fetch(`/api/location/route?fromLat=${pickup.lat}&fromLng=${pickup.lng}&toLat=${dropoff.lat}&toLng=${dropoff.lng}`)
      .then(r => r.json())
      .then(d => {
        if (!d.success) return
        setRouteInfo({ distance: d.route.distance, duration: d.route.duration })
        setRouteGeo(d.route.geometry.coordinates.map(([lng, lat]: [number, number]) => [lat, lng]))
      })
      .catch(() => null)
      .finally(() => setLoadingRoute(false))
  }, [pickup, dropoff])

  /* fetch rides */
  const fetchRides = useCallback(async () => {
    setRidesLoading(true)
    try {
      const res  = await authFetch('/api/rides?limit=50')
      const data = await res.json()
      if (data.success) setRides(data.rides)
    } catch { /* ignore */ }
    setRidesLoading(false)
  }, [authFetch])

  useEffect(() => { if (isLoggedIn) fetchRides() }, [isLoggedIn, fetchRides])

  /* GPS */
  async function getMyLocation() {
    if (!navigator.geolocation) { alert('Geolocation not supported'); return }
    setGpsLoading(true)
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res  = await fetch(`/api/location/reverse?lat=${coords.latitude}&lng=${coords.longitude}`)
          const data = await res.json()
          if (data.success)
            setPickup({ address: data.location.address, lat: coords.latitude, lng: coords.longitude })
        } catch { /* ignore */ }
        setGpsLoading(false)
      },
      () => { alert('Allow location access to use this feature.'); setGpsLoading(false) },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  useEffect(() => {
    let alive = true
    fetch('/api/rates')
      .then(r => r.json())
      .then(d => { if (alive && d?.rates) setRates(d.rates) })
      .catch(() => { /* bundled defaults already in state */ })
    return () => { alive = false }
  }, [])

  /* book */
  // Outstation is a fact about the destination, not a choice — mirrors what
  // the server derives, so the quote and the bill agree.
  const outstation = !!dropoff && Math.abs(dropoff.lat - 25.5941) + Math.abs(dropoff.lng - 85.1376) > 0.3
  const tripKind = toTripKind(tripType, outstation)
  const vehicleChoices = rates.vehicles.filter(v => availableVehicles(rates, tripKind).includes(v.id))

  const fareBreakdown: FareBreakdown | null = routeInfo
    ? calculateFare(rates, { oneWayKm: routeInfo.distance, tripKind, vehicle, tier: riderTier })
    : null

  async function handleBook() {
    if (!pickup || !dropoff) return
    setBookErr(''); setBooking(true)
    try {
      const res  = await authFetch('/api/rides', {
        method: 'POST',
        body: JSON.stringify({ pickup, dropoff, tripType, tripKind, vehicle, riderTier, paymentMode: payMode }),
      })
      const data = await res.json()
      if (!data.success) { setBookErr(data.message || 'Booking failed'); return }
      setBookedRide(data.ride)
      fetchRides()
    } catch { setBookErr('Network error. Please try again.') }
    finally   { setBooking(false) }
  }

  /* account actions */
  async function saveName() {
    if (!nameVal.trim()) return
    setNameLoading(true); setNameMsg('')
    try {
      const res  = await authFetch('/api/users/profile', { method: 'PUT', body: JSON.stringify({ name: nameVal.trim() }) })
      const data = await res.json()
      if (data.success) {
        setNameMsg('Name updated!')
        setEditName(false)
        // update local user in auth
        if (typeof window !== 'undefined') {
          const stored = localStorage.getItem('csc_user')
          if (stored) {
            const u = JSON.parse(stored)
            localStorage.setItem('csc_user', JSON.stringify({ ...u, name: nameVal.trim() }))
          }
        }
      } else setNameMsg(data.message || 'Failed to update')
    } catch { setNameMsg('Network error') }
    setNameLoading(false)
  }

  async function savePhone() {
    if (!phoneVal.trim()) return
    setPhoneLoading(true); setPhoneMsg('')
    try {
      const res  = await authFetch('/api/users/profile', { method: 'PUT', body: JSON.stringify({ phone: phoneVal.trim() }) })
      const data = await res.json()
      setPhoneMsg(data.success ? 'Phone updated!' : (data.message || 'Failed to update'))
      if (data.success) setEditPhone(false)
    } catch { setPhoneMsg('Network error') }
    setPhoneLoading(false)
  }

  async function changePassword() {
    if (!pwCurrent || !pwNew || !pwConfirm) { setPwMsg({ ok: false, text: 'All fields required' }); return }
    if (pwNew !== pwConfirm) { setPwMsg({ ok: false, text: 'New passwords do not match' }); return }
    if (pwNew.length < 6) { setPwMsg({ ok: false, text: 'Password must be at least 6 characters' }); return }
    setPwLoading(true); setPwMsg(null)
    try {
      const res  = await authFetch('/api/users/profile/password', {
        method: 'POST',
        body: JSON.stringify({ currentPassword: pwCurrent, newPassword: pwNew }),
      })
      const data = await res.json()
      if (data.success) {
        setPwMsg({ ok: true, text: 'Password changed successfully!' })
        setPwCurrent(''); setPwNew(''); setPwConfirm('')
        setTimeout(() => setShowPwForm(false), 1500)
      } else {
        setPwMsg({ ok: false, text: data.message || 'Failed to change password' })
      }
    } catch { setPwMsg({ ok: false, text: 'Network error' }) }
    setPwLoading(false)
  }

  /* ─── loading / auth guard ─── */
  if (authLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <Loader2 size={36} className="animate-spin text-orange-500" />
    </div>
  )
  if (!isLoggedIn) return null

  const initials = user?.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() ?? '?'

  const filteredRides = rides.filter(r => {
    if (rideFilter === 'all') return true
    if (rideFilter === 'active') return ['pending','accepted','in_progress'].includes(r.status)
    if (rideFilter === 'completed') return r.status === 'completed'
    if (rideFilter === 'cancelled') return r.status === 'cancelled'
    return true
  })

  /* ════════════════════════════════════════
     RENDER
  ════════════════════════════════════════ */
  return (
    <div className="fixed inset-0 flex flex-col bg-white overflow-hidden">

      {/* ══ TOP NAVBAR ══════════════════════════════════════════════ */}
      <header className="h-14 shrink-0 flex items-center px-4 border-b border-gray-100 bg-white z-20 gap-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-xl overflow-hidden border border-orange-200">
            <Image src="/finalcitilogo.png" alt="CSC" width={32} height={32} className="w-full h-full object-cover" />
          </div>
          <span className="font-black text-gray-900 text-sm hidden sm:block">CSC Travels</span>
        </Link>

        {/* Center tabs */}
        <nav className="flex-1 flex items-center justify-center gap-1">
          {([
            ['book',    'Book a Ride', Car],
            ['rides',   'My Rides',    History],
            ['account', 'Account',     User],
          ] as [AppTab, string, LucideIcon][]).map(([id, label, Icon]) => (
            <button key={id} onClick={() => setTab(id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition ${
                tab === id
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
              }`}>
              <Icon size={14} />
              <span className="hidden sm:block">{label}</span>
            </button>
          ))}
        </nav>

        {/* User chip */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden sm:flex flex-col items-end leading-tight">
            <span className="text-xs font-bold text-gray-800">{user?.name}</span>
            <span className="text-[10px] text-gray-400 capitalize">{user?.role}</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-black text-xs shrink-0">
            {initials}
          </div>
          <button onClick={() => { logout(); router.push('/') }} title="Sign out"
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition">
            <LogOut size={15} />
          </button>
        </div>
      </header>

      {/* ══ BODY ══════════════════════════════════════════════════ */}
      <div className="flex-1 flex overflow-hidden">

        {/* ── SIDEBAR ─────────────────────────────── */}
        <aside className="w-[400px] shrink-0 flex flex-col h-full bg-white border-r border-gray-100 shadow-xl z-10 overflow-hidden">
          <div className="flex-1 overflow-y-auto">

            {/* ════ BOOK ════ */}
            {tab === 'book' && (
              <div className="p-5 space-y-4">
                {bookedRide ? (
                  /* Confirmed ride screen */
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-50 border border-green-200 flex items-center justify-center">
                        <CheckCircle2 size={22} className="text-green-500" />
                      </div>
                      <div>
                        <p className="font-black text-gray-900">Ride Confirmed!</p>
                        <p className="text-xs text-gray-400">Driver is being assigned</p>
                      </div>
                    </div>

                    <div className="bg-gray-900 rounded-2xl p-5 text-white space-y-3">
                      <RouteStop dot="bg-orange-400" label="Pickup"      value={bookedRide.pickup.address.split(',').slice(0,2).join(',')} />
                      <div className="w-px h-4 bg-gray-700 ml-[5px]" />
                      <RouteStop dot="bg-red-400"    label="Destination" value={bookedRide.dropoff.address.split(',').slice(0,2).join(',')} />
                      <div className="pt-3 border-t border-gray-700 flex items-center justify-between text-sm">
                        <span className="text-gray-400">{bookedRide.distance} km · ~{bookedRide.duration} min</span>
                        <span className="font-black text-orange-400 text-lg flex items-center gap-0.5">
                          <IndianRupee size={14}/>{bookedRide.fare}
                        </span>
                      </div>
                    </div>

                    <div className="bg-orange-50 border border-orange-200 rounded-2xl px-5 py-5 text-center">
                      <p className="text-xs text-gray-500 mb-2">Share this OTP with your driver to start the trip</p>
                      <p className="text-5xl font-black text-orange-500 tracking-[0.3em]">{bookedRide.otp}</p>
                    </div>

                    <button onClick={() => { setBookedRide(null); setPickup(null); setDropoff(null); setRouteGeo(null) }}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition">
                      <ArrowLeft size={14}/> Book another ride
                    </button>
                    <button onClick={() => setTab('rides')}
                      className="w-full py-3 rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-bold text-sm transition">
                      View in ride history
                    </button>
                  </div>

                ) : (
                  /* Booking form */
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-xl font-black text-gray-900">Where to?</h2>
                      <p className="text-xs text-gray-400 mt-0.5">Patna & outstation trips available</p>
                    </div>

                    {/* Trip type */}
                    <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
                      {(['one_way','round_trip'] as TripType[]).map(t => (
                        <button key={t} onClick={() => setTripType(t)}
                          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-bold transition ${
                            tripType === t ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-400 hover:text-gray-700'
                          }`}>
                          {t === 'round_trip' ? <RotateCcw size={12}/> : <Navigation size={12}/>}
                          {t === 'one_way' ? 'One Way' : 'Round Trip'}
                        </button>
                      ))}
                    </div>

                    {/* Address inputs */}
                    <div className="space-y-2 relative">
                      <div className="absolute left-[22px] top-12 w-px h-6 bg-gray-300 z-10" />
                      <div className="flex gap-2 items-end">
                        <div className="flex-1">
                          <AddressInput
                            placeholder="Pickup location…"
                            value={pickup} onChange={setPickup} onClear={() => setPickup(null)}
                            icon={<div className="w-2.5 h-2.5 rounded-full bg-orange-500 ring-2 ring-orange-200" />}
                          />
                        </div>
                        <button onClick={getMyLocation} disabled={gpsLoading} title="Use my current location"
                          className="shrink-0 w-11 h-11 flex items-center justify-center bg-orange-50 border border-orange-200 hover:bg-orange-100 text-orange-500 rounded-xl transition disabled:opacity-50">
                          {gpsLoading ? <Loader2 size={16} className="animate-spin"/> : <LocateFixed size={16}/>}
                        </button>
                      </div>
                      <AddressInput
                        placeholder="Where are you going?"
                        value={dropoff} onChange={setDropoff} onClear={() => setDropoff(null)}
                        icon={<MapPin size={14} className="text-red-500" />}
                      />
                    </div>

                    {/* Route info pill */}
                    {(loadingRoute || routeInfo) && (
                      <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                        {loadingRoute
                          ? <><Loader2 size={12} className="animate-spin text-orange-400"/> Calculating route…</>
                          : <><Clock size={12} className="text-orange-500"/>
                              <span className="font-bold text-gray-700">{routeInfo!.distance} km one-way</span>
                              {tripType === 'round_trip' && <span className="text-orange-500 font-bold"> · {(routeInfo!.distance*2).toFixed(1)} km total</span>}
                              <span className="text-gray-400">· ~{routeInfo!.duration} min</span></>}
                      </div>
                    )}

                    {/* Fare category — the member/employee benefit circular */}
                    <div className="space-y-1.5">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">Fare category</p>
                      <div className="flex gap-1.5">
                        {(Object.keys(rates.discounts) as RiderTier[]).map(t => {
                          const cfg = rates.discounts[t]
                          const on  = riderTier === t
                          return (
                            <button key={t} onClick={() => setRiderTier(t)}
                              className={`flex-1 py-2 px-1 rounded-lg border-2 text-center transition ${
                                on ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'
                              }`}>
                              <span className="block text-[11px] font-bold text-gray-800 truncate">{cfg.label}</span>
                              <span className={`block text-[10px] font-bold ${cfg.pct > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                                {cfg.pct > 0 ? `${cfg.pct}% off` : 'No discount'}
                              </span>
                            </button>
                          )
                        })}
                      </div>
                      {rates.discounts[riderTier].proof && (
                        <p className="text-[10px] text-gray-400">{rates.discounts[riderTier].proof}.</p>
                      )}
                    </div>

                    {/* Vehicle — outstation is priced per class, city is a flat rate */}
                    {outstation && vehicleChoices.length > 1 && (
                      <div className="space-y-1.5">
                        <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">Vehicle</p>
                        <div className="flex gap-1.5">
                          {vehicleChoices.map(v => {
                            const on = vehicle === v.id
                            return (
                              <button key={v.id} onClick={() => setVehicle(v.id)}
                                className={`flex-1 py-2 px-1 rounded-lg border-2 text-center transition ${
                                  on ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'
                                }`}>
                                <span className="block text-[11px] font-bold text-gray-800">{v.label}</span>
                                <span className="block text-[10px] text-gray-400">
                                  ₹{rates.outstation.perKm[v.id]}/km
                                </span>
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {/* Fare card */}
                    <div className="bg-gray-900 text-white rounded-2xl px-5 py-4 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                          <Car size={18} className="text-orange-400" />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-sm">CSC Cab</p>
                          <p className="text-xs text-gray-400">1–4 passengers · {tripType === 'round_trip' ? 'Round Trip' : 'One Way'}</p>
                        </div>
                        <div className="text-right">
                          {fareBreakdown
                            ? <p className="font-black text-orange-400 text-xl flex items-center gap-0.5 justify-end">
                                <IndianRupee size={14}/>{fareBreakdown.totalFare}
                              </p>
                            : <p className="text-xs text-gray-400">₹20/km</p>}
                        </div>
                      </div>
                      {fareBreakdown && (
                        <div className="border-t border-gray-700 pt-3 space-y-1.5 text-xs">
                          {/* Every line of the circular, spelled out — a one-way
                              city ride bills the outbound leg and the empty
                              return separately, so showing one blended number
                              would look like an unexplained markup. */}
                          {fareBreakdown.baseLines.map((l, i) => (
                            <FareRow key={i} label={l.detail ? `${l.label} · ${l.detail}` : l.label} value={`₹${l.amount}`} />
                          ))}
                          {fareBreakdown.minimumApplied && (
                            <FareRow label="Minimum fare applied" value={`₹${fareBreakdown.baseFare}`} />
                          )}
                          {fareBreakdown.discountAmount > 0 && (
                            <FareRow
                              icon={<ShieldCheck size={10}/>}
                              label={`${fareBreakdown.discountLabel} · ${fareBreakdown.discountPct}% off base fare`}
                              value={`− ₹${fareBreakdown.discountAmount}`}
                              highlight
                            />
                          )}
                          {fareBreakdown.extraLines.map((l, i) => (
                            <FareRow key={`x${i}`} label={l.detail ? `${l.label} · ${l.detail}` : l.label} value={`₹${l.amount}`} />
                          ))}
                          <div className="flex justify-between font-bold text-white border-t border-gray-700 pt-1.5 mt-1">
                            <span>Total</span>
                            <span className="text-orange-400 flex items-center gap-0.5"><IndianRupee size={11}/>{fareBreakdown.totalFare}</span>
                          </div>
                          <p className="text-gray-500 text-[10px] pt-0.5">
                            Estimated on {fareBreakdown.oneWayKm} km road distance. Toll and parking are
                            billed separately on actuals. Rate card {rates.version}.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Payment */}
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Payment method</p>
                      <div className="flex gap-2">
                        {(['cash','online'] as const).map(m => (
                          <button key={m} onClick={() => setPayMode(m)}
                            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl border-2 text-sm font-semibold capitalize transition ${
                              payMode === m ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'
                            }`}>
                            {m === 'cash' ? <Wallet size={14}/> : <CreditCard size={14}/>} {m}
                          </button>
                        ))}
                      </div>
                    </div>

                    {bookErr && (
                      <div className="flex gap-2 items-center bg-red-50 text-red-600 text-xs px-3 py-2.5 rounded-xl border border-red-100">
                        <AlertCircle size={13}/> {bookErr}
                      </div>
                    )}

                    <button onClick={handleBook} disabled={!pickup || !dropoff || booking}
                      className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-orange-500 hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black text-base transition shadow-lg shadow-orange-200">
                      {booking ? <Loader2 size={20} className="animate-spin"/> : <><Car size={18}/> Confirm Booking</>}
                    </button>

                    {(!pickup || !dropoff) && (
                      <p className="text-center text-xs text-gray-400">Enter pickup and destination above</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ════ RIDES ════ */}
            {tab === 'rides' && (
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-black text-gray-900">My Rides</h2>
                  <button onClick={fetchRides} title="Refresh" className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition">
                    <RotateCcw size={14}/>
                  </button>
                </div>

                {/* Filter tabs */}
                <div className="flex gap-1 p-1 bg-gray-100 rounded-xl">
                  {(['all','active','completed','cancelled'] as RideFilter[]).map(f => (
                    <button key={f} onClick={() => setRideFilter(f)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold capitalize transition ${
                        rideFilter === f ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-400 hover:text-gray-700'
                      }`}>
                      {f}
                    </button>
                  ))}
                </div>

                {ridesLoading ? (
                  <div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-orange-400"/></div>
                ) : filteredRides.length === 0 ? (
                  <div className="text-center py-16">
                    <Car size={40} className="text-gray-200 mx-auto mb-3"/>
                    <p className="text-gray-400 text-sm font-medium">No {rideFilter !== 'all' ? rideFilter : ''} rides found</p>
                    {rideFilter === 'all' && (
                      <button onClick={() => setTab('book')} className="mt-4 text-orange-500 text-sm font-bold hover:underline">
                        Book your first ride →
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredRides.map(r => {
                      const s = STATUS_STYLE[r.status] ?? STATUS_STYLE.completed
                      return (
                        <div key={r._id}
                          className="bg-white border border-gray-100 rounded-2xl p-4 hover:shadow-md hover:border-orange-100 transition">

                          {/* Status + date row */}
                          <div className="flex items-center justify-between mb-3">
                            <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${s.badge}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`}/>
                              {s.label}
                            </span>
                            <span className="text-[11px] text-gray-400">
                              {new Date(r.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}
                            </span>
                          </div>

                          {/* Route */}
                          <div className="space-y-1.5 mb-3">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-orange-500 shrink-0"/>
                              <span className="text-sm font-semibold text-gray-800 truncate">{r.pickup.address.split(',')[0]}</span>
                            </div>
                            <div className="flex items-center gap-2 pl-0.5">
                              <div className="w-px h-3 bg-gray-300 ml-[3px]"/>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin size={8} className="text-red-400 shrink-0 ml-[2px]"/>
                              <span className="text-sm text-gray-500 truncate">{r.dropoff.address.split(',')[0]}</span>
                            </div>
                          </div>

                          {/* Meta */}
                          <div className="flex items-center justify-between pt-2.5 border-t border-gray-50">
                            <div className="flex items-center gap-3 text-xs text-gray-400">
                              <span className="flex items-center gap-1"><Car size={11}/>{r.vehicleType}</span>
                              <span>{r.distance} km</span>
                              {r.tripType && <span className="capitalize">{r.tripType.replace('_',' ')}</span>}
                            </div>
                            <span className="font-black text-gray-900 flex items-center gap-0.5 text-sm">
                              <IndianRupee size={12}/>{r.fare}
                            </span>
                          </div>

                          {/* OTP for active */}
                          {['pending','accepted'].includes(r.status) && (
                            <div className="mt-3 flex items-center justify-between bg-orange-50 border border-orange-100 rounded-xl px-3 py-2">
                              <span className="text-xs text-gray-500">Driver OTP</span>
                              <span className="font-black text-orange-500 tracking-widest text-lg">{r.otp}</span>
                            </div>
                          )}

                          {/* Rating */}
                          {r.status === 'completed' && r.rating && (
                            <div className="mt-3 flex items-center gap-1 pt-2.5 border-t border-gray-50">
                              <span className="text-xs text-gray-400 mr-1">Your rating</span>
                              {[1,2,3,4,5].map(n => (
                                <Star key={n} size={13}
                                  className={n <= r.rating! ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}/>
                              ))}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ════ ACCOUNT ════ */}
            {tab === 'account' && (
              <div className="p-5 space-y-4">
                <h2 className="text-xl font-black text-gray-900">Account</h2>

                {/* Avatar card */}
                <div className="flex items-center gap-4 p-4 bg-orange-50 border border-orange-100 rounded-2xl">
                  <div className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center text-white font-black text-xl shrink-0">
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-gray-900 text-lg truncate">{user?.name}</p>
                    <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                    <span className="inline-block mt-1 text-xs font-bold bg-orange-200 text-orange-800 px-2.5 py-0.5 rounded-full capitalize">
                      {user?.role}
                    </span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                  <StatCard label="Total" value={rides.length} />
                  <StatCard label="Done"  value={rides.filter(r => r.status === 'completed').length} />
                  <StatCard label="Active" value={rides.filter(r => ['pending','accepted','in_progress'].includes(r.status)).length} />
                </div>

                {/* ── Edit Name ── */}
                <Section icon={<User size={15}/>} title="Full Name">
                  {editName ? (
                    <div className="space-y-2">
                      <input
                        type="text" value={nameVal} onChange={e => setNameVal(e.target.value)}
                        placeholder="Your full name"
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 transition"
                      />
                      {nameMsg && <p className={`text-xs ${nameMsg.includes('!') ? 'text-green-600' : 'text-red-500'}`}>{nameMsg}</p>}
                      <div className="flex gap-2">
                        <button onClick={saveName} disabled={nameLoading}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-orange-500 text-white text-xs font-bold hover:bg-orange-600 transition disabled:opacity-60">
                          {nameLoading ? <Loader2 size={13} className="animate-spin"/> : <><Check size={13}/> Save</>}
                        </button>
                        <button onClick={() => { setEditName(false); setNameMsg('') }}
                          className="flex-1 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition">
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-800 font-medium">{user?.name}</span>
                      <button onClick={() => { setNameVal(user?.name ?? ''); setEditName(true) }}
                        className="flex items-center gap-1 text-xs text-orange-500 font-bold hover:text-orange-600 transition">
                        <Edit3 size={12}/> Edit
                      </button>
                    </div>
                  )}
                </Section>

                {/* ── Email (read-only) ── */}
                <Section icon={<Mail size={15}/>} title="Email Address">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-800 font-medium">{user?.email}</span>
                    <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">read-only</span>
                  </div>
                </Section>

                {/* ── Change Phone ── */}
                <Section icon={<Phone size={15}/>} title="Phone Number">
                  {editPhone ? (
                    <div className="space-y-2">
                      <input
                        type="tel" value={phoneVal} onChange={e => setPhoneVal(e.target.value)}
                        placeholder="10-digit mobile number" maxLength={10}
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 transition"
                      />
                      {phoneMsg && <p className={`text-xs ${phoneMsg.includes('!') ? 'text-green-600' : 'text-red-500'}`}>{phoneMsg}</p>}
                      <div className="flex gap-2">
                        <button onClick={savePhone} disabled={phoneLoading}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-orange-500 text-white text-xs font-bold hover:bg-orange-600 transition disabled:opacity-60">
                          {phoneLoading ? <Loader2 size={13} className="animate-spin"/> : <><Check size={13}/> Save</>}
                        </button>
                        <button onClick={() => { setEditPhone(false); setPhoneMsg('') }}
                          className="flex-1 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition">
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-800 font-medium">{user?.phone ?? '—'}</span>
                      <button onClick={() => { setPhoneVal(user?.phone ?? ''); setEditPhone(true) }}
                        className="flex items-center gap-1 text-xs text-orange-500 font-bold hover:text-orange-600 transition">
                        <Edit3 size={12}/> Change
                      </button>
                    </div>
                  )}
                </Section>

                {/* ── Change Password ── */}
                <Section icon={<Lock size={15}/>} title="Password">
                  {showPwForm ? (
                    <div className="space-y-3">
                      <PasswordField label="Current password" value={pwCurrent} onChange={setPwCurrent}
                        show={showPwCur} onToggle={() => setShowPwCur(v=>!v)} />
                      <PasswordField label="New password" value={pwNew} onChange={setPwNew}
                        show={showPwNew} onToggle={() => setShowPwNew(v=>!v)} />
                      <div>
                        <input
                          type="password" value={pwConfirm} onChange={e => setPwConfirm(e.target.value)}
                          placeholder="Confirm new password"
                          className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 transition"
                        />
                      </div>
                      {pwMsg && (
                        <p className={`text-xs flex items-center gap-1.5 ${pwMsg.ok ? 'text-green-600' : 'text-red-500'}`}>
                          {pwMsg.ok ? <ShieldCheck size={12}/> : <AlertCircle size={12}/>} {pwMsg.text}
                        </p>
                      )}
                      <div className="flex gap-2">
                        <button onClick={changePassword} disabled={pwLoading}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-orange-500 text-white text-xs font-bold hover:bg-orange-600 transition disabled:opacity-60">
                          {pwLoading ? <Loader2 size={13} className="animate-spin"/> : <><ShieldCheck size={13}/> Update</>}
                        </button>
                        <button onClick={() => { setShowPwForm(false); setPwMsg(null); setPwCurrent(''); setPwNew(''); setPwConfirm('') }}
                          className="flex-1 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition">
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-800">••••••••</span>
                      <button onClick={() => setShowPwForm(true)}
                        className="flex items-center gap-1 text-xs text-orange-500 font-bold hover:text-orange-600 transition">
                        <Lock size={12}/> Change
                      </button>
                    </div>
                  )}
                </Section>

                {/* Links */}
                <div className="space-y-2">
                  <SidebarLink href="/privacy-policy" label="Privacy Policy" />
                  <SidebarLink href="/terms"           label="Terms of Service" />
                </div>

                {/* Sign out */}
                <button onClick={() => { logout(); router.push('/') }}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-red-100 text-red-500 font-bold text-sm hover:bg-red-50 transition">
                  <LogOut size={15}/> Sign Out
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* ── MAP ─────────────────────────────────── */}
        <div className="flex-1 h-full">
          <RideMap pickup={pickup} dropoff={dropoff} routeCoords={routeGeo} />
        </div>
      </div>
    </div>
  )
}

/* ─── Helpers ─── */
function RouteStop({ dot, label, value }: { dot: string; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${dot}`}/>
      <div>
        <p className="text-[10px] text-gray-500 uppercase tracking-wide">{label}</p>
        <p className="text-sm font-semibold text-white leading-snug">{value}</p>
      </div>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl px-3 py-3 text-center shadow-sm">
      <p className="text-2xl font-black text-orange-500">{value}</p>
      <p className="text-[11px] text-gray-400 mt-0.5">{label}</p>
    </div>
  )
}

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-orange-500">{icon}</span>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">{title}</p>
      </div>
      {children}
    </div>
  )
}

function PasswordField({ label, value, onChange, show, onToggle }: {
  label: string; value: string; onChange: (v: string) => void; show: boolean; onToggle: () => void
}) {
  return (
    <div className="relative">
      <input
        type={show ? 'text' : 'password'} value={value} onChange={e => onChange(e.target.value)}
        placeholder={label}
        className="w-full px-3 py-2.5 pr-10 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 transition"
      />
      <button type="button" onClick={onToggle}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
        {show ? <EyeOff size={14}/> : <Eye size={14}/>}
      </button>
    </div>
  )
}

function FareRow({ icon, label, value, highlight }: {
  icon?: React.ReactNode; label: string; value: string; highlight?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className={`flex items-center gap-1 ${highlight ? 'text-amber-400' : 'text-gray-400'}`}>
        {icon}{label}
      </span>
      <span className={highlight ? 'text-amber-400 font-bold' : 'text-gray-300'}>{value}</span>
    </div>
  )
}

function SidebarLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href}
      className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-gray-50 text-sm text-gray-600 hover:text-gray-900 transition border border-gray-100">
      {label} <ChevronRight size={14} className="text-gray-300"/>
    </Link>
  )
}
