import type { Metadata } from "next";
import { CheckCircle2, BadgePercent, CircleDollarSign } from "lucide-react";

export const metadata: Metadata = {
  title: "Fare Structure | Intracity and Outstation",
  description: "Official CSC Travels fare chart for Patna intracity and outstation travel.",
  alternates: {
    canonical: "https://csctravels.com/Services",
  },
};

const marketRates = [
  { service: "CSC Travels", city: "INR 20/KM", outstation: "INR 12/KM", notes: "Fixed and transparent structure" },
  { service: "National App Competitor", city: "INR 20-25/KM", outstation: "INR 12-14/KM", notes: "Surge and demand-based changes" },
  { service: "International App Competitor", city: "INR 20-26/KM", outstation: "INR 12-15/KM", notes: "Variable pricing by traffic and demand" },
  { service: "Local Car Provider", city: "INR 20-22/KM", outstation: "Limited", notes: "Mostly city-only availability" },
];

const highlights = [
  "No hidden surge pricing for standard categories",
  "Clear billing logic for one-way and round trips",
  "Member and employee discount policy available",
];

export default function ServicePage() {
  return (
    <main className="pt-32">
      <section className="px-4 pb-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-3xl bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#334155] px-6 py-14 text-white sm:px-10">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-300">Fare Structure</p>
          <h1 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">Intracity and Outstation Pricing</h1>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-200 sm:text-base">
            Transparent tariffs, predictable billing, and policy-backed discounts for cooperative members and official travel.
          </p>
        </div>
      </section>

      <section className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-3">
          <article className="surface rounded-3xl p-6 lg:col-span-2">
            <h2 className="text-2xl font-black text-slate-900">Intracity (Within City Limits)</h2>
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[560px] text-sm">
                <thead>
                  <tr className="bg-[#2563eb] text-white">
                    <th className="px-4 py-3 text-left">Ride Type</th>
                    <th className="px-4 py-3 text-left">Charges</th>
                    <th className="px-4 py-3 text-left">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[#ebdfca] bg-white/70">
                    <td className="px-4 py-3 font-semibold text-slate-800">Normal Ride</td>
                    <td className="px-4 py-3 text-slate-700">INR 20/KM</td>
                    <td className="px-4 py-3 text-slate-600">Standard city tariff</td>
                  </tr>
                  <tr className="border-b border-[#ebdfca] bg-[#fff7e7]">
                    <td className="px-4 py-3 font-semibold text-slate-800">One-Way Ride</td>
                    <td className="px-4 py-3 text-slate-700">INR 20/KM running + INR 8.5/KM return</td>
                    <td className="px-4 py-3 text-slate-600">Return empty run billed separately</td>
                  </tr>
                  <tr className="bg-white/70">
                    <td className="px-4 py-3 font-semibold text-slate-800">Round Trip</td>
                    <td className="px-4 py-3 text-slate-700">INR 20/KM</td>
                    <td className="px-4 py-3 text-slate-600">Complete round journey billed by KM</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </article>

          <article className="surface rounded-3xl p-6">
            <h2 className="text-xl font-black text-slate-900">Outstation</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-700">
              <li className="rounded-xl border border-[#eadbc0] bg-white px-4 py-3">Base Fare: INR 12/KM</li>
              <li className="rounded-xl border border-[#eadbc0] bg-white px-4 py-3">Toll Tax: actual</li>
              <li className="rounded-xl border border-[#eadbc0] bg-white px-4 py-3">Parking: actual</li>
              <li className="rounded-xl border border-[#eadbc0] bg-white px-4 py-3">Night Stay: applicable as approved</li>
            </ul>
          </article>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-3xl bg-[#1d4ed8] p-7 text-white">
          <h2 className="text-2xl font-black">Benefit Policy</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-blue-300/30 bg-white/10 p-4">
              <div className="flex items-center gap-2 text-amber-200">
                <BadgePercent className="h-4 w-4" />
                <p className="font-bold">Registered Cooperative Members</p>
              </div>
              <p className="mt-2 text-sm text-blue-50">10% discount on base fare.</p>
            </div>
            <div className="rounded-2xl border border-blue-300/30 bg-white/10 p-4">
              <div className="flex items-center gap-2 text-amber-200">
                <CircleDollarSign className="h-4 w-4" />
                <p className="font-bold">Official and Employee Trips</p>
              </div>
              <p className="mt-2 text-sm text-blue-50">Up to 25% discount with management approval.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-4 text-2xl font-black text-slate-900">Market Comparison</h2>
          <div className="surface overflow-x-auto rounded-3xl p-3">
            <table className="w-full min-w-[700px] text-sm">
              <thead>
                <tr className="bg-[#f1e5cf] text-slate-800">
                  <th className="px-4 py-3 text-left">Service</th>
                  <th className="px-4 py-3 text-left">In-City</th>
                  <th className="px-4 py-3 text-left">Outstation</th>
                  <th className="px-4 py-3 text-left">Notes</th>
                </tr>
              </thead>
              <tbody>
                {marketRates.map((row) => (
                  <tr key={row.service} className="border-b border-[#eadac0] last:border-b-0">
                    <td className="px-4 py-3 font-semibold text-slate-900">{row.service}</td>
                    <td className="px-4 py-3 text-slate-700">{row.city}</td>
                    <td className="px-4 py-3 text-slate-700">{row.outstation}</td>
                    <td className="px-4 py-3 text-slate-600">{row.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ul className="mt-5 space-y-2 text-sm text-slate-600">
            {highlights.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-[#2563eb]" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
