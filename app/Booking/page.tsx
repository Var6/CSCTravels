import type { Metadata } from 'next';
import BookingForm from '@/components/BookingForm';
import { CheckCircle, Clock, Shield, IndianRupee, Phone } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Book a Ride | CSC Travels',
  description: 'Book a car, bus, or traveler with CSC Travels. Intracity, outstation, and group travel across Patna and beyond.',
  alternates: { canonical: 'https://csctravels.com/Booking' },
};

const perks = [
  { icon: Clock, title: 'Confirmed within minutes', desc: 'Our team calls back the moment your request comes in.' },
  { icon: Shield, title: 'GPS-tracked, insured vehicles', desc: 'Verified drivers, real-time tracking, fully covered.' },
  { icon: IndianRupee, title: 'Transparent fixed rates', desc: 'No surge pricing. See full fare structure on Services.' },
  { icon: CheckCircle, title: 'Free cancellation', desc: 'Cancel up to 2 hours before pickup at no charge.' },
];

export default function BookingPage() {
  return (
    <main className="min-h-screen bg-linear-to-b from-orange-50 via-white to-orange-50 pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-12">
          <span className="text-orange-600 font-semibold text-sm uppercase tracking-wider">Book Online</span>
          <h1 className="text-4xl md:text-5xl font-bold mt-3 mb-4">
            <span className="text-outline">Reserve Your</span>{' '}
            <span className="gradient-text">Ride</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Pick your vehicle, tell us when and where, and we&apos;ll take it from there.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-start">

          <div className="lg:col-span-3">
            <BookingForm />
          </div>

          <aside className="lg:col-span-2 space-y-5">
            <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-orange-100">
              <h2 className="text-xl font-bold text-gray-900 mb-5">Why book with us</h2>
              <ul className="space-y-5">
                {perks.map((p) => (
                  <li key={p.title} className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                      <p.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{p.title}</p>
                      <p className="text-sm text-gray-600 mt-0.5">{p.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="gradient-bg rounded-3xl p-6 md:p-8 text-white shadow-xl">
              <p className="text-sm uppercase tracking-wider opacity-90 mb-2">Prefer to call?</p>
              <a href="tel:+919873101537" className="text-2xl md:text-3xl font-bold flex items-center gap-3 hover:opacity-90">
                <Phone className="w-6 h-6" />
                +91 98731 01537
              </a>
              <p className="text-sm opacity-90 mt-3">
                Wednesday – Monday, 10:00 AM – 6:00 PM. Closed Tuesdays.
              </p>
            </div>
          </aside>

        </div>
      </div>
    </main>
  );
}
