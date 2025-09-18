import React, { useState, useEffect } from 'react';
import { MapPin, Clock, DollarSign, Package, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  destination: string;
  job_size: 'light' | 'medium' | 'heavy';
  price: number;
  scheduled_date: string;
  scheduled_time: string;
  created_at: string;
}

export const JobBoard = ({ worker, onJobSelect }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchAvailableJobs();
  }, []);

  const fetchAvailableJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching jobs:', error);
        toast({
          title: "Error",
          description: "Failed to load available jobs",
          variant: "destructive",
        });
      } else {
        setJobs(data || []);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setLoading(false);
    }
  };

  const acceptJob = async (jobId: string) => {
    try {
      const { error } = await supabase
        .from('jobs')
        .update({ 
          worker_id: worker.id, 
          status: 'assigned' 
        })
        .eq('id', jobId);

      if (error) {
        console.error('Error accepting job:', error);
        toast({
          title: "Error",
          description: "Failed to accept job",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success!",
          description: "Job accepted successfully",
        });
        fetchAvailableJobs(); // Refresh the list
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };

  const viewJobDetails = (job) => {
    onJobSelect(job);
  };

  const filteredJobs = jobs.filter(job => {
    if (filter === 'all') return true;
    return job.job_size === filter;
  });

  const getSizeColor = (size: string) => {
    switch (size) {
      case 'light': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'heavy': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading available jobs...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Available Jobs</h1>
          <p className="text-gray-600">{filteredJobs.length} jobs available</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Jobs</SelectItem>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="heavy">Heavy</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Job List */}
      <div className="grid gap-4">
        {filteredJobs.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No jobs available at the moment</p>
              <p className="text-sm text-gray-500 mt-2">Check back later for new opportunities</p>
            </CardContent>
          </Card>
        ) : (
          filteredJobs.map((job) => (
            <Card key={job.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{job.title}</CardTitle>
                    <CardDescription className="mt-1">{job.description}</CardDescription>
                  </div>
                  <Badge className={getSizeColor(job.job_size)}>
                    {job.job_size}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{job.location}</span>
                  </div>
                  {job.destination && (
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>→ {job.destination}</span>
                    </div>
                  )}
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{job.scheduled_date} at {job.scheduled_time}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-lg font-semibold text-green-600">
                    <DollarSign className="h-5 w-5 mr-1" />
                    <span>₦{job.price.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline"
                      onClick={() => viewJobDetails(job)}
                    >
                      View Details
                    </Button>
                    <Button 
                      onClick={() => acceptJob(job.id)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Accept Job
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
