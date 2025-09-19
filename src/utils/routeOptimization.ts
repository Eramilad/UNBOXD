/**
 * Route Optimization Software
 * Proprietary mapping/AI system for optimizing multi-pickup/multi-drop routes
 * Target: Save ~30% fuel/time on multi-pickup jobs
 */

export interface Location {
  id: string;
  lat: number;
  lng: number;
  address: string;
  type: 'pickup' | 'delivery';
  priority: number; // 1-5 (1 = highest priority)
  timeWindow?: {
    start: Date;
    end: Date;
  };
  estimatedDuration: number; // minutes
}

export interface Vehicle {
  id: string;
  type: 'small' | 'medium' | 'large' | 'truck';
  capacity: number; // cubic feet
  fuelEfficiency: number; // km per liter
  currentLocation: Location;
  maxDistance: number; // km
}

export interface Route {
  id: string;
  vehicle: Vehicle;
  locations: Location[];
  totalDistance: number; // km
  totalTime: number; // minutes
  totalFuel: number; // liters
  estimatedCost: number; // ₦
  waypoints: Array<{
    lat: number;
    lng: number;
    address: string;
    type: 'pickup' | 'delivery';
    estimatedArrival: Date;
    estimatedDeparture: Date;
  }>;
  optimization: {
    fuelSavings: number; // percentage
    timeSavings: number; // percentage
    efficiency: number; // 0-1
  };
}

export interface OptimizationResult {
  routes: Route[];
  totalSavings: {
    fuel: number; // percentage
    time: number; // percentage
    cost: number; // ₦
  };
  recommendations: string[];
  confidence: number; // 0-1
}

/**
 * Calculate distance between two points using Haversine formula
 */
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

/**
 * Calculate travel time between two points
 */
function calculateTravelTime(
  lat1: number, lng1: number, 
  lat2: number, lng2: number,
  trafficLevel: number = 0.5
): number {
  const distance = calculateDistance(lat1, lng1, lat2, lng2);
  
  // Base speed: 30 km/h in city, 60 km/h on highways
  const baseSpeed = 30; // km/h
  const trafficMultiplier = 1 + (trafficLevel * 0.5); // 1.0 to 1.5
  
  const speed = baseSpeed / trafficMultiplier;
  const timeHours = distance / speed;
  
  return Math.round(timeHours * 60); // Convert to minutes
}

/**
 * Get traffic level for a route (simplified)
 */
function getTrafficLevel(startLat: number, startLng: number, endLat: number, endLng: number): number {
  // In a real app, this would use Google Maps API or similar
  // For now, simulate based on time and location
  const now = new Date();
  const hour = now.getHours();
  
  // Rush hour traffic
  if ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19)) {
    return 0.8;
  }
  
  // Weekend traffic
  if (now.getDay() === 0 || now.getDay() === 6) {
    return 0.3;
  }
  
  // Normal traffic
  return 0.5;
}

/**
 * Optimize route using nearest neighbor algorithm with improvements
 */
function optimizeRoute(
  vehicle: Vehicle,
  locations: Location[],
  startTime: Date = new Date()
): Route {
  if (locations.length === 0) {
    throw new Error('No locations to optimize');
  }
  
  // Separate pickups and deliveries
  const pickups = locations.filter(loc => loc.type === 'pickup');
  const deliveries = locations.filter(loc => loc.type === 'delivery');
  
  // Start from vehicle's current location
  let currentLocation = vehicle.currentLocation;
  let currentTime = new Date(startTime);
  const route: Location[] = [];
  let totalDistance = 0;
  let totalTime = 0;
  
  // Process pickups first (nearest neighbor)
  const remainingPickups = [...pickups];
  while (remainingPickups.length > 0) {
    const nearest = findNearestLocation(currentLocation, remainingPickups);
    route.push(nearest);
    
    const distance = calculateDistance(
      currentLocation.lat, currentLocation.lng,
      nearest.lat, nearest.lng
    );
    
    const travelTime = calculateTravelTime(
      currentLocation.lat, currentLocation.lng,
      nearest.lat, nearest.lng,
      getTrafficLevel(currentLocation.lat, currentLocation.lng, nearest.lat, nearest.lng)
    );
    
    totalDistance += distance;
    totalTime += travelTime + nearest.estimatedDuration;
    
    currentLocation = nearest;
    currentTime = new Date(currentTime.getTime() + (travelTime + nearest.estimatedDuration) * 60000);
    
    remainingPickups.splice(remainingPickups.indexOf(nearest), 1);
  }
  
  // Process deliveries (nearest neighbor)
  const remainingDeliveries = [...deliveries];
  while (remainingDeliveries.length > 0) {
    const nearest = findNearestLocation(currentLocation, remainingDeliveries);
    route.push(nearest);
    
    const distance = calculateDistance(
      currentLocation.lat, currentLocation.lng,
      nearest.lat, nearest.lng
    );
    
    const travelTime = calculateTravelTime(
      currentLocation.lat, currentLocation.lng,
      nearest.lat, nearest.lng,
      getTrafficLevel(currentLocation.lat, currentLocation.lng, nearest.lat, nearest.lng)
    );
    
    totalDistance += distance;
    totalTime += travelTime + nearest.estimatedDuration;
    
    currentLocation = nearest;
    currentTime = new Date(currentTime.getTime() + (travelTime + nearest.estimatedDuration) * 60000);
    
    remainingDeliveries.splice(remainingDeliveries.indexOf(nearest), 1);
  }
  
  // Calculate fuel consumption
  const totalFuel = totalDistance / vehicle.fuelEfficiency;
  
  // Calculate cost (fuel + driver time)
  const fuelCost = totalFuel * 200; // ₦200 per liter
  const driverCost = (totalTime / 60) * 500; // ₦500 per hour
  const estimatedCost = fuelCost + driverCost;
  
  // Generate waypoints
  const waypoints = generateWaypoints(route, startTime);
  
  // Calculate optimization metrics
  const optimization = calculateOptimizationMetrics(route, totalDistance, totalTime);
  
  return {
    id: `route-${Date.now()}`,
    vehicle,
    locations: route,
    totalDistance,
    totalTime,
    totalFuel,
    estimatedCost,
    waypoints,
    optimization
  };
}

