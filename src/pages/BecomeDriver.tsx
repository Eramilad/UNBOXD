import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Car, Bike, MapPin, Zap } from 'lucide-react';

const BecomeDriver = () => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const earningOptions = [
    {
      id: 'delivery-car',
      title: 'Delivery with car',
      category: 'Delivery',
      age: '19+',
      requirement: 'Vehicle: 2-door or 4-door',
      icon: Car,
      categoryBg: 'bg-emerald-500',
      categoryText: 'text-white',
      borderColor: 'border-gray-200'
    },
    {
      id: 'delivery-bicycle',
      title: 'Delivery with bicycle',
      category: 'Delivery',
      age: '18+',
      requirement: 'Mode Of Transport: Bicycle, e-bike, or e-scooter',
      icon: Bike,
      categoryBg: 'bg-emerald-500',
      categoryText: 'text-white',
      borderColor: 'border-gray-200'
    },
    {
      id: 'rides-nyc',
      title: 'Rides in New York City',
      category: 'Rides',
      age: '',
      requirement: 'License: I have or will get a TLC license',
      icon: Car,
      categoryBg: 'bg-blue-500',
      categoryText: 'text-white',
      borderColor: 'border-gray-200'
    },
    {
      id: 'delivery-scooter',
      title: 'Delivery with scooter',
      category: 'Delivery',
      age: '19+',
      requirement: 'Vehicle: Scooter or moped 50cc or less',
      icon: Zap,
      categoryBg: 'bg-emerald-500',
      categoryText: 'text-white',
      borderColor: 'border-gray-200'
    }
  ];

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
  };

  const handleContinue = () => {
    if (selectedOption) {
      console.log('Selected option:', selectedOption);
      // Handle navigation or next step
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Choose how you want to earn with Uber
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {earningOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = selectedOption === option.id;
            
            return (
              <Card
                key={option.id}
                className={`cursor-pointer transition-all duration-200 border-2 hover:shadow-lg ${
                  isSelected ? 'border-black shadow-lg' : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleOptionSelect(option.id)}
              >
                <CardContent className="p-8">
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center justify-between">
                      <span className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium ${option.categoryBg} ${option.categoryText}`}>
                        {option.category}
                      </span>
                      <Icon className="w-16 h-16 text-gray-600" />
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold text-foreground">
                        {option.title}
                      </h3>
                      {option.age && (
                        <p className="text-sm text-muted-foreground">
                          Age: {option.age}
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {option.requirement}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="flex justify-center">
          <Button
            onClick={handleContinue}
            disabled={!selectedOption}
            className="px-16 py-4 text-lg font-semibold bg-black text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg min-w-[200px]"
          >
            Continue
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BecomeDriver;