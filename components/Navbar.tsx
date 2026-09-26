"use client";

import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import TopRibbon from "./topheader";
import Topribbion from "./ui/topribbion";
import { useAuth } from "@/lib/useAuth";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const { user, isLoggedIn, loading: authLoading } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navClasses =
    scrollY > 40
      ? "bg-white/70 backdrop-blur-md shadow-md"
      : "bg-white/90 backdrop-blur-sm";

  const linkStyle =
    "text-gray-700 hover:text-orange-600 transition-all font-medium relative group";

  const underline =
    "absolute bottom-0 left-0 w-0 h-0.5 bg-orange-600 group-hover:w-full transition-all duration-300";

  return (
    <nav className={`fixed top-0 w-full z-100 transition-all ${navClasses}`}>
      <Topribbion />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* LOGO AREA */}
          <Link href="/" aria-label="CSC Travels home" className="flex items-center space-x-3">
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-orange-500">
              <Image
                src="/logo2.png"
                alt="CSC Travels Logo"
                width={100}
                height={100}
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <h1 className="text-xl sm:text-2xl font-bold bg-linear-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
                CSC Travels
              </h1>
              <p className="text-xs text-gray-600">Premium Travel Services</p>
            </div>
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className={linkStyle}>
              Home<span className={underline}></span>
            </Link>
            <Link href="/About" className={linkStyle}>
              About<span className={underline}></span>
            </Link>
            <Link href="/Services" className={linkStyle}>
              Services<span className={underline}></span>
            </Link>
            <Link href="/Partners" className={linkStyle}>
              Partners<span className={underline}></span>
            </Link>
            <Link href="/Contact" className={linkStyle}>
              Contact<span className={underline}></span>
            </Link>

            {!authLoading && isLoggedIn ? (
              <div className="relative">
                <button type="button" onClick={() => setProfileOpen((open) => !open)} aria-expanded={profileOpen} className="rounded-full border border-orange-500 px-5 py-2 text-sm font-semibold text-orange-600 transition hover:bg-orange-50">
                  My Profile
                </button>
                {profileOpen && (
                  <div className="absolute right-0 top-full z-[120] mt-3 w-72 rounded-2xl border border-gray-100 bg-white p-5 shadow-xl">
                    <p className="text-xs font-bold uppercase tracking-wide text-orange-600">Customer profile</p>
                    <p className="mt-2 truncate font-bold text-gray-900">{user?.name}</p>
                    <p className="mt-1 truncate text-sm text-gray-600">{user?.email || "Email not added"}</p>
                    <p className="mt-1 text-sm text-gray-600">{user?.phone || "Phone not added"}</p>
                    <Link href="/booking?tab=account" onClick={() => setProfileOpen(false)} className="mt-4 flex w-full items-center justify-center rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-orange-600">
                      View complete profile
                    </Link>
                  </div>
                )}
              </div>
            ) : !authLoading && (
              <Link
                href="/login?next=%2Fbooking"
                className="rounded-full border border-orange-500 px-5 py-2 text-sm font-semibold text-orange-600 transition hover:bg-orange-50"
              >
                Log In
              </Link>
            )}

            <Link
              href={isLoggedIn ? "/booking" : "/?login=1"}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-full font-medium shadow-lg transition-all"
            >
              Book Now
            </Link>

            {/* CITI LOGO */}
            <a
              href="https://citizencooperative.in/"
              target="_blank"
              className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200"
            >
              <Image
                src="/finalcitilogo.png"
                alt="Citizen Logo"
                width={50}
                height={50}
                className="w-full h-full object-cover"
              />
            </a>
          </div>

          {/* MOBILE BUTTON */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-700 hover:text-orange-600 transition"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t">
          <div className="px-6 py-6 space-y-4">
            <Link href="/" onClick={() => setIsMenuOpen(false)} className="block py-2 text-gray-700 hover:text-orange-600">Home</Link>
            <Link href="/About" onClick={() => setIsMenuOpen(false)} className="block py-2 text-gray-700 hover:text-orange-600">About</Link>
            <Link href="/Services" onClick={() => setIsMenuOpen(false)} className="block py-2 text-gray-700 hover:text-orange-600">Services</Link>
            <Link href="/Partners" onClick={() => setIsMenuOpen(false)} className="block py-2 text-gray-700 hover:text-orange-600">Partners</Link>
            <Link href="/Contact" onClick={() => setIsMenuOpen(false)} className="block py-2 text-gray-700 hover:text-orange-600">Contact</Link>

            {!authLoading && isLoggedIn ? (
              <div>
                <button type="button" onClick={() => setProfileOpen((open) => !open)} aria-expanded={profileOpen} className="block w-full rounded-full border border-orange-500 px-6 py-3 text-center font-semibold text-orange-600 hover:bg-orange-50">
                  My Profile
                </button>
                {profileOpen && (
                  <div className="mt-2 rounded-2xl border border-gray-100 bg-white p-5 shadow-lg">
                    <p className="text-xs font-bold uppercase tracking-wide text-orange-600">Customer profile</p>
                    <p className="mt-2 truncate font-bold text-gray-900">{user?.name}</p>
                    <p className="mt-1 truncate text-sm text-gray-600">{user?.email || "Email not added"}</p>
                    <p className="mt-1 text-sm text-gray-600">{user?.phone || "Phone not added"}</p>
                    <Link href="/booking?tab=account" onClick={() => { setProfileOpen(false); setIsMenuOpen(false); }} className="mt-4 flex w-full items-center justify-center rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-orange-600">
                      View complete profile
                    </Link>
                  </div>
                )}
              </div>
            ) : !authLoading && (
              <Link
                href="/login?next=%2Fbooking"
                onClick={() => setIsMenuOpen(false)}
                className="block rounded-full border border-orange-500 px-6 py-3 text-center font-semibold text-orange-600 hover:bg-orange-50"
              >
                Log In
              </Link>
            )}

            <Link
              href={isLoggedIn ? "/booking" : "/?login=1"}
              onClick={() => setIsMenuOpen(false)}
              className="block bg-orange-500 text-white px-6 py-3 rounded-full text-center font-medium shadow-lg"
            >
              Book Now
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
