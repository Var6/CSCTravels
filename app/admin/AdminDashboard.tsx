'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser';
import { LogOut, Phone, Mail, MapPin, Calendar, Users, Filter, RefreshCw } from 'lucide-react';
import type { Booking, BookingStatus } from '@/types/booking';
import { STATUS_LABEL, VEHICLE_LABEL, TRIP_LABEL } from '@/types/booking';

const STATUS_COLOR: Record<BookingStatus, string> = {
  pending: 'bg-amber-100 text-amber-800 border-amber-300',
  confirmed: 'bg-blue-100 text-blue-800 border-blue-300',
  completed: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  cancelled: 'bg-gray-200 text-gray-700 border-gray-300',
};

export default function AdminDashboard({
  initialBookings,
  loadError,
  userEmail,
}: {
  initialBookings: Booking[];
  loadError: string | null;
  userEmail: string;
}) {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [filter, setFilter] = useState<BookingStatus | 'all'>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filtered = useMemo(
    () => (filter === 'all' ? bookings : bookings.filter((b) => b.status === filter)),
    [filter, bookings],
  );

  const counts = useMemo(() => {
    const c: Record<BookingStatus | 'all', number> = {
      all: bookings.length, pending: 0, confirmed: 0, completed: 0, cancelled: 0,
    };
    bookings.forEach((b) => { c[b.status]++; });
    return c;
  }, [bookings]);

  async function updateStatus(id: string, status: BookingStatus) {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Update failed');
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
    } catch (e) {
      console.error(e);
      alert('Could not update status. Please try again.');
    } finally {
      setUpdatingId(null);
    }
  }

  async function signOut() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.replace('/admin/login');
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">Booking Dashboard</h1>
            <p className="text-xs text-gray-500 truncate">{userEmail}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.refresh()}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <RefreshCw className="w-4 h-4" /> Refresh
            </button>
            <button
              onClick={signOut}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium"
            >
              <LogOut className="w-4 h-4" /> Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {loadError && (
          <div className="bg-red-50 border border-red-300 text-red-800 px-4 py-3 rounded-xl text-sm">
            Could not load bookings: {loadError}
          </div>
        )}

        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <span className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-gray-500 shrink-0">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          {(['all', 'pending', 'confirmed', 'completed', 'cancelled'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all shrink-0 ${
                filter === s
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
              }`}
            >
              {s === 'all' ? 'All' : STATUS_LABEL[s]} <span className="opacity-60">({counts[s]})</span>
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-500">
            No bookings to show.
          </div>
        ) : (
          <div className="grid gap-4">
            {filtered.map((b) => (
              <article key={b.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">{b.customer_name}</h2>
                    <p className="text-xs text-gray-500">
                      Booked {new Date(b.created_at).toLocaleString('en-IN')}
                    </p>
                  </div>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${STATUS_COLOR[b.status]}`}>
                    {STATUS_LABEL[b.status]}
                  </span>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm mb-4">
                  <Info icon={<Phone className="w-4 h-4" />} label="Phone">
                    <a href={`tel:${b.phone}`} className="text-orange-700 hover:underline">{b.phone}</a>
                  </Info>
                  {b.email && (
                    <Info icon={<Mail className="w-4 h-4" />} label="Email">
                      <a href={`mailto:${b.email}`} className="text-orange-700 hover:underline truncate block">{b.email}</a>
                    </Info>
                  )}
                  <Info icon={<Users className="w-4 h-4" />} label="Vehicle">
                    {VEHICLE_LABEL[b.vehicle_type]} · {b.passengers} pax
                  </Info>
                  <Info icon={<Calendar className="w-4 h-4" />} label={`Pickup (${TRIP_LABEL[b.trip_type]})`}>
                    {new Date(b.pickup_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                  </Info>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 text-sm mb-4">
                  <Info icon={<MapPin className="w-4 h-4" />} label="From">{b.pickup}</Info>
                  <Info icon={<MapPin className="w-4 h-4" />} label="To">{b.drop_location}</Info>
                </div>

                {b.notes && (
                  <p className="text-sm bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-700 mb-4">
                    <span className="font-semibold">Notes:</span> {b.notes}
                  </p>
                )}

                <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-100">
                  {(['pending', 'confirmed', 'completed', 'cancelled'] as BookingStatus[])
                    .filter((s) => s !== b.status)
                    .map((s) => (
                      <button
                        key={s}
                        disabled={updatingId === b.id}
                        onClick={() => updateStatus(b.id, s)}
                        className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Mark {STATUS_LABEL[s]}
                      </button>
                    ))}
                </div>
              </article>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}

function Info({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
        {icon} {label}
      </p>
      <div className="text-gray-900">{children}</div>
    </div>
  );
}
