"use client";

import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  // Handle scroll
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
    <nav className={`fixed top-0 w-full z-50 transition-all ${navClasses}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* LOGO AREA */}
          <div className="flex items-center space-x-3">
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-orange-500">
              <Image
                src="/logo2.jpg"
                alt="CSC Travels Logo"
                width={100}
                height={100}
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
                CSC Travels
              </h1>
              <p className="text-xs text-gray-600">Premium Travel Services</p>
            </div>
          </div>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center space-x-8">

            <Link href="/" className={linkStyle}>
              Home
              <span className={underline}></span>
            </Link>

            <Link href="/Services" className={linkStyle}>
              Services
              <span className={underline}></span>
            </Link>

            <Link href="/Partners" className={linkStyle}>
              Partners
              <span className={underline}></span>
            </Link>

            <Link href="/Contact" className={linkStyle}>
              Contact
              <span className={underline}></span>
            </Link>

            <a
              href="tel:+919873101537"
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-full font-medium shadow-lg transition-all"
            >
              Book Now
            </a>

            {/* CITI LOGO – CIRCLE */}
            <a
              href="https://citizencooperative.in/"
              target="_blank"
              className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200"
            >
              <Image
                src="/Citilogo.png"
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

            <Link
              href="/"
              onClick={() => setIsMenuOpen(false)}
              className="block py-2 text-gray-700 hover:text-orange-600"
            >
              Home
            </Link>

            <Link
              href="/services"
              onClick={() => setIsMenuOpen(false)}
              className="block py-2 text-gray-700 hover:text-orange-600"
            >
              Services
            </Link>

            <Link
              href="/partners"
              onClick={() => setIsMenuOpen(false)}
              className="block py-2 text-gray-700 hover:text-orange-600"
            >
              Partners
            </Link>

            <Link
              href="/contact"
              onClick={() => setIsMenuOpen(false)}
              className="block py-2 text-gray-700 hover:text-orange-600"
            >
              Contact
            </Link>

            <a
              href="tel:+919873101537"
              className="block bg-orange-500 text-white px-6 py-3 rounded-full text-center font-medium shadow-lg"
            >
              Book Now
            </a>

          </div>
        </div>
      )}

    </nav>
  );
};

export default Navbar;
