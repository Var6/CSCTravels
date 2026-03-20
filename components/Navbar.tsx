"use client";

import React, { useState, useEffect } from "react";
import { Menu, X, Phone, Mail } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { href: "/", label: "Home" },
    { href: "/About", label: "About" },
    { href: "/Services", label: "Services" },
    { href: "/Partners", label: "Partners" },
    { href: "/Contact", label: "Contact" },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="bg-[#1d4ed8] text-[#eff6ff]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-2 text-xs sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <a href="tel:+919873101537" className="flex items-center gap-2 hover:text-white">
              <Phone className="h-3.5 w-3.5" />
              +91 98731 01537
            </a>
            <a href="mailto:booking@csctravels.com" className="flex items-center gap-2 hover:text-white">
              <Mail className="h-3.5 w-3.5" />
              booking@csctravels.com
            </a>
          </div>
          <p className="hidden text-[#dbeafe] md:block">Patna's cooperative-backed travel network</p>
        </div>
      </div>

      <nav className={`transition-all duration-300 ${scrolled ? "surface shadow-lg" : "bg-white/90"}`}>
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="h-12 w-12 overflow-hidden rounded-2xl border border-[#f59e0b]/40 bg-white shadow-sm">
              <Image
                src="/logo2.png"
                alt="CSC Travels Logo"
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="text-xl font-extrabold tracking-tight text-slate-900">
                CSC Travels
              </p>
              <p className="text-xs text-slate-600">Service. Safety. Structure.</p>
            </div>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-semibold text-slate-700 transition-colors hover:text-[#2563eb]"
              >
                {link.label}
              </Link>
            ))}
            <a
              href="tel:+919873101537"
              className="rounded-full bg-[#f59e0b] px-5 py-2.5 text-sm font-bold text-slate-900 transition hover:bg-[#fbbf24]"
            >
              Book Ride
            </a>
            <a
              href="https://citizencooperative.in/"
              target="_blank"
              rel="noreferrer"
              className="h-10 w-10 overflow-hidden rounded-full border border-slate-200"
            >
              <Image
                src="/finalcitilogo.png"
                alt="Citizen Logo"
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </a>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-slate-700 transition hover:text-[#2563eb] md:hidden"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="surface border-t md:hidden">
          <div className="space-y-2 px-6 py-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="block rounded-lg px-2 py-2 text-sm font-semibold text-slate-700 hover:bg-[#fff3d8]"
              >
                {link.label}
              </Link>
            ))}
            <a
              href="tel:+919873101537"
              className="mt-2 block rounded-full bg-[#f59e0b] px-5 py-3 text-center text-sm font-bold text-slate-900"
            >
              Book Ride
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
