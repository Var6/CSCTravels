'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Phone, Mail, MapPin, Car, Users, Shield, Clock, ChevronRight, Send } from 'lucide-react';

const CSCTravelsLanding = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [formStatus, setFormStatus] = useState('');
  const carRef = useRef(null);
  const statsRef = useRef(null);
  const servicesRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -100px 0px' };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    [carRef, statsRef, servicesRef].forEach(ref => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    setFormStatus('sending');
    
    // EmailJS integration would go here
    // For now, simulating submission
    setTimeout(() => {
      setFormStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => setFormStatus(''), 3000);
    }, 1500);
  };

  const cars = [
    { name: 'Hyundai Aura', type: 'Sedan', seats: '4+1' },
    { name: 'Maruti Swift', type: 'Hatchback', seats: '4+1' },
    { name: 'Maruti WagonR', type: 'Hatchback', seats: '4+1' },
    { name: 'Premium Sedans', type: 'Luxury', seats: '4+1' }
  ];

  const services = [
    { icon: <Car className="w-8 h-8" />, title: 'Ola Partnership', desc: 'Verified Ola partner providing premium rides' },
    { icon: <Users className="w-8 h-8" />, title: 'Uber Services', desc: 'Reliable Uber rides across Patna' },
    { icon: <Clock className="w-8 h-8" />, title: 'Rapido Quick Rides', desc: 'Fast and affordable transportation' },
    { icon: <Shield className="w-8 h-8" />, title: 'Safe & Secure', desc: 'GPS tracked rides with verified drivers' }
  ];

  const stats = [
    { number: '8+', label: 'Vehicles' },
    { number: '1000+', label: 'Happy Customers' },
    { number: '24/7', label: 'Available' },
    { number: '100%', label: 'Satisfaction' }
  ];

  return (
    <div className="min-h-screen bg-white">
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .animate-in { animation: fadeInUp 0.8s ease-out forwards; }
        .animate-slide { animation: slideInRight 1s ease-out forwards; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .gradient-text { background: linear-gradient(135deg, #3b82f6 0%, #f97316 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .gradient-bg { background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 50%, #f97316 100%); }
        .gradient-card { background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(249, 115, 22, 0.05) 100%); }
        .car-shadow { filter: drop-shadow(0 20px 40px rgba(59, 130, 246, 0.3)); }
      `}</style>

      {/* Navbar */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrollY > 50 ? 'bg-white shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 gradient-bg rounded-full flex items-center justify-center text-white font-bold text-xl">
                CSC
              </div>
              <div>
                <h1 className="text-2xl font-bold gradient-text">CSC Travels</h1>
                <p className="text-xs text-gray-600">Your Trusted Ride Partner</p>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-gray-700 hover:text-blue-600 transition font-medium">Home</a>
              <a href="#services" className="text-gray-700 hover:text-blue-600 transition font-medium">Services</a>
              <a href="#fleet" className="text-gray-700 hover:text-blue-600 transition font-medium">Our Fleet</a>
              <a href="#contact" className="text-gray-700 hover:text-blue-600 transition font-medium">Contact</a>
              <a href="tel:+919873101537" className="gradient-bg text-white px-6 py-2 rounded-full font-medium hover:shadow-lg transition">
                Book Now
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-4 py-4 space-y-3">
              <a href="#home" className="block py-2 text-gray-700 hover:text-blue-600">Home</a>
              <a href="#services" className="block py-2 text-gray-700 hover:text-blue-600">Services</a>
              <a href="#fleet" className="block py-2 text-gray-700 hover:text-blue-600">Our Fleet</a>
              <a href="#contact" className="block py-2 text-gray-700 hover:text-blue-600">Contact</a>
              <a href="tel:+919873101537" className="block gradient-bg text-white px-6 py-2 rounded-full text-center">
                Book Now
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 gradient-bg opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-slide">
              <h2 className="text-5xl md:text-6xl font-bold mb-6">
                Your Reliable <span className="gradient-text">Ride Partner</span> in Patna
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Premium taxi services for Ola, Uber & Rapido. Experience comfort, safety, and reliability with our fleet of 8+ well-maintained vehicles.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="#contact" className="gradient-bg text-white px-8 py-4 rounded-full font-medium hover:shadow-xl transition flex items-center">
                  Book Your Ride <ChevronRight className="ml-2 w-5 h-5" />
                </a>
                <a href="tel:+919873101537" className="bg-white border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-full font-medium hover:bg-blue-50 transition flex items-center">
                  <Phone className="mr-2 w-5 h-5" /> Call Now
                </a>
              </div>
            </div>
            
            <div ref={carRef} className="relative animate-float">
              <div className="car-shadow">
                <svg viewBox="0 0 400 200" className="w-full">
                  <defs>
                    <linearGradient id="carGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" style={{stopColor: '#3b82f6'}} />
                      <stop offset="100%" style={{stopColor: '#f97316'}} />
                    </linearGradient>
                  </defs>
                  <path d="M80 120 L100 100 L150 90 L200 90 L250 100 L280 120 L280 140 L260 150 L240 150 L230 140 L170 140 L160 150 L140 150 L120 140 L80 140 Z" fill="url(#carGradient)" />
                  <rect x="110" y="100" width="40" height="30" rx="3" fill="#e0f2fe" opacity="0.7" />
                  <rect x="160" y="100" width="60" height="30" rx="3" fill="#e0f2fe" opacity="0.7" />
                  <circle cx="140" cy="150" r="15" fill="#1e293b" />
                  <circle cx="140" cy="150" r="8" fill="#64748b" />
                  <circle cx="240" cy="150" r="15" fill="#1e293b" />
                  <circle cx="240" cy="150" r="8" fill="#64748b" />
                  <path d="M90 120 L95 125 L255 125 L260 120" fill="#1e40af" opacity="0.3" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-16 bg-gradient-to-r from-blue-600 to-orange-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center text-white">
                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.number}</div>
                <div className="text-lg opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" ref={servicesRef} className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Our <span className="gradient-text">Services</span>
            </h2>
            <p className="text-xl text-gray-600">Partner with leading ride-hailing platforms</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, idx) => (
              <div key={idx} className="gradient-card p-8 rounded-2xl hover:shadow-xl transition group cursor-pointer">
                <div className="text-blue-600 mb-4 group-hover:scale-110 transition">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                <p className="text-gray-600">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fleet Section */}
      <section id="fleet" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Our <span className="gradient-text">Fleet</span>
            </h2>
            <p className="text-xl text-gray-600">Choose from our well-maintained vehicles</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {cars.map((car, idx) => (
              <div key={idx} className="bg-white border-2 border-gray-100 rounded-2xl p-6 hover:border-blue-500 hover:shadow-xl transition group">
                <div className="bg-gradient-to-br from-blue-100 to-orange-100 rounded-xl p-8 mb-4 group-hover:scale-105 transition">
                  <Car className="w-16 h-16 mx-auto text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">{car.name}</h3>
                <p className="text-gray-600 mb-1">{car.type}</p>
                <p className="text-sm text-gray-500">Seats: {car.seats}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 gradient-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="text-white">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Get In Touch</h2>
              <p className="text-xl mb-8 opacity-90">Book your ride or send us your queries</p>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <Phone className="w-6 h-6 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Phone</h3>
                    <a href="tel:+919873101537" className="hover:underline">+91 98731 01537</a>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Mail className="w-6 h-6 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Email</h3>
                    <a href="mailto:bookings@csctravels.com" className="hover:underline">bookings@csctravels.com</a>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <MapPin className="w-6 h-6 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Location</h3>
                    <p>Patna, Bihar, India</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-2xl">
              <div className="space-y-6">
                <div>
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    placeholder="Your Phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                  />
                </div>
                <div>
                  <textarea
                    placeholder="Your Message"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition resize-none"
                  ></textarea>
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={formStatus === 'sending'}
                  className="w-full gradient-bg text-white py-4 rounded-lg font-semibold hover:shadow-xl transition flex items-center justify-center disabled:opacity-50"
                >
                  {formStatus === 'sending' ? 'Sending...' : (
                    <>Send Message <Send className="ml-2 w-5 h-5" /></>
                  )}
                </button>
                {formStatus === 'success' && (
                  <p className="text-green-600 text-center font-medium">Message sent successfully!</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 gradient-bg rounded-full flex items-center justify-center text-white font-bold">
                  CSC
                </div>
                <h3 className="text-xl font-bold">CSC Travels</h3>
              </div>
              <p className="text-gray-400">Your trusted ride partner in Patna for Ola, Uber & Rapido services.</p>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#home" className="hover:text-white transition">Home</a></li>
                <li><a href="#services" className="hover:text-white transition">Services</a></li>
                <li><a href="#fleet" className="hover:text-white transition">Our Fleet</a></li>
                <li><a href="#contact" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Ola Partnership</li>
                <li>Uber Services</li>
                <li>Rapido Rides</li>
                <li>24/7 Available</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Patna, Bihar</li>
                <li><a href="tel:+919873101537" className="hover:text-white transition">+91 98731 01537</a></li>
                <li><a href="mailto:bookings@csctravels.com" className="hover:text-white transition">bookings@csctravels.com</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2025 CSC Travels. All rights reserved. | Designed for excellence in Patna</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CSCTravelsLanding;