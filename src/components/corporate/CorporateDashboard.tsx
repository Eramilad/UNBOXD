import React, { useState, useEffect } from 'react';
import { User, Calendar, Package, TrendingUp, Bell, Settings, Plus, Search, Filter, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/components/auth/AuthContext';

interface DashboardData {
  user: {
    name: string;
    email: string;
    avatar?: string;
    role: string;
  };
  stats: {
    totalBookings: number;
    activeBookings: number;
    completedBookings: number;
    totalSpent: number;
  };
  recentBookings: Array<{
    id: string;
    customer: string;
    date: string;
    status: 'pending' | 'in_progress' | 'completed';
    cost: number;
  }>;
  templates: Array<{
    id: string;
    name: string;
    lastUsed: string;
    bookingCount: number;
  }>;
  credits: {
    available: number;
    used: number;
    total: number;
  };
  suggestedActions: Array<{
    id: string;
    title: string;
    description: string;
    action: string;
    priority: 'high' | 'medium' | 'low';
  }>;
}

const CorporateDashboard: React.FC = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch dashboard data
    const fetchDashboardData = async () => {
      setIsLoading(true);
      
      try {
        // In a real app, this would be: fetch(`/api/user/${user?.id}/dashboard`)
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockData: DashboardData = {
          user: {
            name: user?.email?.split('@')[0] || 'Corporate User',
            email: user?.email || 'user@company.com',
            role: 'Corporate Manager'
          },
          stats: {
            totalBookings: 47,
            activeBookings: 8,
            completedBookings: 39,
            totalSpent: 125400
          },
          recentBookings: [
            {
              id: 'BK-001',
              customer: 'John Smith',
              date: '2024-02-15',
              status: 'in_progress',
              cost: 450
            },
            {
              id: 'BK-002',
              customer: 'Sarah Johnson',
              date: '2024-02-14',
              status: 'completed',
              cost: 300
            },
            {
              id: 'BK-003',
              customer: 'Mike Wilson',
              date: '2024-02-13',
              status: 'pending',
              cost: 600
            }
          ],
          templates: [
            {
              id: 'T-001',
              name: 'Q1 2024 Corporate Moves',
              lastUsed: '2024-02-10',
              bookingCount: 15
            },
            {
              id: 'T-002',
              name: 'Employee Relocations',
              lastUsed: '2024-01-28',
              bookingCount: 8
            }
          ],
          credits: {
            available: 2500,
            used: 7500,
            total: 10000
          },
          suggestedActions: [
            {
              id: 'SA-001',
              title: 'Create Q2 2024 Template',
              description: 'Based on your Q1 patterns, create a template for Q2 moves',
              action: 'Create Template',
              priority: 'high'
            },
            {
              id: 'SA-002',
              title: 'Review Pending Bookings',
              description: 'You have 3 bookings pending approval',
              action: 'Review Now',
              priority: 'medium'
            }
          ]
        };
        
        setDashboardData(mockData);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Failed to load dashboard</h2>
          <p className="text-gray-600">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold">Corporate Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
              <Avatar>
                <AvatarImage src={dashboardData.user.avatar} />
                <AvatarFallback>
                  {dashboardData.user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {dashboardData.user.name}
          </h2>
          <p className="text-gray-600">
            Here's what's happening with your corporate moves
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                  <p className="text-2xl font-bold">{dashboardData.stats.totalBookings}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Bookings</p>
                  <p className="text-2xl font-bold">{dashboardData.stats.activeBookings}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold">{dashboardData.stats.completedBookings}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Spent</p>
                  <p className="text-2xl font-bold">${dashboardData.stats.totalSpent.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Bookings */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recent Bookings</CardTitle>
                    <CardDescription>Your latest corporate moves</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.recentBookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium">{booking.customer}</p>
                          <p className="text-sm text-gray-600">{booking.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status.replace('_', ' ')}
                        </Badge>
                        <span className="font-medium">${booking.cost}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Credits */}
            <Card>
              <CardHeader>
                <CardTitle>Available Credits</CardTitle>
                <CardDescription>Your corporate account balance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      ${dashboardData.credits.available.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Available</div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(dashboardData.credits.used / dashboardData.credits.total) * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-sm text-gray-600 text-center">
                    ${dashboardData.credits.used.toLocaleString()} of ${dashboardData.credits.total.toLocaleString()} used
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Saved Templates */}
            <Card>
              <CardHeader>
                <CardTitle>Saved Templates</CardTitle>
                <CardDescription>Quick access to your configurations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dashboardData.templates.map((template) => (
                    <div key={template.id} className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <div className="font-medium">{template.name}</div>
                      <div className="text-sm text-gray-600">
                        {template.bookingCount} bookings • Last used {template.lastUsed}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Suggested Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Suggested Actions</CardTitle>
                <CardDescription>Based on your activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dashboardData.suggestedActions.map((action) => (
                    <div key={action.id} className="p-3 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-medium">{action.title}</div>
                          <div className="text-sm text-gray-600">{action.description}</div>
                        </div>
                        <Badge className={getPriorityColor(action.priority)}>
                          {action.priority}
                        </Badge>
                      </div>
                      <Button variant="outline" size="sm" className="w-full mt-2">
                        {action.action}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CorporateDashboard;
