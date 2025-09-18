import React from 'react';
import { Clock, Package, RotateCcw, Calendar, CreditCard } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const AdditionalFeatures = () => {
  const features = [
    {
      icon: Clock,
      title: "Be Fully Settled in Your New Home in 24 Hours",
      description: "Without lifting a finger — complete move-in service from start to finish"
    },
    {
      icon: Package,
      title: "Sourcing Materials",
      description: "Deliver boxes, bubble wrap, tape 3–5 days before move"
    },
    {
      icon: RotateCcw,
      title: "Return of Borrowed Items",
      description: "We return all borrowed/rented gear for you"
    },
    {
      icon: Calendar,
      title: "Work/Study Conflict",
      description: "After-hours or weekend move slots at no extra cost"
    },
    {
      icon: CreditCard,
      title: "Cash Flow Strain",
      description: "Flexible split-payments"
    }
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Complete Moving Solutions
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            We handle every aspect of your move so you can focus on what matters most.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-border hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdditionalFeatures;