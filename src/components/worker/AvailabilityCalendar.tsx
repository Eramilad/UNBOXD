import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Pause, Play, Settings } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';

type WorkerStatus = Database['public']['Enums']['worker_status'];

export const AvailabilityCalendar = ({ worker, onUpdate }) => {
  const [availability, setAvailability] = useState({
    monday: { available: true, start: '09:00', end: '17:00' },
    tuesday: { available: true, start: '09:00', end: '17:00' },
    wednesday: { available: true, start: '09:00', end: '17:00' },
    thursday: { available: true, start: '09:00', end: '17:00' },
    friday: { available: true, start: '09:00', end: '17:00' },
    saturday: { available: true, start: '09:00', end: '17:00' },
    sunday: { available: false, start: '09:00', end: '17:00' }
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (worker.availability_schedule) {
      setAvailability(worker.availability_schedule);
    }
  }, [worker]);

  const updateAvailability = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('workers')
        .update({ 
          availability_schedule: availability,
          updated_at: new Date().toISOString()
        })
        .eq('id', worker.id);

      if (error) {
        console.error('Error updating availability:', error);
        toast({
          title: "Error",
          description: "Failed to update availability",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success!",
          description: "Availability updated successfully",
        });
        onUpdate({ ...worker, availability_schedule: availability });
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus: WorkerStatus) => {
    try {
      const { error } = await supabase
        .from('workers')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', worker.id);

      if (error) {
        console.error('Error updating status:', error);
        toast({
          title: "Error",
          description: "Failed to update status",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Status Updated",
          description: `You are now ${newStatus}`,
        });
        onUpdate({ ...worker, status: newStatus });
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };

  const days = [
    'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'busy': return 'bg-red-100 text-red-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'offline': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Status Control */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Work Status
          </CardTitle>
          <CardDescription>
            Control your availability for job matching
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-medium">Current Status</h4>
              <Badge className={getStatusColor(worker.status)}>
                {worker.status || 'available'}
              </Badge>
            </div>
            
            <div className="flex space-x-2">
              {worker.status === 'available' ? (
                <Button
                  onClick={() => updateStatus('paused' as WorkerStatus)}
                  variant="outline"
                  size="sm"
                >
                  <Pause className="h-4 w-4 mr-1" />
                  Pause
                </Button>
              ) : (
                <Button
                  onClick={() => updateStatus('available' as WorkerStatus)}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Play className="h-4 w-4 mr-1" />
                  Go Available
                </Button>
              )}
            </div>
          </div>
          
          <p className="text-sm text-gray-600">
            {worker.status === 'available' 
              ? "You're currently visible to customers and can receive job offers"
              : "You're currently paused and won't receive new job offers"
            }
          </p>
        </CardContent>
      </Card>

      {/* Weekly Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Weekly Schedule
          </CardTitle>
          <CardDescription>
            Set your preferred working hours for each day
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {days.map((day) => (
              <div key={day} className="flex items-center space-x-4 p-3 border rounded-lg">
                <div className="w-20">
                  <Label className="capitalize font-medium">{day}</Label>
                </div>
                
                <Switch
                  checked={availability[day].available}
                  onCheckedChange={(checked) => 
                    setAvailability(prev => ({
                      ...prev,
                      [day]: { ...prev[day], available: checked }
                    }))
                  }
                />
                
                {availability[day].available && (
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <input
                      type="time"
                      value={availability[day].start}
                      onChange={(e) => 
                        setAvailability(prev => ({
                          ...prev,
                          [day]: { ...prev[day], start: e.target.value }
                        }))
                      }
                      className="border rounded px-2 py-1 text-sm"
                    />
                    <span className="text-gray-500">to</span>
                    <input
                      type="time"
                      value={availability[day].end}
                      onChange={(e) => 
                        setAvailability(prev => ({
                          ...prev,
                          [day]: { ...prev[day], end: e.target.value }
                        }))
                      }
                      className="border rounded px-2 py-1 text-sm"
                    />
                  </div>
                )}
                
                {!availability[day].available && (
                  <span className="text-gray-500 text-sm">Not available</span>
                )}
              </div>
            ))}
          </div>
          
          <Button 
            onClick={updateAvailability}
            disabled={loading}
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
          >
            {loading ? 'Updating...' : 'Save Schedule'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
