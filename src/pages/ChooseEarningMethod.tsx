import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Car, Truck, Bus, MapPin } from 'lucide-react';

const ChooseEarningMethod = () => {
  const [selectedMethod, setSelectedMethod] = useState<string>('');

  const earningMethods = [
    {
      id: 'car',
      title: 'Move with Car',
      subtitle: 'Vehicle: Sedan or hatchback',
      description: 'Ideal for: Small item moves or roommate relocations',
      tag: 'Moves',
      tagColor: 'bg-green-500',
      icon: Car
    },
    {
      id: 'truck',
      title: 'Move with Truck',
      subtitle: 'Vehicle: Pickup or box truck',
      description: 'Ideal for: Furniture, appliances, or full apartment moves',
      tag: 'Moves',
      tagColor: 'bg-green-500',
      icon: Truck
    },
    {
      id: 'bus',
      title: 'Move with Bus/Van',
      subtitle: 'Vehicle: 12-seater or larger van/bus',
      description: 'Ideal for: Group relocations or bulk item transport',
      tag: 'Group Moves',
      tagColor: 'bg-green-500',
      icon: Bus
    },
    {
      id: 'city',
      title: 'City-to-City Moves',
      subtitle: 'Vehicle: Any long-distance capable ride',
      description: 'Ideal for: Intercity relocations or deliveries',
      tag: 'Long Haul',
      tagColor: 'bg-blue-500',
      icon: MapPin
    }
  ];

  const handleContinue = () => {
    if (selectedMethod) {
      const urlParams = new URLSearchParams(window.location.search);
      const location = urlParams.get('location');
      const selectedMethodData = earningMethods.find(method => method.id === selectedMethod);
      const methodTitle = selectedMethodData?.title || 'Delivery';
      
      const params = new URLSearchParams();
      if (location) params.set('location', location);
      params.set('method', methodTitle);
      
      window.location.href = `/driver-onboarding?${params.toString()}`;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-8">
            Choose how you want to earn with Unboxd
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {earningMethods.map((method) => (
            <Card 
              key={method.id}
              className={`cursor-pointer border-2 transition-all hover:shadow-lg ${
                selectedMethod === method.id 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedMethod(method.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${method.tagColor}`}>
                    {method.tag}
                  </span>
                  <method.icon className="w-8 h-8 text-gray-600" />
                </div>
                
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {method.title}
                </h3>
                
                <p className="text-sm text-muted-foreground mb-2">
                  {method.subtitle}
                </p>
                
                <p className="text-sm text-muted-foreground">
                  {method.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button
            onClick={handleContinue}
            disabled={!selectedMethod}
            className="px-12 py-3 text-lg font-semibold bg-gray-600 text-white hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg"
          >
            Continue
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ChooseEarningMethod;