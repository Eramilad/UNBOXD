import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';


const EarnWithUber = () => {
  const [location, setLocation] = useState('Lagos');
  const [referralCode, setReferralCode] = useState('');

  const handleNext = () => {
    // Navigate to choose earning method page with location parameter
    window.location.href = `/choose-earning-method?location=${encodeURIComponent(location)}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-2xl font-bold text-white">₦</span>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Earn with Unboxd
          </h1>
          
          <p className="text-xl text-muted-foreground">
            Decide when, where, and how you want to earn.
          </p>
        </div>

        <Card className="border-2 border-gray-200">
          <CardContent className="p-8">
            <div className="space-y-8">
              <div className="space-y-3">
                <Label htmlFor="location" className="text-base font-medium text-foreground">
                  Where would you like to earn?
                </Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="text-lg py-3 px-4 border-2 border-gray-300 rounded-lg focus:border-black"
                  placeholder="Enter your city"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="referral" className="text-base font-medium text-foreground">
                  Referral code (optional)
                </Label>
                <Input
                  id="referral"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                  className="text-lg py-3 px-4 border-2 border-gray-300 rounded-lg focus:border-black"
                  placeholder="Enter referral code"
                />
              </div>

              <div className="pt-4">
                <Button
                  onClick={handleNext}
                  className="w-full py-4 text-lg font-semibold bg-black text-white hover:bg-gray-800 rounded-lg min-h-[56px]"
                >
                  Next →
                </Button>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  By proceeding, I agree that Unboxd or its representatives may contact me by email, phone, or SMS (including by automatic telephone dialing system) at the email address or number I provide, including for marketing purposes.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default EarnWithUber;