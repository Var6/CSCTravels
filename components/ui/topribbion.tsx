import React from 'react'
import { Mail, Phone, Facebook, Instagram, Linkedin } from 'lucide-react';
import XLogo from '../XLogo';

const Topribbion = () => {
  return (
     <div className="bg-linear-to-r from-orange-600 to-orange-500 pb-4 top-0 sticky text-white shadow-md py-2 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
          {/* Contact Section - Left */}
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Mail size={16} />
              <a
                href="mailto:Booking@csctravel.com"
                className="hover:opacity-80 transition-opacity"
              >
                Booking@csctravel.com
              </a>
            </div>
            <span className="opacity-60">|</span>
            <div className="flex items-center gap-2">
              <Phone size={16} />
              <a
                href="tel:+919873101537"
                className="hover:opacity-80 transition-opacity"
              >
                +91 98731 01537
              </a>
            </div>
          </div>

          {/* Social Media Links - Right */}
          <div className="flex items-center gap-4">
            <a
              href="https://www.facebook.com/share/18LUspKNQu/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-110 transition-transform duration-200"
              aria-label="CSC Travels on Facebook"
            >
              <Facebook size={20} />
            </a>

            <a
              href="https://x.com/CscTravels43283"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-110 transition-transform duration-200"
              aria-label="CSC Travels on X"
            >
              <XLogo className="w-[18px] h-[18px]" />
            </a>

            <a
              href="https://www.instagram.com/csc.travel"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-110 transition-transform duration-200"
              aria-label="CSC Travels on Instagram"
            >
              <Instagram size={20} />
            </a>

            <a
              href="https://www.linkedin.com/company/csc-travels/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-110 transition-transform duration-200"
              aria-label="CSC Travels on LinkedIn"
            >
              <Linkedin size={20} />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Topribbion
