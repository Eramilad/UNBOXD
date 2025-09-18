import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Truck, Package, MapPin } from 'lucide-react';

const Waitlist = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Image */}
          <div className="relative">
            <img
              className="w-full h-96 object-cover rounded-lg shadow-lg"
              src="https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Professional movers loading truck with boxes and furniture"
            />
          </div>

          {/* Right Content */}
          <div className="text-primary-foreground">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Start your moving business with Unboxd
            </h2>
            <p className="text-lg mb-8 text-primary-foreground/90">
              Join thousands of drivers making money by helping people move their loads. Use your own vehicle and set your own schedule.
            </p>
            
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="text-center">
                <Truck className="h-8 w-8 mx-auto mb-2 text-primary-foreground" />
                <p className="text-sm font-medium">Use any vehicle</p>
              </div>
              <div className="text-center">
                <Package className="h-8 w-8 mx-auto mb-2 text-primary-foreground" />
                <p className="text-sm font-medium">Move anything</p>
              </div>
              <div className="text-center">
                <MapPin className="h-8 w-8 mx-auto mb-2 text-primary-foreground" />
                <p className="text-sm font-medium">Work anywhere</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => navigate('/earn-with-unboxd')}
                variant="secondary"
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 px-8 py-3 text-base font-semibold rounded-lg"
              >
                Start moving today
              </Button>
              <Button
                variant="outline"
                className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary px-8 py-3 text-base font-semibold rounded-lg"
              >
                Learn more
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Waitlist;