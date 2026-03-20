import { CarTaxiFront, ShieldCheck, HeartHandshake, Clock3 } from "lucide-react";
import { Timeline } from "@/components/ui/timeline";

const values = [
  {
    icon: ShieldCheck,
    title: "Safety Discipline",
    description: "Vehicle checks, verified drivers, and route monitoring are non-negotiable.",
  },
  {
    icon: HeartHandshake,
    title: "Human Support",
    description: "Every booking is backed by real people, not just automated flows.",
  },
  {
    icon: Clock3,
    title: "Operational Consistency",
    description: "Punctual dispatch, clear updates, and predictable service behavior.",
  },
];

const journey = [
  { year: "2017", title: "Foundation in Patna", description: "Started with a focused city fleet and a cooperative service mindset." },
  { year: "2019", title: "Fleet and Team Expansion", description: "Scaled operations with more drivers, better coverage, and stronger support." },
  { year: "2021", title: "Digital Booking Process", description: "Added easier request channels and service coordination through online touchpoints." },
  { year: "2024", title: "Structured Growth", description: "Built stronger partner integrations and improved customer response quality." },
];

export default function AboutPage() {
  return (
    <main className="pt-32">
      <section className="px-4 pb-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-3xl bg-gradient-to-r from-[#1d4ed8] to-[#1e40af] px-6 py-14 text-white sm:px-10">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-100">About CSC Travels</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight sm:text-5xl">
            Built to make local transport dependable, not uncertain.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-blue-50 sm:text-base">
            We started in Patna with one goal: provide transport that people can rely on every single day. Our work combines
            service quality, cooperative values, and practical operations.
          </p>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
          {values.map((value) => (
            <article key={value.title} className="surface rounded-3xl p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff1cc] text-[#d97706]">
                <value.icon className="h-6 w-6" />
              </div>
              <h2 className="mt-5 text-2xl font-extrabold text-slate-900">{value.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{value.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 rounded-3xl border border-[#ded0b5] bg-white/70 p-7 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#d97706]">Our Operating Promise</p>
            <h2 className="mt-3 text-3xl font-black text-slate-900">Clarity in pricing, respect in service</h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">
              We maintain a transparent fare model and communicate trip details before travel. Whether the ride is short or long,
              customers should know what to expect and feel supported end-to-end.
            </p>
          </div>
          <div className="rounded-2xl bg-[#0f172a] p-6 text-slate-100">
            <div className="flex items-center gap-3">
              <CarTaxiFront className="h-6 w-6 text-amber-300" />
              <p className="text-lg font-bold">Coverage Highlights</p>
            </div>
            <ul className="mt-4 space-y-2 text-sm text-slate-300">
              <li>Intracity rides in Patna</li>
              <li>Outstation routes with fixed slabs</li>
              <li>Group and event mobility planning</li>
              <li>Airport and station focused dispatch</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#2563eb]">Journey</p>
            <h2 className="mt-2 text-3xl font-black text-slate-900">Key milestones</h2>
          </div>
          <Timeline data={journey} />
        </div>
      </section>
    </main>
  );
}
