import React from 'react'
import { Mail, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Topribbion = () => {
  return (
     <div className="bg-linear-to-r from-orange-600 to-orange-500 pb-4 top-0 sticky text-white shadow-md py-2 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
          {/* Email Section - Left */}
          <div className="flex items-center gap-2">
            <Mail size={16} />
            <a 
              href="mailto:Bookings@csctravel.com" 
              className="text-sm hover:opacity-80 transition-opacity"
            >
              Bookings@csctravel.com
            </a>
          </div>

          {/* Social Media Links - Right */}
          <div className="flex items-center gap-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-110 transition-transform duration-200"
              aria-label="Facebook"
            >
              <Facebook size={20} />
            </a>
            
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-110 transition-transform duration-200"
              aria-label="Twitter"
            >
              <Twitter size={20} />
            </a>
            
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-110 transition-transform duration-200"
              aria-label="Instagram"
            >
              <Instagram size={20} />
            </a>
            
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-110 transition-transform duration-200"
              aria-label="LinkedIn"
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
