import React from 'react'
import { Menu, X, Phone, Mail, MapPin, Car, Users, Shield, Clock, ChevronRight, Send, Bike, Plane, Star, Award, CheckCircle, IndianRupee } from 'lucide-react';
const Service = () => {
    
    const features = [
        { icon: <Shield className="w-8 h-8" />, title: '100% Safe', desc: 'GPS tracked & insured vehicles' },
        { icon: <Clock className="w-8 h-8" />, title: '24/7 Available', desc: 'Round the clock service' },
        { icon: <Award className="w-8 h-8" />, title: 'Experienced Drivers', desc: 'Professional & verified' },
        { icon: <Star className="w-8 h-8" />, title: 'Best Rates', desc: 'Affordable pricing guaranteed' },
      ];
    
      const services = [
        { icon: <Car className="w-10 h-10" />, title: 'Car Rentals', desc: 'Premium cars for all occasions', features: ['Hyundai Aura', 'Maruti Swift', 'WagonR', 'Premium Sedans'] },
        { icon: <Bike className="w-10 h-10" />, title: 'Bus Services', desc: 'Comfortable group transportation', features: ['Rental Bike', 'Hire and Puchase', '20-50 Seater', 'Long Distance'] },
        { icon: <Users className="w-10 h-10" />, title: 'Travelers', desc: 'Perfect for family & friends', features: ['8-14 Seater', 'AC Available', 'Luggage Space', 'Flexible Routes'] },
      ];
  return (
    <section id="services" className="py-24 bg-linear-to-b from-white to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-on-scroll">
            <span className="text-orange-600 font-semibold text-sm uppercase tracking-wider">Our Services</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-4">
             <span className='text-outline'>Choose Your
              </span>  <span className="gradient-text">Perfect Ride</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From cars to buses, we have the perfect vehicle for every journey
            </p>
          </div>

          <div className="grid md:grid-cols-3 text-orange-500 gap-8 z-50">
            {services.map((service, idx) => (
              <div 
                key={idx} 
                className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 card-hover group animate-on-scroll border-2 border-transparent hover:border-orange-200 z-50"
                style={{animationDelay: `${idx * 0.2}s`}}
              >
                <div className="w-20 h-20 gradient-bg rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 z-50">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3 group-hover:text-orange-600 transition-colors z-50">{service.title}</h3>
                <p className="text-gray-600 mb-6">{service.desc}</p>
                <ul className="space-y-3">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-gray-700">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
                    {/* Features Grid */}
          <div className="grid md:grid-cols-4 gap-6 mt-7">
            {features.map((feature, idx) => (
              <div 
                key={idx} 
                className="text-center p-6 bg-linear-to-br from-orange-50 to-orange-50 rounded-2xl hover:shadow-lg transition-all duration-300 animate-on-scroll"
                style={{animationDelay: `${idx * 0.1}s`}}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 gradient-bg rounded-2xl text-white mb-4">
                  {feature.icon}
                </div>
                <h4 className="font-bold text-gray-900 mb-2">{feature.title}</h4>
                <p className="text-sm text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
        
      </section>
  )
}

export default Service
