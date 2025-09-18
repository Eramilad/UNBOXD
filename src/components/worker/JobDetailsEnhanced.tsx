
import React from 'react';
import { MapPin, Clock, DollarSign, User, Star } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface JobDetailsEnhancedProps {
  job: {
    id: string;
    title: string;
    customer_name?: string;
    location: string;
    destination?: string;
    price: number;
    scheduled_date: string;
    scheduled_time: string;
    job_size: 'light' | 'medium' | 'heavy';
    lat?: number;
    lng?: number;
    customer_rating?: number;
  };
}

export const JobDetailsEnhanced = ({ job }: JobDetailsEnhancedProps) => {
  const getSizeColor = (size: string) => {
    switch (size) {
      case 'light': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'heavy': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">{job.title}</CardTitle>
            <Badge className={getSizeColor(job.job_size)}>
              {job.job_size}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Customer Info */}
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-gray-500" />
            <span className="font-medium">{job.customer_name || 'Customer'}</span>
            {job.customer_rating && (
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
                <span className="text-sm">{job.customer_rating}</span>
              </div>
            )}
          </div>

          {/* Location */}
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-blue-500" />
            <span>{job.location}</span>
          </div>

          {/* Destination */}
          {job.destination && (
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-red-500" />
              <span>→ {job.destination}</span>
            </div>
          )}

          {/* Schedule */}
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <span>{job.scheduled_date} at {job.scheduled_time}</span>
          </div>

          {/* Price */}
          <div className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4 text-green-500" />
            <span className="font-semibold text-lg">₦{job.price.toLocaleString()}</span>
          </div>

          {/* Map */}
          {job.lat && job.lng && (
            <div className="w-full h-48 rounded-lg overflow-hidden">
              <iframe
                src={`https://maps.google.com/maps?q=${job.lat},${job.lng}&z=15&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
