import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fare Structure | Intracity and Outstation",
  description:
    "Official CSC Travels fare chart for Patna intracity and outstation travel, including member and employee discount policy.",
  alternates: {
    canonical: "https://csctravels.com/Services",
  },
  openGraph: {
    title: "CSC Travels Fare Structure",
    description:
      "Transparent taxi pricing for intracity and outstation rides with fixed rates and discount policies.",
    url: "https://csctravels.com/Services",
    type: "article",
  },
};

const marketRates = [
  { service: 'CSC Travels', city: '₹20/KM', outstation: '₹12/KM', notes: 'Transparent fixed rate' },
  { service: 'National Competetor', city: '₹20–₹25/KM', outstation: '₹12–₹14/KM', notes: 'Surge pricing extra' },
  { service: 'International Competetor', city: '₹20–₹26/KM', outstation: '₹12–₹15/KM', notes: 'Demand-based rate changes' },
  { service: 'local Competetor (Car)', city: '₹20–₹22/KM', outstation: 'Limited availability', notes: 'Mostly city rides' }
];

export default function ServicePage() {
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Intracity and Outstation Taxi Service",
    provider: {
      "@type": "Organization",
      name: "CSC Travels Services Pvt. Ltd.",
      url: "https://csctravels.com",
      telephone: "+91-98731-01537",
      email: "booking@csctravels.com",
    },
    areaServed: {
      "@type": "Place",
      name: "Patna, Bihar, India",
    },
    offers: [
      {
        "@type": "Offer",
        name: "Intracity Ride",
        priceCurrency: "INR",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: 20,
          unitText: "KM",
        },
      },
      {
        "@type": "Offer",
        name: "Outstation Ride",
        priceCurrency: "INR",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: 12,
          unitText: "KM",
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-orange-50/40 mt-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <section className="bg-linear-to-r from-orange-600 to-orange-500 text-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="uppercase tracking-[0.2em] text-sm text-orange-100 mb-3">CSC Travels Services Pvt. Ltd.</p>
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">Fare Structure for Intracity & Outstation Travel</h1>
          <p className="mt-4 text-orange-50/95 max-w-3xl text-base md:text-lg">
            Effective immediately until further notice. Fixed pricing, clear KM billing, and no surge pricing.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        <section className="bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden">
          <div className="px-6 py-4 bg-orange-100/70 border-b border-orange-200">
            <h2 className="text-xl md:text-2xl font-bold text-orange-700">1) Intracity Rides (Within City Limits)</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm md:text-base">
              <thead>
                <tr className="bg-orange-600 text-white">
                  <th className="text-left p-4">Ride Type</th>
                  <th className="text-left p-4">Charges</th>
                  <th className="text-left p-4">Illustration</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-orange-100">
                  <td className="p-4 font-semibold text-gray-800">Normal Ride (City Use)</td>
                  <td className="p-4 text-gray-700">₹20 per KM</td>
                  <td className="p-4 text-gray-600">Standard city tariff</td>
                </tr>
                <tr className="border-b border-orange-100 bg-orange-50/50">
                  <td className="p-4 font-semibold text-gray-800">One-Way Ride</td>
                  <td className="p-4 text-gray-700">₹20/KM on running KM + ₹8.5/KM empty return</td>
                  <td className="p-4 text-gray-600">40 KM × ₹20 = ₹800; return 40 KM × ₹8.5 = ₹340</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-gray-800">Round Trip Ride</td>
                  <td className="p-4 text-gray-700">Entire journey at ₹20/KM</td>
                  <td className="p-4 text-gray-600">Meter-based full round journey</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <div className="grid lg:grid-cols-2 gap-8">
          <section className="bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden">
            <div className="px-6 py-4 bg-orange-100/70 border-b border-orange-200">
              <h2 className="text-xl md:text-2xl font-bold text-orange-700">2) Outstation Rides (Outside Patna City)</h2>
            </div>
            <ul className="p-6 space-y-4 text-gray-700">
              <li className="flex justify-between gap-4 border-b border-orange-100 pb-3">
                <span className="font-semibold">Outstation Travel</span>
                <span>₹12 per KM (as per meter)</span>
              </li>
              <li className="flex justify-between gap-4 border-b border-orange-100 pb-3">
                <span className="font-semibold">Toll Tax</span>
                <span>Charged extra on actual basis</span>
              </li>
              <li className="flex justify-between gap-4">
                <span className="font-semibold">Parking Charges</span>
                <span>Charged extra on actual basis</span>
              </li>
            </ul>
          </section>

          <section className="bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden">
            <div className="px-6 py-4 bg-orange-100/70 border-b border-orange-200">
              <h2 className="text-xl md:text-2xl font-bold text-orange-700">3) Night Stay & 8-Hour Vehicle Booking</h2>
            </div>
            <div className="p-6 space-y-5 text-gray-700">
              <div className="rounded-xl bg-orange-50 p-4 border border-orange-100">
                <p className="font-semibold text-gray-900">Driver Night Stay</p>
                <p>Additional charges applicable as per management approval.</p>
              </div>
              <div className="rounded-xl bg-orange-50 p-4 border border-orange-100">
                <p className="font-semibold text-gray-900">8 Hours Package (Only Vehicle)</p>
                <p>₹1400 – ₹1800 (depends on vehicle type)</p>
                <p className="mt-2 text-sm text-gray-600">Includes: Only vehicle | Excludes: Driver, fuel, toll, parking</p>
              </div>
            </div>
          </section>
        </div>

        <section className="bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden">
          <div className="px-6 py-4 bg-orange-100/70 border-b border-orange-200">
            <h2 className="text-xl md:text-2xl font-bold text-orange-700">Market Rate Comparison (Approx.)</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm md:text-base">
              <thead>
                <tr className="bg-orange-600 text-white">
                  <th className="text-left p-4">Service</th>
                  <th className="text-left p-4">In-City Rate</th>
                  <th className="text-left p-4">Outstation Rate</th>
                  <th className="text-left p-4">Notes</th>
                </tr>
              </thead>
              <tbody>
                {marketRates.map((row) => (
                  <tr key={row.service} className="border-b border-orange-100 last:border-b-0 hover:bg-orange-50/60">
                    <td className="p-4 font-semibold text-gray-900">{row.service}</td>
                    <td className="p-4 text-gray-700">{row.city}</td>
                    <td className="p-4 text-gray-700">{row.outstation}</td>
                    <td className="p-4 text-gray-600">{row.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="px-6 py-4 text-sm text-gray-600 bg-orange-50/50 border-t border-orange-100">
            Note: App-based cab rates change based on demand, time, and surge. CSC Advantage: fixed rate, no surge pricing, clear KM billing.
          </p>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-orange-100 p-6 space-y-6">
          <h2 className="text-xl md:text-2xl font-bold text-orange-700">Important Guidelines</h2>
          <ul className="space-y-3 text-gray-700">
            <li>Fuel and vehicle maintenance charges are included in applicable fare calculations.</li>
            <li>Toll tax, parking fees, and night stay charges are added separately in the final bill.</li>
            <li>Any revision in rates is implemented only after management approval.</li>
          </ul>

          <div className="rounded-2xl bg-linear-to-r from-orange-600 to-orange-500 text-white p-6">
            <h3 className="text-xl md:text-2xl font-bold">Special Note: Member & Employee Benefit Discount Policy</h3>
            <div className="mt-4 grid md:grid-cols-2 gap-4 text-sm md:text-base">
              <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                <p className="font-semibold">Cooperative Members Benefit</p>
                <p className="mt-1">All registered cooperative members get 10% discount on total fare.</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                <p className="font-semibold">Official & Employee Travel Benefit</p>
                <p className="mt-1">25% discount for official duties, official visits, and employee travel (subject to management approval).</p>
              </div>
            </div>
            <ul className="mt-4 space-y-2 text-orange-50/95 text-sm md:text-base list-disc pl-5">
              <li>Discount applies on base fare.</li>
              <li>Valid identity proof or official confirmation is required.</li>
              <li>Official trip discounts are valid only for genuine authorized official travel.</li>
            </ul>
          </div>

          <div className="text-sm text-gray-600 pt-2 border-t border-orange-100">
            Issued By: CSC Travels Services Pvt. Ltd. (Authorized Signatory)
          </div>
        </section>
      </div>
    </div>
  );
}