'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  MapPin, Navigation, Loader2, CheckCircle2, Clock, Bike,
  Car, Truck, Bus, LogOut, User, ChevronDown, X, Search,
  IndianRupee, Calendar, Wallet, CreditCard, History,
  AlertCircle,
} from 'lucide-react'
import { useAuth } from '@/lib/useAuth'

/* ─── Types ─── */
interface GeoResult { address: string; lat: number; lng: number }

interface VehicleOption {
  key: string
  label: string
  desc: string
  icon: React.ReactNode
  base: number
  perKm: number
}

interface Ride {
  _id: string
  pickup: { address: string }
  dropoff: { address: string }
  vehicleType: string
  status: string
  fare: number
  distance: number
  otp: string
  createdAt: string
}

/* ─── Constants ─── */
const VEHICLES: VehicleOption[] = [
  { key: 'bike', label: 'Bike', desc: 'Solo rides, fast', icon: <Bike size={20} />, base: 20, perKm: 7 },
  { key: 'auto', label: 'Auto', desc: '1–3 passengers', icon: <Car size={18} />, base: 30, perKm: 12 },
  { key: 'cab', label: 'Cab', desc: '1–4 passengers', icon: <Car size={20} />, base: 50, perKm: 18 },
  { key: 'suv', label: 'SUV', desc: '1–6 passengers', icon: <Truck size={20} />, base: 80, perKm: 25 },
  { key: 'bus', label: 'Bus', desc: 'Group travel', icon: <Bus size={20} />, base: 200, perKm: 10 },
]

const STATUS_COLOR: Record<string, string> = {
  pending: 'text-amber-600 bg-amber-50',
  accepted: 'text-blue-600 bg-blue-50',
  in_progress: 'text-emerald-600 bg-emerald-50',
  completed: 'text-slate-600 bg-slate-100',
  cancelled: 'text-red-500 bg-red-50',
}

