import React from 'react'
import { Menu, X, Phone, Mail, MapPin, Car, Users, Shield, Clock, ChevronRight, Send, Bike, Plane, Star, Award, CheckCircle, IndianRupee } from 'lucide-react';
const Stats = () => {

    const stats = [
    { number: '500+', label: 'Happy Clients', icon: <Users className="w-6 h-6" /> },
    { number: '15+', label: 'Vehicles', icon: <Car className="w-6 h-6" /> },
    { number: '24/7', label: 'Service', icon: <Clock className="w-6 h-6" /> },
    { number: '100%', label: 'Satisfaction', icon: <Star className="w-6 h-6" /> },
  ];

  return (
      <section className="py-16 gradient-bg relative overflow-hidden z-40">
        <div className="absolute inset-0 shimmer"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-30">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 ">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center text-white animate-on-scroll animate-scale z-30" style={{animationDelay: `${idx * 0.1}s`}}>
                <div className="inline-flex z-50 items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-4 backdrop-blur-sm">
                  {stat.icon}
                </div>
                <div className="text-4xl md:text-5xl font-bold text-orange-700 mb-2 z-30">{stat.number}</div>
                <div className="text-lg opacity-90 z-30 text-orange-700">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
  )
}

export default Stats
