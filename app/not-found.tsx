import { Plane, Home, Search, MapPin } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Animated Plane Icon */}
        <div className="mb-8 relative mt-50">
          <div className="inline-block animate-bounce">
            <Plane className="w-24 h-24 text-blue-600 mx-auto" strokeWidth={1.5} />
          </div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-blue-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        </div>

        {/* 404 Text */}
        <h1 className="text-8xl font-bold text-blue-600 mb-4">404</h1>
        
        {/* Message */}
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">
          Oops! This Destination Doesn't Exist
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          Looks like this page took an unexpected detour. Let's get you back on track to your dream destination!
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <a
            href="/"
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
          >
            <Home className="w-5 h-5" />
            <span className="font-medium">Back to Home</span>
          </a>
          
          <a
            href="/search"
            className="flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors border-2 border-blue-600 shadow-md hover:shadow-lg"
          >
            <Search className="w-5 h-5" />
            <span className="font-medium">Search Destinations</span>
          </a>
        </div>

        {/* Popular Destinations */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center justify-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            Popular Destinations
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Patna', emoji: '🗼' },
              { name: 'Ranchi', emoji: '🗾' },
              { name: 'Varanasi', emoji: '🗽' },
              { name: 'Lucknow', emoji: '🏜️' }
            ].map((destination) => (
              <a
                key={destination.name}
                href={`/destinations/${destination.name.toLowerCase()}`}
                className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 transition-all hover:scale-105 hover:shadow-md"
              >
                <div className="text-3xl mb-2">{destination.emoji}</div>
                <div className="font-medium text-gray-800">{destination.name}</div>
              </a>
            ))}
          </div>
        </div>

        {/* Footer Note */}
        <p className="mt-8 text-sm text-gray-500">
          Need help? Contact our support team at{' '}
          <a href="mailto:support@csctravel.com" className="text-blue-600 hover:underline">
            support@csctravel.com
          </a>
        </p>
      </div>
    </div>
  );
}