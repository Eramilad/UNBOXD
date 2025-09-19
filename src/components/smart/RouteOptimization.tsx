import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Fuel, Route, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { optimizeRoutes, Route, Vehicle, Location, OptimizationResult } from '@/utils/routeOptimization';

interface RouteOptimizationProps {
  locations: Location[];
  vehicles: Vehicle[];
  onRouteSelected: (route: Route) => void;
  onOptimizationComplete: (result: OptimizationResult) => void;
}

const RouteOptimization: React.FC<RouteOptimizationProps> = ({ 
  locations, 
  vehicles, 
  onRouteSelected, 
  onOptimizationComplete 
}) => {
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [optimizationProgress, setOptimizationProgress] = useState(0);

  useEffect(() => {
    if (locations.length > 0 && vehicles.length > 0) {
      startOptimization();
    }
  }, [locations, vehicles]);

  const startOptimization = async () => {
    setIsOptimizing(true);
    setOptimizationProgress(0);
    
    // Simulate optimization progress
    const progressInterval = setInterval(() => {
      setOptimizationProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 15;
      });
    }, 300);

    try {
      // Perform route optimization
      const result = await optimizeRoutes(vehicles, locations);
      setOptimizationResult(result);
      onOptimizationComplete(result);
      
      if (result.routes.length > 0) {
        setSelectedRoute(result.routes[0]);
      }
    } catch (error) {
      console.error('Error optimizing routes:', error);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleRouteSelect = (route: Route) => {
    setSelectedRoute(route);
    onRouteSelected(route);
  };

  const getVehicleIcon = (vehicleType: string) => {
    switch (vehicleType) {
      case 'small': return '🚗';
      case 'medium': return '🚐';
      case 'large': return '🚚';
      case 'truck': return '🚛';
      default: return '🚗';
    }
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 0.8) return 'text-green-600';
    if (efficiency >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getEfficiencyText = (efficiency: number) => {
    if (efficiency >= 0.8) return 'Excellent';
    if (efficiency >= 0.6) return 'Good';
    return 'Fair';
  };

  if (isOptimizing) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Route className="w-5 h-5" />
            Optimizing Routes
          </CardTitle>
          <CardDescription>
            Our AI is calculating the most efficient routes for your deliveries...
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Analyzing {locations.length} locations...</span>
              <span>{optimizationProgress}%</span>
            </div>
            <Progress value={optimizationProgress} className="w-full" />
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <div className="text-2xl">⏱️</div>
              <div className="text-sm text-gray-600">Time</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl">⛽</div>
              <div className="text-sm text-gray-600">Fuel</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl">💰</div>
              <div className="text-sm text-gray-600">Cost</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!optimizationResult || optimizationResult.routes.length === 0) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Routes Found</h3>
          <p className="text-gray-600">
            Unable to optimize routes for the given locations and vehicles.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Optimization Summary */}
      <Card className="bg-green-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <CheckCircle className="w-5 h-5" />
            Route Optimization Complete
          </CardTitle>
          <CardDescription className="text-green-700">
            Found {optimizationResult.routes.length} optimized route{optimizationResult.routes.length > 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {optimizationResult.totalSavings.fuel.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Fuel Savings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {optimizationResult.totalSavings.time.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Time Savings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                ₦{optimizationResult.totalSavings.cost.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Cost Savings</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Routes List */}
      <div className="grid gap-4">
        {optimizationResult.routes.map((route, index) => (
          <Card 
            key={route.id}
            className={`cursor-pointer transition-all duration-200 ${
              selectedRoute?.id === route.id 
                ? 'ring-2 ring-blue-500 bg-blue-50' 
                : 'hover:shadow-md'
            }`}
            onClick={() => handleRouteSelect(route)}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {getVehicleIcon(route.vehicle.type)} Route {index + 1}
                    <Badge variant="outline" className={getEfficiencyColor(route.optimization.efficiency)}>
                      {getEfficiencyText(route.optimization.efficiency)}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    {route.locations.length} stops • {route.vehicle.type} vehicle
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">
                    ₦{route.estimatedCost.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">Estimated cost</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-lg font-semibold text-blue-600">
                    {route.totalDistance.toFixed(1)} km
                  </div>
                  <div className="text-sm text-gray-600">Distance</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-green-600">
                    {Math.round(route.totalTime)} min
                  </div>
                  <div className="text-sm text-gray-600">Duration</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-orange-600">
                    {route.totalFuel.toFixed(1)} L
                  </div>
                  <div className="text-sm text-gray-600">Fuel</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-purple-600">
                    {route.optimization.fuelSavings.toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600">Savings</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Route Efficiency</span>
                  <span className="font-semibold">
                    {Math.round(route.optimization.efficiency * 100)}%
                  </span>
                </div>
                <Progress value={route.optimization.efficiency * 100} className="w-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Selected Route Details */}
      {selectedRoute && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <MapPin className="w-5 h-5" />
              Selected Route Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Route Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Route Summary</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Total Distance:</span>
                      <span className="font-semibold">{selectedRoute.totalDistance.toFixed(1)} km</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Time:</span>
                      <span className="font-semibold">{Math.round(selectedRoute.totalTime)} minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fuel Consumption:</span>
                      <span className="font-semibold">{selectedRoute.totalFuel.toFixed(1)} liters</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated Cost:</span>
                      <span className="font-semibold">₦{selectedRoute.estimatedCost.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Optimization Benefits</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Fuel Savings:</span>
                      <span className="font-semibold text-green-600">
                        {selectedRoute.optimization.fuelSavings.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Time Savings:</span>
                      <span className="font-semibold text-blue-600">
                        {selectedRoute.optimization.timeSavings.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Route Efficiency:</span>
                      <span className="font-semibold text-purple-600">
                        {Math.round(selectedRoute.optimization.efficiency * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Waypoints Table */}
              <div>
                <h4 className="font-semibold mb-2">Route Waypoints</h4>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Stop</TableHead>
                        <TableHead>Address</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Arrival</TableHead>
                        <TableHead>Departure</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedRoute.waypoints.map((waypoint, index) => (
                        <TableRow key={index}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell className="max-w-xs truncate">
                            {waypoint.address}
                          </TableCell>
                          <TableCell>
                            <Badge variant={waypoint.type === 'pickup' ? 'default' : 'secondary'}>
                              {waypoint.type}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {waypoint.estimatedArrival.toLocaleTimeString()}
                          </TableCell>
                          <TableCell>
                            {waypoint.estimatedDeparture.toLocaleTimeString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
              
              <div className="flex justify-center">
                <Button 
                  onClick={() => onRouteSelected(selectedRoute)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
                >
                  Use This Route
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      {optimizationResult.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Optimization Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {optimizationResult.recommendations.map((recommendation, index) => (
                <Alert key={index}>
                  <AlertDescription>{recommendation}</AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RouteOptimization;
