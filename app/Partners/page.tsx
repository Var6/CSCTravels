import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { BackgroundGradient } from "@/components/ui/background-gradient";

const partners = [
       {
        name: "Citizen Jaivik",
        description: "Delivering fresh, organic food and vegetables directly to your doorstep.",
        url: "#",
        color: "bg-green-600",
    },
     {
        name: "Citizen Housing",
        description: "Empowering citizens through cooperative banking and financial services.",
        url: "https://citizenhousing.in",
        color: "bg-blue-600",
    },
    {
        name: "Citizen IMF",
        description: "Comprehensive insurance solutions for your peace of mind.",
        url: "#",
        color: "bg-purple-600",
    },
 
];

export default function Partners() {
    return (
        <main className="min-h-screen bg-gray-50">
            
            {/* TOP HEADER */}
            <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-display font-bold text-gray-900 mb-6">
                        Powered By
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        We are proud to be the Member Citizen Cooperative Society, working
                        together to provide holistic services to our community.
                    </p>
                </div>

                {/* --- STATIC CARD WITH MOVING BORDER --- */}

                <div className="relative w-[600px] mx-auto mb-5">
                    
                    {/* MOVING BORDER (absolute overlay) */}
                    <BackgroundGradient>

                    {/* CARD */}
                    <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg border-5 border-blue-300">
                        <div className="h-48 border-b-2 border-black flex items-center justify-center gap-3 px-3">
                            <Image
                                height={120}
                                width={120}
                                src="/Citilogo.png"
                                alt="Citi Logo"
                                />
                            <span className="text-black text-2xl font-bold">
                                Citizen Savings & Credit Co-operative Society
                            </span>
                        </div>

                        <div className="p-8">
                            <h3 className="text-2xl font-bold mb-4 text-gray-900">Name</h3>
                            <p className="text-gray-600 mb-6">
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam
                                aperiam voluptatem in omnis totam!
                            </p>
                            <Link
                                href="https://citizencooperative.in"
                                target="_blank"
                                className="inline-flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all"
                                >
                                Visit Website <ArrowRight size={18} />
                            </Link>
                        </div>
                    </div>
                                </BackgroundGradient>
                </div>

                {/* PARTNERS SECTION */}
                <div className="pt-10">
                    <div className="text-center mb-16">
                        <h1 className="text-5xl font-display font-bold text-gray-900 mb-6">
                            Our Partners
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            We are proud to be part of the Citizen ecosystem, working together
                            to provide holistic services to our community.
                        </p>
                    </div>

                    {/* PARTNER LIST */}
                    <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
                        {partners.map((partner, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow border border-gray-100 group"
                            >
                                <div className={`h-48 ${partner.color} flex items-center justify-center`}>
                                    <span className="text-white text-3xl font-bold">
                                        {partner.name}
                                    </span>
                                </div>
                                <div className="p-8">
                                    <h3 className="text-2xl font-bold mb-4 text-gray-900">
                                        {partner.name}
                                    </h3>
                                    <p className="text-gray-600 mb-6">{partner.description}</p>
                                    <Link
                                        href={partner.url}
                                        target="_blank"
                                        className="inline-flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all"
                                    >
                                        Visit Website <ArrowRight size={18} />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
