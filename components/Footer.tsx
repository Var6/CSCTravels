import React from 'react'
import { Mail, Phone, MapPin,Facebook, Twitter, Instagram  } from "lucide-react"
import Image from 'next/image'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-16 z-80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-80">
        <div className="grid md:grid-cols-4 gap-8 mb-12 z-80">
          
          {/* Logo + About */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-18 h-14 rounded-full overflow-hidden">
                <Image 
                  src="/logo2.jpg" 
                  alt="CSC Travels Logo" 
                  width={150} 
                  height={100} 
                  className="w-full h-full object-cover fill"
                />
              </div>
              <h3 className="text-xl font-bold text-white">CSC Travel Services Pvt. Ltd.</h3>
            </div>

            <p className="text-gray-300 mb-4">
              1st floor, Shanti Devi Nivas, near Sichai bhawan, Anishabad Patna, Bihar 800002
            </p>

            {/* Social Icons */}
  <div className="flex space-x-3">
      
      {/* Facebook */}
      <a
        href="#"
        aria-label="Facebook"
        className="w-10 h-10 rounded-lg flex items-center justify-center 
                   bg-[#1877F2]/90 hover:bg-[#1877F2] 
                   text-white transition-all duration-300 
                   hover:scale-110 shadow-lg"
      >
        <Facebook className="w-5 h-5" />
      </a>

      {/* Twitter / X */}
      <a
        href="#"
        aria-label="Twitter"
        className="w-10 h-10 rounded-lg flex items-center justify-center 
                   bg-[#1DA1F2]/90 hover:bg-[#1DA1F2] 
                   text-white transition-all duration-300 
                   hover:scale-110 shadow-lg"
      >
        <Twitter className="w-5 h-5" />
      </a>

      {/* Instagram */}
      <a
        href="#"
        aria-label="Instagram"
        className="w-10 h-10 rounded-lg flex items-center justify-center 
                   bg-gradient-to-tr from-pink-500 via-purple-500 to-orange-400
                   hover:from-pink-600 hover:via-purple-600 hover:to-orange-500
                   text-white transition-all duration-300 
                   hover:scale-110 shadow-lg"
      >
        <Instagram className="w-5 h-5" />
      </a>

    </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#home" className="hover:text-white transition">Home</a></li>
              <li><a href="#services" className="hover:text-white transition">Services</a></li>
              <li><a href="#fleet" className="hover:text-white transition">Our Fleet</a></li>
              <li><a href="#contact" className="hover:text-white transition">Contact</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-white">Our Services</h4>
            <ul className="space-y-2 text-gray-300">
              <li>Car Rentals</li>
              <li>Bike Rentals</li>
              <li>Traveler Bookings</li>
              <li>Airport Transfers</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-white">Contact Info</h4>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 mr-2 mt-1 text-orange-500" />
                <span>Patna, Bihar, India</span>
              </li>
              <li className="flex items-start">
                <Phone className="w-5 h-5 mr-2 mt-1 text-orange-500" />
                <a href="tel:+919873101537" className="hover:text-white transition">+91 98731 01537</a>
              </li>
              <li className="flex items-start">
                <Mail className="w-5 h-5 mr-2 mt-1 text-orange-500" />
                <a href="mailto:booking@csctravels.com" className="hover:text-white transition">
                  booking@csctravels.com
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
            <p>&copy; 2025 CSC Travels. All rights reserved.</p>
            <p className="mt-2 md:mt-0">Designed with ❤️ for premium travel experience</p>
          </div>
        </div>

      </div>
    </footer>
  )
}

export default Footer
