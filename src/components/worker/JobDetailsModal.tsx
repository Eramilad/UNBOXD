
import React from 'react';
import { X, MapPin, Clock, DollarSign, User, Phone, MessageCircle, Star, Package, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface JobDetailsModalProps {
  job: any;
  isOpen: boolean;
  onClose: () => void;
  onAccept: (jobId: string) => void;
}

export const JobDetailsModal = ({ job, isOpen, onClose, onAccept }: JobDetailsModalProps) => {
  if (!isOpen || !job) return null;

  const getSizeColor = (size: string) => {
    switch (size) {
      case 'light': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'heavy': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const openMaps = (address: string) => {
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://maps.google.com/?q=${encodedAddress}`, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold">{job.title}</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Job Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Job Details</span>
                <Badge className={getSizeColor(job.job_size)}>
                  {job.job_size}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">{job.description}</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center text-sm">
                  <Clock className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{job.scheduled_date} at {job.scheduled_time}</span>
                </div>
                <div className="flex items-center text-sm">
                  <DollarSign className="h-4 w-4 mr-2 text-green-500" />
                  <span className="font-semibold">₦{job.price.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location Details */}
          <Card>
            <CardHeader>
              <CardTitle>Locations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                  <div>
                    <p className="font-medium">Pickup Location</p>
                    <p className="text-sm text-gray-600">{job.location}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openMaps(job.location)}
                >
                  <Navigation className="h-4 w-4 mr-1" />
                  Maps
                </Button>
              </div>
              
              {job.destination && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-red-500" />
                    <div>
                      <p className="font-medium">Drop-off Location</p>
                      <p className="text-sm text-gray-600">{job.destination}</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openMaps(job.destination)}
                  >
                    <Navigation className="h-4 w-4 mr-1" />
                    Maps
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Customer Profile */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src="/placeholder-avatar.jpg" />
                  <AvatarFallback>
                    {job.customer_name?.charAt(0) || 'C'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="font-medium">{job.customer_name || 'Customer'}</h4>
                  <div className="flex items-center mt-1">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    <span className="text-sm">4.8 rating • 12 jobs posted</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Safety Features */}
          <Card>
            <CardHeader>
              <CardTitle>Safety & Verification</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 text-sm">
                <Badge variant="outline" className="text-green-600">
                  ✓ Verified Customer
                </Badge>
                <Badge variant="outline" className="text-blue-600">
                  ✓ Photo ID Required
                </Badge>
                <Badge variant="outline" className="text-purple-600">
                  ✓ Live Support Available
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <Button
              onClick={() => onAccept(job.id)}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              <Package className="h-4 w-4 mr-2" />
              Accept Job
            </Button>
            <Button variant="outline" className="flex-1">
              Save for Later
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
