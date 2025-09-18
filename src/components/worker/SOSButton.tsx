
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Phone } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SOSButtonProps {
  workerId: string;
}

export const SOSButton = ({ workerId }: SOSButtonProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const triggerSOS = async () => {
    setLoading(true);
    
    try {
      // Get current location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;
          
          // Insert SOS alert into database
          const { error } = await supabase
            .from('sos_alerts')
            .insert({
              user_id: workerId,
              lat: latitude,
              lng: longitude
            });

          if (error) {
            console.error('Error creating SOS alert:', error);
            toast({
              title: "Error",
              description: "Failed to send SOS alert",
              variant: "destructive",
            });
          } else {
            toast({
              title: "SOS Alert Sent!",
              description: "Emergency services have been notified",
            });
            
            // You could also trigger additional actions here like:
            // - Send push notification to support team
            // - Call emergency services API
            // - Send SMS to emergency contacts
          }
          
          setLoading(false);
        }, (error) => {
          console.error('Geolocation error:', error);
          toast({
            title: "Location Error",
            description: "Could not get your location for SOS alert",
            variant: "destructive",
          });
          setLoading(false);
        });
      } else {
        toast({
          title: "Location Not Supported",
          description: "Your device doesn't support location services",
          variant: "destructive",
        });
        setLoading(false);
      }
    } catch (error) {
      console.error('SOS error:', error);
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        onClick={triggerSOS}
        disabled={loading}
        className="bg-red-600 hover:bg-red-700 text-white rounded-full p-4 shadow-lg"
        size="lg"
      >
        {loading ? (
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
        ) : (
          <>
            <AlertTriangle className="h-6 w-6 mr-2" />
            SOS
          </>
        )}
      </Button>
    </div>
  );
};
