import React from 'react';
import { Clock, Dumbbell, Truck, Calendar, Sparkles, X, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const WhyUnboxd = () => {
  const features = [
    {
      icon: Clock,
      title: "24-Hour Complete Move",
      withoutUnboxd: "Multiple-day packing hassles, extended disruption to your life",
      withUnboxd: "Get fully moved in or out within 24 hours — everything done in one session"
    },
    {
      icon: Dumbbell,
      title: "No Heavy Lifting for You",
      withoutUnboxd: "Carrying heavy furniture, boxes, and appliances yourself (risking injury and exhaustion)",
      withUnboxd: "Movers do 100% of the lifting while you relax"
    },
    {
      icon: Truck,
      title: "No Rental Truck Paperwork",
      withoutUnboxd: "Renting a truck, signing insurance waivers, refueling, and returning it",
      withUnboxd: "We bring the truck, handle logistics, and you never touch a steering wheel"
    },
    {
      icon: Calendar,
      title: "No Scheduling Stress",
      withoutUnboxd: "Calling friends or family to help, aligning everyone's schedules, and hoping they show up",
      withUnboxd: "Book online in under 60 seconds, and we handle the rest with guaranteed arrival times"
    },
    {
      icon: Sparkles,
      title: "No Cleaning Stress Before Move-Out",
      withoutUnboxd: "Spending hours cleaning before moving out to avoid landlord penalties",
      withUnboxd: "Optional 'move-out cleaning service' so you hand over the keys stress-free"
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why Choose Unboxd?
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            We eliminate the stress, hassle, and physical demands of traditional moving. 
            Here's how we make your move effortless.
          </p>
        </div>

        <div className="space-y-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-border overflow-hidden">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
                  {/* Feature Title */}
                  <div className="bg-primary/5 p-6 flex items-center justify-center lg:justify-start">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <feature.icon className="h-10 w-10 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground">
                        {feature.title}
                      </h3>
                    </div>
                  </div>

                  {/* Without Unboxd */}
                  <div className="p-6 border-l border-r border-border/50">
                    <div className="flex items-start space-x-3">
                      <X className="h-5 w-5 text-destructive mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-foreground mb-2">
                          Without Unboxd
                        </h4>
                        <p className="text-muted-foreground text-sm">
                          {feature.withoutUnboxd}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* With Unboxd */}
                  <div className="p-6 bg-primary/5">
                    <div className="flex items-start space-x-3">
                      <Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-foreground mb-2">
                          With Unboxd
                        </h4>
                        <p className="text-muted-foreground text-sm">
                          {feature.withUnboxd}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center space-x-2 bg-primary/10 px-6 py-3 rounded-full">
            <Check className="h-5 w-5 text-primary" />
            <span className="text-primary font-medium">
              Join thousands who've made the switch to stress-free moving
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyUnboxd;