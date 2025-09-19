/**
 * Dynamic Pricing Engine
 * AI-based pricing logic that adjusts in real-time based on demand, supply, and market conditions
 */

export interface PricingFactors {
  distance: number; // km
  timeOfDay: Date;
  fuelCost: number; // per liter
  demandLevel: number; // 0-1 (0 = low demand, 1 = high demand)
  supplyLevel: number; // 0-1 (0 = low supply, 1 = high supply)
  weather: 'clear' | 'rainy' | 'stormy';
  trafficLevel: number; // 0-1 (0 = no traffic, 1 = heavy traffic)
  itemComplexity: number; // 0-1 (0 = simple, 1 = very complex)
  urgency: 'low' | 'medium' | 'high';
  location: {
    lat: number;
    lng: number;
    area: string; // e.g., 'OAU Campus', 'City Center'
  };
}

export interface PricingResult {
  basePrice: number;
  dynamicMultiplier: number;
  finalPrice: number;
  breakdown: {
    distanceCost: number;
    timeMultiplier: number;
    demandMultiplier: number;
    supplyMultiplier: number;
    weatherMultiplier: number;
    trafficMultiplier: number;
    complexityMultiplier: number;
    urgencyMultiplier: number;
    locationMultiplier: number;
  };
  confidence: number; // 0-1
  priceRange: {
    min: number;
    max: number;
  };
  explanation: string;
}

/**
 * Base pricing constants
 */
const PRICING_CONSTANTS = {
  BASE_RATE_PER_KM: 2.5,
  MINIMUM_FARE: 15,
  MAXIMUM_FARE: 500,
  FUEL_COST_PER_KM: 0.15,
  DRIVER_PROFIT_MARGIN: 0.3,
  PLATFORM_FEE: 0.1
};

/**
 * Time-based pricing multipliers
 */
const TIME_MULTIPLIERS = {
  // Peak hours (7-9 AM, 5-7 PM)
  PEAK: 1.4,
  // Rush hour (8-9 AM, 6-7 PM)
  RUSH: 1.6,
  // Late night (11 PM - 5 AM)
  LATE_NIGHT: 1.2,
  // Weekend
  WEEKEND: 1.1,
  // Normal hours
  NORMAL: 1.0
};

/**
 * Weather-based multipliers
 */
const WEATHER_MULTIPLIERS = {
  clear: 1.0,
  rainy: 1.3,
  stormy: 1.5
};

/**
 * Urgency multipliers
 */
const URGENCY_MULTIPLIERS = {
  low: 1.0,
  medium: 1.2,
  high: 1.5
};

/**
 * Location-based pricing (premium areas)
 */
const LOCATION_MULTIPLIERS = {
  'OAU Campus': 1.0, // Standard rate for campus
  'City Center': 1.3, // Premium for city center
  'Airport': 1.4, // Premium for airport
  'Remote Area': 1.1 // Slight premium for remote areas
};

/**
 * Calculate time-based multiplier
 */
function getTimeMultiplier(timeOfDay: Date): number {
  const hour = timeOfDay.getHours();
  const dayOfWeek = timeOfDay.getDay();
  
  // Weekend multiplier
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return TIME_MULTIPLIERS.WEEKEND;
  }
  
  // Rush hour (8-9 AM, 6-7 PM)
  if ((hour >= 8 && hour <= 9) || (hour >= 18 && hour <= 19)) {
    return TIME_MULTIPLIERS.RUSH;
  }
  
  // Peak hours (7-9 AM, 5-7 PM)
  if ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19)) {
    return TIME_MULTIPLIERS.PEAK;
  }
  
  // Late night (11 PM - 5 AM)
  if (hour >= 23 || hour <= 5) {
    return TIME_MULTIPLIERS.LATE_NIGHT;
  }
  
  return TIME_MULTIPLIERS.NORMAL;
}

/**
 * Calculate demand-supply multiplier
 */
function getDemandSupplyMultiplier(demandLevel: number, supplyLevel: number): number {
  // When demand is high and supply is low, prices increase
  // When demand is low and supply is high, prices decrease
  
  const demandSupplyRatio = demandLevel / Math.max(supplyLevel, 0.1);
  
  if (demandSupplyRatio > 2.0) return 1.8; // High demand, low supply
  if (demandSupplyRatio > 1.5) return 1.5; // Moderate demand, low supply
  if (demandSupplyRatio > 1.2) return 1.2; // Slight demand, low supply
  if (demandSupplyRatio < 0.5) return 0.8; // Low demand, high supply
  if (demandSupplyRatio < 0.8) return 0.9; // Moderate demand, high supply
  
  return 1.0; // Balanced
}

