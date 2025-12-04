"use client"

import { Mail, Phone, MapPin, Clock } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-16 flex items-center justify-center">
      <div className="max-w-5xl w-full bg-white border border-gray-200 rounded-2xl shadow-md p-6 md:p-12 space-y-12">

        {/* HEADER */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl md:text-4xl font-bold text-orange-600">
            Contact CSC Travels
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            Have a question or want to book a trip? We’d love to hear from you.
          </p>
        </div>

        {/* CONTACT SECTION */}
        <div className="grid md:grid-cols-2 gap-10">

          {/* LEFT - DETAILS */}
          <div className="space-y-6">

            <div className="flex gap-4">
              <Phone className="text-orange-500" />
              <div>
                <p className="font-semibold text-gray-800">Phone</p>
                <p className="text-gray-600">+91 98731 01537</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Mail className="text-orange-500" />
              <div>
                <p className="font-semibold text-gray-800">Email</p>
                <p className="text-gray-600">
                  info@csctravels.com
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <MapPin className="text-orange-500" />
              <div>
                <p className="font-semibold text-gray-800">Office Address</p>
                <p className="text-gray-600 leading-relaxed">
                  CSC Travels<br />
                  Patna, Bihar<br />
                  India – 800001
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <Clock className="text-orange-500" />
              <div>
                <p className="font-semibold text-gray-800">Working Hours</p>
                <p className="text-gray-600">
                  Mon – Sat: 9:00 AM – 8:00 PM
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT - FORM */}
          <form className="space-y-5">

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Message
              </label>
              <textarea
                rows={5}
                placeholder="Write your message..."
                className="w-full border border-gray-300 px-4 py-3 rounded-lg resize-none focus:ring-2 focus:ring-orange-400 outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition"
            >
              Send Message
            </button>

          </form>
        </div>

        {/* MAP SECTION */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 text-center">
            Find Us on Map
          </h2>

          <div className="w-full h-80 border border-gray-200 rounded-xl overflow-hidden">
            <iframe
              src="https://www.google.com/maps?q=Patna+Bihar&output=embed"
              width="100%"
              height="100%"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="border-0"
            ></iframe>
          </div>
        </div>

      </div>
    </div>
  )
}
