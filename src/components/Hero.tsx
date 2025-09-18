
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import heroMovingTruck from '@/assets/hero-moving-truck.jpg';
import { useAuth } from '@/components/auth/AuthContext';

const Hero = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleStartMoving = () => {
    // Direct navigation to book-service without authentication check
    navigate('/book-service');
  };

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between py-16 lg:py-24">
          {/* Left Content */}
          <div className="flex-1 lg:pr-16">
            <h1 className="text-5xl lg:text-6xl font-bold text-black mb-8">
              Move your load anywhere with Unboxd
            </h1>
            
            <p className="text-lg text-gray-600 mb-8">
              Professional moving services at your fingertips. From small items to full apartments, we've got you covered.
            </p>
            
            <Button
              onClick={handleStartMoving}
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-4 text-lg font-medium rounded-lg mb-8"
            >
              Start moving today
            </Button>
            
            <div className="text-sm text-gray-600">
              <button 
                onClick={() => navigate('/auth')}
                className="hover:underline"
              >
                {user ? 'View your account' : 'Log in to see your recent activity'}
              </button>
            </div>
          </div>
          
          {/* Right Image */}
          <div className="flex-1 lg:pl-8 mt-8 lg:mt-0">
            <img
              className="w-full h-96 object-cover rounded-lg"
              src={heroMovingTruck}
              alt="Professional moving truck being loaded with boxes and furniture"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
