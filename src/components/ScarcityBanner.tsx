import React, { useState, useEffect } from 'react';
import { X, Clock, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const ScarcityBanner = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState({
    days: 6,
    hours: 14,
    minutes: 23,
    seconds: 45
  });

  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-red-600 to-red-700 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="relative max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            <AlertTriangle className="h-5 w-5 text-yellow-300 animate-pulse" />
            <div className="flex-1">
              <p className="text-sm font-medium">
                📦 Only 3 move slots left this week — secure yours before we close!
              </p>
              <p className="text-xs opacity-90 mt-1">
                🏫 School management deadline: Special discounted moves until Sept 15th
              </p>
            </div>
            
            <div className="hidden md:flex items-center space-x-2 bg-white/20 rounded-lg px-3 py-1">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-mono">
                {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
              </span>
            </div>
            
            <Button
              onClick={() => navigate('/book-service')}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-4 py-1 text-sm"
            >
              Secure Slot
            </Button>
          </div>
          
          <button
            onClick={() => setIsVisible(false)}
            className="ml-4 p-1 hover:bg-white/20 rounded"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScarcityBanner;