import React from 'react';
import { Truck, Users, Shield, Clock, CheckCircle, AlertTriangle, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

const Services = () => {
  const navigate = useNavigate();
  
  const suggestions = [
    {
      icon: Truck,
      title: 'Student Move-Out Special',
      description: 'Perfect for dorm & apartment moves',
      image: '/placeholder-move.jpg',
      available: true,
      price: '₦15,000 - ₦35,000',
      originalPrice: '₦25,000 - ₦50,000',
      guarantees: [
        'One-trip promise (second trip free if we fail)',
        'Free "Smart Essentials Kit" (₦10,000 value)',
        'Only 7 clients get free deep cleaning bonus'
      ],
      deadline: 'Discounted rates for students moving before Sept 15th deadline',
      slotsLeft: 3
    },
    {
      icon: Users,
      title: 'Family Move Package',
      description: 'Complete household relocation',
      image: '/placeholder-reserve.jpg',
      available: true,
      price: '₦45,000 - ₦85,000',
      originalPrice: '₦60,000 - ₦120,000',
      guarantees: [
        'Full packing & unpacking service',
        'Furniture protection guarantee',
        'Same-day completion promise'
      ],
      deadline: 'Grand opening special - limited slots',
      slotsLeft: 2
    },
    {
      icon: Shield,
      title: 'Charter Premium',
      description: 'Large loads & commercial moves',
      image: '/placeholder-charter.jpg',
      available: true,
      price: '₦80,000 - ₦150,000',
      originalPrice: '₦120,000 - ₦200,000',
      guarantees: [
        'Dedicated team & equipment',
        'White-glove handling service',
        'Full insurance coverage'
      ],
      deadline: 'Enterprise rates locked until month-end',
      slotsLeft: 5
    },
    {
      icon: Clock,
      title: 'Express Package',
      description: 'Same-day delivery service',
      image: '/placeholder-package.jpg',
      available: false,
      price: 'Coming Soon',
      guarantees: [
        'Sub-4 hour delivery',
        'Real-time tracking',
        'Damage protection'
      ],
      deadline: 'Launching October 1st',
      slotsLeft: 0
    }
  ];

  const handleBookNow = (service) => {
    if (service.available) {
      navigate('/book-service');
    }
  };

  return (
    <section id="services" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Suggestions
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {suggestions.map((service, index) => (
            <Card key={index} className={`group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 relative overflow-hidden ${
              service.available ? 'border-green-200 bg-white' : 'border-gray-200 bg-gray-50'
            }`} onClick={() => handleBookNow(service)}>
              {service.available && service.slotsLeft <= 3 && (
                <div className="absolute top-2 right-2 z-10">
                  <Badge className="bg-red-500 text-white animate-pulse">
                    Only {service.slotsLeft} left!
                  </Badge>
                </div>
              )}
              
              <CardContent className="p-6">
                <div className="flex items-start space-x-4 mb-4">
                  <div className="flex-shrink-0">
                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                      service.available ? 'bg-primary/10' : 'bg-gray-100'
                    }`}>
                      <service.icon className={`h-8 w-8 ${
                        service.available ? 'text-primary' : 'text-gray-400'
                      }`} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      {service.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {service.description}
                    </p>
                    
                    <div className="mb-3">
                      {service.originalPrice && (
                        <span className="text-sm text-gray-400 line-through mr-2">
                          {service.originalPrice}
                        </span>
                      )}
                      <span className={`text-lg font-bold ${
                        service.available ? 'text-green-600' : 'text-gray-500'
                      }`}>
                        {service.price}
                      </span>
                    </div>
                  </div>
                </div>

                {service.available && (
                  <>
                    <div className="mb-4">
                      <h4 className="font-semibold text-sm text-gray-800 mb-2 flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                        Guarantees & Bonuses:
                      </h4>
                      <ul className="space-y-1">
                        {service.guarantees.map((guarantee, idx) => (
                          <li key={idx} className="text-xs text-gray-600 flex items-start">
                            <span className="text-green-500 mr-1">✅</span>
                            {guarantee}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mb-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <div className="flex items-start">
                        <AlertTriangle className="h-4 w-4 text-orange-600 mr-2 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-orange-800 font-medium">
                          <span className="font-semibold">Exclusive:</span> {service.deadline}
                        </p>
                      </div>
                    </div>

                    <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold">
                      <Zap className="h-4 w-4 mr-2" />
                      Reserve This Package
                    </Button>
                  </>
                )}

                {!service.available && (
                  <div className="text-center">
                    <p className="text-gray-500 text-sm mb-3">{service.deadline}</p>
                    <Button disabled className="w-full">
                      Coming Soon
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;