"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle, ChevronRight, Clock, MapPin, Phone, ShieldCheck, Users } from "lucide-react";

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
      <section className="relative mt-7 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-orange-500 to-orange-700" />
        <div className="absolute -right-24 -top-28 h-96 w-96 rounded-full bg-white/10" />
        <div className="absolute -bottom-40 -left-28 h-96 w-96 rounded-full bg-white/10" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:py-28">
          <div className="text-white">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-4 py-2 backdrop-blur-sm">{config.icon}<span className="text-sm font-semibold">{config.eyebrow}</span></div>
            <h1 className="text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">{config.title}<span className="mt-2 block text-orange-100">Made Easy</span></h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-orange-50 md:text-xl">{config.description}</p>
            <p className="mt-4 max-w-xl leading-relaxed text-orange-100">{config.details}</p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a href="#booking" className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-4 font-bold text-orange-600 shadow-lg transition hover:bg-orange-50">{config.bookingLabel}<ArrowRight className="h-5 w-5" /></a>
              <a href="tel:+919873101537" className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white/70 px-7 py-4 font-bold text-white transition hover:bg-white/10"><Phone className="h-5 w-5" />Call Us</a>
            </div>
          </div>
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-orange-500 text-white [&>svg]:h-10 [&>svg]:w-10">{config.icon}</div>
              <h2 className="text-2xl font-bold text-gray-900">Travel with confidence</h2>
              <p className="mt-3 leading-relaxed text-gray-600">{config.details}</p>
              <div className="mt-6 space-y-4">{config.benefits.map((benefit) => <div key={benefit} className="flex items-center gap-3 text-gray-700"><CheckCircle className="h-5 w-5 shrink-0 text-green-500" /><span>{benefit}</span></div>)}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 -mt-8 px-6">
        <div className="mx-auto max-w-6xl rounded-2xl border border-orange-100 bg-white shadow-xl">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4">{config.benefits.map((benefit, index) => <div key={benefit} className={`flex items-center gap-4 p-6 ${index < config.benefits.length - 1 ? "lg:border-r border-orange-100" : ""}`}><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600"><CheckCircle className="h-6 w-6" /></div><p className="font-semibold text-gray-800">{benefit}</p></div>)}</div>
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-14 max-w-3xl text-center"><span className="text-sm font-bold uppercase tracking-wider text-orange-600">Our Services</span><h2 className="mt-3 text-3xl font-bold text-gray-900 md:text-4xl">Choose what works for your trip</h2><p className="mt-4 text-lg text-gray-600">{config.description}</p></div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">{config.options.map((option) => <article key={option.title} className="rounded-3xl border border-orange-100 bg-white p-8 shadow-lg transition hover:-translate-y-1 hover:shadow-2xl"><div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500 text-white [&>svg]:h-9 [&>svg]:w-9">{config.icon}</div><h3 className="text-2xl font-bold text-gray-900">{option.title}</h3><p className="mt-3 leading-relaxed text-gray-600">{option.description}</p><div className="mt-6 space-y-3">{config.benefits.slice(0, 3).map((benefit) => <div key={benefit} className="flex items-center gap-3 text-gray-700"><CheckCircle className="h-5 w-5 shrink-0 text-green-500" /><span>{benefit}</span></div>)}</div></article>)}</div>
        </div>
      </section>

      <section className="bg-white px-6 py-24">
        <div className="mx-auto max-w-7xl"><div className="mx-auto mb-16 max-w-3xl text-center"><span className="text-sm font-bold uppercase tracking-wider text-orange-600">Simple Process</span><h2 className="mt-3 text-3xl font-bold text-gray-900 md:text-4xl">How It Works</h2><p className="mt-4 text-lg text-gray-600">Getting your trip arranged is simple.</p></div><div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">{[{ title: "Request a Trip", text: "Share your pickup, destination and preferred travel date." }, { title: "Confirm Details", text: "Our team will contact you to confirm availability and trip details." }, { title: "Travel with CSC", text: "Meet your driver at the agreed pickup point and travel comfortably." }].map((step, index) => <div key={step.title} className="relative"><div className="h-full rounded-3xl border border-orange-100 bg-orange-50 p-7"><div className="mb-6 flex items-center justify-between"><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500 text-white"><Users className="h-7 w-7" /></div><span className="text-4xl font-bold text-orange-200">0{index + 1}</span></div><h3 className="text-xl font-bold text-gray-900">{step.title}</h3><p className="mt-3 leading-relaxed text-gray-600">{step.text}</p></div>{index < 2 && <div className="absolute -right-5 top-1/2 z-10 hidden h-10 w-10 items-center justify-center rounded-full bg-white text-orange-500 shadow-md lg:flex"><ChevronRight className="h-5 w-5" /></div>}</div>)}</div></div>
      </section>

      <section id="booking" className="bg-gradient-to-br from-orange-50 to-white px-6 py-24">
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
