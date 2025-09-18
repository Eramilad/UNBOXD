
import React from 'react';
import { Clock, Shield, Phone, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const ProvenProcess = () => {
  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Our Proven Process
          </h2>
          <div className="flex items-center justify-center space-x-4 text-lg font-medium text-foreground mb-8">
            <span>Pick-up</span>
            <ArrowRight className="h-5 w-5 text-primary" />
            <span>Packing</span>
            <ArrowRight className="h-5 w-5 text-primary" />
            <span>Transit</span>
            <ArrowRight className="h-5 w-5 text-primary" />
            <span>Delivery</span>
            <ArrowRight className="h-5 w-5 text-primary" />
            <span className="text-primary font-bold">Done in 24 Hours</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Guarantee Card */}
          <Card className="p-6 border-border">
            <CardContent className="p-0">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <Shield className="h-12 w-12 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    On-Time Guarantee
                  </h3>
                  <p className="text-muted-foreground">
                    We are more than 15 mins late for pickup, you get 50% off.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Coordinator Card */}
          <Card className="p-6 border-border">
            <CardContent className="p-0">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <Phone className="h-12 w-12 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    Dedicated Coordinator
                  </h3>
                  <p className="text-muted-foreground">
                    Within 10 minutes of booking, your dedicated move coordinator will call to confirm your pickup time, note special requests, and answer any questions so you feel ready and confident.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ProvenProcess;
