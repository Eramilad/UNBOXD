/**
 * Smart Matching Algorithm
 * Auto-matches customers with the nearest, most reliable drivers/crew
 * Target: Reduce average wait time from 2 hours → 20 minutes
 */

export interface Driver {
  id: string;
  name: string;
  rating: number;
  totalJobs: number;
  location: {
    lat: number;
    lng: number;
  };
  vehicle: {
    type: 'small' | 'medium' | 'large' | 'truck';
    capacity: number; // in cubic feet
    features: string[];
  };
  availability: {
    isOnline: boolean;
    currentJob?: string;
    nextAvailable: Date;
  };
  specialties: string[];
  responseTime: number; // average response time in minutes
  reliabilityScore: number; // 0-1 based on completion rate, punctuality
}

export interface CustomerRequest {
  id: string;
  pickup: {
    lat: number;
    lng: number;
    address: string;
  };
  delivery: {
    lat: number;
    lng: number;
    address: string;
  };
  items: {
    count: number;
    volume: number; // cubic feet
    weight: number; // kg
    fragile: boolean;
    specialRequirements: string[];
  };
  preferredTime: Date;
  budget: number;
  urgency: 'low' | 'medium' | 'high';
}

export interface MatchResult {
  driver: Driver;
  score: number;
  estimatedArrival: number; // minutes
  estimatedCost: number;
  confidence: number; // 0-1
  reasons: string[];
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
 * Calculate driver score based on multiple factors
 */
function calculateDriverScore(
  driver: Driver, 
  request: CustomerRequest, 
  distance: number
): { score: number; reasons: string[] } {
  const reasons: string[] = [];
  let score = 0;

  // Distance factor (40% weight) - closer is better
  const maxDistance = 50; // km
  const distanceScore = Math.max(0, (maxDistance - distance) / maxDistance);
  score += distanceScore * 0.4;
  if (distance < 5) reasons.push('Very close location');
  else if (distance < 15) reasons.push('Nearby driver');

  // Rating factor (25% weight)
  const ratingScore = driver.rating / 5;
  score += ratingScore * 0.25;
  if (driver.rating >= 4.5) reasons.push('Excellent rating');
  else if (driver.rating >= 4.0) reasons.push('High rating');

  // Reliability factor (20% weight)
  score += driver.reliabilityScore * 0.2;
  if (driver.reliabilityScore >= 0.9) reasons.push('Highly reliable');
  else if (driver.reliabilityScore >= 0.8) reasons.push('Reliable driver');

  // Vehicle suitability (10% weight)
  const vehicleScore = calculateVehicleSuitability(driver.vehicle, request.items);
  score += vehicleScore * 0.1;
  if (vehicleScore >= 0.8) reasons.push('Perfect vehicle size');
  else if (vehicleScore >= 0.6) reasons.push('Suitable vehicle');

  // Availability factor (5% weight)
  const availabilityScore = driver.availability.isOnline ? 1 : 0;
  score += availabilityScore * 0.05;
  if (driver.availability.isOnline) reasons.push('Currently available');

  return { score, reasons };
}

/**
 * Calculate vehicle suitability for the request
 */
function calculateVehicleSuitability(
  vehicle: Driver['vehicle'], 
  items: CustomerRequest['items']
): number {
  const capacityRatio = items.volume / vehicle.capacity;
  
  if (capacityRatio <= 0.5) return 0.6; // Too small
  if (capacityRatio <= 0.8) return 0.8; // Good fit
  if (capacityRatio <= 1.0) return 1.0; // Perfect fit
  if (capacityRatio <= 1.2) return 0.9; // Slightly tight but workable
  return 0.7; // Too big but acceptable
}

/**
 * Estimate arrival time based on distance and driver location
 */
function estimateArrivalTime(driver: Driver, request: CustomerRequest): number {
  const distance = calculateDistance(
    driver.location.lat, driver.location.lng,
    request.pickup.lat, request.pickup.lng
  );
  
  // Base time: 2 minutes per km + 5 minutes preparation
  const baseTime = (distance * 2) + 5;
  
  // Adjust for driver's average response time
  const responseAdjustment = driver.responseTime * 0.5;
  
  // Adjust for traffic (simplified - in real app, use traffic API)
  const trafficMultiplier = getTrafficMultiplier(request.preferredTime);
  
  return Math.round((baseTime + responseAdjustment) * trafficMultiplier);
}

/**
 * Get traffic multiplier based on time of day
 */
function getTrafficMultiplier(time: Date): number {
  const hour = time.getHours();
  
  // Rush hours: 7-9 AM, 5-7 PM
  if ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19)) {
    return 1.5;
  }
  
  // Late night/early morning: 11 PM - 5 AM
  if (hour >= 23 || hour <= 5) {
    return 0.8;
  }
  
  return 1.0; // Normal traffic
}

