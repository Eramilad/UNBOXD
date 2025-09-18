import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, Car, Shield, Camera, FileText, CreditCard, CheckCircle, Upload, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DriverOnboarding = () => {
  const navigate = useNavigate();
  
  // Get location and method from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const location = urlParams.get('location') || 'New York City';
  const method = urlParams.get('method') || 'Delivery';
  
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  
  const onboardingSteps = [
    {
      id: 'vehicle-info',
      title: 'Vehicle Information',
      subtitle: 'Recommended next step',
      icon: Car,
      isRecommended: true,
      acceptedTypes: '.pdf,.jpg,.jpeg,.png'
    },
    {
      id: 'activation-waitlist',
      title: 'Activation Waitlist',
      subtitle: '',
      icon: CheckCircle,
      isRecommended: false,
      acceptedTypes: '.pdf,.jpg,.jpeg,.png'
    },
    {
      id: 'background-check',
      title: 'Background Check',
      subtitle: '',
      icon: Shield,
      isRecommended: false,
      acceptedTypes: '.pdf,.jpg,.jpeg,.png'
    },
    {
      id: 'profile-photo',
      title: 'Profile photo',
      subtitle: '',
      icon: Camera,
      isRecommended: false,
      acceptedTypes: '.jpg,.jpeg,.png'
    },
    {
      id: 'drivers-license',
      title: "Driver's License",
      subtitle: '',
      icon: FileText,
      isRecommended: false,
      acceptedTypes: '.pdf,.jpg,.jpeg,.png'
    },
    {
      id: 'vehicle-insurance',
      title: 'Vehicle Insurance',
      subtitle: '',
      icon: CreditCard,
      isRecommended: false,
      acceptedTypes: '.pdf,.jpg,.jpeg,.png'
    },
    {
      id: 'terms-conditions',
      title: 'Terms and Conditions',
      subtitle: '',
      icon: FileText,
      isRecommended: false,
      acceptedTypes: '.pdf'
    }
  ];

  const handleFileUpload = (stepId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCompletedSteps(prev => new Set([...prev, stepId]));
      console.log(`Uploaded file for ${stepId}:`, file.name);
    }
  };

  const handleStepClick = (stepId: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = onboardingSteps.find(step => step.id === stepId)?.acceptedTypes || '';
    input.onchange = (event) => handleFileUpload(stepId, event as any);
    input.click();
  };

  const allStepsCompleted = completedSteps.size === onboardingSteps.length;

  const handleContinue = () => {
    if (allStepsCompleted) {
      // Navigate to desktop driver dashboard
      navigate('/driver-dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="mb-8">
            <p className="text-sm text-muted-foreground mb-2">Signing up for</p>
            <p className="text-lg font-medium text-foreground">{location} • {method} • 🚗 🚲</p>
          </div>
          
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Welcome
          </h1>
          <p className="text-xl text-muted-foreground">
            Here's what you need to do to set up your account.
          </p>
        </div>

        {/* Onboarding Steps */}
        <div className="space-y-4 mb-12">
          {onboardingSteps.map((step) => {
            const Icon = step.icon;
            const isCompleted = completedSteps.has(step.id);
            
            return (
              <Card
                key={step.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md border ${
                  isCompleted ? 'border-green-500 bg-green-50/50' : 'border-border'
                }`}
                onClick={() => handleStepClick(step.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        isCompleted ? 'bg-green-100' : 'bg-muted'
                      }`}>
                        {isCompleted ? (
                          <Check className="w-6 h-6 text-green-600" />
                        ) : (
                          <Icon className="w-6 h-6 text-muted-foreground" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className={`text-lg font-medium ${
                          isCompleted ? 'text-green-700' : 'text-foreground'
                        }`}>
                          {step.title}
                        </h3>
                        {step.isRecommended && !isCompleted && (
                          <p className="text-sm text-blue-600 font-medium">
                            {step.subtitle}
                          </p>
                        )}
                        {isCompleted && (
                          <p className="text-sm text-green-600 font-medium">
                            Document uploaded
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {isCompleted ? (
                      <Check className="w-6 h-6 text-green-600" />
                    ) : (
                      <Upload className="w-6 h-6 text-muted-foreground" />
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Continue Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleContinue}
            disabled={!allStepsCompleted}
            className={`px-16 py-4 text-lg font-semibold rounded-lg min-w-[200px] transition-all duration-200 ${
              allStepsCompleted 
                ? 'bg-black text-white hover:bg-gray-800' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Continue
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DriverOnboarding;