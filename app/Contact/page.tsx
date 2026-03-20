"use client";

import { Mail, Phone, MapPin, Clock } from "lucide-react";
import type { ReactNode } from "react";

export default function ContactPage() {
  return (
    <main className="pt-32 px-4 pb-10 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-7xl rounded-3xl bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] px-6 py-14 text-white sm:px-10">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-100">Contact</p>
        <h1 className="mt-4 text-4xl font-black sm:text-5xl">Let&apos;s plan your next journey</h1>
        <p className="mt-4 max-w-2xl text-sm text-blue-50 sm:text-base">
          Reach us for local rides, outstation bookings, and organizational travel requirements.
        </p>
      </section>

      <section className="mx-auto mt-8 grid max-w-7xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="surface rounded-3xl p-6">
          <h2 className="text-2xl font-black text-slate-900">Contact Details</h2>
          <div className="mt-5 space-y-5 text-sm text-slate-700">
            <InfoRow icon={<Phone className="h-5 w-5" />} title="Phone" value="+91 98731 01537" />
            <InfoRow icon={<Mail className="h-5 w-5" />} title="Email" value="booking@csctravels.com" />
            <InfoRow icon={<MapPin className="h-5 w-5" />} title="Address" value="Shanti Devi Nivas, near Sichai Bhawan, Anishabad, Patna, Bihar 800002" />
            <InfoRow icon={<Clock className="h-5 w-5" />} title="Hours" value="Wednesday to Monday, 10:00 AM to 6:00 PM" />
          </div>
        </div>

        <form className="surface rounded-3xl p-6">
          <h2 className="text-2xl font-black text-slate-900">Send a Request</h2>
          <p className="mt-2 text-sm text-slate-600">Share trip details and our team will call you shortly.</p>

          <div className="mt-6 grid gap-4">
            <label className="text-sm font-semibold text-slate-700">
              Full Name
              <input
                type="text"
                placeholder="Enter your full name"
                className="mt-1 w-full rounded-xl border border-[#dac9a9] bg-white px-4 py-3 text-sm outline-none ring-[#2563eb] transition focus:ring-2"
              />
            </label>

            <label className="text-sm font-semibold text-slate-700">
              Phone Number
              <input
                type="tel"
                placeholder="Enter phone number"
                className="mt-1 w-full rounded-xl border border-[#dac9a9] bg-white px-4 py-3 text-sm outline-none ring-[#2563eb] transition focus:ring-2"
              />
            </label>

            <label className="text-sm font-semibold text-slate-700">
              Message
              <textarea
                rows={5}
                placeholder="Trip date, pickup point, destination, and vehicle preference"
                className="mt-1 w-full resize-none rounded-xl border border-[#dac9a9] bg-white px-4 py-3 text-sm outline-none ring-[#2563eb] transition focus:ring-2"
              />
            </label>

            <button
              type="submit"
              className="rounded-full bg-[#f59e0b] px-6 py-3 text-sm font-bold text-slate-900 transition hover:bg-[#fbbf24]"
            >
              Submit Request
            </button>
          </div>
        </form>
      </section>

      <section className="mx-auto mt-8 max-w-7xl overflow-hidden rounded-3xl border border-[#decfb1]">
        <iframe
          src="https://www.google.com/maps?q=Patna+Bihar&output=embed"
          width="100%"
          height="340"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="border-0"
        ></iframe>
      </section>
    </main>
  );
}

const InfoRow = ({ icon, title, value }: { icon: ReactNode; title: string; value: string }) => {
  return (
    <div className="rounded-xl border border-[#e3d4b9] bg-white p-4">
      <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#2563eb]">
        {icon}
        {title}
      </p>
      <p className="mt-1 text-sm leading-relaxed text-slate-700">{value}</p>
    </div>
  );
};
