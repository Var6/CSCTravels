import Link from 'next/link'
import { cookies } from 'next/headers'
import { Suspense } from 'react'
import { Calendar, Filter, LogOut, MapPin, Phone, User } from 'lucide-react'
import { connectDB } from '@/lib/mongodb'
import Ride from '@/lib/models/Ride'
import Driver from '@/lib/models/Driver'
import UserModel from '@/lib/models/User'
import { verifyToken } from '@/lib/auth'
import SignOutButton from './SignOutButton'

export const dynamic = 'force-dynamic'

interface SearchParams {
  status?: string
  driver?: string
  from?: string
  to?: string
  q?: string
}

const STATUSES = ['pending', 'accepted', 'in_progress', 'completed', 'cancelled'] as const

interface RideRow {
  _id: string
  status: typeof STATUSES[number]
  fare: number
  distance: number
  paymentMode: 'cash' | 'online'
  paymentStatus: 'pending' | 'paid'
  otp: string
  pickup: { address: string }
  dropoff: { address: string }
  createdAt: string
  scheduledAt?: string
  completedAt?: string
  userId?: { name: string; phone: string } | null
  driverId?: {
    vehicleNumber: string
    vehicleModel: string
    userId?: { name: string; phone: string } | null
  } | null
}

interface DriverOption { _id: string; vehicleNumber: string; userName: string }

async function load(searchParams: SearchParams) {
  await connectDB()
  // Make sure these models are registered before populate runs.
  void UserModel; void Driver

  const filter: Record<string, unknown> = {}
  if (searchParams.status && STATUSES.includes(searchParams.status as typeof STATUSES[number])) {
    filter.status = searchParams.status
  }
  if (searchParams.driver) {
    filter.driverId = searchParams.driver
  }
  if (searchParams.from || searchParams.to) {
    const range: Record<string, Date> = {}
    if (searchParams.from) range.$gte = new Date(searchParams.from)
    if (searchParams.to) {
      const d = new Date(searchParams.to)
      d.setHours(23, 59, 59, 999)
      range.$lte = d
    }
    filter.createdAt = range
  }
  if (searchParams.q) {
    const q = searchParams.q.trim()
    if (q) {
      filter.$or = [
        { 'pickup.address': { $regex: q, $options: 'i' } },
        { 'dropoff.address': { $regex: q, $options: 'i' } },
        { otp: q },
      ]
    }
  }

  const [rides, drivers, stats] = await Promise.all([
    Ride.find(filter)
      .sort({ createdAt: -1 })
      .limit(200)
      .populate('userId', 'name phone')
      .populate({ path: 'driverId', select: 'vehicleNumber vehicleModel userId',
                  populate: { path: 'userId', select: 'name phone' } })
      .lean(),
    Driver.find({ isApproved: true })
      .select('vehicleNumber userId')
      .populate('userId', 'name')
      .limit(200)
      .lean(),
    Ride.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 }, fare: { $sum: '$fare' } } },
    ]),
  ])

  // Aggregate totals
  const counts: Record<string, { count: number; fare: number }> = {}
  for (const s of stats) {
    counts[s._id as string] = { count: s.count as number, fare: s.fare as number }
  }
  const totalRides = Object.values(counts).reduce((a, c) => a + c.count, 0)
  const totalRevenue = (counts['completed']?.fare ?? 0)

  return {
    rides: JSON.parse(JSON.stringify(rides)) as RideRow[],
    drivers: (drivers as unknown as Array<{ _id: unknown; vehicleNumber: string; userId?: { name?: string } }>)
      .map((d) => ({ _id: String(d._id), vehicleNumber: d.vehicleNumber, userName: d.userId?.name ?? '—' })) as DriverOption[],
    counts,
    totalRides,
    totalRevenue,
  }
}

