
import React, { useState } from 'react';
import { CheckCircle, Share2, Copy, Mail, MessageCircle, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const BookingConfirmation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  
  // Generate a simple referral code (in a real app, this would come from the backend)
  const referralCode = "MOVE10" + Math.random().toString(36).substr(2, 4).toUpperCase();
  const shareMessage = `🚚 I just booked a move with Unboxd! Use my referral code "${referralCode}" and get 10% off your next move. Easy, affordable, and reliable moving services! 🏠✨`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    toast({
      title: "Copied!",
      description: "Referral code copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: string) => {
    const encodedMessage = encodeURIComponent(shareMessage);
    let shareUrl = '';

    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodedMessage}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=Get 10% off your move with Unboxd&body=${encodedMessage}`;
        break;
      case 'sms':
        shareUrl = `sms:?body=${encodedMessage}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* Success Icon */}
        <div className="mb-6">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
        </div>

        {/* Congratulations Message */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          🎉 Congratulations!
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Your move has been successfully booked with us. We'll contact you shortly to confirm the details and get everything ready for your move.
        </p>

        {/* Referral Section */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            <Users className="inline h-5 w-5 mr-2" />
            Share with a friend & get 10% off your next move!
          </h2>
          <p className="text-gray-600 mb-4">
            Help your friends move with ease and save money on your future moves.
          </p>
          
          {/* Referral Code */}
          <div className="bg-white rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-500 mb-2">Your referral code:</p>
            <div className="flex items-center justify-center space-x-3">
              <code className="text-2xl font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-lg">
                {referralCode}
              </code>
              <Button
                onClick={handleCopyCode}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <Copy className="h-4 w-4" />
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </Button>
            </div>
          </div>

          {/* Share Buttons */}
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              onClick={() => handleShare('whatsapp')}
              className="bg-green-500 hover:bg-green-600 text-white flex items-center space-x-2"
            >
              <MessageCircle className="h-4 w-4" />
              <span>WhatsApp</span>
            </Button>
            <Button
              onClick={() => handleShare('email')}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <Mail className="h-4 w-4" />
              <span>Email</span>
            </Button>
            <Button
              onClick={() => handleShare('sms')}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <MessageCircle className="h-4 w-4" />
              <span>SMS</span>
            </Button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => navigate('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
          >
            Back to Home
          </Button>
          <Button
            onClick={() => navigate('/book-service')}
            variant="outline"
            className="px-8 py-3"
          >
            Book Another Move
          </Button>
        </div>

        {/* Additional Info */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            We'll send you a confirmation email shortly with all the details of your move.
            If you have any questions, feel free to contact our support team.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