/* ─── Address Search Dropdown ─── */
function AddressInput({
  label, value, onChange, placeholder, icon,
}: {
  label: string
  value: GeoResult | null
  onChange: (r: GeoResult) => void
  placeholder: string
  icon: React.ReactNode
}) {
  const [query, setQuery] = useState(value?.address || '')
  const [results, setResults] = useState<GeoResult[]>([])
  const [open, setOpen] = useState(false)
  const [searching, setSearching] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (value) setQuery(value.address)
  }, [value])

  function handleChange(val: string) {
    setQuery(val)
    if (timer.current) clearTimeout(timer.current)
    if (val.length < 3) { setResults([]); setOpen(false); return }
    setSearching(true)
    timer.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/location/geocode?address=${encodeURIComponent(val)}`)
        const data = await res.json()
        setResults(data.results || [])
        setOpen(true)
      } catch { /* ignore */ }
      setSearching(false)
    }, 400)
  }

  function select(r: GeoResult) {
    onChange(r)
    setQuery(r.address)
    setOpen(false)
  }

  return (
    <div className="relative">
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2">{icon}</span>
        <input
          type="text"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => results.length && setOpen(true)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-3 rounded-xl border border-[#e9dcc3] bg-[#fffaf0] text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb]/30 focus:border-[#2563eb] transition"
        />
        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
          {searching ? <Loader2 size={15} className="animate-spin" /> : <Search size={15} />}
        </span>
      </div>

      {open && results.length > 0 && (
        <div className="absolute z-50 left-0 right-0 mt-1 surface rounded-xl shadow-xl overflow-hidden border border-[#e9dcc3]">
          {results.map((r, i) => (
            <button
              key={i}
              type="button"
              onMouseDown={() => select(r)}
              className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-[#fff8ea] border-b border-[#f5ecd8] last:border-0 transition truncate"
            >
              <span className="font-medium">{r.address.split(',')[0]}</span>
              <span className="text-xs text-slate-400 block truncate">{r.address.slice(r.address.indexOf(',') + 1)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/* ─── Main Page ─── */
export default function BookingPage() {
  const router = useRouter()
  const { user, loading: authLoading, logout, authFetch, isLoggedIn } = useAuth()

  const [pickup, setPickup] = useState<GeoResult | null>(null)
  const [dropoff, setDropoff] = useState<GeoResult | null>(null)
  const [vehicle, setVehicle] = useState('cab')
  const [paymentMode, setPaymentMode] = useState<'cash' | 'online'>('cash')
  const [schedule, setSchedule] = useState('')
  const [routeInfo, setRouteInfo] = useState<{ distance: number; duration: number } | null>(null)
  const [loadingRoute, setLoadingRoute] = useState(false)
  const [booking, setBooking] = useState(false)
  const [confirmedRide, setConfirmedRide] = useState<Ride | null>(null)
  const [bookingError, setBookingError] = useState('')
  const [rides, setRides] = useState<Ride[]>([])
  const [ridesLoading, setRidesLoading] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      router.push('/login?next=/booking')
    }
  }, [authLoading, isLoggedIn, router])

  // Fetch route when both locations set
  useEffect(() => {
    if (!pickup || !dropoff) { setRouteInfo(null); return }
    setLoadingRoute(true)
    fetch(
      `/api/location/route?fromLat=${pickup.lat}&fromLng=${pickup.lng}&toLat=${dropoff.lat}&toLng=${dropoff.lng}`
    )
      .then((r) => r.json())
      .then((d) => d.success && setRouteInfo({ distance: d.route.distance, duration: d.route.duration }))
      .catch(() => null)
      .finally(() => setLoadingRoute(false))
  }, [pickup, dropoff])

  const fetchRides = useCallback(async () => {
    setRidesLoading(true)
    try {
      const res = await authFetch('/api/rides?limit=5')
      const data = await res.json()
      if (data.success) setRides(data.rides)
    } catch { /* ignore */ }
    setRidesLoading(false)
  }, [authFetch])

  useEffect(() => {
    if (isLoggedIn) fetchRides()
  }, [isLoggedIn, fetchRides])

  const selectedVehicle = VEHICLES.find((v) => v.key === vehicle)!
  const estimatedFare = routeInfo
    ? Math.round(selectedVehicle.base + selectedVehicle.perKm * routeInfo.distance)
    : null

  async function handleBook() {
    if (!pickup || !dropoff) return
    setBookingError('')
    setBooking(true)
    try {
      const res = await authFetch('/api/rides', {
        method: 'POST',
        body: JSON.stringify({
          pickup,
          dropoff,
          vehicleType: vehicle,
          paymentMode,
          ...(schedule ? { scheduledAt: schedule } : {}),
        }),
      })
      const data = await res.json()
      if (!data.success) {
        setBookingError(data.message || 'Booking failed')
        return
      }
      setConfirmedRide(data.ride)
      fetchRides()
    } catch {
      setBookingError('Network error. Please try again.')
    } finally {
      setBooking(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen hero-grid flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-[#2563eb]" />
      </div>
    )
  }

  if (!isLoggedIn) return null

  /* ─── Booking Confirmed Screen ─── */
  if (confirmedRide) {
    return (
      <main className="min-h-screen hero-grid flex items-center justify-center px-4 py-20 relative overflow-hidden">
        <div className="pointer-events-none absolute -top-32 -left-32 w-96 h-96 rounded-full bg-emerald-300/20 blur-3xl" />
        <div className="rise-in w-full max-w-md relative z-10">
          <div className="surface rounded-3xl p-8 shadow-xl text-center">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={36} className="text-emerald-500" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-1" style={{ fontFamily: 'var(--font-sora)' }}>
              Ride Booked!
            </h2>
            <p className="text-slate-500 text-sm mb-6">Your driver will arrive shortly</p>

            <div className="bg-[#fff8ea] rounded-2xl p-5 text-left space-y-3 mb-6 border border-[#f59e0b]/20">
              <Row label="Pickup" value={confirmedRide.pickup.address.split(',').slice(0, 2).join(',')} />
              <Row label="Drop-off" value={confirmedRide.dropoff.address.split(',').slice(0, 2).join(',')} />
              <Row label="Vehicle" value={confirmedRide.vehicleType.toUpperCase()} />
              <Row label="Distance" value={`${confirmedRide.distance} km`} />
              <Row label="Fare" value={`₹${confirmedRide.fare}`} highlight />
              <div className="pt-3 border-t border-[#f59e0b]/20">
                <p className="text-xs text-slate-500 mb-1">Share this OTP with your driver to start the ride</p>
                <div className="flex items-center justify-between bg-white rounded-xl px-4 py-3 border border-[#e9dcc3]">
                  <span className="text-sm font-semibold text-slate-600">OTP</span>
                  <span className="text-2xl font-black text-[#2563eb] tracking-widest">{confirmedRide.otp}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => { setConfirmedRide(null); setPickup(null); setDropoff(null) }}
                className="flex-1 py-3 rounded-xl border border-[#e9dcc3] text-slate-700 font-semibold text-sm hover:bg-[#fff8ea] transition"
              >
                Book Another
              </button>
              <button
                onClick={() => setShowHistory(true)}
                className="flex-1 py-3 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold text-sm transition"
              >
                View Rides
              </button>
            </div>
          </div>
        </div>
      </main>
    )
  }

  /* ─── Main Booking UI ─── */
  return (
    <main className="min-h-screen hero-grid relative overflow-x-hidden">
      {/* Blurs */}
      <div className="pointer-events-none absolute top-0 -left-32 w-96 h-96 rounded-full bg-amber-300/20 blur-3xl" />
      <div className="pointer-events-none absolute top-32 -right-32 w-80 h-80 rounded-full bg-blue-300/20 blur-3xl" />

      {/* Top nav bar */}
      <nav className="sticky top-0 z-40 surface border-b border-[#e9dcc3] px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-xl border border-[#f59e0b]/40 bg-white/80 flex items-center justify-center overflow-hidden">
            <Image src="/finalcitilogo.png" alt="CSC" width={28} height={28} className="object-contain" />
          </div>
          <span className="font-black text-slate-900 text-sm hidden sm:block" style={{ fontFamily: 'var(--font-sora)' }}>
            CSC Travels
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={() => { setShowHistory((v) => !v); fetchRides() }}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#2563eb] bg-white/70 border border-[#e9dcc3] px-3 py-2 rounded-xl transition"
          >
            <History size={14} /> My Rides
          </button>

          {/* Profile dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen((v) => !v)}
              className="flex items-center gap-2 surface border border-[#e9dcc3] px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:border-[#2563eb]/40 transition"
            >
              <div className="w-6 h-6 rounded-full bg-[#2563eb] flex items-center justify-center text-white text-xs font-bold">
                {user?.name[0]?.toUpperCase()}
              </div>
              <span className="hidden sm:block max-w-[100px] truncate">{user?.name}</span>
              <ChevronDown size={14} />
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-12 w-52 surface border border-[#e9dcc3] rounded-2xl shadow-xl overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-[#f0e6d3]">
                  <p className="text-sm font-bold text-slate-800 truncate">{user?.name}</p>
                  <p className="text-xs text-slate-400 truncate">{user?.phone}</p>
                  <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider text-[#d97706] bg-[#fff1cc] px-2 py-0.5 rounded-full">
                    {user?.role}
                  </span>
                </div>
                <Link
                  href="/login"
                  className="flex items-center gap-2 px-4 py-3 text-sm text-slate-600 hover:bg-[#fff8ea] transition"
                  onClick={() => setProfileOpen(false)}
                >
                  <User size={14} /> Account settings
                </Link>
                <button
                  onClick={() => { logout(); router.push('/') }}
                  className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition border-t border-[#f0e6d3]"
                >
                  <LogOut size={14} /> Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 grid lg:grid-cols-[1fr_380px] gap-6 items-start">

        {/* ── LEFT: Booking form ── */}
        <div className="space-y-5 rise-in">
          <div>
            <p className="text-xs font-bold text-[#d97706] tracking-widest uppercase mb-1">Book a Ride</p>
            <h2 className="text-3xl font-black text-slate-900" style={{ fontFamily: 'var(--font-sora)' }}>
              Where are you going?
            </h2>
          </div>

          {/* Address inputs */}
          <div className="surface rounded-2xl p-5 space-y-4">
            <div className="relative">
              <AddressInput
                label="Pickup Location"
                value={pickup}
                onChange={setPickup}
                placeholder="Search pickup address in Patna…"
                icon={<Navigation size={16} className="text-[#2563eb]" />}
              />
            </div>

            {/* Swap connector */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-[#e9dcc3]" />
              <div className="w-7 h-7 rounded-full bg-[#fff1cc] border border-[#e9dcc3] flex items-center justify-center text-slate-400 text-xs">↕</div>
              <div className="flex-1 h-px bg-[#e9dcc3]" />
            </div>

            <AddressInput
              label="Drop-off Location"
              value={dropoff}
              onChange={setDropoff}
              placeholder="Search destination…"
              icon={<MapPin size={16} className="text-[#d97706]" />}
            />
          </div>

          {/* Route info pill */}
          {(loadingRoute || routeInfo) && (
            <div className="mesh-pill px-4 py-2.5 rounded-xl flex items-center gap-3 text-sm text-slate-700">
              {loadingRoute ? (
                <Loader2 size={14} className="animate-spin text-[#2563eb]" />
              ) : routeInfo ? (
                <>
                  <Clock size={14} className="text-[#2563eb]" />
                  <span className="font-semibold">{routeInfo.distance} km</span>
                  <span className="text-slate-400">·</span>
                  <span>~{routeInfo.duration} min</span>
                </>
              ) : null}
            </div>
          )}

          {/* Vehicle selector */}
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-3">Choose Vehicle</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {VEHICLES.map((v) => (
                <button
                  key={v.key}
                  onClick={() => setVehicle(v.key)}
                  className={`flex flex-col items-start gap-1.5 p-4 rounded-2xl border-2 transition text-left ${
                    vehicle === v.key
                      ? 'border-[#2563eb] bg-blue-50 shadow-md shadow-blue-100'
                      : 'border-[#e9dcc3] bg-white/70 hover:border-[#f59e0b]/60'
                  }`}
                >
                  <span className={vehicle === v.key ? 'text-[#2563eb]' : 'text-slate-500'}>{v.icon}</span>
                  <span className="text-sm font-bold text-slate-800">{v.label}</span>
                  <span className="text-xs text-slate-400">{v.desc}</span>
                  <span className={`text-xs font-bold mt-0.5 ${vehicle === v.key ? 'text-[#2563eb]' : 'text-slate-600'}`}>
                    ₹{v.base}+ · ₹{v.perKm}/km
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Payment mode */}
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-2">Payment Mode</p>
            <div className="flex gap-3">
              {([['cash', 'Cash', Wallet], ['online', 'Online', CreditCard]] as const).map(([m, label, Icon]) => (
                <button
                  key={m}
                  onClick={() => setPaymentMode(m)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm font-semibold transition ${
                    paymentMode === m
                      ? 'border-[#2563eb] bg-blue-50 text-[#2563eb]'
                      : 'border-[#e9dcc3] bg-white/70 text-slate-600 hover:border-[#f59e0b]/60'
                  }`}
                >
                  <Icon size={15} /> {label}
                </button>
              ))}
            </div>
          </div>

          {/* Schedule (optional) */}
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-1.5">
              Schedule for later{' '}
              <span className="text-xs font-normal text-slate-400">(optional)</span>
            </p>
            <div className="relative">
              <Calendar size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="datetime-local"
                value={schedule}
                onChange={(e) => setSchedule(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#e9dcc3] bg-[#fffaf0] text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb]/30 focus:border-[#2563eb] transition"
              />
            </div>
          </div>

          {bookingError && (
            <div className="flex gap-2 items-start bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
              <AlertCircle size={15} className="mt-0.5 shrink-0" /> {bookingError}
            </div>
          )}
        </div>

        {/* ── RIGHT: Fare summary + Book ── */}
        <div className="lg:sticky lg:top-24 rise-in" style={{ animationDelay: '0.1s' }}>
          <div className="surface rounded-3xl p-6 shadow-xl border border-[#e9dcc3]">
            <p className="text-xs font-bold text-[#d97706] tracking-widest uppercase mb-4">Fare Estimate</p>

            <div className="space-y-3 mb-5">
              <SummaryRow
                icon={<Navigation size={14} className="text-[#2563eb]" />}
                label="From"
                value={pickup?.address.split(',').slice(0, 2).join(',') || '—'}
              />
              <SummaryRow
                icon={<MapPin size={14} className="text-[#d97706]" />}
                label="To"
                value={dropoff?.address.split(',').slice(0, 2).join(',') || '—'}
              />
              <SummaryRow
                icon={selectedVehicle.icon}
                label="Vehicle"
                value={selectedVehicle.label}
              />
              {routeInfo && (
                <>
                  <SummaryRow icon={<Clock size={14} />} label="Distance" value={`${routeInfo.distance} km`} />
                  <SummaryRow icon={<Clock size={14} />} label="Est. Time" value={`${routeInfo.duration} min`} />
                </>
              )}
            </div>

            {/* Big fare display */}
            <div className="bg-[#0f172a] rounded-2xl p-5 mb-5 text-center">
              <p className="text-xs text-slate-400 mb-1">Estimated Fare</p>
              <div className="flex items-center justify-center gap-1">
                <IndianRupee size={22} className="text-amber-300" />
                <span className="text-4xl font-black text-amber-300">
                  {estimatedFare ?? '—'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Final fare may vary based on actual route</p>
            </div>

            <button
              onClick={handleBook}
              disabled={!pickup || !dropoff || booking}
              className="w-full flex items-center justify-center gap-2 bg-[#f59e0b] hover:bg-[#fbbf24] disabled:opacity-50 text-slate-900 font-black py-4 rounded-2xl transition text-base shadow-lg shadow-amber-200 disabled:cursor-not-allowed"
            >
              {booking ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  <Car size={18} /> Confirm Booking
                </>
              )}
            </button>

            {(!pickup || !dropoff) && (
              <p className="text-center text-xs text-slate-400 mt-3">
                Set pickup and drop-off to continue
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── Ride History Drawer ── */}
      {showHistory && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={() => setShowHistory(false)} />
          <aside className="w-full max-w-sm bg-[#fffbf2] h-full overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-[#fffbf2]/90 backdrop-blur-sm px-5 py-4 border-b border-[#e9dcc3] flex items-center justify-between">
              <h3 className="font-black text-slate-900" style={{ fontFamily: 'var(--font-sora)' }}>My Rides</h3>
              <button onClick={() => setShowHistory(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <div className="p-4 space-y-3">
              {ridesLoading ? (
                <div className="flex justify-center py-10">
                  <Loader2 size={24} className="animate-spin text-[#2563eb]" />
                </div>
              ) : rides.length === 0 ? (
                <div className="text-center py-12">
                  <Car size={36} className="text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 text-sm">No rides yet</p>
                  <p className="text-slate-400 text-xs">Book your first ride above!</p>
                </div>
              ) : (
                rides.map((r) => (
                  <div key={r._id} className="surface rounded-2xl p-4 border border-[#e9dcc3]">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800 truncate">
                          {r.pickup.address.split(',')[0]}
                        </p>
                        <p className="text-xs text-slate-400 truncate">→ {r.dropoff.address.split(',')[0]}</p>
                      </div>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full capitalize whitespace-nowrap ${STATUS_COLOR[r.status] || 'text-slate-500 bg-slate-100'}`}>
                        {r.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="font-bold text-slate-700 flex items-center gap-0.5">
                        <IndianRupee size={11} />{r.fare}
                      </span>
                      <span>·</span>
                      <span>{r.distance} km</span>
                      <span>·</span>
                      <span className="capitalize">{r.vehicleType}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                ))
              )}
            </div>
          </aside>
        </div>
      )}

      {/* Click-away for profile dropdown */}
      {profileOpen && (
        <div className="fixed inset-0 z-30" onClick={() => setProfileOpen(false)} />
      )}
    </main>
  )
}

/* ─── Small helpers ─── */
function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-2">
      <span className="text-xs text-slate-500 shrink-0">{label}</span>
      <span className={`text-xs font-semibold text-right max-w-[65%] leading-relaxed ${highlight ? 'text-[#2563eb] text-sm' : 'text-slate-700'}`}>
        {value}
      </span>
    </div>
  )
}

function SummaryRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="text-slate-400 mt-0.5 shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <span className="text-xs text-slate-400 block">{label}</span>
        <span className="text-sm font-semibold text-slate-700 leading-snug line-clamp-2">{value}</span>
      </div>
    </div>
  )
}
