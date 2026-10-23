import Link from "next/link";
import { ArrowRight, Building2, MapPin } from "lucide-react";
import Image from "next/image";

const partners = [
    {
        name: "Citizen Cooperative",
        description:
            "Trusted cooperative financial services with deposits, savings, and loan solutions for individuals and groups.",
        line: "Your trusted cooperative partner for growth and financial security.",
        url: "https://citizencooperative.in",
        logo: "/finalcitilogo.png",
        address: "1st Floor, Shanti Devi Nivas, Near Sichai Bhavan, Patna",
        contact: "0612-2255447 • info@citizencooperative.in",
        accent: "from-orange-500 to-orange-600",
    },
    {
        name: "Citizen Housing",
        description:
            "Verified property discovery and end-to-end real estate assistance including buy/sell, legal support, and consultation.",
        line: "Your trusted partner in finding the perfect home across India.",
        url: "https://citizenhousing.in",
        logo: "/Citilogo.png",
        address: "1st Floor, Shanti Devi Nivas, Near Sichai Bhavan, Patna",
        contact: "+91 90310 07097 • sales@citizenimf.com",
        accent: "from-sky-500 to-blue-600",
    },
    {
        name: "Citizen Jaivik",
        description:
            "Community-first daily essentials and wellness-focused offerings designed to support healthier, quality living.",
        line: "Fresh choices, trusted network, better lifestyle for cooperative families.",
        url: "https://citizenjaivik.com",
        logo: "/citizenjaivik-logo.png",
        address: "Citizen ecosystem support center, Patna, Bihar",
        contact: "Jaivik@citizenagriculture.in",
        accent: "from-emerald-500 to-green-600",
    },
    {
        name: "Citizen IMF",
        description:
            "Financial and support services focused on convenience, guidance, and strong member relationships.",
        line: "Reliable support for day-to-day financial planning and service needs.",
        url: "https://citizenimf.com",
        logo: "/citizenimf-logo.png",
        address: "Citizen ecosystem support center, Patna, Bihar",
        contact: "+91 90310 07097 • hello@citizenimf.com",
        accent: "from-violet-500 to-purple-600",
    },
];

export default function Partners() {
    return (
        <main className="min-h-screen bg-linear-to-b from-orange-50 via-white to-orange-50">
            <section className="pt-40 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="text-center mb-14">
                    <p className="text-sm font-semibold tracking-[0.2em] uppercase text-orange-600 mb-3">Partner Network</p>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-5">Trusted Institutions Powering CSC Travels</h1>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        We collaborate with reputed Citizen-group organizations to deliver dependable travel, housing, and member-focused support services.
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-2">
                    {partners.map((partner) => (
                        <article key={partner.name} className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition-all">
                            <div className={`h-2 bg-linear-to-r ${partner.accent}`} />

                            <div className="p-6 md:p-7">
                                <div className="flex items-start gap-4">
                                    <div className="w-14 h-14 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                                        <Image src={partner.logo} alt={`${partner.name} logo`} width={50} height={50} className="object-contain" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900">{partner.name}</h3>
                                        <p className="text-orange-600 font-medium mt-1">{partner.line}</p>
                                    </div>
                                </div>

                                <p className="text-gray-600 mt-5 leading-relaxed">{partner.description}</p>

                                <div className="mt-5 space-y-2 text-sm">
                                    <p className="text-gray-700 flex items-start gap-2">
                                        <MapPin size={16} className="text-orange-600 mt-0.5" />
                                        <span>{partner.address}</span>
                                    </p>
                                    <p className="text-gray-700 flex items-start gap-2">
                                        <Building2 size={16} className="text-orange-600 mt-0.5" />
                                        <span>{partner.contact}</span>
                                    </p>
                                </div>

                                {partner.url ? (
                                    <Link
                                        href={partner.url}
                                        target="_blank"
                                        className="mt-6 inline-flex items-center gap-2 text-orange-600 font-semibold hover:gap-3 transition-all"
                                    >
                                        Visit Website
                                        <ArrowRight size={18} />
                                    </Link>
                                ) : (
                                    <p className="mt-6 text-sm font-semibold text-gray-500">Official website link will be updated soon.</p>
                                )}
                            </div>
                        </article>
                    ))}
                </div>
            </section>
        </main>
    );
}
