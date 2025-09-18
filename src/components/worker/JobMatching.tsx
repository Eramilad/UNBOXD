import React, { useState, useEffect } from 'react';
import { Target, MapPin, Clock, DollarSign, Star, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface MatchedJob {
  id: string;
  title: string;
  description: string;
  location: string;
  destination: string;
  job_size: 'light' | 'medium' | 'heavy';
  price: number;
  scheduled_date: string;
  scheduled_time: string;
  match_score: number;
  distance: number;
}

export const JobMatching = ({ worker, onJobSelect }) => {
  const [matchedJobs, setMatchedJobs] = useState<MatchedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchMatchedJobs();
  }, [worker.id]);

  const fetchMatchedJobs = async () => {
    try {
      // Fetch jobs and calculate match scores
      const { data: jobs, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching jobs:', error);
        return;
      }

      // Simple matching algorithm based on location, skills, and availability
      const matched = jobs?.map(job => ({
        ...job,
        match_score: calculateMatchScore(job, worker),
        distance: calculateDistance(job.location, worker.location)
      }))
      .filter(job => job.match_score > 60)
      .sort((a, b) => b.match_score - a.match_score)
      .slice(0, 5) || [];

      setMatchedJobs(matched);
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateMatchScore = (job: any, worker: any) => {
    let score = 70; // Base score

    // Factor in worker rating
    if (worker.rating >= 4.5) score += 20;
    else if (worker.rating >= 4.0) score += 10;

    // Factor in job size preference
    if (worker.skills?.includes('heavy lifting') && job.job_size === 'heavy') score += 15;
    if (worker.skills?.includes('packing') && job.title.toLowerCase().includes('pack')) score += 10;

    // Factor in location (simplified)
    if (job.location.toLowerCase().includes(worker.location?.toLowerCase() || '')) score += 15;

    return Math.min(score, 100);
  };

  const calculateDistance = (jobLocation: string, workerLocation: string) => {
    // Simplified distance calculation - in real app would use Google Maps API
    return Math.floor(Math.random() * 20) + 1;
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
        fetchMatchedJobs();
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };

  const getMatchColor = (score: number) => {
    if (score >= 90) return 'bg-green-100 text-green-800';
    if (score >= 80) return 'bg-blue-100 text-blue-800';
    if (score >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return <div className="text-center py-8">Finding your best job matches...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Target className="h-6 w-6 text-blue-500" />
        <h2 className="text-xl font-semibold">Recommended Jobs</h2>
        <Badge variant="secondary">{matchedJobs.length} matches</Badge>
      </div>

      <div className="grid gap-4">
        {matchedJobs.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No job matches at the moment</p>
              <p className="text-sm text-gray-500 mt-2">Update your profile to get better matches</p>
            </CardContent>
          </Card>
        ) : (
          matchedJobs.map((job) => (
            <Card key={job.id} className="hover:shadow-md transition-shadow border-l-4 border-l-blue-500">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <span>{job.title}</span>
                      <Badge className={getMatchColor(job.match_score)}>
                        {job.match_score}% match
                      </Badge>
                    </CardTitle>
                    <CardDescription className="mt-1">{job.description}</CardDescription>
                  </div>
                  <Zap className="h-5 w-5 text-yellow-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{job.scheduled_date}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <DollarSign className="h-4 w-4 mr-2" />
                    <span>₦{job.price.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{job.distance}km away</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <Badge variant="outline">{job.job_size}</Badge>
                    <Badge variant="outline">Quick Response Bonus</Badge>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline"
                      onClick={() => onJobSelect(job)}
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
