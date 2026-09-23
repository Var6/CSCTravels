"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle, Clock, MapPin, Phone, ShieldCheck } from "lucide-react";

export type ServiceLandingConfig = {
  title: string;
  eyebrow: string;
  description: string;
  details: string;
  icon: React.ReactNode;
  benefits: string[];
  options: { title: string; description: string }[];
  bookingLabel: string;
  bookingType: string;
};

export default function ServiceLandingPage({ config }: { config: ServiceLandingConfig }) {
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    event.currentTarget.reset();
    window.setTimeout(() => setSubmitted(false), 6000);
  };

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <section className="bg-gradient-to-br from-orange-50 via-white to-orange-100 px-6 py-20 md:py-28">
        <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2 md:items-center">
          <div>
            <span className="font-semibold uppercase tracking-wider text-orange-600">{config.eyebrow}</span>
            <h1 className="mt-4 text-4xl font-bold leading-tight md:text-6xl">{config.title}</h1>
            <p className="mt-6 text-lg leading-relaxed text-gray-600">{config.description}</p>
            <p className="mt-4 leading-relaxed text-gray-600">{config.details}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="#booking" className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 font-bold text-white hover:bg-orange-600">{config.bookingLabel}<ArrowRight className="h-5 w-5" /></a>
              <a href="tel:+919873101537" className="inline-flex items-center gap-2 rounded-xl border border-orange-200 bg-white px-6 py-3 font-bold text-orange-700"><Phone className="h-5 w-5" />+91 98731 01537</a>
            </div>
          </div>
          <div className="mx-auto flex h-64 w-64 items-center justify-center rounded-[3rem] bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-2xl md:h-80 md:w-80 [&>svg]:h-32 [&>svg]:w-32">{config.icon}</div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="text-center"><span className="font-semibold uppercase tracking-wider text-orange-600">Why ride with us</span><h2 className="mt-3 text-3xl font-bold md:text-4xl">Travel that works for you</h2></div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {config.benefits.map((benefit) => <div key={benefit} className="flex gap-3 rounded-2xl border border-orange-100 bg-white p-5 shadow-sm"><CheckCircle className="h-6 w-6 shrink-0 text-green-500" /><span className="font-medium text-gray-700">{benefit}</span></div>)}
          </div>
          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {config.options.map((option, index) => <article key={option.title} className="rounded-3xl bg-orange-50 p-7"><span className="text-sm font-bold text-orange-600">0{index + 1}</span><h3 className="mt-3 text-xl font-bold">{option.title}</h3><p className="mt-3 leading-relaxed text-gray-600">{option.description}</p></article>)}
          </div>
        </div>
      </section>

      <section id="booking" className="bg-orange-50 px-6 py-20">
        <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2">
          <div><span className="font-semibold uppercase tracking-wider text-orange-600">Plan your trip</span><h2 className="mt-3 text-3xl font-bold md:text-4xl">Request {config.bookingType}</h2><p className="mt-5 leading-relaxed text-gray-600">Send your trip details and our team will call to confirm availability and fare.</p><div className="mt-8 space-y-5 text-gray-700"><p className="flex items-center gap-3"><Phone className="h-5 w-5 text-orange-500" />+91 98731 01537</p><p className="flex items-center gap-3"><MapPin className="h-5 w-5 text-orange-500" />Patna and surrounding areas</p><p className="flex items-center gap-3"><Clock className="h-5 w-5 text-orange-500" />Advance bookings welcome</p></div><p className="mt-8 flex items-center gap-2 text-sm text-gray-500"><ShieldCheck className="h-5 w-5 text-green-600" />Your request is handled by the CSC Travels team.</p></div>
          <form onSubmit={handleSubmit} className="rounded-3xl border border-orange-100 bg-white p-6 shadow-xl md:p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="text-sm font-semibold text-gray-700">Name *<input required name="name" autoComplete="name" className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 font-normal outline-none focus:border-orange-500" placeholder="Passenger name" /></label>
              <label className="text-sm font-semibold text-gray-700">Phone *<input required name="phone" type="tel" autoComplete="tel" className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 font-normal outline-none focus:border-orange-500" placeholder="+91 XXXXX XXXXX" /></label>
              <label className="text-sm font-semibold text-gray-700 sm:col-span-2">Pickup location *<input required name="pickup" className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 font-normal outline-none focus:border-orange-500" placeholder="Pickup address" /></label>
              <label className="text-sm font-semibold text-gray-700 sm:col-span-2">Destination *<input required name="destination" className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 font-normal outline-none focus:border-orange-500" placeholder="Where are you going?" /></label>
              <label className="text-sm font-semibold text-gray-700">Travel date<input name="date" type="date" className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 font-normal outline-none focus:border-orange-500" /></label>
              <label className="text-sm font-semibold text-gray-700">Travel time<input name="time" type="time" className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 font-normal outline-none focus:border-orange-500" /></label>
              <label className="text-sm font-semibold text-gray-700 sm:col-span-2">Additional details<textarea name="details" rows={3} className="mt-2 w-full resize-y rounded-xl border border-gray-200 px-4 py-3 font-normal outline-none focus:border-orange-500" placeholder="Passengers, return trip, or other requirements" /></label>
            </div>
            {submitted && <p role="status" className="mt-5 rounded-xl border border-green-200 bg-green-50 p-4 text-green-800">Thanks — your request is ready. Please call us at <a className="font-bold underline" href="tel:+919873101537">+91 98731 01537</a> to confirm it with our team.</p>}
            <button type="submit" className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-4 font-bold text-white hover:bg-orange-600">{config.bookingLabel}<ArrowRight className="h-5 w-5" /></button>
            <p className="mt-3 text-center text-xs text-gray-500">Submitting this form does not confirm a booking. Our team will check availability.</p>
          </form>
        </div>
      </section>
      <footer className="px-6 py-8 text-center text-sm text-gray-500"><Link className="text-orange-600 hover:underline" href="/">← Back to CSC Travels</Link></footer>
    </main>
  );
}