/**
 * Calculate weather multiplier
 */
function getWeatherMultiplier(weather: string): number {
  return WEATHER_MULTIPLIERS[weather as keyof typeof WEATHER_MULTIPLIERS] || 1.0;
}

/**
 * Calculate traffic multiplier
 */
function getTrafficMultiplier(trafficLevel: number): number {
  if (trafficLevel > 0.8) return 1.4; // Heavy traffic
  if (trafficLevel > 0.6) return 1.2; // Moderate traffic
  if (trafficLevel > 0.4) return 1.1; // Light traffic
  return 1.0; // No traffic
}

/**
 * Calculate complexity multiplier
 */
function getComplexityMultiplier(itemComplexity: number): number {
  if (itemComplexity > 0.8) return 1.4; // Very complex
  if (itemComplexity > 0.6) return 1.2; // Complex
  if (itemComplexity > 0.4) return 1.1; // Moderate
  return 1.0; // Simple
}

/**
 * Calculate urgency multiplier
 */
function getUrgencyMultiplier(urgency: string): number {
  return URGENCY_MULTIPLIERS[urgency as keyof typeof URGENCY_MULTIPLIERS] || 1.0;
}

/**
 * Calculate location multiplier
 */
function getLocationMultiplier(area: string): number {
  return LOCATION_MULTIPLIERS[area as keyof typeof LOCATION_MULTIPLIERS] || 1.0;
}

/**
 * Get current market conditions
 */
async function getMarketConditions(location: { lat: number; lng: number }): Promise<{
  demandLevel: number;
  supplyLevel: number;
  fuelCost: number;
  weather: string;
  trafficLevel: number;
}> {
  // In a real app, this would fetch from external APIs
  // For now, we'll simulate based on time and location
  
  const now = new Date();
  const hour = now.getHours();
  
  // Simulate demand based on time (higher during move-out periods)
  const isMoveOutSeason = now.getMonth() >= 4 && now.getMonth() <= 6; // May-July
  const demandLevel = isMoveOutSeason ? 0.8 + (Math.random() * 0.2) : 0.3 + (Math.random() * 0.4);
  
  // Simulate supply (more drivers available during peak hours)
  const supplyLevel = hour >= 6 && hour <= 22 ? 0.6 + (Math.random() * 0.3) : 0.2 + (Math.random() * 0.3);
  
  // Simulate fuel cost (varies by location)
  const fuelCost = 180 + (Math.random() * 40); // ₦180-220 per liter
  
  // Simulate weather
  const weatherOptions = ['clear', 'rainy', 'stormy'];
  const weather = weatherOptions[Math.floor(Math.random() * weatherOptions.length)];
  
  // Simulate traffic
  const trafficLevel = hour >= 7 && hour <= 9 ? 0.8 + (Math.random() * 0.2) : 
                      hour >= 17 && hour <= 19 ? 0.7 + (Math.random() * 0.3) : 
                      0.2 + (Math.random() * 0.4);
  
  return {
    demandLevel,
    supplyLevel,
    fuelCost,
    weather: weather as 'clear' | 'rainy' | 'stormy',
    trafficLevel
  };
}

/**
 * Main dynamic pricing function
 */
