import React from "react";
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="mt-20 border-t border-[#d6c8ad] bg-[#0f172a] text-slate-200">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <div className="mb-5 flex items-center gap-3">
              <div className="h-12 w-12 overflow-hidden rounded-2xl border border-slate-700 bg-white">
                <Image
                  src="/logo2.png"
                  alt="CSC Travels Logo"
                  width={96}
                  height={100}
                  className="h-full w-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-white">CSC Travels</h3>
            </div>
            <p className="text-sm leading-relaxed text-slate-300">
              Cooperative-first transportation platform offering city rides, group travel, and outstation mobility across Patna and nearby regions.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <SocialIcon href="https://facebook.com" label="Facebook" icon={<Facebook className="h-4 w-4" />} />
              <SocialIcon href="https://instagram.com" label="Instagram" icon={<Instagram className="h-4 w-4" />} />
              <SocialIcon href="https://linkedin.com" label="LinkedIn" icon={<Linkedin className="h-4 w-4" />} />
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-lg font-semibold text-white">Explore</h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li><Link href="/" className="hover:text-white">Home</Link></li>
              <li><Link href="/About" className="hover:text-white">About</Link></li>
              <li><Link href="/Services" className="hover:text-white">Services</Link></li>
              <li><Link href="/Partners" className="hover:text-white">Partners</Link></li>
              <li><Link href="/Contact" className="hover:text-white">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-lg font-semibold text-white">Primary Services</h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>Car Rentals</li>
              <li>Corporate Mobility</li>
              <li>Traveler Booking</li>
              <li>Airport Transfers</li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-lg font-semibold text-white">Contact</h4>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 text-amber-300" />
                <span>Shanti Devi Nivas, Anishabad, Patna, Bihar 800002</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-amber-300" />
                <a href="tel:+919873101537" className="hover:text-white">+91 98731 01537</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-amber-300" />
                <a href="mailto:booking@csctravels.com" className="hover:text-white">booking@csctravels.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-slate-700 pt-6 text-xs text-slate-400 md:flex-row md:items-center">
          <p>&copy; 2026 CSC Travels Services Pvt. Ltd. All rights reserved.</p>
          <p>Built for dependable travel in Bihar.</p>
        </div>
      </div>
    </footer>
  );
};

const SocialIcon = ({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-600 bg-slate-800 text-slate-200 transition hover:border-amber-300 hover:text-white"
    >
      {icon}
    </a>
  );
};

export default Footer;
