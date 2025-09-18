import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthContext';
import AuthModal from '@/components/auth/AuthModal';
import CSVUploader from '@/components/corporate/CSVUploader';
import MultiRowEditor from '@/components/corporate/MultiRowEditor';
import PreviewConfirm from '@/components/corporate/PreviewConfirm';
import { ArrowLeft, FileText, Edit3, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface CSVRow {
  id: string;
  data: Record<string, string>;
  errors: string[];
  isValid: boolean;
}

type BulkBookingStep = 'upload' | 'edit' | 'preview' | 'confirm';

const BulkBooking: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<BulkBookingStep>('upload');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [csvRows, setCsvRows] = useState<CSVRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Check authentication on component mount
  React.useEffect(() => {
    if (!user) {
      setShowAuthModal(true);
    }
  }, [user]);

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    // Emit analytics event
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'bulk_booking_started', {
        event_category: 'booking',
        event_label: 'bulk_booking_started'
      });
    }
  };

  const handleCSVUpload = (rows: CSVRow[]) => {
    setCsvRows(rows);
    setCurrentStep('edit');
    
    // Emit analytics event
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'bulk_booking_uploaded', {
        event_category: 'booking',
        event_label: 'bulk_booking_uploaded',
        value: rows.length
      });
    }
  };

  const handleEditComplete = () => {
    setCurrentStep('preview');
  };

  const handlePreviewConfirm = () => {
    setCurrentStep('confirm');
  };

  const handleFinalConfirm = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      navigate('/corporate/dashboard');
    }, 2000);
  };

  const handleBack = () => {
    switch (currentStep) {
      case 'edit':
        setCurrentStep('upload');
        break;
      case 'preview':
        setCurrentStep('edit');
        break;
      case 'confirm':
        setCurrentStep('preview');
        break;
    }
  };

  const getStepProgress = () => {
    switch (currentStep) {
      case 'upload': return 25;
      case 'edit': return 50;
      case 'preview': return 75;
      case 'confirm': return 100;
      default: return 0;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 'upload': return 'Upload CSV File';
      case 'edit': return 'Edit & Validate Data';
      case 'preview': return 'Review & Confirm';
      case 'confirm': return 'Processing...';
      default: return '';
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 'upload': return 'Upload your bulk booking data in CSV format';
      case 'edit': return 'Review and edit your booking data';
      case 'preview': return 'Review your bookings before confirmation';
      case 'confirm': return 'Your bulk booking is being processed';
      default: return '';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Card className="w-full max-w-md bg-gray-900 border-gray-800">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-white">Authentication Required</CardTitle>
            <CardDescription className="text-gray-400">
              Please sign in to access bulk booking features
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button 
              onClick={() => setShowAuthModal(true)}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Sign In to Continue
            </Button>
          </CardContent>
        </Card>
        
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={handleAuthSuccess}
          title="Sign in to start bulk booking"
          description="Access your corporate dashboard and manage bulk bookings"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/corporate')}
              className="text-gray-300 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Corporate
            </Button>
            <div className="h-6 w-px bg-gray-700"></div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Bulk Booking
            </h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Progress Header */}
        <Card className="mb-8 bg-gray-900 border-gray-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white">{getStepTitle()}</CardTitle>
                <CardDescription className="text-gray-400">{getStepDescription()}</CardDescription>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-400">Step {currentStep === 'upload' ? '1' : currentStep === 'edit' ? '2' : currentStep === 'preview' ? '3' : '4'} of 4</div>
                <div className="text-lg font-semibold text-white">{getStepProgress()}%</div>
              </div>
            </div>
            <Progress value={getStepProgress()} className="mt-4" />
          </CardHeader>
        </Card>

        {/* Step Navigation */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-8">
            <div className={`flex items-center space-x-2 ${currentStep === 'upload' ? 'text-blue-400' : 'text-gray-600'}`}>
              <FileText className="w-5 h-5" />
              <span className="text-sm font-medium">Upload</span>
            </div>
            <div className="w-8 h-px bg-gray-700"></div>
            <div className={`flex items-center space-x-2 ${currentStep === 'edit' ? 'text-blue-400' : 'text-gray-600'}`}>
              <Edit3 className="w-5 h-5" />
              <span className="text-sm font-medium">Edit</span>
            </div>
            <div className="w-8 h-px bg-gray-700"></div>
            <div className={`flex items-center space-x-2 ${currentStep === 'preview' ? 'text-blue-400' : 'text-gray-600'}`}>
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-medium">Preview</span>
            </div>
            <div className="w-8 h-px bg-gray-700"></div>
            <div className={`flex items-center space-x-2 ${currentStep === 'confirm' ? 'text-blue-400' : 'text-gray-600'}`}>
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-medium">Confirm</span>
            </div>
          </div>
        </div>

        {/* Step Content */}
        <div className="max-w-6xl mx-auto">
          {currentStep === 'upload' && (
            <CSVUploader
              onUpload={handleCSVUpload}
              onPreview={handleEditComplete}
            />
          )}

          {currentStep === 'edit' && (
            <MultiRowEditor
              rows={csvRows}
              onUpdate={setCsvRows}
              onSaveTemplate={(name) => console.log('Template saved:', name)}
            />
          )}

          {currentStep === 'preview' && (
            <PreviewConfirm
              rows={csvRows}
              onConfirm={handlePreviewConfirm}
              onBack={handleBack}
            />
          )}

          {currentStep === 'confirm' && (
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <h3 className="text-xl font-semibold text-white mb-2">Processing Your Bulk Booking</h3>
                <p className="text-gray-400">Please wait while we process your {csvRows.filter(row => row.isValid).length} bookings...</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Navigation Buttons */}
        {currentStep !== 'upload' && currentStep !== 'confirm' && (
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handleBack}
              className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              Back
            </Button>
            
            {currentStep === 'edit' && (
              <Button
                onClick={handleEditComplete}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Continue to Preview
              </Button>
            )}
          </div>
        )}
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
        title="Sign in to start bulk booking"
        description="Access your corporate dashboard and manage bulk bookings"
      />
    </div>
  );
};

export default BulkBooking;