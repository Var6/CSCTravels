'use client';
import React, { useState, useEffect, useRef, JSX } from 'react';
import { Menu, X, Phone, Mail, MapPin, Car, Users, Shield, Clock, ChevronRight, Send, Bike, Plane, Star, Award, CheckCircle, IndianRupee } from 'lucide-react';
import emailjs from '@emailjs/browser';
import Image from 'next/image';
import Link from 'next/link';
import Floating from '@/components/floating';
import CarModel from '@/components/carmodel';
import Partners from './Partners/page';


const CSCTravelsLanding = () => {
  
  const [scrollY, setScrollY] = useState(0);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [formStatus, setFormStatus] = useState('');
  const [activeService, setActiveService] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observerOptions = { 
      threshold: 0.1, 
      rootMargin: '0px 0px -50px 0px' 
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveService(prev => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    setFormStatus('sending');

    try {
      const result = await emailjs.send(
        'service_lvx7awe',
        'template_a5l253f',
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
        },
        '8SKteo8GEKvXbMwvp'
      );

      console.log(result.text);
      setFormStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '' });

      setTimeout(() => setFormStatus(''), 3000);
    } catch (error) {
      console.error('EmailJS Error:', error);
      setFormStatus('error');
      setTimeout(() => setFormStatus(''), 3000);
    }
  };

  const vehicles = [
    { name: 'Luxury Cars', icon: <Image src='/aura.avif' alt='aura car' height={100} width={100} />, desc: 'Premium sedans for comfortable rides', seats: '4+1', color: 'from-orange-500 to-orange-600' },
    { name: 'Econommic Bike', icon: <Image src='/bike.png' alt='aura car' height={100} width={100} />, desc: 'Spacious buses for group travel', seats: '20-50', color: 'from-orange-500 to-orange-600' },
    { name: 'Travelers', icon: <Image src='/new.png' alt='aura car' height={100} width={100} />, desc: 'Perfect for family trips', seats: '8-14', color: 'from-orange-600 to-orange-500' },
  ];

  const services = [
    { icon: <Car className="w-10 h-10" />, title: 'Car Rentals', desc: 'Premium cars for all occasions', features: ['Hyundai Aura', 'Maruti Swift', 'WagonR', 'Premium Sedans'] },
    { icon: <Bike className="w-10 h-10" />, title: 'Bus Services', desc: 'Comfortable group transportation', features: ['Rental Bike', 'Hire and Puchase', '20-50 Seater', 'Long Distance'] },
    { icon: <Users className="w-10 h-10" />, title: 'Travelers', desc: 'Perfect for family & friends', features: ['8-14 Seater', 'AC Available', 'Luggage Space', 'Flexible Routes'] },
  ];

  const features = [
    { icon: <Shield className="w-8 h-8" />, title: '100% Safe', desc: 'GPS tracked & insured vehicles' },
    { icon: <Clock className="w-8 h-8" />, title: '24/7 Available', desc: 'Round the clock service' },
    { icon: <Award className="w-8 h-8" />, title: 'Experienced Drivers', desc: 'Professional & verified' },
    { icon: <Star className="w-8 h-8" />, title: 'Best Rates', desc: 'Affordable pricing guaranteed' },
  ];

  const stats = [
    { number: '500+', label: 'Happy Clients', icon: <Users className="w-6 h-6" /> },
    { number: '15+', label: 'Vehicles', icon: <Car className="w-6 h-6" /> },
    { number: '24/7', label: 'Service', icon: <Clock className="w-6 h-6" /> },
    { number: '100%', label: 'Satisfaction', icon: <Star className="w-6 h-6" /> },
  ];

  return (
    <div className="min-h-screen bg-white">
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInLeft {
          from { opacity: 0; transform: translateX(-40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeInRight {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(2deg); }
        }
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.4); }
          50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.8); }
        }
        .animate-in { animation: fadeInUp 0.8s ease-out forwards; opacity: 0; }
        .animate-in.delay-1 { animation-delay: 0.1s; }
        .animate-in.delay-2 { animation-delay: 0.2s; }
        .animate-in.delay-3 { animation-delay: 0.3s; }
        .animate-in.delay-4 { animation-delay: 0.4s; }
        .animate-fade-left { animation: fadeInLeft 0.8s ease-out forwards; opacity: 0; }
        .animate-fade-right { animation: fadeInRight 0.8s ease-out forwards; opacity: 0; }
        .animate-scale { animation: scaleIn 0.6s ease-out forwards; opacity: 0; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .gradient-text { 
            background: linear-gradient(
            135deg,
            #ff7a18 0%,
            #ff5f03 50%,
            #ff3b00 100%
      );
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
}
        .gradient-bg { background: linear-gradient(
            135deg, 
            #ffb144 0%,
            #ff8603 50%,
            #cd6c02 100% 
            ); }
        .gradient-hover { 
          background: linear-gradient(
            #ff8603 0%,
            #cd6c02 100% ); 
          background-size: 200% 200%;
          transition: all 0.3s ease;
        }
        .gradient-hover:hover { background-position: right center; transform: translateY(-2px); }
        .shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          background-size: 1000px 100%;
          animation: shimmer 3s infinite;
        }
        .glass-effect {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
        .card-hover {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .card-hover:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 40px rgba(59, 130, 246, 0.2);
        }
        .animate-on-scroll { opacity: 0; }
      `}</style>

   

      {/* Hero Section */}
      <section id="home" className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl animate-float"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl animate-float" style={{animationDelay: '4s'}}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center z-50">
            <div className="space-y-6 z-50">
              <div className="animate-on-scroll animate-fade-left z-50">
                <span className="inline-block z-50 bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-semibold mb-4 bg-clip-text">
                  🚗 Premium Travel Partner in Patna
                </span>
              </div>
              
              <h1 className="text-5xl z-70  md:text-6xl lg:text-7xl font-bold leading-tight animate-on-scroll animate-fade-left delay-1">
               <span className='text-outline z-70'>Travel in</span>  <br/>
               <span className="gradient-text z-70">Comfort</span>
               <span className='text-outline z-70'> & </span>  
               <span className="gradient-text z-70">Style</span>
              </h1>
              
              <p className="text-xl bg-white bg-opacity-5  text-gray-600 leading-relaxed animate-on-scroll animate-fade-left delay-2 padding-2">
                Experience premium travel services with our fleet of cars, buses, and travelers. Safe, reliable, and available 24/7 across Patna and beyond.
              </p>
              
              <div className="flex flex-wrap gap-4 animate-on-scroll animate-fade-left delay-3">
                <a href="#contact" className="gradient-hover text-white px-8 py-4 rounded-full font-semibold shadow-xl hover:shadow-2xl flex items-center group">
                  Get Started
                  <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
                <a href="tel:+919873101537" className="bg-white border-2 border-orange-600 text-orange-600 px-8 py-4 rounded-full font-semibold hover:bg-orange-50 shadow-lg transition-all flex items-center group">
                  <Phone className="mr-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
                  Call Now
                </a>
              </div>

              <div className="flex items-center gap-8 pt-4 animate-on-scroll animate-fade-left delay-4 ">
                <div className="flex -space-x-2 ">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-400 border-2 border-white"></div>
                  ))}
                </div>
                <div>
                  <div className="flex text-orange-500">
                    {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-current" />)}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">500+ Happy Customers</p>
                </div>
              </div>
            </div>
            
            <div className="relative animate-on-scroll animate-fade-right">
              <div className="relative animate-float">
                <CarModel />
                <div className="absolute inset-0 gradient-bg opacity-20 blur-3xl rounded-full"></div>
                <svg viewBox="0 0 500 400" className="w-full relative z-10">
                  <defs>
                    <linearGradient id="carGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{stopColor: '#3b82f6'}} />
                      <stop offset="100%" style={{stopColor: '#f97316'}} />

                    </linearGradient>
                    <filter id="shadow">
                      <feDropShadow dx="0" dy="10" stdDeviation="15" floodColor="#3b82f6" floodOpacity="0.3"/>
                    </filter>
                  </defs>
                  
                  {/* Car */}
                  
                  
                  {/* Road lines */}
                  <rect x="50" y="270" width="80" height="4" rx="2" fill="#cbd5e1" opacity="0.5" />
                  <rect x="170" y="270" width="80" height="4" rx="2" fill="#cbd5e1" opacity="0.5" />
                  <rect x="290" y="270" width="80" height="4" rx="2" fill="#cbd5e1" opacity="0.5" />
                  <rect x="410" y="270" width="80" height="4" rx="2" fill="#cbd5e1" opacity="0.5" />
                </svg>
              </div>
              </div>
              
              {/* Floating badges */}
              <div className="fixed z-20 bottom-100 right-4 border-2 border-orange-500 bg-white rounded-2xl shadow-xl p-4 animate-float" style={{animationDelay: '2s'}}>
               <Floating icon={ <Clock className="w-6 h-6 text-orange-600" />} text1="24/7 Service" text2="Always Available" />
              </div>

              <div className="fixed z-20 bottom-75 right-4 border-2 border-orange-500 bg-white rounded-2xl shadow-xl p-4 animate-float" style={{animationDelay: '1s'}}>
               <Floating icon={<Shield className="w-6 h-6 text-orange-600" />} text1="100% Safe & Secure" text2="Safest" />
              </div>
              <div className="fixed z-20 bottom-75 left-4 border-2 border-orange-500 bg-white rounded-2xl shadow-xl p-4 animate-float" style={{animationDelay: '1s'}}>
               <Floating icon={<MapPin className="w-6 h-6 text-orange-600 z-5"  />} text1="100% Safe & Secure" text2="Safest" />
              </div>
              <div className="fixed z-20 bottom-100 left-4 border-2 border-orange-500 bg-white rounded-2xl shadow-xl p-4 animate-float" style={{animationDelay: '1s'}}>
               <Floating icon={<IndianRupee className="w-6 h-6 text-orange-600" />} text1="Affordable rate" text2="Pocket Friendly" />
              </div>  
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 gradient-bg relative overflow-hidden">
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

      {/* Services Section */}
      <section id="services" className="py-24 bg-gradient-to-b from-white to-orange-50">
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

          <div className="grid md:grid-cols-3 text-orange-500 gap-8">
            {services.map((service, idx) => (
              <div 
                key={idx} 
                className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 card-hover group animate-on-scroll border-2 border-transparent hover:border-orange-200"
                style={{animationDelay: `${idx * 0.2}s`}}
              >
                <div className="w-20 h-20 gradient-bg rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3 group-hover:text-orange-600 transition-colors">{service.title}</h3>
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
                className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-50 rounded-2xl hover:shadow-lg transition-all duration-300 animate-on-scroll"
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

      {/* Fleet Section */}
      <section id="fleet" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-on-scroll">
            <span className="text-orange-600 font-semibold text-sm uppercase tracking-wider">Our Fleet</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-4">
              <span className='text-outline'>Well-Maintained </span>
              <span className="gradient-text">Vehicles</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose from our diverse fleet of premium vehicles
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {vehicles.map((vehicle, idx) => (
              <div 
                key={idx} 
                className="bg-gradient-to-br from-white to-orange-50 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 card-hover group animate-on-scroll border border-orange-100"
                style={{animationDelay: `${idx * 0.15}s`}}
              >
                <div className={`w-full h-48 bg-gradient-to-br ${vehicle.color} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-105 transition-transform duration-300 shadow-lg`}>
                  {vehicle.icon}
                </div>
                <h3 className="text-2xl font-bold mb-2 group-hover:text-orange-600 text-orange-500 transition-colors">{vehicle.name}</h3>
                <p className="text-gray-600 mb-4">{vehicle.desc}</p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <span className="text-sm text-gray-500">Capacity</span>
                  <span className="font-semibold text-orange-600">{vehicle.seats} Seats</span>
                </div>
              </div>
            ))}
          </div>


        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 gradient-bg relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-float"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-float" style={{animationDelay: '3s'}}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 text-white animate-on-scroll">
            <span className="font-semibold text-sm uppercase tracking-wider opacity-90">Get In Touch</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-4">
              Let's Start Your Journey
            </h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Book your ride now or send us your queries
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8 animate-on-scroll animate-fade-left">
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold text-white mb-6">Contact Information</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4 group cursor-pointer">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div className="text-white">
                      <h4 className="font-semibold text-lg mb-1">Phone</h4>
                      <a href="tel:+919873101537" className="hover:text-orange-200 transition text-lg">+91 98731 01537</a>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4 group cursor-pointer">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div className="text-white">
                      <h4 className="font-semibold text-lg mb-1">Email</h4>
                      <a href="mailto:bookings@csctravels.com" className="hover:text-orange-200 transition">bookings@csctravels.com</a>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4 group cursor-pointer">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div className="text-white">
                      <h4 className="font-semibold text-lg mb-1">Location</h4>
                      <p>Patna, Bihar, India</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold text-white mb-4">Why Choose Us?</h3>
                <ul className="space-y-3 text-white">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                    <span>Professional & experienced drivers</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                    <span>Well-maintained & clean vehicles</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                    <span>Affordable & transparent pricing</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                    <span>24/7 customer support</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="animate-on-scroll animate-fade-right">
              <div className="bg-white rounded-3xl p-8 shadow-2xl">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h3>
                <form onSubmit={handleSubmit} className="space-y-6 text-black">
                  <div>
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                      className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none transition-all text-black"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Your Email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                      className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      placeholder="Your Phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      required
                      className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <textarea
                      placeholder="Your Message"
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      required
                      rows={5}
                      className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none transition-all resize-none"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    disabled={formStatus === 'sending'}
                    className="w-full gradient-hover text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-2xl transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {formStatus === 'sending' ? (
                      <span className="flex items-center">
                        <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      <>
                        Send Message
                        <Send className="ml-2 w-5 h-5" />
                      </>
                    )}
                  </button>
                  {formStatus === 'success' && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl animate-in">
                      <p className="font-medium">✓ Message sent successfully! We'll get back to you soon.</p>
                    </div>
                  )}
                  {formStatus === 'error' && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl animate-in">
                      <p className="font-medium">✗ Failed to send message. Please try again or call us directly.</p>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="animate-on-scroll">
              <div className="flex items-center space-x-3 mb-4">
                 <div className="w-14 h-14  rounded-full overflow-hidden">
                <Image src="/logo2.jpg" alt="CSC Travels Logo" width={100} height={100} className="w-full h-full object-cover" />
              </div>
                <h3 className="text-xl font-bold">CSC Travels</h3>
              </div>
              <p className="text-gray-400 mb-4">1st floor, Shanti Devi Nivas, near Sichai bhawan, Anishabad Patna, Bihar 800002</p>
              <div className="flex space-x-3">
                <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-orange-600 transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-orange-400 transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-pink-600 transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/></svg>
                </a>
              </div>
            </div>
            
            <div className="animate-on-scroll delay-1">
              <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#home" className="hover:text-white hover:translate-x-1 inline-block transition-all">Home</a></li>
                <li><a href="#services" className="hover:text-white hover:translate-x-1 inline-block transition-all">Services</a></li>
                <li><a href="#fleet" className="hover:text-white hover:translate-x-1 inline-block transition-all">Our Fleet</a></li>
                <li><a href="#contact" className="hover:text-white hover:translate-x-1 inline-block transition-all">Contact</a></li>
              </ul>
            </div>
            
            <div className="animate-on-scroll delay-2">
              <h4 className="font-semibold text-lg mb-4">Our Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Car Rentals</li>
                <li>Bike Rentals</li>
                <li>Traveler Bookings</li>
                <li>Airport Transfers</li>
              </ul>
            </div>
            
            <div className="animate-on-scroll delay-3">
              <h4 className="font-semibold text-lg mb-4">Contact Info</h4>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-start">
                  <MapPin className="w-5 h-5 mr-2 mt-1 flex-shrink-0 text-orange-500" />
                  <span>Patna, Bihar, India</span>
                </li>
                <li className="flex items-start">
                  <Phone className="w-5 h-5 mr-2 mt-1 flex-shrink-0 text-orange-500" />
                  <a href="tel:+919873101537" className="hover:text-white transition">+91 98731 01537</a>
                </li>
                <li className="flex items-start">
                  <Mail className="w-5 h-5 mr-2 mt-1 flex-shrink-0 text-orange-500" />
                  <a href="mailto:bookings@csctravels.com" className="hover:text-white transition">bookings@csctravels.com</a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
              <p>&copy; 2025 CSC Travels. All rights reserved.</p>
              <p className="mt-2 md:mt-0">Designed with ❤️ for premium travel experience</p>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a 
        href="https://wa.me/919873101537" 
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white shadow-2xl hover:scale-110 transition-transform z-50 animate-float"
      >
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      </a>
    </div>
  );
};

export default CSCTravelsLanding;