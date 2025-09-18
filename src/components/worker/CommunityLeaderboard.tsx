
import React, { useState, useEffect } from 'react';
import { Trophy, Star, DollarSign, Users, Medal, Crown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';

export const CommunityLeaderboard = ({ worker }) => {
  const [leaderboards, setLeaderboards] = useState({
    topEarners: [],
    topRated: [],
    mostJobs: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboards();
  }, []);

  const fetchLeaderboards = async () => {
    try {
      // Fetch top earners
      const { data: topEarners } = await supabase
        .from('workers')
        .select('id, full_name, photo_url, total_earnings, total_jobs, rating')
        .order('total_earnings', { ascending: false })
        .limit(10);

      // Fetch top rated workers
      const { data: topRated } = await supabase
        .from('workers')
        .select('id, full_name, photo_url, total_earnings, total_jobs, rating')
        .gte('total_jobs', 5) // At least 5 jobs to be on rating leaderboard
        .order('rating', { ascending: false })
        .limit(10);

      // Fetch workers with most jobs
      const { data: mostJobs } = await supabase
        .from('workers')
        .select('id, full_name, photo_url, total_earnings, total_jobs, rating')
        .order('total_jobs', { ascending: false })
        .limit(10);

      setLeaderboards({
        topEarners: topEarners || [],
        topRated: topRated || [],
        mostJobs: mostJobs || []
      });
    } catch (error) {
      console.error('Error fetching leaderboards:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2: return <Medal className="h-5 w-5 text-gray-400" />;
      case 3: return <Medal className="h-5 w-5 text-orange-500" />;
      default: return <span className="text-gray-500 font-bold">#{rank}</span>;
    }
  };

  const findWorkerRank = (list: any[], workerId: string) => {
    const index = list.findIndex(w => w.id === workerId);
    return index !== -1 ? index + 1 : null;
  };

  const LeaderboardCard = ({ title, data, metric, icon: Icon, formatter = (val) => val }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Icon className="h-5 w-5 mr-2" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.slice(0, 5).map((workerData, index) => {
            const isCurrentWorker = workerData.id === worker.id;
            return (
              <div
                key={workerData.id}
                className={`flex items-center space-x-3 p-2 rounded ${
                  isCurrentWorker ? 'bg-blue-50 border-2 border-blue-200' : ''
                }`}
              >
                <div className="flex-shrink-0 w-8">
                  {getRankIcon(index + 1)}
                </div>
                
                <Avatar className="h-8 w-8">
                  <AvatarImage src={workerData.photo_url} />
                  <AvatarFallback>
                    {workerData.full_name?.charAt(0) || 'W'}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <p className={`font-medium ${isCurrentWorker ? 'text-blue-700' : ''}`}>
                    {isCurrentWorker ? 'You' : workerData.full_name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {workerData.total_jobs || 0} jobs • {workerData.rating || 0}★
                  </p>
                </div>
                
                <Badge variant={isCurrentWorker ? "default" : "secondary"}>
                  {formatter(workerData[metric] || 0)}
                </Badge>
              </div>
            );
          })}
        </div>
        
        {/* Show current worker's rank if not in top 5 */}
        {data.length > 5 && (
          <div className="mt-4 pt-4 border-t">
            <div className="text-center text-sm text-gray-600">
              Your rank: #{findWorkerRank(data, worker.id) || 'Unranked'}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return <div className="text-center py-8">Loading leaderboards...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Community Leaderboards
          </CardTitle>
          <CardDescription>
            See how you rank among other movers in the community
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Mover of the Week Spotlight */}
      <Card className="border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center text-yellow-700">
            <Crown className="h-6 w-6 mr-2" />
            Mover of the Week
          </CardTitle>
        </CardHeader>
        <CardContent>
          {leaderboards.topRated[0] && (
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16 border-4 border-yellow-300">
                <AvatarImage src={leaderboards.topRated[0].photo_url} />
                <AvatarFallback className="bg-yellow-100 text-yellow-700 text-xl font-bold">
                  {leaderboards.topRated[0].full_name?.charAt(0) || 'W'}
                </AvatarFallback>
              </Avatar>
              
              <div>
                <h3 className="text-xl font-bold text-yellow-700">
                  {leaderboards.topRated[0].full_name}
                </h3>
                <p className="text-yellow-600">
                  {leaderboards.topRated[0].rating}★ rating • {leaderboards.topRated[0].total_jobs} jobs completed
                </p>
                <Badge className="bg-yellow-100 text-yellow-800 mt-2">
                  Outstanding Performance
                </Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Leaderboards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <LeaderboardCard
          title="Top Earners"
          data={leaderboards.topEarners}
          metric="total_earnings"
          icon={DollarSign}
          formatter={(val) => `₦${val.toLocaleString()}`}
        />
        
        <LeaderboardCard
          title="Top Rated"
          data={leaderboards.topRated}
          metric="rating"
          icon={Star}
          formatter={(val) => `${val}★`}
        />
        
        <LeaderboardCard
          title="Most Jobs"
          data={leaderboards.mostJobs}
          metric="total_jobs"
          icon={Trophy}
          formatter={(val) => `${val} jobs`}
        />
      </div>
    </div>
  );
};
