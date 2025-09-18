import React from 'react';
import { Gift, Sparkles, Package, Shield, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const BonusSection = () => {
  const navigate = useNavigate();

  const bonuses = [
    {
      icon: Package,
      title: "Smart Essentials Kit",
      description: "Bubble wrap, tape, markers, and moving labels",
      value: "₦10,000",
      included: true
    },
    {
      icon: CheckCircle,
      title: "Moving Day Survival Checklist",
      description: "Step-by-step guide for stress-free moving",
      value: "₦5,000",
      included: true
    }
  ];

  const totalValue = bonuses.reduce((sum, bonus) => sum + parseInt(bonus.value.replace(/[₦,]/g, '')), 0);

  return (
    <section className="py-16 bg-gradient-to-br from-green-50 to-emerald-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAwMDAiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iNyIgY3k9IjciIHI9IjUiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-50"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-3">
              <Gift className="h-8 w-8 text-white" />
            </div>
            <Sparkles className="h-6 w-6 text-yellow-500 ml-2 animate-pulse" />
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            🎁 Secure Your Slot Today & Get
          </h2>
          <p className="text-lg text-gray-600 mb-2">
            Limited-time bonuses for early bookers
          </p>
          <div className="inline-flex items-center bg-white rounded-full px-6 py-2 shadow-lg border-2 border-green-200">
            <span className="text-2xl font-bold text-gray-400 line-through mr-2">₦{totalValue.toLocaleString()}</span>
            <span className="text-2xl font-bold text-green-600">FREE TODAY</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {bonuses.map((bonus, index) => (
            <Card key={index} className="border-2 border-green-200 bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-2 right-2">
                <div className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  FREE
                </div>
              </div>
              
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-full p-4">
                    <bonus.icon className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {bonus.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {bonus.description}
                </p>
                
                <div className="border-t pt-4">
                  <span className="text-lg font-bold text-gray-400 line-through">
                    {bonus.value}
                  </span>
                  <span className="text-sm text-green-600 font-semibold ml-2">
                    FREE with booking
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-auto border-4 border-green-300">
            <div className="mb-4">
              <span className="text-4xl">🎯</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Total Bonus Value
            </h3>
            <div className="text-3xl font-bold text-gray-400 line-through mb-2">
              ₦{totalValue.toLocaleString()}
            </div>
            <div className="text-4xl font-bold text-green-600 mb-6">
              FREE TODAY
            </div>
            
            <Button
              onClick={() => navigate('/book-service')}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 text-lg"
            >
              Claim Your Bonuses Now
            </Button>
            
            <p className="text-xs text-gray-500 mt-3">
              *Bonuses apply to bookings made before Sept 15th deadline
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BonusSection;