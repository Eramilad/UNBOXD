
import React, { useState } from 'react';
import { Shield, AlertTriangle, Phone, MapPin, Clock, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { SOSButton } from './SOSButton';

export const SafetyTools = ({ worker }) => {
  const { toast } = useToast();
  const [emergencyContacts] = useState([
    { name: 'Police', number: '199', type: 'emergency' },
    { name: 'Fire Service', number: '199', type: 'emergency' },
    { name: 'Unboxd Support', number: '+234-XXX-XXXX', type: 'support' }
  ]);

  const safetyChecklist = [
    'Verify customer identity before starting',
    'Take photos of items before and after',
    'Wear protective equipment',
    'Check vehicle safety',
    'Share location with emergency contact'
  ];

  const callEmergency = (number: string, name: string) => {
    if (typeof window !== 'undefined') {
      window.open(`tel:${number}`, '_self');
      toast({
        title: `Calling ${name}`,
        description: `Dialing ${number}`,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Shield className="h-6 w-6 text-green-500" />
        <h2 className="text-xl font-semibold">Safety Center</h2>
      </div>

      {/* Emergency Contacts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Phone className="h-5 w-5 text-red-500" />
            <span>Emergency Contacts</span>
          </CardTitle>
          <CardDescription>Quick access to emergency services</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {emergencyContacts.map((contact, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{contact.name}</p>
                  <p className="text-sm text-gray-600">{contact.number}</p>
                </div>
                <Button
                  onClick={() => callEmergency(contact.number, contact.name)}
                  variant={contact.type === 'emergency' ? 'destructive' : 'outline'}
                  size="sm"
                >
                  <Phone className="h-4 w-4 mr-1" />
                  Call
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Safety Checklist */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span>Pre-Job Safety Checklist</span>
          </CardTitle>
          <CardDescription>Complete before starting any job</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {safetyChecklist.map((item, index) => (
              <div key={index} className="flex items-center space-x-3">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Live Location Sharing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-blue-500" />
            <span>Live Location</span>
          </CardTitle>
          <CardDescription>Share your location for safety</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Location Sharing</p>
              <p className="text-sm text-gray-600">Currently active</p>
            </div>
            <Badge variant="outline" className="text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Active
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* SOS Button - Fixed position */}
      <SOSButton workerId={worker.id} />
    </div>
  );
};
