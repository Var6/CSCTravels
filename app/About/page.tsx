import React from 'react';
import { Car, Users, Shield, Clock, Award, Heart, Target, MapPin, Phone, Mail, CheckCircle, Star, TrendingUp } from 'lucide-react';

export default function AboutUsPage() {
  const stats = [
    { icon: Users, value: '500+', label: 'Happy Clients', color: 'from-orange-500 to-orange-600' },
    { icon: Car, value: '15+', label: 'Vehicles', color: 'from-blue-500 to-blue-600' },
    { icon: Clock, value: '24/7', label: 'Service', color: 'from-green-500 to-green-600' },
    { icon: Award, value: '100%', label: 'Satisfaction', color: 'from-purple-500 to-purple-600' }
  ];

  const values = [
    {
      icon: Shield,
      title: 'Safety First',
      description: 'All our vehicles are GPS-tracked, regularly maintained, and fully insured for your peace of mind.',
      gradient: 'from-orange-500 to-red-500'
    },
    {
      icon: Heart,
      title: 'Customer Care',
      description: 'We prioritize your comfort and satisfaction with 24/7 support and personalized service.',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Target,
      title: 'Excellence',
      description: 'Our commitment to quality ensures every journey is smooth, comfortable, and memorable.',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: TrendingUp,
      title: 'Growth',
      description: 'Continuously expanding our fleet and services to meet your evolving travel needs.',
      gradient: 'from-green-500 to-emerald-500'
    }
  ];

  const milestones = [
    { year: '2017', event: 'CSC Travels Founded', desc: 'Started with a vision to revolutionize travel in Patna' },
    { year: '2019', event: 'Fleet Expansion', desc: 'Added 10+ vehicles to serve more customers' },
    { year: '2021', event: 'Digital Transformation', desc: 'Launched online booking platform' },
    { year: '2023', event: '500+ Happy Customers', desc: 'Reached milestone of serving 500+ satisfied clients' },
    { year: '2025', event: 'Premium Services', desc: 'Introduced luxury vehicles and enhanced customer experience' }
  ];

  const team = [
    { name: 'Professional Drivers', count: '20+', desc: 'Verified & experienced' },
    { name: 'Support Staff', count: '10+', desc: 'Available 24/7' },
    { name: 'Maintenance Team', count: '5+', desc: 'Keeping fleet top-notch' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-orange-600 via-orange-500 to-orange-400 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
              About CSC Travels
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-orange-50 max-w-3xl mx-auto">
              Your Trusted Premium Travel Partner in Patna
            </p>
            <div className="flex items-center justify-center gap-3 text-lg">
              <MapPin className="w-5 h-5" />
              <span>Patna, Bihar, India</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 mx-auto`}>
                <stat.icon className="w-8 h-8 text-white" />
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Our Story Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p className="text-lg">
                Founded with a vision to transform the travel experience in Patna, <span className="font-semibold text-orange-600">CSC Travels</span> has grown from a small car rental service to a comprehensive premium travel solutions provider.
              </p>
              <p>
                We understand that every journey matters. Whether it's a business trip, a family vacation, or a special occasion, we're committed to making your travel experience comfortable, safe, and memorable.
              </p>
              <p>
                Our fleet of well-maintained vehicles, professional drivers, and 24/7 customer support ensure that you travel with confidence and peace of mind.
              </p>
              <p className="font-semibold text-orange-600">
                At CSC Travels, we don't just provide transportation – we create experiences.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="bg-gradient-to-br from-orange-100 to-orange-50 rounded-3xl p-8 shadow-xl">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Professional Service</h3>
                    <p className="text-gray-600 text-sm">Experienced drivers with verified credentials</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Premium Fleet</h3>
                    <p className="text-gray-600 text-sm">Well-maintained vehicles for all occasions</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Transparent Pricing</h3>
                    <p className="text-gray-600 text-sm">No hidden charges, affordable rates</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Values Section */}
      <div className="bg-gradient-to-br from-gray-50 to-orange-50/30 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${value.gradient} flex items-center justify-center mb-4`}>
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Our Journey Timeline */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Journey</h2>
          <p className="text-xl text-gray-600">Key milestones that shaped CSC Travels</p>
        </div>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-orange-500 to-orange-300 hidden md:block"></div>
          
          <div className="space-y-12">
            {milestones.map((milestone, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-8 ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
              >
                <div className={`flex-1 ${idx % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                  <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all">
                    <div className="text-orange-600 font-bold text-2xl mb-2">{milestone.year}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{milestone.event}</h3>
                    <p className="text-gray-600">{milestone.desc}</p>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center flex-shrink-0 shadow-lg relative z-10 hidden md:flex">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 hidden md:block"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Our Team */}
      <div className="bg-gradient-to-br from-orange-600 to-orange-500 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Our Team</h2>
            <p className="text-xl text-orange-100">Dedicated professionals serving you</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, idx) => (
              <div
                key={idx}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center hover:bg-white/20 transition-all"
              >
                <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <div className="text-4xl font-bold text-white mb-2">{member.count}</div>
                <h3 className="text-xl font-bold text-white mb-2">{member.name}</h3>
                <p className="text-orange-100">{member.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-3xl p-12 text-center shadow-xl">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Experience premium travel services with CSC Travels. Book now or get in touch with us.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="tel:+919873101537"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-600 to-orange-500 text-white px-8 py-4 rounded-full font-semibold hover:shadow-xl transition-all hover:scale-105"
            >
              <Phone className="w-5 h-5" />
              +91 98731 01537
            </a>
            <a
              href="mailto:booking@csctravels.com"
              className="inline-flex items-center gap-2 bg-white text-orange-600 px-8 py-4 rounded-full font-semibold border-2 border-orange-600 hover:bg-orange-50 transition-all"
            >
              <Mail className="w-5 h-5" />
              booking@csctravels.com
            </a>
          </div>
          <div className="mt-8 flex items-center justify-center gap-2 text-gray-600">
            <MapPin className="w-5 h-5 text-orange-600" />
            <span>1st floor, Shanti Devi Nivas, near Sichai bhawan, Anishabad Patna, Bihar 800002</span>
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose CSC Travels?</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: 'GPS Tracked Vehicles', desc: 'All vehicles equipped with GPS for safety' },
              { icon: Award, title: 'Verified Drivers', desc: 'Professional and background-checked drivers' },
              { icon: Clock, title: '24/7 Availability', desc: 'Round the clock service for your convenience' },
              { icon: Car, title: 'Well-Maintained Fleet', desc: 'Regular maintenance and cleaning' },
              { icon: TrendingUp, title: 'Transparent Pricing', desc: 'No hidden charges, affordable rates' },
              { icon: Heart, title: 'Customer First', desc: 'Your satisfaction is our priority' }
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}