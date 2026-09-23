"use client";

import {
  Accessibility,
  ArrowRight,
  CheckCircle,
  ChevronRight,
  Clock,
  HeartHandshake,
  Hospital,
  MapPin,
  Phone,
  ShieldCheck,
  UserRoundCheck,
  Users,
} from "lucide-react";

import { FormEvent, useState } from "react";


export default function AssistiveServicesPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);

    setTimeout(() => {
      setSubmitted(false);
    }, 5000);
  };

  const services = [
    {
      icon: <Accessibility className="w-9 h-9" />,
      title: "Wheelchair-Friendly Travel",
      description:
        "Comfortable and accessible vehicles for passengers who require wheelchair support during their journey.",
      features: [
        "Wheelchair-friendly vehicles",
        "Easy boarding assistance",
        "Door-to-door support",
      ],
    },
    {
      icon: <Hospital className="w-9 h-9" />,
      title: "Hospital & Medical Trips",
      description:
        "Reliable transportation for hospital visits, medical appointments, check-ups and follow-up trips.",
      features: [
        "Hospital pickup & drop",
        "Scheduled medical trips",
        "Patient-friendly assistance",
      ],
    },
    {
      icon: <UserRoundCheck className="w-9 h-9" />,
      title: "Trained Drivers",
      description:
        "Patient and verified drivers who understand the additional care required by elderly and differently-abled passengers.",
      features: [
        "Verified drivers",
        "Patient assistance",
        "Safe and respectful service",
      ],
    },
    {
      icon: <HeartHandshake className="w-9 h-9" />,
      title: "Door-to-Door Assistance",
      description:
        "Assistance from your doorstep to the vehicle and from the vehicle to your final destination.",
      features: [
        "Pickup assistance",
        "Safe vehicle transfer",
        "Destination assistance",
      ],
    },
  ];

  const steps = [
    {
      number: "01",
      icon: <Phone className="w-7 h-7" />,
      title: "Request Assistance",
      description:
        "Tell us your pickup location, destination and the type of assistance required.",
    },
    {
      number: "02",
      icon: <Users className="w-7 h-7" />,
      title: "Driver Assigned",
      description:
        "We arrange a suitable vehicle and verified driver according to your requirements.",
    },
    {
      number: "03",
      icon: <Accessibility className="w-7 h-7" />,
      title: "Assisted Pickup",
      description:
        "Our driver reaches your pickup point and provides the required boarding assistance.",
    },
    {
      number: "04",
      icon: <ShieldCheck className="w-7 h-7" />,
      title: "Safe Drop-Off",
      description:
        "Reach your destination comfortably with assistance until the journey is complete.",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-orange-50 mt-7">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-orange-500 to-orange-700" />

        {/* Decorative circles */}
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-white/10" />
        <div className="absolute -bottom-40 -left-32 w-96 h-96 rounded-full bg-white/10" />

        <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero text */}
            <div className="text-white">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 border border-white/20 backdrop-blur-sm mb-6">
                <Accessibility className="w-5 h-5" />
                <span className="text-sm font-semibold">
                  Accessible Travel Services
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Travel With
                <span className="block text-orange-100">
                  Comfort & Dignity
                </span>
              </h1>

              <p className="mt-6 text-lg md:text-xl text-orange-50 leading-relaxed max-w-xl">
                Safe, accessible and compassionate transportation for elderly
                passengers and people with disabilities — from your doorstep
                to your destination.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <a
                  href="#booking"
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-white text-orange-600 font-bold rounded-xl shadow-lg hover:bg-orange-50 transition-all duration-300"
                >
                  Book Assistance
                  <ArrowRight className="w-5 h-5" />
                </a>

                <a
                  href="tel:+919873101537"
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 border-2 border-white/70 text-white font-bold rounded-xl hover:bg-white/10 transition-all duration-300"
                >
                  <Phone className="w-5 h-5" />
                  Call Us
                </a>
              </div>
            </div>

            {/* Hero card */}
            <div className="lg:flex justify-end">
              <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl">
                <div className="w-20 h-20 bg-orange-500 rounded-2xl flex items-center justify-center text-white mb-6">
                  <Accessibility className="w-10 h-10" />
                </div>

                <h2 className="text-2xl font-bold text-gray-900">
                  Assistance When You Need It
                </h2>

                <p className="mt-3 text-gray-600 leading-relaxed">
                  Our service is designed around the passenger — providing
                  additional assistance, patient drivers and accessible travel
                  options.
                </p>

                <div className="mt-6 space-y-4">
                  {[
                    "Verified & trained drivers",
                    "Door-to-door assistance",
                    "Hospital & medical trips",
                    "Wheelchair-friendly options",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 text-gray-700"
                    >
                      <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK INFO */}
      <section className="relative -mt-8 z-10 px-6">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl border border-orange-100">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: <ShieldCheck className="w-6 h-6" />,
                title: "Verified Drivers",
                text: "Trained & verified",
              },
              {
                icon: <Accessibility className="w-6 h-6" />,
                title: "Accessible",
                text: "Passenger-friendly",
              },
              {
                icon: <Clock className="w-6 h-6" />,
                title: "Flexible",
                text: "Scheduled trips",
              },
              {
                icon: <HeartHandshake className="w-6 h-6" />,
                title: "Compassionate",
                text: "Patient assistance",
              },
            ].map((item, index) => (
              <div
                key={item.title}
                className={`p-6 flex items-center gap-4 ${
                  index !== 3 ? "lg:border-r border-orange-100" : ""
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                  {item.icon}
                </div>

                <div>
                  <h3 className="font-bold text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-orange-600 font-bold uppercase tracking-wider text-sm">
              Our Services
            </span>

            <h2 className="mt-3 text-3xl md:text-4xl font-bold text-gray-900">
              Assistance Designed Around You
            </h2>

            <p className="mt-4 text-gray-600 text-lg">
              From medical appointments to everyday travel, CSC Travels
              provides additional support for a comfortable journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service) => (
              <div
                key={service.title}
                className="bg-white rounded-3xl p-8 shadow-lg border border-orange-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center text-white mb-6">
                  {service.icon}
                </div>

                <h3 className="text-2xl font-bold text-gray-900">
                  {service.title}
                </h3>

                <p className="mt-3 text-gray-600 leading-relaxed">
                  {service.description}
                </p>

                <div className="mt-6 space-y-3">
                  {service.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center gap-3 text-gray-700"
                    >
                      <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-orange-600 font-bold uppercase tracking-wider text-sm">
              Simple Process
            </span>

            <h2 className="mt-3 text-3xl md:text-4xl font-bold text-gray-900">
              How It Works
            </h2>

            <p className="mt-4 text-gray-600 text-lg">
              Getting accessible transportation is simple.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                <div className="bg-orange-50 rounded-3xl p-7 h-full border border-orange-100">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 bg-orange-500 text-white rounded-2xl flex items-center justify-center">
                      {step.icon}
                    </div>

                    <span className="text-4xl font-bold text-orange-100">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {index < steps.length - 1 && (
                  <div className="hidden lg:flex absolute top-1/2 -right-5 z-10 w-10 h-10 rounded-full bg-white shadow-md items-center justify-center text-orange-500">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOOKING */}
      <section
        id="booking"
        className="py-24 px-6 bg-gradient-to-br from-orange-50 to-white"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-12 items-start">
            {/* Booking intro */}
            <div className="lg:col-span-2">
              <span className="text-orange-600 font-bold uppercase tracking-wider text-sm">
                Book a Trip
              </span>

              <h2 className="mt-3 text-3xl md:text-4xl font-bold text-gray-900">
                Tell Us What You Need
              </h2>

              <p className="mt-5 text-gray-600 leading-relaxed">
                Share your travel requirements and our team will get in touch
                with you to confirm the vehicle, driver and assistance needed.
              </p>

              <div className="mt-8 space-y-5">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>

                  <div>
                    <p className="font-semibold text-gray-900">Call us</p>
                    <a
                      href="tel:+919873101537"
                      className="text-orange-600 hover:text-orange-700"
                    >
                      +91 98731 01537
                    </a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>

                  <div>
                    <p className="font-semibold text-gray-900">
                      Service Area
                    </p>
                    <p className="text-gray-600">
                      Patna and surrounding areas
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>

                  <div>
                    <p className="font-semibold text-gray-900">
                      Advance Booking
                    </p>
                    <p className="text-gray-600">
                      Schedule your trip in advance
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              <form
                onSubmit={handleSubmit}
                className="bg-white rounded-3xl shadow-xl border border-orange-100 p-6 md:p-8"
              >
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Passenger Name *
                    </label>

                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      placeholder="Enter passenger name"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Phone Number *
                    </label>

                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="pickup"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Pickup Location *
                    </label>

                    <input
                      id="pickup"
                      name="pickup"
                      type="text"
                      required
                      placeholder="Pickup address"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="destination"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Destination *
                    </label>

                    <input
                      id="destination"
                      name="destination"
                      type="text"
                      required
                      placeholder="Destination address"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="date"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Travel Date *
                    </label>

                    <input
                      id="date"
                      name="date"
                      type="date"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="time"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Preferred Time *
                    </label>

                    <input
                      id="time"
                      name="time"
                      type="time"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label
                      htmlFor="assistance"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Assistance Required *
                    </label>

                    <select
                      id="assistance"
                      name="assistance"
                      required
                      defaultValue=""
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition"
                    >
                      <option value="" disabled>
                        Select assistance type
                      </option>
                      <option value="accessibility">
                        Wheelchair Assistance
                      </option>
                      <option value="elderly">Elderly Passenger</option>
                      <option value="medical">Hospital / Medical Trip</option>
                      <option value="door-to-door">
                        Door-to-Door Assistance
                      </option>
                      <option value="other">Other Assistance</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label
                      htmlFor="message"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Additional Requirements
                    </label>

                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      placeholder="Tell us anything else we should know..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition resize-none"
                    />
                  </div>
                </div>

                {submitted && (
                  <div className="mt-5 flex items-start gap-3 rounded-xl bg-green-50 border border-green-200 p-4 text-green-700">
                    <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />

                    <div>
                      <p className="font-semibold">
                        Request received successfully!
                      </p>
                      <p className="text-sm mt-1">
                        Our team will contact you to confirm the booking.
                      </p>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="mt-6 w-full flex items-center justify-center gap-2 px-6 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Request Assistance
                  <ArrowRight className="w-5 h-5" />
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  Our team will contact you to confirm availability and
                  requirements.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-6 pb-24">
        <div className="max-w-6xl mx-auto rounded-3xl overflow-hidden bg-gradient-to-r from-orange-500 to-orange-600">
          <div className="px-6 py-14 md:px-12 text-center text-white">
            <Accessibility className="w-12 h-12 mx-auto mb-5" />

            <h2 className="text-3xl md:text-4xl font-bold">
              Everyone Deserves a Comfortable Journey
            </h2>

            <p className="mt-4 text-orange-50 max-w-2xl mx-auto text-lg">
              Need assistance for yourself or a family member? Contact CSC
              Travels and let us help plan a safe and comfortable trip.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
              <a
                href="#booking"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-orange-600 font-bold rounded-xl hover:bg-orange-50 transition"
              >
                Book Now
                <ArrowRight className="w-5 h-5" />
              </a>

              <a
                href="tel:+919873101537"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border-2 border-white/70 text-white font-bold rounded-xl hover:bg-white/10 transition"
              >
                <Phone className="w-5 h-5" />
                +91 98731 01537
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}