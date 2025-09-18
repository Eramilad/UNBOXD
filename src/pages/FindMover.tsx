

import React, { useState, useEffect } from 'react';
import { MapPin, Clock, User, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import AddressInput from '@/components/AddressInput';

const FindMover = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [when, setWhen] = useState('now');
  const [forWho, setForWho] = useState('me');
  const [showResults, setShowResults] = useState(false);
  const [currentDriverIndex, setCurrentDriverIndex] = useState(0);

  // Driver data - only the two specified drivers
  const drivers = [
    {
      name: "FALADE SEGUN",
      phone: "09030953275", 
      rating: "4.8",
      plateNumber: "LAG123AB",
      vehicle: "Blue Toyota Camry",
      initials: "FS",
      bgColor: "bg-blue-500"
    },
    {
      name: "BABALOLA DAMILARE",
      phone: "07087637688",
      rating: "4.9", 
      plateNumber: "ABJ456CD",
      vehicle: "Red Honda Accord",
      initials: "BD",
      bgColor: "bg-red-500"
    }
  ];

  // Get initial values from navigation state
  useEffect(() => {
    if (location.state) {
      const { pickup: initialPickup, destination: initialDestination } = location.state as any;
      if (initialPickup) setPickup(initialPickup);
      if (initialDestination) setDestination(initialDestination);
    }
  }, [location.state]);

  const handleSearch = () => {
    // Show results and alternate driver
    setShowResults(true);
    setCurrentDriverIndex((prev) => (prev + 1) % drivers.length);
  };

  // Default map showing Lagos, Nigeria
  const getMapUrl = () => {
    if (pickup && destination) {
      return `https://www.google.com/maps/embed/v1/directions?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dOWTgWiEucNGsk&origin=${encodeURIComponent(pickup)}&destination=${encodeURIComponent(destination)}&mode=driving&region=NG`;
    } else if (pickup) {
      return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dOWTgWiEucNGsk&q=${encodeURIComponent(pickup)}&region=NG&zoom=13`;
    } else {
      return `https://www.google.com/maps/embed/v1/view?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dOWTgWiEucNGsk&center=6.5244,3.3792&zoom=12&region=NG`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button 
                onClick={() => navigate('/')}
                className="mr-4 p-2 hover:bg-gray-800 rounded-full"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h1 className="text-2xl font-bold">Unboxd</h1>
            </div>
            
            <div className="flex items-center space-x-6">
              <nav className="hidden md:flex space-x-8">
                <a href="#" className="text-white hover:text-gray-300 font-medium border-b-2 border-white pb-2">
                  Move
                </a>
                <a href="#" className="text-gray-300 hover:text-white font-medium">
                  Package
                </a>
              </nav>
              
              <div className="flex items-center space-x-4">
                <Button variant="ghost" className="text-white hover:bg-gray-800">
                  Activity
                </Button>
                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {!showResults ? (
        <div className="flex">
          {/* Left Panel - Booking Form */}
          <div className="w-full lg:w-2/5 bg-white p-6">
            <div className="max-w-md">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Get a move</h2>
              
              <div className="space-y-4">
                {/* Pickup Location */}
                <div className="relative">
                  <div className="p-4 bg-gray-100 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-black rounded-full"></div>
                      <AddressInput
                        placeholder="Pickup location"
                        value={pickup}
                        onChange={setPickup}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Destination */}
                <div className="relative">
                  <div className="p-4 bg-gray-100 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                      <AddressInput
                        placeholder="Destination"
                        value={destination}
                        onChange={setDestination}
                        className="flex-1"
                      />
                      <button className="text-gray-400 hover:text-gray-600">
                        <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* When */}
                <div className="relative">
                  <div className="flex items-center space-x-3 p-4 bg-gray-100 rounded-lg">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <select
                      value={when}
                      onChange={(e) => setWhen(e.target.value)}
                      className="flex-1 bg-transparent outline-none text-gray-900"
                    >
                      <option value="now">Pickup now</option>
                      <option value="schedule">Schedule for later</option>
                    </select>
                    <svg className="w-5 h-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>

                {/* For Who */}
                <div className="relative">
                  <div className="flex items-center space-x-3 p-4 bg-gray-100 rounded-lg">
                    <User className="h-5 w-5 text-gray-400" />
                    <select
                      value={forWho}
                      onChange={(e) => setForWho(e.target.value)}
                      className="flex-1 bg-transparent outline-none text-gray-900"
                    >
                      <option value="me">For me</option>
                      <option value="someone">For someone else</option>
                    </select>
                    <svg className="w-5 h-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>

                {/* Search Button */}
                <Button
                  onClick={handleSearch}
                  disabled={!pickup || !destination}
                  className="w-full bg-black text-white hover:bg-gray-800 py-4 text-base font-medium rounded-lg mt-6"
                >
                  Search
                </Button>
              </div>
            </div>
          </div>

          {/* Right Panel - Always Show Map */}
          <div className="hidden lg:block flex-1 bg-gray-200 relative">
            <iframe
              width="100%"
              height="100%"
              frameBorder="0"
              style={{ border: 0 }}
              src={getMapUrl()}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
            
            {/* Zoom Controls */}
            <div className="absolute bottom-6 right-6 bg-white rounded-lg shadow-lg">
              <button className="block p-3 hover:bg-gray-50 border-b border-gray-200">
                <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              </button>
              <button className="block p-3 hover:bg-gray-50">
                <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex h-screen">
          {/* Left Panel - Driver Selection (Uber-style) */}
          <div className="w-full lg:w-2/5 bg-white flex flex-col">
            {/* Header with trip info */}
            <div className="p-6 border-b">
              <div className="flex items-center mb-4">
                <button 
                  onClick={() => setShowResults(false)}
                  className="mr-4 p-2 hover:bg-gray-100 rounded-full"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <h2 className="text-xl font-semibold">Pickup in 9 mins</h2>
              </div>
              
              {/* Address info */}
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-3 h-3 bg-black rounded-full mt-1.5"></div>
                  <div>
                    <p className="text-sm text-gray-600">From</p>
                    <p className="font-medium">{pickup}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-3 h-3 bg-gray-400 rounded-full mt-1.5"></div>
                  <div>
                    <p className="text-sm text-gray-600">To</p>
                    <p className="font-medium">{destination}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Driver card */}
            <div className="p-6">
              <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 ${drivers[currentDriverIndex].bgColor} rounded-full flex items-center justify-center text-white font-bold`}>
                    {drivers[currentDriverIndex].initials}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{drivers[currentDriverIndex].name}</h3>
                    <p className="text-gray-600">★ {drivers[currentDriverIndex].rating} • {drivers[currentDriverIndex].plateNumber}</p>
                    <p className="text-gray-600">{drivers[currentDriverIndex].vehicle}</p>
                  </div>
                </div>
                
                <div className="flex space-x-4 mt-4">
                  <button className="flex-1 bg-gray-100 py-3 px-4 rounded-lg flex items-center justify-center space-x-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                    </svg>
                    <span className="text-sm font-medium">{drivers[currentDriverIndex].phone}</span>
                  </button>
                  <button className="p-3 bg-gray-100 rounded-lg">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Cancel button */}
              <button className="w-full text-red-500 font-medium py-2">
                Cancel ride
              </button>
            </div>
          </div>

          {/* Right Panel - Always Show Full Map */}
          <div className="flex-1 bg-gray-200 relative">
            <iframe
              width="100%"
              height="100%"
              frameBorder="0"
              style={{ border: 0 }}
              src={getMapUrl()}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
            
            {/* Zoom Controls */}
            <div className="absolute bottom-6 right-6 bg-white rounded-lg shadow-lg">
              <button className="block p-3 hover:bg-gray-50 border-b border-gray-200">
                <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              </button>
              <button className="block p-3 hover:bg-gray-50">
                <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FindMover;

