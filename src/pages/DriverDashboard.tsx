import React, { useState } from 'react';
import { Navigation, MapPin, Menu, Settings, User, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const DriverDashboard = () => {
  const [isOnline, setIsOnline] = useState(false);

  // This page is desktop-only, show message on mobile
  if (window.innerWidth < 768) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Desktop Only</h2>
            <p className="text-muted-foreground mb-4">
              Please access the driver dashboard on a desktop device for the best experience.
            </p>
            <Button 
              onClick={() => window.history.back()}
              variant="outline"
            >
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Navigation Bar */}
      <div className="bg-black text-white px-6 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold">Unboxd</h1>
          <span className="text-sm text-gray-300">Driver Dashboard</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Circle className={`w-3 h-3 ${isOnline ? 'fill-green-500 text-green-500' : 'fill-gray-500 text-gray-500'}`} />
            <span className="text-sm">{isOnline ? 'Online' : 'Offline'}</span>
          </div>
          <Button 
            size="sm"
            variant={isOnline ? "destructive" : "default"}
            onClick={() => setIsOnline(!isOnline)}
          >
            {isOnline ? 'Go Offline' : 'Go Online'}
          </Button>
          <Button size="sm" variant="ghost">
            <User className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="ghost">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1">
        {/* Left Sidebar */}
        <div className="w-80 bg-white border-r border-border p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Today's Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Earnings</span>
                <span className="font-medium">₦0.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Trips</span>
                <span className="font-medium">0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Online time</span>
                <span className="font-medium">0h 0m</span>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-medium mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <MapPin className="w-4 h-4 mr-2" />
                Set Destination
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Menu className="w-4 h-4 mr-2" />
                View Trips
              </Button>
            </div>
          </div>

          {!isOnline && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <h4 className="font-medium text-blue-900 mb-2">Ready to earn?</h4>
                <p className="text-sm text-blue-700 mb-3">
                  Go online to start receiving trip requests in your area.
                </p>
                <Button 
                  onClick={() => setIsOnline(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Go Online
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Map Area */}
        <div className="flex-1 relative bg-gray-100">
          {/* Map Placeholder */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Map View</h3>
              <p className="text-gray-500">
                Interactive map will be displayed here
              </p>
              {isOnline && (
                <div className="mt-4 p-4 bg-white rounded-lg shadow-sm inline-block">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">Searching for trips...</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Go Button (when online) */}
          {isOnline && (
            <div className="absolute bottom-8 right-8">
              <Button 
                size="lg"
                className="w-16 h-16 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xl shadow-lg"
              >
                GO
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;