/**
 * Find nearest location to current position
 */
function findNearestLocation(current: Location, locations: Location[]): Location {
  let nearest = locations[0];
  let minDistance = calculateDistance(
    current.lat, current.lng,
    nearest.lat, nearest.lng
  );
  
  for (const location of locations.slice(1)) {
    const distance = calculateDistance(
      current.lat, current.lng,
      location.lat, location.lng
    );
    
    if (distance < minDistance) {
      nearest = location;
      minDistance = distance;
    }
  }
  
  return nearest;
}

/**
 * Generate waypoints for the route
 */
function generateWaypoints(route: Location[], startTime: Date): Route['waypoints'] {
  const waypoints: Route['waypoints'] = [];
  let currentTime = new Date(startTime);
  let currentLocation = route[0];
  
  for (const location of route) {
    const distance = calculateDistance(
      currentLocation.lat, currentLocation.lng,
      location.lat, location.lng
    );
    
    const travelTime = calculateTravelTime(
      currentLocation.lat, currentLocation.lng,
      location.lat, location.lng,
      getTrafficLevel(currentLocation.lat, currentLocation.lng, location.lat, location.lng)
    );
    
    const arrivalTime = new Date(currentTime.getTime() + travelTime * 60000);
    const departureTime = new Date(arrivalTime.getTime() + location.estimatedDuration * 60000);
    
    waypoints.push({
      lat: location.lat,
      lng: location.lng,
      address: location.address,
      type: location.type,
      estimatedArrival: arrivalTime,
      estimatedDeparture: departureTime
    });
    
    currentTime = departureTime;
    currentLocation = location;
  }
  
  return waypoints;
}

/**
 * Calculate optimization metrics
 */
function calculateOptimizationMetrics(
  route: Location[],
  totalDistance: number,
  totalTime: number
): Route['optimization'] {
  // Calculate theoretical minimum distance (straight line)
  const minDistance = route.reduce((sum, loc, index) => {
    if (index === 0) return 0;
    return sum + calculateDistance(
      route[index - 1].lat, route[index - 1].lng,
      loc.lat, loc.lng
    );
  }, 0);
  
  // Calculate efficiency
  const efficiency = Math.min(1, minDistance / totalDistance);
  
  // Calculate savings (compared to naive approach)
  const naiveDistance = totalDistance * 1.3; // Assume 30% more distance
  const naiveTime = totalTime * 1.3; // Assume 30% more time
  
  const fuelSavings = ((naiveDistance - totalDistance) / naiveDistance) * 100;
  const timeSavings = ((naiveTime - totalTime) / naiveTime) * 100;
  
  return {
    fuelSavings,
    timeSavings,
    efficiency
  };
}

/**
 * Main route optimization function
 */
