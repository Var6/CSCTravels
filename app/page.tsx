import Link from "next/link";
import { ArrowRight, ShieldCheck, Clock3, CarTaxiFront, Users, Plane, CheckCircle2 } from "lucide-react";
import type { ReactNode } from "react";

const services = [
  {
    title: "City Cabs",
    description: "Quick and reliable rides across Patna with transparent meter-based pricing.",
    icon: CarTaxiFront,
  },
  {
    title: "Airport & Station Transfers",
    description: "On-time pickups for flights and trains with real-world route planning.",
    icon: Plane,
  },
  {
    title: "Traveler & Group Mobility",
    description: "Comfortable multi-seater options for families, teams, and events.",
    icon: Users,
  },
];

const trustPoints = [
  "GPS-tracked and maintained vehicles",
  "Verified drivers with service training",
  "Dedicated support and cooperative accountability",
  "Fair pricing with no hidden surge tactics",
];

export default function HomePage() {
  return (
    <main className="pt-32">
      <section className="hero-grid relative overflow-hidden px-4 pb-20 pt-10 sm:px-6 lg:px-8">
        <div className="absolute -left-20 top-10 h-56 w-56 rounded-full bg-amber-300/30 blur-3xl" />
        <div className="absolute -right-16 top-20 h-72 w-72 rounded-full bg-blue-300/30 blur-3xl" />
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="rise-in">
            <p className="mesh-pill inline-flex rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-800">
              Trusted in Patna Since 2017
            </p>
            <h1 className="mt-6 text-4xl font-black leading-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Movement That Feels
              <span className="text-[#2563eb]"> Structured</span>,
              <span className="text-[#d97706]"> Safe</span>, and Human.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
              CSC Travels blends cooperative ethics with premium transport execution. Book city rides, airport transfers,
              and group journeys with transparent billing and responsive support.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/Contact"
                className="inline-flex items-center gap-2 rounded-full bg-[#2563eb] px-7 py-3 text-sm font-bold text-white transition hover:bg-[#1d4ed8]"
              >
                Book a Ride
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/Services"
                className="inline-flex items-center gap-2 rounded-full border border-[#d1c09f] bg-white/70 px-7 py-3 text-sm font-bold text-slate-800 transition hover:bg-[#fff4dc]"
              >
                View Fare Structure
              </Link>
            </div>
          </div>

          <div className="surface rise-in rounded-3xl p-6 sm:p-8">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#2563eb]">Why People Choose Us</p>
            <div className="mt-5 space-y-4">
              <StatRow icon={<ShieldCheck className="h-5 w-5" />} label="Safety-first fleet and onboarding" value="100% verified" />
              <StatRow icon={<Clock3 className="h-5 w-5" />} label="Support and ride availability" value="24/7" />
              <StatRow icon={<Users className="h-5 w-5" />} label="Trips delivered annually" value="500+" />
            </div>
            <div className="mt-7 rounded-2xl bg-[#0f172a] p-5 text-slate-100">
              <p className="text-sm text-slate-300">Quick Connect</p>
              <a href="tel:+919873101537" className="mt-1 block text-2xl font-extrabold text-amber-300">
                +91 98731 01537
              </a>
              <p className="mt-1 text-xs text-slate-400">Booking desk for city and outstation travel</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#d97706]">Core Services</p>
              <h2 className="mt-2 text-3xl font-black text-slate-900 sm:text-4xl">Built for daily needs and long routes</h2>
            </div>
            <Link href="/Services" className="text-sm font-bold text-[#2563eb] hover:text-[#1d4ed8]">
              Full pricing details
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {services.map((service) => (
              <article key={service.title} className="surface rounded-3xl p-6 transition duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff1cc] text-[#d97706]">
                  <service.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-2xl font-extrabold text-slate-900">{service.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{service.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-6 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 rounded-3xl bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#334155] p-7 text-white lg:grid-cols-2 lg:p-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">Key Concepts</p>
            <h2 className="mt-3 text-3xl font-black">Reliable operations, transparent intent</h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-200">
              Every trip follows a simple principle: clear communication, verified people, and predictable outcomes.
              This is the structure behind our city network.
            </p>
          </div>
          <ul className="space-y-3 text-sm text-slate-100">
            {trustPoints.map((point) => (
              <li key={point} className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-amber-300" />
                {point}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}

const StatRow = ({ icon, label, value }: { icon: ReactNode; label: string; value: string }) => {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-[#e8dac0] bg-white px-4 py-3">
      <div className="flex items-center gap-2 text-slate-700">
        <span className="text-[#2563eb]">{icon}</span>
        <span className="text-sm font-semibold">{label}</span>
      </div>
      <span className="text-sm font-extrabold text-slate-900">{value}</span>
    </div>
  );
};
