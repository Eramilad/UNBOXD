import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import howItWorksMoving from '@/assets/how-it-works-moving.jpg';

const HowItWorks = () => {
  const navigate = useNavigate();

  return (
    <section id="how-it-works" className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Log in to see your recent activity
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              View past trips, reorder suggestions, support resources, and more.
            </p>
            
            <Button
              onClick={() => navigate('/choose-earning-method')}
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 text-base font-medium rounded-lg"
            >
              Start moving today
            </Button>
            
            <p className="text-sm text-muted-foreground mt-4">
              Don't have an Unboxd account? <a href="/signup" className="text-primary hover:underline">Sign up</a>
            </p>
          </div>

          {/* Right Image */}
          <div className="relative">
            <img
              className="w-full h-96 object-cover rounded-lg shadow-lg"
              src={howItWorksMoving}
              alt="People packing and loading moving truck"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;