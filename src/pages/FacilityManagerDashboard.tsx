import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Building2, 
  Users, 
  Calendar as CalendarIcon, 
  TrendingUp, 
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Filter
} from "lucide-react";

const FacilityManagerDashboard = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedBuilding, setSelectedBuilding] = useState("all");

  const buildings = [
    { id: "tower-a", name: "Tower A", units: 120, occupancy: 95 },
    { id: "tower-b", name: "Tower B", units: 150, occupancy: 88 },
    { id: "garden-view", name: "Garden View", units: 80, occupancy: 92 },
    { id: "executive", name: "Executive Suites", units: 40, occupancy: 100 }
  ];

  const todaysMoves = [
    {
      id: "MV001",
      tenant: "Sarah Johnson",
      unit: "A-405",
      type: "Move Out",
      time: "9:00 AM",
      status: "In Progress",
      contact: "+234 801 XXX XXXX"
    },
    {
      id: "MV002", 
      tenant: "Michael Chen",
      unit: "B-302",
      type: "Move In",
      time: "2:00 PM", 
      status: "Scheduled",
      contact: "+234 802 XXX XXXX"
    },
    {
      id: "MV003",
      tenant: "Estate Services",
      unit: "Common Area",
      type: "Furniture Delivery",
      time: "4:30 PM",
      status: "Scheduled", 
      contact: "Internal"
    }
  ];

  const upcomingMoves = [
    { date: "Jan 16", count: 5, moveOuts: 3, moveIns: 2 },
    { date: "Jan 17", count: 8, moveOuts: 4, moveIns: 4 },
    { date: "Jan 18", count: 3, moveOuts: 1, moveIns: 2 },
    { date: "Jan 19", count: 12, moveOuts: 8, moveIns: 4 },
    { date: "Jan 20", count: 6, moveOuts: 2, moveIns: 4 }
  ];

  const monthlyStats = [
    { label: "Total Moves", value: "156", change: "+12%", icon: Users },
    { label: "Occupancy Rate", value: "94%", change: "+2%", icon: Building2 },
    { label: "Avg Move Time", value: "3.2hrs", change: "-15min", icon: Clock },
    { label: "Satisfaction", value: "4.8/5", change: "+0.2", icon: TrendingUp }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "bg-green-100 text-green-800";
      case "In Progress": return "bg-blue-100 text-blue-800";
      case "Scheduled": return "bg-yellow-100 text-yellow-800";
      case "Delayed": return "bg-red-100 text-red-800";
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
              <h1 className="text-2xl font-bold">Facility Manager Dashboard</h1>
              <p className="text-muted-foreground">Grandview Estate - Central Management</p>
            </div>
            <div className="flex space-x-4">
              <Select value={selectedBuilding} onValueChange={setSelectedBuilding}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select building" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Buildings</SelectItem>
                  {buildings.map(building => (
                    <SelectItem key={building.id} value={building.id}>
                      {building.name} ({building.occupancy}% occupied)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Schedule Move
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {monthlyStats.map((stat, index) => (
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

        <Tabs defaultValue="today" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="today">Today's Schedule</TabsTrigger>
            <TabsTrigger value="calendar">Move Calendar</TabsTrigger>
            <TabsTrigger value="buildings">Building Overview</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Today's Moves */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Today's Scheduled Moves
                    <Badge variant="outline">{todaysMoves.length} moves</Badge>
                  </CardTitle>
                  <CardDescription>
                    {new Date().toDateString()} - All scheduled activities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {todaysMoves.map((move) => (
                      <div key={move.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-3 h-3 rounded-full bg-primary"></div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <p className="font-medium">{move.tenant}</p>
                              <Badge variant="outline" className="text-xs">
                                Unit {move.unit}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {move.type} • {move.time}
                            </p>
                            <p className="text-xs text-muted-foreground">{move.contact}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(move.status)}>
                            {move.status}
                          </Badge>
                          {move.status === "In Progress" && (
                            <div className="flex items-center mt-1 text-xs text-blue-600">
                              <MapPin className="h-3 w-3 mr-1" />
                              Track Live
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full justify-start">
                    <Plus className="h-4 w-4 mr-2" />
                    Schedule Emergency Move
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Bulk Schedule Weekend
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Report Issue
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    Tenant Notifications
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Upcoming Week Preview */}
            <Card>
              <CardHeader>
                <CardTitle>This Week's Schedule</CardTitle>
                <CardDescription>Move volume for the next 5 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-4">
                  {upcomingMoves.map((day, index) => (
                    <div key={index} className="text-center p-4 border rounded-lg">
                      <p className="font-medium text-sm">{day.date}</p>
                      <p className="text-2xl font-bold text-primary mt-2">{day.count}</p>
                      <div className="mt-2 space-y-1">
                        <p className="text-xs text-red-600">{day.moveOuts} out</p>
                        <p className="text-xs text-green-600">{day.moveIns} in</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calendar" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Move Calendar</CardTitle>
                  <CardDescription>Click on any date to view scheduled moves</CardDescription>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    className="rounded-md border w-full"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>
                    {selectedDate?.toDateString()} Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg">
                      <p className="font-medium text-sm">Morning Slot (8AM-12PM)</p>
                      <p className="text-xs text-muted-foreground">3 moves scheduled</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <p className="font-medium text-sm">Afternoon Slot (1PM-5PM)</p>
                      <p className="text-xs text-muted-foreground">2 moves scheduled</p>
                    </div>
                    <div className="p-3 border-dashed border-2 rounded-lg">
                      <p className="font-medium text-sm text-muted-foreground">Evening Slot (6PM-8PM)</p>
                      <p className="text-xs text-muted-foreground">Available</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="buildings" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {buildings.map((building) => (
                <Card key={building.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Building2 className="h-5 w-5 mr-2" />
                      {building.name}
                    </CardTitle>
                    <CardDescription>{building.units} total units</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Occupancy</span>
                          <span>{building.occupancy}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${building.occupancy}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span>Occupied:</span>
                          <span>{Math.round(building.units * building.occupancy / 100)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Available:</span>
                          <span>{building.units - Math.round(building.units * building.occupancy / 100)}</span>
                        </div>
                      </div>

                      <Button variant="outline" size="sm" className="w-full">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Building Activity Summary</CardTitle>
                <CardDescription>Recent move activity across all buildings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {buildings.map((building, index) => (
                    <div key={building.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Building2 className="h-8 w-8 text-primary" />
                        <div>
                          <p className="font-medium">{building.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {building.occupancy}% occupied • {building.units} units
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {Math.floor(Math.random() * 5) + 1} moves this week
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Next: {["Today", "Tomorrow", "Jan 18"][index % 3]}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Move Analytics</CardTitle>
                  <CardDescription>Monthly performance metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Total Moves Completed</span>
                      <span className="font-bold">156</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Average Move Duration</span>
                      <span className="font-bold">3.2 hours</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>On-Time Completion Rate</span>
                      <span className="font-bold text-green-600">94.2%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Tenant Satisfaction Score</span>
                      <span className="font-bold">4.8/5</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cost Analysis</CardTitle>
                  <CardDescription>Moving expenses breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Total Moving Costs</span>
                      <span className="font-bold">₦2,340,000</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Average Cost per Move</span>
                      <span className="font-bold">₦15,000</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Emergency Move Premium</span>
                      <span className="font-bold text-orange-600">₦180,000</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Bulk Discount Savings</span>
                      <span className="font-bold text-green-600">-₦234,000</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Generate Reports</CardTitle>
                <CardDescription>Create detailed reports for management</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="report-type">Report Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select report type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly-summary">Monthly Summary</SelectItem>
                        <SelectItem value="building-performance">Building Performance</SelectItem>
                        <SelectItem value="cost-analysis">Cost Analysis</SelectItem>
                        <SelectItem value="tenant-satisfaction">Tenant Satisfaction</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="report-period">Period</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="last-month">Last Month</SelectItem>
                        <SelectItem value="last-quarter">Last Quarter</SelectItem>
                        <SelectItem value="last-year">Last Year</SelectItem>
                        <SelectItem value="custom">Custom Range</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button className="w-full">Generate Report</Button>
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

export default FacilityManagerDashboard;