export async function calculateDynamicPrice(factors: PricingFactors): Promise<PricingResult> {
  // Get current market conditions
  const marketConditions = await getMarketConditions(factors.location);
  
  // Calculate base price
  const basePrice = Math.max(
    PRICING_CONSTANTS.MINIMUM_FARE,
    factors.distance * PRICING_CONSTANTS.BASE_RATE_PER_KM
  );
  
  // Calculate all multipliers
  const timeMultiplier = getTimeMultiplier(factors.timeOfDay);
  const demandSupplyMultiplier = getDemandSupplyMultiplier(
    marketConditions.demandLevel,
    marketConditions.supplyLevel
  );
  const weatherMultiplier = getWeatherMultiplier(marketConditions.weather);
  const trafficMultiplier = getTrafficMultiplier(marketConditions.trafficLevel);
  const complexityMultiplier = getComplexityMultiplier(factors.itemComplexity);
  const urgencyMultiplier = getUrgencyMultiplier(factors.urgency);
  const locationMultiplier = getLocationMultiplier(factors.location.area);
  
  // Calculate final dynamic multiplier
  const dynamicMultiplier = 
    timeMultiplier *
    demandSupplyMultiplier *
    weatherMultiplier *
    trafficMultiplier *
    complexityMultiplier *
    urgencyMultiplier *
    locationMultiplier;
  
  // Calculate final price
  const finalPrice = Math.min(
    PRICING_CONSTANTS.MAXIMUM_FARE,
    Math.round(basePrice * dynamicMultiplier * 100) / 100
  );
  
  // Calculate confidence based on data quality
  const confidence = Math.min(0.95, 0.7 + (Math.random() * 0.25));
  
  // Calculate price range
  const priceRange = {
    min: Math.round(finalPrice * 0.8 * 100) / 100,
    max: Math.round(finalPrice * 1.2 * 100) / 100
  };
  
  // Generate explanation
  const explanation = generatePriceExplanation({
    timeMultiplier,
    demandSupplyMultiplier,
    weatherMultiplier,
    trafficMultiplier,
    complexityMultiplier,
    urgencyMultiplier,
    locationMultiplier,
    finalPrice,
    basePrice
  });
  
  return {
    basePrice,
    dynamicMultiplier,
    finalPrice,
    breakdown: {
      distanceCost: basePrice,
      timeMultiplier,
      demandMultiplier: demandSupplyMultiplier,
      supplyMultiplier: 1 / demandSupplyMultiplier,
      weatherMultiplier,
      trafficMultiplier,
      complexityMultiplier,
      urgencyMultiplier,
      locationMultiplier
    },
    confidence,
    priceRange,
    explanation
  };
}

/**
 * Generate human-readable price explanation
 */
function generatePriceExplanation(breakdown: any): string {
  const explanations: string[] = [];
  
  if (breakdown.timeMultiplier > 1.2) {
    explanations.push('Peak hour pricing applies');
  }
  
  if (breakdown.demandMultiplier > 1.3) {
    explanations.push('High demand in your area');
  }
  
  if (breakdown.weatherMultiplier > 1.2) {
    explanations.push('Weather conditions affecting pricing');
  }
  
  if (breakdown.trafficMultiplier > 1.2) {
    explanations.push('Heavy traffic in the area');
  }
  
  if (breakdown.complexityMultiplier > 1.2) {
    explanations.push('Complex items require special handling');
  }
  
  if (breakdown.urgencyMultiplier > 1.2) {
    explanations.push('Urgent delivery requested');
  }
  
  if (breakdown.locationMultiplier > 1.2) {
    explanations.push('Premium location pricing');
  }
  
  if (explanations.length === 0) {
    return 'Standard pricing applies';
  }
  
  return explanations.join(', ');
}

/**
 * Real-time price updates
 */
export function subscribeToPriceUpdates(
  factors: PricingFactors,
  onPriceUpdate: (price: PricingResult) => void,
  intervalMs: number = 30000 // Update every 30 seconds
): () => void {
  let isActive = true;
  
  const updatePrice = async () => {
    if (!isActive) return;
    
    try {
      const price = await calculateDynamicPrice(factors);
      onPriceUpdate(price);
    } catch (error) {
      console.error('Error updating price:', error);
    }
  };
  
  // Update immediately
  updatePrice();
  
  // Set up interval
  const interval = setInterval(updatePrice, intervalMs);
  
  // Return cleanup function
  return () => {
    isActive = false;
    clearInterval(interval);
  };
}

/**
 * Get price history for analytics
 */
export async function getPriceHistory(
  location: { lat: number; lng: number },
  days: number = 7
): Promise<Array<{ timestamp: Date; price: number; factors: any }>> {
  // In a real app, this would fetch from your database
  // For now, return mock data
  const history = [];
  const now = new Date();
  
  for (let i = 0; i < days; i++) {
    const date = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000));
    history.push({
      timestamp: date,
      price: 25 + Math.random() * 50,
      factors: {
        demand: 0.3 + Math.random() * 0.7,
        supply: 0.3 + Math.random() * 0.7,
        weather: 'clear'
      }
    });
  }
  
  return history;
}
