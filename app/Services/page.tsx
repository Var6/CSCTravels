'use client';
import { useState } from 'react';

export default function ServicePage() {
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');
  const [waitingTime, setWaitingTime] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [calculation, setCalculation] = useState({
    distanceCost: 0,
    waitingCost: 0,
    subtotal: 0,
    buffer: 0,
    total: 0
  });

  const calculateFare = () => {
    const dist = parseFloat(distance) || 0;
    const wait = parseFloat(waitingTime) || 0;
    
    const distanceCost = dist * 20;
    const waitingCost = wait * 2;
    const subtotal = distanceCost + waitingCost;
    const buffer = subtotal * 0.25;
    const total = subtotal + buffer;
    
    setCalculation({
      distanceCost,
      waitingCost,
      subtotal,
      buffer,
      total
    });
    setShowResult(true);
  };

  const comparisonData = [
    { hours: 1, km: 10, price: 722 },
    { hours: 2, km: 20, price: 1354 },
    { hours: 3, km: 30, price: 1789 },
    { hours: 4, km: 40, price: 1447 },
    { hours: 6, km: 60, price: 2240 },
    { hours: 8, km: 80, price: 3945 },
    { hours: 10, km: 100, price: 4479 }
  ];

  return (
    <div className="min-h-screen bg-white mt-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">Premium Taxi Services</h1>
          <p className="text-xl opacity-90">Comfortable, Reliable & Affordable Rides</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Main Services */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold text-orange-600 mb-8 border-b-4 border-orange-600 pb-3 inline-block">
            Our Services
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 mt-8">
            {/* Hourly & Long Trip */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="text-2xl font-bold text-orange-700 mb-4">Hourly & Long Trip Service</h3>
              <div className="text-5xl font-bold text-orange-600 my-6">₹20<span className="text-2xl">/km</span></div>
              <p className="text-gray-700 text-lg mb-4">Book rides by the hour or for long distances at a flat rate</p>
              <div className="bg-white p-4 rounded-lg mt-4">
                <p className="text-gray-600"><strong>Waiting Charges:</strong> ₹2/min</p>
              </div>
            </div>

            {/* Executive Service */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="text-2xl font-bold text-orange-700 mb-4">Executive Service for Seniors</h3>
              <div className="text-5xl font-bold text-orange-600 my-6">₹500</div>
              <p className="text-gray-700 text-lg mb-4">Premium care service for elderly members</p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-orange-600 font-bold mr-2">✓</span>
                  <span>Doctor appointments with assistance</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 font-bold mr-2">✓</span>
                  <span>Shopping assistance (carry bags, hold hands)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 font-bold mr-2">✓</span>
                  <span>Family-like care and support</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Night Stay */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow mt-8">
            <h3 className="text-2xl font-bold text-orange-700 mb-4">Night Stay Service</h3>
            <div className="text-5xl font-bold text-orange-600 my-6">₹1000<span className="text-2xl">/night</span></div>
            <p className="text-gray-700 text-lg">Driver available throughout the night for your convenience</p>
            <div className="bg-white p-4 rounded-lg mt-4">
              <p className="text-gray-600"><strong>Additional time charges:</strong> ₹2/min</p>
            </div>
          </div>
        </section>

        {/* Amenities */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold text-orange-600 mb-8 border-b-4 border-orange-600 pb-3 inline-block">
            Trip Amenities
          </h2>
          
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-2xl mt-8">
            <h3 className="text-2xl font-bold text-orange-700 mb-6">Complimentary Starter Kit</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center">
                  <span className="text-orange-600 text-2xl mr-3">✓</span>
                  <span className="text-lg">Water Bottle</span>
                </div>
                <div className="flex items-center">
                  <span className="text-orange-600 text-2xl mr-3">✓</span>
                  <span className="text-lg">Wet Wipes</span>
                </div>
                <div className="flex items-center">
                  <span className="text-orange-600 text-2xl mr-3">✓</span>
                  <span className="text-lg">Tissues</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center">
                  <span className="text-orange-600 text-2xl mr-3">✓</span>
                  <span className="text-lg">Mouth Freshener</span>
                </div>
                <div className="flex items-center">
                  <span className="text-orange-600 text-2xl mr-3">✓</span>
                  <span className="text-lg">Hand Sanitizer</span>
                </div>
                <div className="flex items-center">
                  <span className="text-orange-600 text-2xl mr-3">✓</span>
                  <span className="text-lg">Information Booklet</span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-300">
              <h4 className="text-xl font-bold text-orange-700 mb-4">Reading Material</h4>
              <div className="flex gap-4">
                <div className="flex items-center">
                  <span className="text-orange-600 text-2xl mr-3">📰</span>
                  <span className="text-lg">English Newspaper</span>
                </div>
                <div className="flex items-center">
                  <span className="text-orange-600 text-2xl mr-3">📰</span>
                  <span className="text-lg">Hindi Newspaper</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Fare Calculator */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold text-orange-600 mb-8 border-b-4 border-orange-600 pb-3 inline-block">
            Fare Calculator
          </h2>
          
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-2xl mt-8">
            <h3 className="text-2xl font-bold text-orange-700 mb-6">Calculate Your Approximate Fare</h3>
            
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Distance (km)</label>
                <input
                  type="number"
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  placeholder="Enter distance"
                  className="w-full px-4 py-3 border-2 border-orange-300 rounded-lg focus:outline-none focus:border-orange-500"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Trip Duration (hours)</label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="Enter duration"
                  className="w-full px-4 py-3 border-2 border-orange-300 rounded-lg focus:outline-none focus:border-orange-500"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Waiting Time (minutes)</label>
                <input
                  type="number"
                  value={waitingTime}
                  onChange={(e) => setWaitingTime(e.target.value)}
                  placeholder="Enter waiting time"
                  className="w-full px-4 py-3 border-2 border-orange-300 rounded-lg focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>
            
            <button
              onClick={calculateFare}
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:from-orange-600 hover:to-orange-700 transition-all transform hover:scale-105"
            >
              Calculate Fare
            </button>
            
            {showResult && (
              <div className="bg-white p-6 rounded-xl mt-6 shadow-lg">
                <h4 className="text-2xl font-bold text-orange-700 mb-4">Fare Breakdown</h4>
                <div className="space-y-3">
                  <div className="flex justify-between text-lg">
                    <span className="text-gray-700">Distance Cost ({distance} km × ₹20):</span>
                    <span className="font-semibold">₹{calculation.distanceCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg">
                    <span className="text-gray-700">Waiting Charges ({waitingTime} min × ₹2):</span>
                    <span className="font-semibold">₹{calculation.waitingCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg pt-3 border-t-2 border-gray-200">
                    <span className="text-gray-700">Subtotal:</span>
                    <span className="font-semibold">₹{calculation.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg">
                    <span className="text-gray-700">Buffer (25%):</span>
                    <span className="font-semibold">₹{calculation.buffer.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-2xl font-bold pt-3 border-t-2 border-orange-300">
                    <span className="text-orange-700">Total (Before Tax):</span>
                    <span className="text-orange-600">₹{calculation.total.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mt-6">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> This is an approximate calculation. A 25% buffer has been added for accuracy. 
                    The final fare is calculated before taxes and may vary based on actual trip conditions.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Comparison with Ola/Uber */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold text-orange-600 mb-8 border-b-4 border-orange-600 pb-3 inline-block">
            Compare with Ola/Uber Hourly Packages
          </h2>
          
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-2xl mt-8 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-orange-600 text-white">
                  <th className="p-4 text-left rounded-tl-lg">Duration</th>
                  <th className="p-4 text-left">Distance</th>
                  <th className="p-4 text-left rounded-tr-lg">Ola/Uber Price</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((item, index) => (
                  <tr key={index} className="border-b border-gray-300 hover:bg-orange-50 transition-colors">
                    <td className="p-4 font-semibold">{item.hours} Hour{item.hours > 1 ? 's' : ''}</td>
                    <td className="p-4">{item.km} km</td>
                    <td className="p-4 font-bold text-orange-600">₹{item.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div className="mt-6 bg-orange-100 p-4 rounded-lg">
              <p className="text-gray-700 text-center">
                <strong className="text-orange-700">💡 Compare and Save!</strong> Use our calculator above to see how much you can save with our transparent pricing.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}