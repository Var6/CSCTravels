"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import MemberContactFields from "@/components/MemberContactFields";
import { useAuth } from "@/lib/useAuth";
import {
  ArrowRight,
  CalendarDays,
  Car,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  ShieldCheck,
} from "lucide-react";

export default function CarRentalPage() {
  const { user } = useAuth();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);

    setTimeout(() => {
      setSubmitted(false);
    }, 5000);
  };

  const cars = [
    {
      name: "Hyundai Aura",
      image: "/Aura.png",
      type: "Compact Sedan",
      description: "Comfortable and economical car for city travel.",
      features: [
        "4+1 Seating",
        "CNG Available",
        "AC",
        "Self-drive / Driver",
      ],
    },
    {
      name: "Maruti WagonR",
      image: "/WagonR.png",
      type: "Hatchback",
      description: "Affordable and practical for everyday city journeys.",
      features: [
        "4+1 Seating",
        "CNG Available",
        "Excellent Mileage",
        "Self-drive / Driver",
      ],
    },
    {
      name: "Maruti Swift Dzire",
      image: "/Dzire.png",
      type: "Compact Sedan",
      description: "A comfortable sedan for airport transfers, city travel and outstation journeys.",
      features: [
        "4+1 Seating",
        "Air conditioning",
        "Comfortable luggage space",
        "With driver",
      ],
    },
    {
      name: "Maruti Eeco",
      image: "/Eeco.png",
      type: "Family Van",
      description: "A roomier option for families and small groups travelling together.",
      features: [
        "5- or 7-seat options",
        "Air conditioning, subject to variant",
        "Extra room for passengers",
        "With driver",
      ],
    },
  ];

  const benefits = [
    "Hourly, daily & weekly rental plans",
    "Self-drive and driver-assisted options",
    "Well-maintained vehicles",
    "Transparent per-km pricing",
    "Flexible pickup & drop-off",
    "Airport and railway station service",
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-orange-50/30 to-white mt-30">

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-600 via-orange-500 to-orange-400 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white" />
          <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-white" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-2">

            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur">
                <Car className="h-4 w-4" />
                Reliable Car Rental
              </div>

              <h1 className="text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
                Your Journey.
                <br />
                <span className="text-orange-100">Your Car.</span>
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-8 text-orange-50 md:text-xl">
                Rent well-maintained cars for city rides, airport transfers
                and outstation journeys across Patna and beyond.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="#booking"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 font-semibold text-orange-600 shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
                >
                  Book a Car
                  <ArrowRight className="h-5 w-5" />
                </a>

                <a
                  href="tel:+919873101537"
                  className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-7 py-3.5 font-semibold backdrop-blur transition hover:bg-white/20"
                >
                  <Phone className="h-5 w-5" />
                  Call Us
                </a>
              </div>
            </div>

            {/* Hero Card */}
            <div className="relative">
              <div className="rounded-3xl bg-white p-7 text-gray-800 shadow-2xl">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg">
                  <Car className="h-10 w-10" />
                </div>

                <h2 className="text-2xl font-bold">
                  Flexible Rental Plans
                </h2>

                <p className="mt-2 text-gray-600">
                  Choose the rental plan that fits your journey.
                </p>

                <div className="mt-6 space-y-4">
                  {[
                    ["Hourly", "For quick city errands"],
                    ["Daily", "Perfect for a full day"],
                    ["Weekly", "For extended requirements"],
                    ["Outstation", "For longer journeys"],
                  ].map(([title, desc]) => (
                    <div
                      key={title}
                      className="flex items-center gap-4 rounded-2xl bg-orange-50 p-4"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-white">
                        <CheckCircle className="h-5 w-5" />
                      </div>

                      <div>
                        <p className="font-semibold text-gray-900">
                          {title}
                        </p>
                        <p className="text-sm text-gray-500">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* RENTAL OPTIONS */}
      <section className="px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">

          <div className="mx-auto mb-12 max-w-2xl text-center">
            <span className="font-semibold uppercase tracking-widest text-orange-600">
              Rental Options
            </span>

            <h2 className="mt-3 text-4xl font-bold text-gray-900">
              Choose What Works for You
            </h2>

            <p className="mt-4 text-lg text-gray-600">
              Simple rental plans designed around your travel requirements.
            </p>
          </div>

          <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Clock,
                title: "Hourly",
                text: "Ideal for short city trips and errands.",
              },
              {
                icon: CalendarDays,
                title: "Daily",
                text: "Book a car for the entire day.",
              },
              {
                icon: CalendarDays,
                title: "Weekly",
                text: "Flexible plans for longer requirements.",
              },
              {
                icon: MapPin,
                title: "Outstation",
                text: "Comfortable long-distance journeys.",
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="group rounded-3xl bg-white p-7 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                >
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 text-white transition-transform duration-300 group-hover:scale-110">
                    <Icon className="h-7 w-7" />
                  </div>

                  <h3 className="text-xl font-bold text-gray-900">
                    {item.title}
                  </h3>

                  <p className="mt-2 leading-6 text-gray-600">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* VEHICLES */}
      <section className="bg-gradient-to-b from-orange-50 to-white px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">

          <div className="mb-12 text-center">
            <span className="font-semibold uppercase tracking-widest text-orange-600">
              Our Fleet
            </span>

            <h2 className="mt-3 text-4xl font-bold text-gray-900">
              Cars for Every Journey
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-gray-600">
              Choose from practical city cars to comfortable vehicles for
              longer journeys.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cars.map((car) => (
              <div
                key={car.name}
                className="group overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-36 bg-white">
                  <Image
                    src={car.image}
                    alt={`${car.name} rental car`}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-contain p-1 transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                <div className="p-4">
                  <span className="text-xs font-semibold text-orange-600">
                    {car.type}
                  </span>

                  <h3 className="mt-1 text-lg font-bold leading-tight text-gray-900">
                    {car.name}
                  </h3>

                  <p className="mt-2 text-sm leading-5 text-gray-600">
                    {car.description}
                  </p>

                  <div className="mt-4 space-y-2">
                    {car.features.map((feature) => (
                      <div
                        key={feature}
                        className="flex items-start gap-2 text-xs leading-4 text-gray-700"
                      >
                        <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-3xl border border-orange-100 bg-white p-8 text-center shadow-lg md:p-10">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
              <CalendarDays className="h-7 w-7" />
            </div>
            <h3 className="mt-4 text-2xl font-bold text-gray-900">Ready to book a car?</h3>
            <p className="mx-auto mt-2 max-w-xl text-gray-600">
              Pick the car that suits your trip, then send your details through one simple booking form.
            </p>
            <a
              href="#booking"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-orange-500 px-7 py-3.5 font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-orange-600 hover:shadow-xl"
            >
              Go to Booking Form
              <ArrowRight className="h-5 w-5" />
            </a>
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="px-6 py-20 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">

          <div>
            <span className="font-semibold uppercase tracking-widest text-orange-600">
              Why CSC Travels
            </span>

            <h2 className="mt-3 text-4xl font-bold text-gray-900">
              Comfortable Travel Without the Hassle
            </h2>

            <p className="mt-5 text-lg leading-8 text-gray-600">
              From short city rides to long-distance journeys, we keep the
              rental process straightforward and transparent.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {benefits.map((benefit) => (
                <div
                  key={benefit}
                  className="flex items-start gap-3"
                >
                  <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-gradient-to-br from-orange-500 to-orange-600 p-8 text-white shadow-2xl">
            <ShieldCheck className="h-12 w-12" />

            <h3 className="mt-6 text-3xl font-bold">
              Safe & Transparent
            </h3>

            <p className="mt-4 leading-7 text-orange-50">
              We focus on reliable vehicles, verified drivers and clear rental
              terms so you know what you are booking.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">
                <p className="text-3xl font-bold">15+</p>
                <p className="mt-1 text-sm text-orange-100">Vehicles</p>
              </div>

              <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">
                <p className="text-3xl font-bold">24/7</p>
                <p className="mt-1 text-sm text-orange-100">Support</p>
              </div>

              <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">
                <p className="text-3xl font-bold">500+</p>
                <p className="mt-1 text-sm text-orange-100">Clients</p>
              </div>

              <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">
                <p className="text-3xl font-bold">100%</p>
                <p className="mt-1 text-sm text-orange-100">Commitment</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-gray-50 px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">

          <div className="mb-12 text-center">
            <span className="font-semibold uppercase tracking-widest text-orange-600">
              How It Works
            </span>

            <h2 className="mt-3 text-4xl font-bold text-gray-900">
              Book Your Car in 4 Simple Steps
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-4">
            {[
              {
                number: "01",
                icon: MapPin,
                title: "Choose Location",
                text: "Tell us your pickup and drop-off locations.",
              },
              {
                number: "02",
                icon: CalendarDays,
                title: "Select Date",
                text: "Choose your travel date and rental duration.",
              },
              {
                number: "03",
                icon: Car,
                title: "Choose Vehicle",
                text: "Select the vehicle category that suits you.",
              },
              {
                number: "04",
                icon: CheckCircle,
                title: "Confirm Booking",
                text: "Our team confirms your booking and details.",
              },
            ].map((step) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.number}
                  className="relative rounded-3xl bg-white p-7 text-center shadow-md"
                >
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange-500 text-white">
                    <Icon className="h-6 w-6" />
                  </div>

                  <span className="mt-5 block text-sm font-bold text-orange-500">
                    STEP {step.number}
                  </span>

                  <h3 className="mt-2 text-xl font-bold text-gray-900">
                    {step.title}
                  </h3>

                  <p className="mt-2 text-gray-600">
                    {step.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* BOOKING */}
      <section
        id="booking"
        className="px-6 py-20 lg:px-8"
      >
        <div className="mx-auto max-w-5xl">

          <div className="mb-10 text-center">
            <span className="font-semibold uppercase tracking-widest text-orange-600">
              Book Your Car
            </span>

            <h2 className="mt-3 text-4xl font-bold text-gray-900">
              Tell Us About Your Journey
            </h2>

            <p className="mt-4 text-gray-600">
              Submit your requirements and our team will get in touch with you.
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-2xl md:p-10">

            {submitted ? (
              <div className="py-16 text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle className="h-10 w-10 text-green-500" />
                </div>

                <h3 className="mt-6 text-3xl font-bold text-gray-900">
                  Request Received!
                </h3>

                <p className="mx-auto mt-3 max-w-md text-gray-600">
                  Thank you for contacting CSC Travels. Our team will contact
                  you shortly to confirm availability and pricing.
                </p>
              </div>
            ) : (
              <form
                key={user?._id ?? "guest"}
                onSubmit={handleSubmit}
                className="grid gap-6 md:grid-cols-2"
              >
                <MemberContactFields user={user} inputClassName="w-full rounded-xl border border-gray-200 px-4 py-3.5 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100" />

                <div>
                  <label className="mb-2 block font-medium text-gray-700">
                    Pickup Location
                  </label>

                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                    <input
                      required
                      type="text"
                      placeholder="Pickup location"
                      className="w-full rounded-xl border border-gray-200 py-3.5 pl-12 pr-4 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block font-medium text-gray-700">
                    Drop Location
                  </label>

                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                    <input
                      required
                      type="text"
                      placeholder="Drop location"
                      className="w-full rounded-xl border border-gray-200 py-3.5 pl-12 pr-4 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block font-medium text-gray-700">
                    Pickup Date
                  </label>

                  <input
                    required
                    type="date"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3.5 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-medium text-gray-700">
                    Rental Type
                  </label>

                  <select
                    required
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  >
                    <option value="">Select rental type</option>
                    <option>Hourly Rental</option>
                    <option>Daily Rental</option>
                    <option>Weekly Rental</option>
                    <option>Outstation</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block font-medium text-gray-700">
                    Vehicle Type
                  </label>

                  <select
                    required
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  >
                    <option value="">Select vehicle</option>
                    <option>Hyundai Aura</option>
                    <option>Maruti WagonR</option>
                    <option>Maruti Swift Dzire</option>
                    <option>Maruti Eeco</option>
                    <option>Any Available Car</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block font-medium text-gray-700">
                    Driver Requirement
                  </label>

                  <select
                    required
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  >
                    <option value="">Select option</option>
                    <option>Self Drive</option>
                    <option>With Driver</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block font-medium text-gray-700">
                    Additional Requirements
                  </label>

                  <textarea
                    rows={4}
                    placeholder="Tell us anything else about your journey..."
                    className="w-full rounded-xl border border-gray-200 px-4 py-3.5 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                </div>

                <div className="md:col-span-2">
                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 py-4 font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
                  >
                    Request Car Booking
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-20 lg:px-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-gradient-to-r from-orange-600 to-orange-500 px-8 py-14 text-center text-white shadow-xl">

          <Car className="mx-auto h-12 w-12" />

          <h2 className="mt-5 text-3xl font-bold md:text-4xl">
            Ready to Hit the Road?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-orange-50">
            Tell us where you are going and we will help you find the right
            car for your journey.
          </p>

          <a
            href="#booking"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 font-semibold text-orange-600 transition hover:-translate-y-1 hover:shadow-lg"
          >
            Book Your Car
            <ArrowRight className="h-5 w-5" />
          </a>
        </div>
      </section>

    </main>
  );
}
