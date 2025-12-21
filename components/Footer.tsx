import React from 'react'
import { Mail, Phone, MapPin } from "lucide-react"
import Image from 'next/image'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-16 z-80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-80">
        
        <div className="grid md:grid-cols-4 gap-8 mb-12 z-80">
          
          {/* Logo + About */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-14 h-14 rounded-full overflow-hidden">
                <Image 
                  src="/logo2.jpg" 
                  alt="CSC Travels Logo" 
                  width={100} 
                  height={100} 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-white">CSC Travels</h3>
            </div>

            <p className="text-gray-300 mb-4">
              1st floor, Shanti Devi Nivas, near Sichai bhawan, Anishabad Patna, Bihar 800002
            </p>

            {/* Social Icons */}
            <div className="flex space-x-3">
              <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-orange-600 transition-all text-white">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12S0 5.446 0 12.073c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>

              <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-orange-400 transition-all text-white">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775A4.958 4.958 0 0023.29 2.62c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105 13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985a14.1 14.1 0 00-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>

              <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-pink-600 transition-all text-white">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384C.935 3.35.63 4.14.333 4.905.072 7.053 0 8.333 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zM12 19.34c-4.052 0-7.34-3.288-7.34-7.34 0-4.052 3.288-7.34 7.34-7.34 4.052 0 7.34 3.288 7.34 7.34 0 4.052-3.288 7.34-7.34 7.34z"/>
                </svg>
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
                <a href="mailto:bookings@csctravels.com" className="hover:text-white transition">
                  bookings@csctravels.com
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
