
import React, { useState, useEffect } from 'react';
import { BookOpen, Play, CheckCircle, Award, Clock, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const TrainingModules = ({ worker }) => {
  const [modules, setModules] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchTrainingData();
  }, [worker.id]);

  const fetchTrainingData = async () => {
    try {
      // Fetch training modules
      const { data: modulesData, error: modulesError } = await supabase
        .from('training_modules')
        .select('*')
        .order('created_at', { ascending: true });

      if (modulesError) {
        console.error('Error fetching modules:', modulesError);
        return;
      }

      // Fetch worker's progress
      const { data: progressData, error: progressError } = await supabase
        .from('worker_training_progress')
        .select('*')
        .eq('worker_id', worker.id);

      if (progressError) {
        console.error('Error fetching progress:', progressError);
        return;
      }

      setModules(modulesData || []);
      setProgress(progressData || []);
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setLoading(false);
    }
  };

  const startModule = async (moduleId: string) => {
    try {
      const { error } = await supabase
        .from('worker_training_progress')
        .upsert({
          worker_id: worker.id,
          module_id: moduleId,
          progress_percentage: 0
        });

      if (error) {
        console.error('Error starting module:', error);
        toast({
          title: "Error",
          description: "Failed to start training module",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Training Started",
          description: "You can now access the training content",
        });
        fetchTrainingData();
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };

  const completeModule = async (moduleId: string) => {
    try {
      const { error } = await supabase
        .from('worker_training_progress')
        .upsert({
          worker_id: worker.id,
          module_id: moduleId,
          progress_percentage: 100,
          completed_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error completing module:', error);
        toast({
          title: "Error",
          description: "Failed to complete training module",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Module Completed!",
          description: "Congratulations on completing the training",
        });
        fetchTrainingData();
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };

  const getModuleProgress = (moduleId: string) => {
    const moduleProgress = progress.find(p => p.module_id === moduleId);
    return moduleProgress?.progress_percentage || 0;
  };

  const isModuleCompleted = (moduleId: string) => {
    const moduleProgress = progress.find(p => p.module_id === moduleId);
    return moduleProgress?.completed_at !== null;
  };

  const getProgressColor = (percentage: number) => {
    if (percentage === 100) return 'bg-green-500';
    if (percentage >= 50) return 'bg-blue-500';
    return 'bg-yellow-500';
  };

  if (loading) {
    return <div className="text-center py-8">Loading training modules...</div>;
  }

  const completedCount = progress.filter(p => p.completed_at).length;
  const totalModules = modules.length;

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="h-5 w-5 mr-2" />
            Training Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{completedCount}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{totalModules - completedCount}</div>
              <div className="text-sm text-gray-600">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{Math.round((completedCount / totalModules) * 100)}%</div>
              <div className="text-sm text-gray-600">Overall Progress</div>
            </div>
          </div>
          <Progress 
            value={(completedCount / totalModules) * 100} 
            className="mt-4"
          />
        </CardContent>
      </Card>

      {/* Training Modules */}
      <div className="grid gap-4">
        {modules.map((module) => {
          const moduleProgress = getModuleProgress(module.id);
          const isCompleted = isModuleCompleted(module.id);
          const isStarted = moduleProgress > 0;

          return (
            <Card key={module.id} className={`${isCompleted ? 'border-green-200 bg-green-50' : ''}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center space-x-2">
                      <span>{module.title}</span>
                      {isCompleted && <CheckCircle className="h-5 w-5 text-green-500" />}
                    </CardTitle>
                    <CardDescription className="mt-1">{module.description}</CardDescription>
                    
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{module.duration_minutes} minutes</span>
                      </div>
                      {module.badge_reward && (
                        <div className="flex items-center">
                          <Award className="h-4 w-4 mr-1" />
                          <span>Earns {module.badge_reward.replace('_', ' ')} badge</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end space-y-2">
                    {isStarted && (
                      <div className="text-right">
                        <div className="text-sm font-medium">{moduleProgress}%</div>
                        <Progress 
                          value={moduleProgress} 
                          className="w-20"
                        />
                      </div>
                    )}
                    
                    {isCompleted ? (
                      <Badge className="bg-green-100 text-green-800">
                        Completed
                      </Badge>
                    ) : isStarted ? (
                      <Button
                        size="sm"
                        onClick={() => completeModule(module.id)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Play className="h-4 w-4 mr-1" />
                        Continue
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => startModule(module.id)}
                      >
                        Start Module
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              {module.content_url && isStarted && (
                <CardContent>
                  <div className="border rounded-lg p-4 bg-white">
                    <div className="flex items-center space-x-2 mb-2">
                      <FileText className="h-4 w-4" />
                      <span className="text-sm font-medium">Training Content</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Access your training materials and complete the module to earn your badge.
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(module.content_url, '_blank')}
                    >
                      Open Content
                    </Button>
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {modules.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No training modules available</p>
            <p className="text-sm text-gray-500 mt-2">Check back later for new training content</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
