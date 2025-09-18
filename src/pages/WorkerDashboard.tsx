import React, { useState, useEffect } from 'react';
import { Package, Calendar, DollarSign, Star, Bell, User, MapPin, Shield, Award, Users, Target, BookOpen, Settings, Zap, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { JobBoard } from '@/components/worker/JobBoard';
import { WorkerProfile } from '@/components/worker/WorkerProfile';
import { EarningsDashboard } from '@/components/worker/EarningsDashboard';
import { NotificationCenter } from '@/components/worker/NotificationCenter';
import { JobMatching } from '@/components/worker/JobMatching';
import { TrainingModules } from '@/components/worker/TrainingModules';
import { BadgeSystem } from '@/components/worker/BadgeSystem';
import { AvailabilityCalendar } from '@/components/worker/AvailabilityCalendar';
import { SafetyTools } from '@/components/worker/SafetyTools';
import { CommunityLeaderboard } from '@/components/worker/CommunityLeaderboard';
import { JobDetailsModal } from '@/components/worker/JobDetailsModal';
import { NotificationSystem } from '@/components/worker/NotificationSystem';
import { InstantPayout } from '@/components/worker/InstantPayout';
import { LanguageSupport, LanguageProvider, useLanguage } from '@/components/worker/LanguageSupport';
import { SOSButton } from '@/components/worker/SOSButton';

const WorkerDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showJobModal, setShowJobModal] = useState(false);

  useEffect(() => {
    checkWorkerProfile();
  }, []);

  const checkWorkerProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/login');
        return;
      }

      const { data: workerData, error } = await supabase
        .from('workers')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching worker profile:', error);
        toast({
          title: "Error",
          description: "Failed to load worker profile",
          variant: "destructive",
        });
      }

      setWorker(workerData);
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJobSelect = (job) => {
    setSelectedJob(job);
    setShowJobModal(true);
  };

  const handleJobAccept = async (jobId: string) => {
    try {
      const { error } = await supabase
        .from('jobs')
        .update({ 
          worker_id: worker.id, 
          status: 'assigned' 
        })
        .eq('id', jobId);

      if (error) {
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
        setShowJobModal(false);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="h-12 w-12 text-blue-500 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!worker) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Package className="h-12 w-12 text-blue-500 mx-auto mb-4" />
            <CardTitle>Welcome to Unboxd!</CardTitle>
            <CardDescription>
              Complete your worker profile to start accepting jobs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => setActiveTab('profile')} 
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Create Worker Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const tabContent = {
    dashboard: (
      <div className="space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ₦{(worker.total_earnings || 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Star className="h-8 w-8 text-yellow-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Rating</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {worker.rating || '0.0'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Package className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Jobs Completed</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {worker.total_jobs || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Award className="h-8 w-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Status</p>
                  <Badge className={`${
                    worker.status === 'available' ? 'bg-green-100 text-green-800' : 
                    worker.status === 'busy' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {worker.status || 'available'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Job Matching */}
        <JobMatching worker={worker} onJobSelect={handleJobSelect} />
      </div>
    ),
    jobs: <JobBoard worker={worker} onJobSelect={handleJobSelect} />,
    profile: <WorkerProfile worker={worker} onUpdate={setWorker} />,
    earnings: <EarningsDashboard worker={worker} />,
    payout: <InstantPayout worker={worker} />,
    training: <TrainingModules worker={worker} />,
    badges: <BadgeSystem worker={worker} />,
    availability: <AvailabilityCalendar worker={worker} onUpdate={setWorker} />,
    safety: <SafetyTools worker={worker} />,
    community: <CommunityLeaderboard worker={worker} />,
    notifications: <NotificationSystem worker={worker} />,
    language: <LanguageSupport />
  };

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <Package className="h-8 w-8 text-blue-500 mr-2" />
                <span className="text-xl font-bold text-gray-900">unboxd</span>
                <Badge variant="secondary" className="ml-2">Worker</Badge>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                  <span>{worker.rating || '0.0'}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{worker.location || 'Set location'}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/')}
                >
                  Exit
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-8 overflow-x-auto">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: Target },
                { id: 'jobs', label: 'Jobs', icon: Calendar },
                { id: 'profile', label: 'Profile', icon: User },
                { id: 'earnings', label: 'Earnings', icon: DollarSign },
                { id: 'payout', label: 'Instant Payout', icon: Zap },
                { id: 'training', label: 'Training', icon: BookOpen },
                { id: 'badges', label: 'Badges', icon: Award },
                { id: 'availability', label: 'Schedule', icon: Settings },
                { id: 'safety', label: 'Safety', icon: Shield },
                { id: 'community', label: 'Community', icon: Users },
                { id: 'notifications', label: 'Notifications', icon: Bell },
                { id: 'language', label: 'Language', icon: Globe }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {tabContent[activeTab]}
        </div>

        {/* Job Details Modal */}
        <JobDetailsModal
          job={selectedJob}
          isOpen={showJobModal}
          onClose={() => setShowJobModal(false)}
          onAccept={handleJobAccept}
        />

        {/* Global SOS Button */}
        <SOSButton workerId={worker.id} />
      </div>
    </LanguageProvider>
  );
};

export default WorkerDashboard;
