
import React, { useState, useEffect } from 'react';
import { Award, Star, Trophy, Zap, Heart } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';

export const BadgeSystem = ({ worker }) => {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBadges();
  }, [worker.id]);

  const fetchBadges = async () => {
    try {
      const { data, error } = await supabase
        .from('worker_badges')
        .select('*')
        .eq('worker_id', worker.id)
        .order('earned_at', { ascending: false });

      if (error) {
        console.error('Error fetching badges:', error);
      } else {
        setBadges(data || []);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setLoading(false);
    }
  };

  const badgeDefinitions = {
    '5_star_pro': {
      name: '5-Star Pro',
      description: 'Maintain a 5-star rating for 10+ jobs',
      icon: Star,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-100',
      requirement: 'Complete 10 jobs with 5-star ratings'
    },
    'mover_of_month': {
      name: 'Mover of the Month',
      description: 'Top performer of the month',
      icon: Trophy,
      color: 'text-gold-500',
      bgColor: 'bg-yellow-100',
      requirement: 'Be the top-rated mover for a month'
    },
    'certified_packing': {
      name: 'Certified Packing Expert',
      description: 'Complete packing training and 5 packing jobs',
      icon: Award,
      color: 'text-blue-500',
      bgColor: 'bg-blue-100',
      requirement: 'Complete packing training module'
    },
    'speed_demon': {
      name: 'Speed Demon',
      description: 'Complete 20 jobs faster than estimated time',
      icon: Zap,
      color: 'text-purple-500',
      bgColor: 'bg-purple-100',
      requirement: 'Complete 20 jobs ahead of schedule'
    },
    'customer_favorite': {
      name: 'Customer Favorite',
      description: 'Receive 50+ positive reviews',
      icon: Heart,
      color: 'text-red-500',
      bgColor: 'bg-red-100',
      requirement: 'Receive 50 positive customer reviews'
    }
  };

  const earnedBadges = badges.map(b => b.badge_type);
  const allBadgeTypes = Object.keys(badgeDefinitions);
  const unearnedBadges = allBadgeTypes.filter(type => !earnedBadges.includes(type));

  const getBadgeProgress = (badgeType: string) => {
    // Simplified progress calculation - in real app would be based on actual metrics
    switch (badgeType) {
      case '5_star_pro':
        return Math.min((worker.total_jobs || 0) * 10, 100);
      case 'mover_of_month':
        return worker.rating >= 4.8 ? 80 : 40;
      case 'certified_packing':
        return worker.skills?.includes('packing') ? 100 : 0;
      case 'speed_demon':
        return Math.min((worker.total_jobs || 0) * 5, 100);
      case 'customer_favorite':
        return Math.min((worker.total_jobs || 0) * 2, 100);
      default:
        return 0;
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading badges...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Badge Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Award className="h-5 w-5 mr-2" />
            Your Achievements
          </CardTitle>
          <CardDescription>
            Earn badges by completing jobs and training modules
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{badges.length}</div>
              <div className="text-sm text-gray-600">Badges Earned</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">{worker.total_jobs || 0}</div>
              <div className="text-sm text-gray-600">Jobs Completed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{worker.rating || 0}</div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {Math.round((badges.length / allBadgeTypes.length) * 100)}%
              </div>
              <div className="text-sm text-gray-600">Completion</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Earned Badges */}
      {badges.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Earned Badges</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {badges.map((badge) => {
                const definition = badgeDefinitions[badge.badge_type];
                const Icon = definition.icon;
                
                return (
                  <div key={badge.id} className={`p-4 rounded-lg border ${definition.bgColor}`}>
                    <div className="flex items-center space-x-3">
                      <Icon className={`h-8 w-8 ${definition.color}`} />
                      <div>
                        <h4 className="font-semibold">{definition.name}</h4>
                        <p className="text-sm text-gray-600">{definition.description}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Earned on {new Date(badge.earned_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available Badges */}
      <Card>
        <CardHeader>
          <CardTitle>Available Badges</CardTitle>
          <CardDescription>
            Work towards these achievements to unlock badges
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {unearnedBadges.map((badgeType) => {
              const definition = badgeDefinitions[badgeType];
              const Icon = definition.icon;
              const progress = getBadgeProgress(badgeType);
              
              return (
                <div key={badgeType} className="p-4 border rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Icon className={`h-6 w-6 ${definition.color} opacity-60`} />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-700">{definition.name}</h4>
                      <p className="text-sm text-gray-600 mb-2">{definition.description}</p>
                      <p className="text-xs text-gray-500 mb-2">{definition.requirement}</p>
                      
                      <div className="flex items-center space-x-2">
                        <Progress value={progress} className="flex-1" />
                        <span className="text-sm text-gray-600">{progress}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
