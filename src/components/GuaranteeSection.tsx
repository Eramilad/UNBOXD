import React from 'react';
import { CheckCircle, Shield, Clock, Truck, AlertTriangle, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const GuaranteeSection = () => {
  const guarantees = [
    {
      icon: Truck,
      title: "One-Trip Promise",
      description: "If we don't complete your move in one trip, your second trip is free",
      type: "promise",
      badge: "100% Guarantee"
    },
    {
      icon: Clock,
      title: "On-Time Guarantee",
      description: "We arrive exactly when promised (valid for bookings made 48+ hours in advance)",
      type: "conditional",
      badge: "Punctuality Promise"
    },
    {
      icon: Shield,
      title: "Preparedness Guarantee",
      description: "Full service guaranteed when items are packed and ready upon our arrival",
      type: "conditional",
      badge: "Readiness Required"
    },
    {
      icon: Calendar,
      title: "Deadline Guarantee",
      description: "Discounted student move-out rates locked in until Sept 15th management deadline",
      type: "limited",
      badge: "Limited Time"
    },
    {
      icon: AlertTriangle,
      title: "Weather Protection",
      description: "Extreme weather delays? We'll prioritize your move the moment it's safe",
      type: "protection",
      badge: "Safety First"
    }
  ];

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'promise': return 'bg-green-100 text-green-800 border-green-300';
      case 'conditional': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'limited': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'protection': return 'bg-purple-100 text-purple-800 border-purple-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'promise': return 'text-green-600 bg-green-100';
      case 'conditional': return 'text-blue-600 bg-blue-100';
      case 'limited': return 'text-orange-600 bg-orange-100';
      case 'protection': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full p-3">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Our Rock-Solid Guarantees
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Move with confidence. We stand behind our service with clear, honest guarantees that protect your investment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guarantees.map((guarantee, index) => (
            <Card key={index} className="border-2 border-white bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0">
                <Badge className={`rounded-none rounded-bl-lg border ${getBadgeColor(guarantee.type)}`}>
                  {guarantee.badge}
                </Badge>
              </div>
              
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getIconColor(guarantee.type)}`}>
                      <guarantee.icon className="h-6 w-6" />
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      {guarantee.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {guarantee.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto border-2 border-blue-200">
            <div className="flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-blue-600 mr-2" />
              <h3 className="text-xl font-bold text-gray-800">
                Your Peace of Mind is Our Priority
              </h3>
            </div>
            <p className="text-gray-600 text-sm">
              We believe in transparent service. Our guarantees are designed to give you confidence while keeping expectations realistic. 
              Questions about any guarantee? <span className="font-semibold text-blue-600">Contact us before booking.</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GuaranteeSection;