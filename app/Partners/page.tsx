import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, MapPin, Phone, Mail } from "lucide-react";

const partners = [
  {
    name: "Citizen Cooperative",
    description: "Cooperative finance network supporting member-first savings and loan services.",
    line: "Financial trust infrastructure for citizen communities.",
    url: "https://citizencooperative.in",
    logo: "/finalcitilogo.png",
    contact: "0612-2255447",
    email: "info@citizencooperative.in",
    accent: "bg-[#2563eb]",
  },
  {
    name: "Citizen Housing",
    description: "Property discovery and support for verified residential and commercial options.",
    line: "Housing pathways with cooperative guidance.",
    url: "https://citizenhousing.in",
    logo: "/Citilogo.png",
    contact: "+91 90310 07097",
    email: "sales@citizenimf.com",
    accent: "bg-[#d97706]",
  },
  {
    name: "Citizen Jaivik",
    description: "Organic farm-to-fork vegetable platform delivering chemical-free produce across Patna with eco-conscious packaging.",
    line: "100% organic freshness delivered to your doorstep.",
    url: "https://www.citizenjaivik.com",
    logo: "/Citilogo.png",
    contact: "+91 98765 43210",
    email: "jaivik@citizenagriculture.in",
    accent: "bg-[#15803d]",
  },
  {
    name: "Citizen IMF",
    description: "Insurance marketplace focused on policy comparison, claim support, and fast activation across health, life, motor, and travel categories.",
    line: "Your trusted insurance partner with 24/7 support.",
    url: "https://citizenimf.com",
    logo: "/Citilogo.png",
    contact: "+91 90310 07097",
    email: "hello@citizenimf.com",
    accent: "bg-[#1e40af]",
  },
];

export default function PartnersPage() {
  return (
    <main className="pt-32 px-4 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-7xl rounded-3xl bg-gradient-to-r from-[#f59e0b] to-[#d97706] px-6 py-14 text-white sm:px-10">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-100">Partner Ecosystem</p>
        <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight sm:text-5xl">
          Institutions that strengthen the CSC mobility network
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-amber-50 sm:text-base">
          We collaborate with trusted Citizen-group institutions to create a dependable and integrated service environment.
        </p>
      </section>

      <section className="mx-auto mt-8 grid max-w-7xl gap-6 md:grid-cols-2">
        {partners.map((partner) => (
          <article key={partner.name} className="surface overflow-hidden rounded-3xl">
            <div className={`h-2 ${partner.accent}`} />
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl border border-[#e9dbc2] bg-white">
                  <Image src={partner.logo} alt={partner.name} width={56} height={56} className="h-full w-full object-contain" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900">{partner.name}</h2>
                  <p className="mt-1 text-sm font-semibold text-slate-600">{partner.line}</p>
                </div>
              </div>

              <p className="mt-5 text-sm leading-relaxed text-slate-600">{partner.description}</p>

              <div className="mt-5 space-y-2 text-sm text-slate-700">
                <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-[#2563eb]" /> Patna, Bihar</p>
                <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-[#2563eb]" /> {partner.contact}</p>
                <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-[#2563eb]" /> {partner.email}</p>
              </div>

              {partner.url ? (
                <Link
                  href={partner.url}
                  target="_blank"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#2563eb] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#1d4ed8]"
                >
                  Visit Website
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              ) : (
                <p className="mt-6 text-sm font-semibold text-slate-500">Official website link will be updated soon.</p>
              )}
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