/**
 * Main smart matching function
 */
export function findBestMatches(
  request: CustomerRequest,
  availableDrivers: Driver[],
  maxResults: number = 5
): MatchResult[] {
  const matches: MatchResult[] = [];

  for (const driver of availableDrivers) {
    // Skip if driver is not available
    if (!driver.availability.isOnline || driver.availability.currentJob) {
      continue;
    }

    const distance = calculateDistance(
      driver.location.lat, driver.location.lng,
      request.pickup.lat, request.pickup.lng
    );

    // Skip if too far (more than 50km)
    if (distance > 50) continue;

    const { score, reasons } = calculateDriverScore(driver, request, distance);
    const estimatedArrival = estimateArrivalTime(driver, request);
    const estimatedCost = calculateEstimatedCost(distance, request.items, driver.vehicle);

    // Calculate confidence based on score and driver history
    const confidence = Math.min(0.95, score * (driver.totalJobs > 10 ? 1.0 : 0.8));

    matches.push({
      driver,
      score,
      estimatedArrival,
      estimatedCost,
      confidence,
      reasons
    });
  }

  // Sort by score (highest first) and return top matches
  return matches
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults);
}

/**
 * Calculate estimated cost based on distance, items, and vehicle
 */
function calculateEstimatedCost(
  distance: number,
  items: CustomerRequest['items'],
  vehicle: Driver['vehicle']
): number {
  const baseRate = 2.5; // per km
  const baseFee = 15; // minimum fee
  
  // Distance cost
  let cost = baseFee + (distance * baseRate);
  
  // Vehicle type multiplier
  const vehicleMultiplier = {
    'small': 1.0,
    'medium': 1.2,
    'large': 1.4,
    'truck': 1.6
  }[vehicle.type];
  
  cost *= vehicleMultiplier;
  
  // Item complexity multiplier
  if (items.fragile) cost *= 1.2;
  if (items.specialRequirements.length > 0) cost *= 1.1;
  
  // Volume multiplier for large items
  if (items.volume > 50) cost *= 1.3;
  
  return Math.round(cost * 100) / 100;
}

/**
 * Get instant match for immediate booking
 */
export function getInstantMatch(
  request: CustomerRequest,
  availableDrivers: Driver[]
): MatchResult | null {
  const matches = findBestMatches(request, availableDrivers, 1);
  
  if (matches.length === 0) return null;
  
  const bestMatch = matches[0];
  
  // Only return if confidence is high enough and arrival time is reasonable
  if (bestMatch.confidence >= 0.7 && bestMatch.estimatedArrival <= 30) {
    return bestMatch;
  }
  
  return null;
}

/**
 * Real-time matching for live updates
 */
export function subscribeToMatches(
  request: CustomerRequest,
  onMatchFound: (match: MatchResult) => void,
  onNoMatch: () => void
): () => void {
  let isActive = true;
  
  const checkForMatches = async () => {
    if (!isActive) return;
    
    try {
      // In a real app, this would fetch from your API
      const availableDrivers = await fetchAvailableDrivers();
      const match = getInstantMatch(request, availableDrivers);
      
      if (match) {
        onMatchFound(match);
        return; // Stop checking once we find a match
      }
      
      // Check again in 5 seconds
      setTimeout(checkForMatches, 5000);
    } catch (error) {
      console.error('Error checking for matches:', error);
      onNoMatch();
    }
  };
  
  // Start checking immediately
  checkForMatches();
  
  // Return cleanup function
  return () => {
    isActive = false;
  };
}

/**
 * Mock function to fetch available drivers
 * In a real app, this would be an API call
 */
async function fetchAvailableDrivers(): Promise<Driver[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Mock data - in real app, this comes from your database
  return [
    {
      id: 'driver-1',
      name: 'John Adebayo',
      rating: 4.8,
      totalJobs: 156,
      location: { lat: 7.4951, lng: 4.5156 },
      vehicle: {
        type: 'medium',
        capacity: 120,
        features: ['GPS', 'Climate Control', 'Insurance']
      },
      availability: {
        isOnline: true,
        nextAvailable: new Date()
      },
      specialties: ['Furniture', 'Electronics'],
      responseTime: 8,
      reliabilityScore: 0.95
    },
    {
      id: 'driver-2',
      name: 'Sarah Okafor',
      rating: 4.9,
      totalJobs: 203,
      location: { lat: 7.4951, lng: 4.5156 },
      vehicle: {
        type: 'large',
        capacity: 180,
        features: ['GPS', 'Climate Control', 'Insurance', 'Fragile Handling']
      },
      availability: {
        isOnline: true,
        nextAvailable: new Date()
      },
      specialties: ['Furniture', 'Electronics', 'Fragile Items'],
      responseTime: 6,
      reliabilityScore: 0.98
    }
  ];
}