export default async function AdminPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams

  // Pull admin user info from cookie for the header (middleware already gated).
  const token = (await cookies()).get('token')?.value
  const adminPayload = token ? verifyToken(token) : null
  const adminEmail = adminPayload?.userId ? '' : ''

  const { rides, drivers, counts, totalRides, totalRevenue } = await load(params)

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">Ride Dispatch</h1>
            <p className="text-xs text-gray-500">CSC Travels admin</p>
          </div>
          <SignOutButton />
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* KPI tiles */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <Tile label="Total" value={totalRides.toString()} />
          <Tile label="Pending"     value={(counts['pending']?.count     ?? 0).toString()} accent="bg-amber-50 text-amber-700" />
          <Tile label="Accepted"    value={(counts['accepted']?.count    ?? 0).toString()} accent="bg-blue-50 text-blue-700" />
          <Tile label="In progress" value={(counts['in_progress']?.count ?? 0).toString()} accent="bg-indigo-50 text-indigo-700" />
          <Tile label="Revenue (paid)" value={`₹${totalRevenue.toLocaleString('en-IN')}`} accent="bg-emerald-50 text-emerald-700" />
        </div>

        {/* Filters */}
        <form className="bg-white border border-gray-200 rounded-2xl p-4 grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
          <Field label="Status">
            <select name="status" defaultValue={params.status ?? ''} className="select">
              <option value="">All</option>
              {STATUSES.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
            </select>
          </Field>
          <Field label="Driver">
            <select name="driver" defaultValue={params.driver ?? ''} className="select">
              <option value="">All</option>
              {drivers.map((d) => (
                <option key={d._id} value={d._id}>{d.vehicleNumber} · {d.userName}</option>
              ))}
            </select>
          </Field>
          <Field label="From"><input type="date" name="from" defaultValue={params.from ?? ''} className="input" /></Field>
          <Field label="To"><input type="date" name="to" defaultValue={params.to ?? ''} className="input" /></Field>
          <Field label="Search address / OTP">
            <input type="text" name="q" defaultValue={params.q ?? ''} placeholder="e.g. Patna or 4321" className="input" />
          </Field>
          <div className="flex gap-2">
            <button className="flex-1 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold px-3 py-2.5 rounded-lg inline-flex items-center justify-center gap-1">
              <Filter className="w-4 h-4" /> Apply
            </button>
            <Link href="/admin" className="px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-gray-50">Reset</Link>
          </div>
        </form>

        {/* Rides table */}
        <Suspense>
          <RidesTable rides={rides} />
        </Suspense>

        <p className="text-xs text-gray-500 text-center">Showing latest {rides.length} of matching rides (cap 200).</p>
      </div>

      <style>{`
        .input, .select {
          width: 100%; border: 1.5px solid #e5e7eb; border-radius: 10px;
          padding: 8px 12px; font-size: 14px; background: white;
        }
        .input:focus, .select:focus { outline: none; border-color: #f97316; box-shadow: 0 0 0 3px #ffedd5; }
      `}</style>
    </main>
  )
}

function Tile({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className={`rounded-2xl border border-gray-200 bg-white p-4`}>
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${accent ?? 'text-gray-900'} px-2 py-1 rounded inline-block`}>{value}</p>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-1">{label}</span>
      {children}
    </label>
  )
}

const STATUS_PILL: Record<RideRow['status'], string> = {
  pending:    'bg-amber-100 text-amber-800 border-amber-200',
  accepted:   'bg-blue-100 text-blue-800 border-blue-200',
  in_progress:'bg-indigo-100 text-indigo-800 border-indigo-200',
  completed:  'bg-emerald-100 text-emerald-800 border-emerald-200',
  cancelled:  'bg-gray-200 text-gray-700 border-gray-300',
}

function RidesTable({ rides }: { rides: RideRow[] }) {
  if (rides.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center text-gray-500">
        No rides match these filters.
      </div>
    )
  }
  return (
    <div className="grid gap-3">
      {rides.map((r) => (
        <article key={r._id} className="bg-white rounded-2xl border border-gray-200 p-4">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
            <div>
              <p className="text-xs text-gray-500">
                {new Date(r.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                {r.scheduledAt && (
                  <span className="ml-2 inline-flex items-center gap-1 text-indigo-700">
                    <Calendar className="w-3 h-3" /> sched {new Date(r.scheduledAt).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}
                  </span>
                )}
              </p>
              <p className="font-semibold text-gray-900 mt-0.5">OTP {r.otp}</p>
            </div>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${STATUS_PILL[r.status]}`}>
              {r.status.replace('_', ' ')}
            </span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm mb-3">
            <Info icon={<User className="w-4 h-4" />} label="Customer">
              <span className="text-gray-900">{r.userId?.name ?? '—'}</span>
              {r.userId?.phone && (
                <a href={`tel:${r.userId.phone}`} className="block text-xs text-orange-700 hover:underline">{r.userId.phone}</a>
              )}
            </Info>
            <Info icon={<User className="w-4 h-4" />} label="Driver">
              {r.driverId ? (
                <>
                  <span className="text-gray-900">{r.driverId.userId?.name ?? '—'}</span>
                  <span className="block text-xs text-gray-500">{r.driverId.vehicleNumber} · {r.driverId.vehicleModel}</span>
                  {r.driverId.userId?.phone && (
                    <a href={`tel:${r.driverId.userId.phone}`} className="block text-xs text-orange-700 hover:underline">
                      <Phone className="inline w-3 h-3 mr-0.5" />{r.driverId.userId.phone}
                    </a>
                  )}
                </>
              ) : <span className="text-gray-400 italic">Unassigned</span>}
            </Info>
            <Info icon={<MapPin className="w-4 h-4" />} label="Route">
              <p className="text-gray-900 truncate" title={r.pickup.address}>🟢 {r.pickup.address}</p>
              <p className="text-gray-900 truncate" title={r.dropoff.address}>🔴 {r.dropoff.address}</p>
            </Info>
            <Info icon={<></>} label="Fare / Payment">
              <p className="text-gray-900 font-semibold">₹{r.fare.toLocaleString('en-IN')} · {r.distance.toFixed(1)} km</p>
              <p className={`text-xs ${r.paymentStatus === 'paid' ? 'text-emerald-700' : 'text-gray-500'}`}>
                {r.paymentMode.toUpperCase()} · {r.paymentStatus}
              </p>
            </Info>
          </div>
        </article>
      ))}
    </div>
  )
}

function Info({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-1">
        {icon} {label}
      </p>
      <div>{children}</div>
    </div>
  )
}