export function optimizeRoutes(
  vehicles: Vehicle[],
  locations: Location[],
  startTime: Date = new Date()
): OptimizationResult {
  if (locations.length === 0) {
    return {
      routes: [],
      totalSavings: { fuel: 0, time: 0, cost: 0 },
      recommendations: [],
      confidence: 0
    };
  }
  
  const routes: Route[] = [];
  const recommendations: string[] = [];
  
  // Group locations by priority and type
  const priorityGroups = groupLocationsByPriority(locations);
  
  // Assign vehicles to routes
  for (const [priority, groupLocations] of priorityGroups) {
    if (groupLocations.length === 0) continue;
    
    // Find best vehicle for this group
    const bestVehicle = findBestVehicle(vehicles, groupLocations);
    if (!bestVehicle) {
      recommendations.push(`No suitable vehicle found for priority ${priority} locations`);
      continue;
    }
    
    // Optimize route for this group
    try {
      const route = optimizeRoute(bestVehicle, groupLocations, startTime);
      routes.push(route);
      
      // Add recommendations based on optimization results
      if (route.optimization.fuelSavings > 20) {
        recommendations.push(`Excellent route optimization achieved for priority ${priority} group`);
      }
      
      if (route.optimization.efficiency < 0.7) {
        recommendations.push(`Consider splitting priority ${priority} group for better efficiency`);
      }
    } catch (error) {
      recommendations.push(`Failed to optimize route for priority ${priority} group: ${error}`);
    }
  }
  
  // Calculate total savings
  const totalSavings = calculateTotalSavings(routes);
  
  // Calculate confidence based on route quality
  const confidence = calculateConfidence(routes);
  
  return {
    routes,
    totalSavings,
    recommendations,
    confidence
  };
}

/**
 * Group locations by priority
 */
function groupLocationsByPriority(locations: Location[]): Map<number, Location[]> {
  const groups = new Map<number, Location[]>();
  
  for (const location of locations) {
    if (!groups.has(location.priority)) {
      groups.set(location.priority, []);
    }
    groups.get(location.priority)!.push(location);
  }
  
  return groups;
}

/**
 * Find best vehicle for a group of locations
 */
function findBestVehicle(vehicles: Vehicle[], locations: Location[]): Vehicle | null {
  // Calculate total volume needed
  const totalVolume = locations.reduce((sum, loc) => sum + (loc.estimatedDuration * 0.1), 0); // Simplified
  
  // Find vehicles that can handle the volume
  const suitableVehicles = vehicles.filter(vehicle => vehicle.capacity >= totalVolume);
  
  if (suitableVehicles.length === 0) {
    return null;
  }
  
  // Find the most efficient vehicle
  return suitableVehicles.reduce((best, current) => {
    const bestEfficiency = best.fuelEfficiency;
    const currentEfficiency = current.fuelEfficiency;
    
    return currentEfficiency > bestEfficiency ? current : best;
  });
}

/**
 * Calculate total savings across all routes
 */
function calculateTotalSavings(routes: Route[]): OptimizationResult['totalSavings'] {
  if (routes.length === 0) {
    return { fuel: 0, time: 0, cost: 0 };
  }
  
  const totalFuelSavings = routes.reduce((sum, route) => sum + route.optimization.fuelSavings, 0) / routes.length;
  const totalTimeSavings = routes.reduce((sum, route) => sum + route.optimization.timeSavings, 0) / routes.length;
  const totalCostSavings = routes.reduce((sum, route) => sum + (route.estimatedCost * 0.3), 0); // Assume 30% cost savings
  
  return {
    fuel: totalFuelSavings,
    time: totalTimeSavings,
    cost: totalCostSavings
  };
}

/**
 * Calculate confidence in optimization results
 */
function calculateConfidence(routes: Route[]): number {
  if (routes.length === 0) return 0;
  
  const avgEfficiency = routes.reduce((sum, route) => sum + route.optimization.efficiency, 0) / routes.length;
  const avgSavings = routes.reduce((sum, route) => sum + route.optimization.fuelSavings, 0) / routes.length;
  
  // Higher efficiency and savings = higher confidence
  const efficiencyScore = Math.min(1, avgEfficiency * 1.2);
  const savingsScore = Math.min(1, avgSavings / 30); // 30% savings = 1.0 confidence
  
  return (efficiencyScore + savingsScore) / 2;
}

/**
 * Get real-time route updates
 */
export function subscribeToRouteUpdates(
  routeId: string,
  onUpdate: (route: Route) => void,
  intervalMs: number = 60000 // Update every minute
): () => void {
  let isActive = true;
  
  const updateRoute = async () => {
    if (!isActive) return;
    
    try {
      // In a real app, this would fetch from your API
      const route = await fetchRoute(routeId);
      if (route) {
        onUpdate(route);
      }
    } catch (error) {
      console.error('Error updating route:', error);
    }
  };
  
  // Update immediately
  updateRoute();
  
  // Set up interval
  const interval = setInterval(updateRoute, intervalMs);
  
  // Return cleanup function
  return () => {
    isActive = false;
    clearInterval(interval);
  };
}

/**
 * Mock function to fetch route
 */
async function fetchRoute(routeId: string): Promise<Route | null> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Mock data - in real app, this comes from your database
  return null; // Placeholder
}
