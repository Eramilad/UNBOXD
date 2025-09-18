import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import marketplacePlanning from '@/assets/marketplace-planning.jpg';

const Marketplace = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Image */}
          <div className="relative">
            <img
              className="w-full h-96 object-cover rounded-lg shadow-lg"
              src={marketplacePlanning}
              alt="Delivery truck loaded with packages and driver planning route"
            />
          </div>

          {/* Right Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Plan for later
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Get your move right with Unboxd Reserve
            </p>
            
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-foreground mb-4">Benefits</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3"></div>
                  <span className="text-muted-foreground">Reserve your mover up to 30 days in advance</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3"></div>
                  <span className="text-muted-foreground">Easy fare included in your trip</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3"></div>
                  <span className="text-muted-foreground">Cancel at no charge up to 60 minutes in advance</span>
                </li>
              </ul>
            </div>

            <div className="flex space-x-4">
              <input
                type="date"
                className="flex-1 px-4 py-3 border border-input rounded-lg"
                placeholder="Date"
              />
              <input
                type="time"
                className="flex-1 px-4 py-3 border border-input rounded-lg"
                placeholder="Time"
              />
            </div>

            <Button
              onClick={() => navigate('/book-service')}
              className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90 py-3 text-base font-medium rounded-lg"
            >
              Reserve
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Marketplace;