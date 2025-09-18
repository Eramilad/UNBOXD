
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Car, Truck, Bus, MapPin } from 'lucide-react';

const ChooseVehicleType = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedVehicle, setSelectedVehicle] = useState<string>('');
  
  // Get pickup and destination from navigation state
  const { pickup, destination } = location.state || {};

  const vehicleTypes = [
    {
      id: 'car',
      title: 'Car Service',
      subtitle: 'Sedan or hatchback',
      description: 'Perfect for: Small item moves, documents, or light packages',
      tag: 'Light Moves',
      tagColor: 'bg-green-500',
      icon: Car,
      priceRange: '₦2,000 - ₦5,000'
    },
    {
      id: 'truck',
      title: 'Truck Service',
      subtitle: 'Pickup or box truck',
      description: 'Ideal for: Furniture, appliances, or apartment moves',
      tag: 'Heavy Moves',
      tagColor: 'bg-blue-500',
      icon: Truck,
      priceRange: '₦8,000 - ₦15,000'
    },
    {
      id: 'bus',
      title: 'Large Van/Bus',
      subtitle: '12-seater or larger vehicle',
      description: 'Best for: Full house moves or bulk item transport',
      tag: 'Bulk Moves',
      tagColor: 'bg-purple-500',
      icon: Bus,
      priceRange: '₦12,000 - ₦25,000'
    },
    {
      id: 'intercity',
      title: 'Inter-city Service',
      subtitle: 'Long-distance capable vehicle',
      description: 'Perfect for: City-to-city moves or long-distance deliveries',
      tag: 'Long Distance',
      tagColor: 'bg-orange-500',
      icon: MapPin,
      priceRange: '₦15,000 - ₦40,000'
    }
  ];

  const handleContinue = () => {
    if (selectedVehicle && pickup && destination) {
      const selectedVehicleData = vehicleTypes.find(v => v.id === selectedVehicle);
      navigate('/find-mover', { 
        state: { 
          pickup, 
          destination,
          vehicleType: selectedVehicleData?.title || 'Standard Service'
        } 
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Choose the right vehicle for your move
          </h1>
          <p className="text-lg text-muted-foreground mb-2">
            Select the vehicle type that best fits your moving needs
          </p>
          {pickup && destination && (
            <div className="bg-muted rounded-lg p-4 mt-6">
              <p className="text-sm text-muted-foreground mb-1">Moving from:</p>
              <p className="font-medium">{pickup}</p>
              <p className="text-sm text-muted-foreground mb-1 mt-2">To:</p>
              <p className="font-medium">{destination}</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {vehicleTypes.map((vehicle) => (
            <Card 
              key={vehicle.id}
              className={`cursor-pointer border-2 transition-all hover:shadow-lg ${
                selectedVehicle === vehicle.id 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => setSelectedVehicle(vehicle.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${vehicle.tagColor}`}>
                    {vehicle.tag}
                  </span>
                  <vehicle.icon className="w-8 h-8 text-muted-foreground" />
                </div>
                
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {vehicle.title}
                </h3>
                
                <p className="text-sm text-muted-foreground mb-2">
                  {vehicle.subtitle}
                </p>
                
                <p className="text-sm text-muted-foreground mb-3">
                  {vehicle.description}
                </p>
                
                <p className="text-lg font-semibold text-primary">
                  {vehicle.priceRange}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button
            onClick={handleContinue}
            disabled={!selectedVehicle}
            className="px-12 py-3 text-lg font-semibold"
          >
            Find Movers
          </Button>
          
          {!pickup || !destination ? (
            <p className="text-sm text-muted-foreground mt-4">
              Please go back to select pickup and destination locations
            </p>
          ) : null}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ChooseVehicleType;
