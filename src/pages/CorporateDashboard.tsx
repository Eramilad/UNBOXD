import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Building2, 
  Users, 
  TrendingUp, 
  Calendar, 
  FileText, 
  Settings,
  Plus,
  Download,
  Eye,
  CheckCircle,
  Clock,
  AlertTriangle
} from "lucide-react";

const CorporateDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const stats = [
    { label: "Active Moves", value: "24", change: "+12%", icon: Users },
    { label: "This Month Cost", value: "₦480,000", change: "-8%", icon: TrendingUp },
    { label: "Scheduled Moves", value: "15", change: "+5%", icon: Calendar },
    { label: "Completed Moves", value: "156", change: "+23%", icon: CheckCircle }
  ];

  const recentMoves = [
    { 
      id: "MV001", 
      employee: "John Doe", 
      from: "Lagos Office", 
      to: "Abuja Branch", 
      status: "In Progress", 
      date: "2024-01-15",
      cost: "₦25,000"
    },
    { 
      id: "MV002", 
      employee: "Sarah Wilson", 
      from: "Staff Quarters A", 
      to: "New Complex B", 
      status: "Scheduled", 
      date: "2024-01-18",
      cost: "₦18,000"
    },
    { 
      id: "MV003", 
      employee: "Mike Johnson", 
      from: "Temporary Lodge", 
      to: "Permanent Residence", 
      status: "Completed", 
      date: "2024-01-12",
      cost: "₦32,000"
    }
  ];

  const upcomingScheduled = [
    { date: "Jan 18", count: 3, type: "Staff Relocation" },
    { date: "Jan 22", count: 7, type: "Estate Move-out" },
    { date: "Jan 25", count: 2, type: "Office Equipment" },
    { date: "Feb 01", count: 5, type: "New Hire Moves" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "bg-green-100 text-green-800";
      case "In Progress": return "bg-blue-100 text-blue-800";
      case "Scheduled": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Corporate Dashboard</h1>
              <p className="text-muted-foreground">Manage your company's moving operations</p>
            </div>
            <div className="flex space-x-4">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Bulk Request
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-green-600">{stat.change}</p>
                  </div>
                  <stat.icon className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="moves">Move Management</TabsTrigger>
            <TabsTrigger value="billing">Billing & Reports</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Recent Moves */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Recent Moves</CardTitle>
                  <CardDescription>Latest employee relocations and their status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentMoves.map((move, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{move.employee}</p>
                          <p className="text-sm text-muted-foreground">{move.from} → {move.to}</p>
                          <p className="text-sm text-muted-foreground">{move.date}</p>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(move.status)}>{move.status}</Badge>
                          <p className="text-sm font-medium mt-1">{move.cost}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Schedule */}
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Schedule</CardTitle>
                  <CardDescription>Scheduled moves this month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingScheduled.map((schedule, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{schedule.date}</p>
                          <p className="text-sm text-muted-foreground">{schedule.type}</p>
                        </div>
                        <Badge variant="outline">{schedule.count} moves</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="moves" className="space-y-6 mt-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Move Management</h3>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Schedule New Move
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>All Moves</CardTitle>
                <CardDescription>Comprehensive view of all corporate moves</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentMoves.map((move, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        <div>
                          <p className="font-medium">Move #{move.id}</p>
                          <p className="text-sm text-muted-foreground">{move.employee}</p>
                          <p className="text-sm text-muted-foreground">{move.from} → {move.to}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge className={getStatusColor(move.status)}>{move.status}</Badge>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing" className="space-y-6 mt-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Spending</CardTitle>
                  <CardDescription>Current month vs last month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Current Month</span>
                        <span>₦480,000</span>
                      </div>
                      <Progress value={75} className="mt-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Budget Used</span>
                        <span>75%</span>
                      </div>
                      <Progress value={75} className="mt-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cost Breakdown</CardTitle>
                  <CardDescription>Expense categories this month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Staff Relocations</span>
                      <span>₦320,000 (67%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Office Equipment</span>
                      <span>₦96,000 (20%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Emergency Moves</span>
                      <span>₦64,000 (13%)</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Company Settings</CardTitle>
                <CardDescription>Manage your corporate account preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-2">Notification Preferences</h4>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked />
                        <span>Email notifications for move confirmations</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked />
                        <span>SMS updates for urgent moves</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Approval Settings</h4>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" />
                        <span>Require approval for moves over ₦50,000</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked />
                        <span>Auto-approve scheduled bulk moves</span>
                      </label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CorporateDashboard;