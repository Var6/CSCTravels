'use client';

import { useState } from 'react';
import { Car, Bus, Users, Calendar, MapPin, Phone, User, Mail, MessageSquare, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { VEHICLE_LABEL, TRIP_LABEL, type VehicleKind, type TripKind } from '@/types/booking';

const WHATSAPP_NUMBER = '919873101537';

interface State {
  customer_name: string;
  phone: string;
  email: string;
  pickup: string;
  drop_location: string;
  pickup_date: string;
  pickup_time: string;
  return_date: string;
  vehicle_type: VehicleKind;
  trip_type: TripKind;
  passengers: number;
  notes: string;
}

const initial: State = {
  customer_name: '',
  phone: '',
  email: '',
  pickup: '',
  drop_location: '',
  pickup_date: '',
  pickup_time: '',
  return_date: '',
  vehicle_type: 'car',
  trip_type: 'one_way',
  passengers: 2,
  notes: '',
};

export default function BookingForm({ compact = false }: { compact?: boolean }) {
  const [form, setForm] = useState<State>(initial);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const update = <K extends keyof State>(k: K, v: State[K]) => setForm((s) => ({ ...s, [k]: v }));

  const todayISO = new Date().toISOString().split('T')[0];

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');

    const pickup_at = new Date(`${form.pickup_date}T${form.pickup_time || '09:00'}:00`).toISOString();
    const return_at = form.return_date ? new Date(`${form.return_date}T23:59:00`).toISOString() : undefined;

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: form.customer_name,
          phone: form.phone,
          email: form.email || undefined,
          pickup: form.pickup,
          drop_location: form.drop_location,
          pickup_at,
          return_at,
          vehicle_type: form.vehicle_type,
          trip_type: form.trip_type,
          passengers: form.passengers,
          notes: form.notes || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Booking failed');

      setStatus('success');

      // Open WhatsApp pre-filled message in a new tab for instant follow-up.
      const msg = [
        `New booking request from ${form.customer_name}`,
        `Phone: ${form.phone}`,
        `Vehicle: ${VEHICLE_LABEL[form.vehicle_type]}`,
        `Trip: ${TRIP_LABEL[form.trip_type]}`,
        `Pickup: ${form.pickup}`,
        `Drop: ${form.drop_location}`,
        `When: ${form.pickup_date} ${form.pickup_time || '09:00'}`,
        form.return_date ? `Return: ${form.return_date}` : '',
        `Passengers: ${form.passengers}`,
        form.notes ? `Notes: ${form.notes}` : '',
        `Booking ID: ${data.id}`,
      ].filter(Boolean).join('\n');
      const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
      window.open(waUrl, '_blank', 'noopener,noreferrer');

      setForm(initial);
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong');
    }
  }

  return (
    <form onSubmit={onSubmit} className={`bg-white rounded-3xl shadow-2xl p-6 md:p-8 space-y-5 text-gray-900 ${compact ? '' : ''}`}>
      <div>
        <h3 className="text-2xl md:text-3xl font-bold mb-1">Book Your Ride</h3>
        <p className="text-sm text-gray-600">We&apos;ll confirm on WhatsApp / phone within minutes.</p>
      </div>

      {/* Vehicle pills */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Vehicle</label>
        <div className="grid grid-cols-3 gap-2">
          {([
            { k: 'car' as const, icon: Car, label: 'Car' },
            { k: 'bus' as const, icon: Bus, label: 'Bus' },
            { k: 'traveler' as const, icon: Users, label: 'Traveler' },
          ]).map(({ k, icon: Icon, label }) => (
            <button
              key={k}
              type="button"
              onClick={() => update('vehicle_type', k)}
              className={`flex flex-col items-center gap-1 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                form.vehicle_type === k
                  ? 'border-orange-500 bg-orange-50 text-orange-700'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-orange-300'
              }`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Trip type */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Trip type</label>
        <select
          value={form.trip_type}
          onChange={(e) => update('trip_type', e.target.value as TripKind)}
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none transition-all"
        >
          {(Object.keys(TRIP_LABEL) as TripKind[]).map((t) => (
            <option key={t} value={t}>{TRIP_LABEL[t]}</option>
          ))}
        </select>
      </div>

      {/* Pickup / drop */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Pickup location" icon={<MapPin className="w-4 h-4" />}>
          <input
            type="text"
            required
            placeholder="e.g. Patna Junction"
            value={form.pickup}
            onChange={(e) => update('pickup', e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label="Drop location" icon={<MapPin className="w-4 h-4" />}>
          <input
            type="text"
            required
            placeholder="e.g. Gaya"
            value={form.drop_location}
            onChange={(e) => update('drop_location', e.target.value)}
            className={inputCls}
          />
        </Field>
      </div>

      {/* Date / time / return */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Field label="Pickup date" icon={<Calendar className="w-4 h-4" />}>
          <input
            type="date"
            required
            min={todayISO}
            value={form.pickup_date}
            onChange={(e) => update('pickup_date', e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label="Pickup time">
          <input
            type="time"
            required
            value={form.pickup_time}
            onChange={(e) => update('pickup_time', e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label={`Return date ${form.trip_type === 'round_trip' || form.trip_type === 'outstation' ? '' : '(optional)'}`}>
          <input
            type="date"
            min={form.pickup_date || todayISO}
            value={form.return_date}
            onChange={(e) => update('return_date', e.target.value)}
            className={inputCls}
          />
        </Field>
      </div>

      {/* Passengers */}
      <Field label="Passengers">
        <input
          type="number"
          required
          min={1}
          max={60}
          value={form.passengers}
          onChange={(e) => update('passengers', Math.max(1, Number(e.target.value) || 1))}
          className={inputCls}
        />
      </Field>

      {/* Contact */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Your name" icon={<User className="w-4 h-4" />}>
          <input
            type="text"
            required
            value={form.customer_name}
            onChange={(e) => update('customer_name', e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label="Phone" icon={<Phone className="w-4 h-4" />}>
          <input
            type="tel"
            required
            placeholder="+91 9XXXXXXXXX"
            value={form.phone}
            onChange={(e) => update('phone', e.target.value)}
            className={inputCls}
          />
        </Field>
      </div>

      <Field label="Email (optional)" icon={<Mail className="w-4 h-4" />}>
        <input
          type="email"
          value={form.email}
          onChange={(e) => update('email', e.target.value)}
          className={inputCls}
        />
      </Field>

      <Field label="Notes (optional)" icon={<MessageSquare className="w-4 h-4" />}>
        <textarea
          rows={3}
          value={form.notes}
          onChange={(e) => update('notes', e.target.value)}
          className={`${inputCls} resize-none`}
        />
      </Field>

      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full gradient-bg text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-2xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === 'sending' ? (
          <>
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Sending...
          </>
        ) : (
          <>
            Confirm Booking
            <Send className="w-5 h-5" />
          </>
        )}
      </button>

      {status === 'success' && (
        <div className="bg-green-50 border border-green-300 text-green-800 px-4 py-3 rounded-xl flex items-start gap-3">
          <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="text-sm">Booking received! We&apos;ve opened WhatsApp so you can send us the details instantly. Our team will call back shortly.</p>
        </div>
      )}
      {status === 'error' && (
        <div className="bg-red-50 border border-red-300 text-red-800 px-4 py-3 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="text-sm">{errorMsg || 'Could not submit. Please call +91 98731 01537.'}</p>
        </div>
      )}
    </form>
  );
}

const inputCls =
  'w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none transition-all text-gray-900';

function Field({ label, icon, children }: { label: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
        {icon}
        {label}
      </span>
      {children}
    </label>
  );
}
