import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Clock, Fuel, MapPin, AlertCircle, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { calculateDynamicPrice, subscribeToPriceUpdates, PricingFactors, PricingResult } from '@/utils/dynamicPricing';

interface DynamicPricingProps {
  factors: PricingFactors;
  onPriceUpdate: (price: PricingResult) => void;
  onPriceAccept: (price: PricingResult) => void;
}

const DynamicPricing: React.FC<DynamicPricingProps> = ({ factors, onPriceUpdate, onPriceAccept }) => {
  const [currentPrice, setCurrentPrice] = useState<PricingResult | null>(null);
  const [priceHistory, setPriceHistory] = useState<PricingResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [priceTrend, setPriceTrend] = useState<'up' | 'down' | 'stable'>('stable');

  useEffect(() => {
    let cleanup: (() => void) | undefined;

    const initializePricing = async () => {
      try {
        // Get initial price
        const initialPrice = await calculateDynamicPrice(factors);
        setCurrentPrice(initialPrice);
        onPriceUpdate(initialPrice);
        setIsLoading(false);

        // Subscribe to real-time updates
        cleanup = subscribeToPriceUpdates(factors, (newPrice) => {
          setCurrentPrice(prevPrice => {
            if (prevPrice) {
              const trend = newPrice.finalPrice > prevPrice.finalPrice ? 'up' : 
                          newPrice.finalPrice < prevPrice.finalPrice ? 'down' : 'stable';
              setPriceTrend(trend);
            }
            return newPrice;
          });
          onPriceUpdate(newPrice);
        }, 30000); // Update every 30 seconds
      } catch (error) {
        console.error('Error initializing pricing:', error);
        setIsLoading(false);
      }
    };

    initializePricing();

    return () => {
      if (cleanup) cleanup();
    };
  }, [factors, onPriceUpdate]);

  const getTrendIcon = () => {
    switch (priceTrend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-red-500" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-green-500" />;
      default: return <Clock className="w-4 h-4 text-blue-500" />;
    }
  };

  const getTrendColor = () => {
    switch (priceTrend) {
      case 'up': return 'text-red-600';
      case 'down': return 'text-green-600';
      default: return 'text-blue-600';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 0.8) return 'High Confidence';
    if (confidence >= 0.6) return 'Medium Confidence';
    return 'Low Confidence';
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold mb-2">Calculating Dynamic Price</h3>
          <p className="text-gray-600">
            Analyzing market conditions and demand patterns...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!currentPrice) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Pricing Unavailable</h3>
          <p className="text-gray-600">
            Unable to calculate dynamic pricing at this time.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Main Pricing Card */}
      <Card className="border-2 border-blue-200 bg-blue-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {getTrendIcon()}
                Dynamic Pricing
                <Badge variant="outline" className={getConfidenceColor(currentPrice.confidence)}>
                  {getConfidenceText(currentPrice.confidence)}
                </Badge>
              </CardTitle>
              <CardDescription>
                Real-time pricing based on market conditions
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">
                ₦{currentPrice.finalPrice.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">
                Base: ₦{currentPrice.basePrice.toLocaleString()}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                ₦{currentPrice.priceRange.min.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Min Price</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                ₦{currentPrice.finalPrice.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Current Price</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                ₦{currentPrice.priceRange.max.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Max Price</div>
            </div>
          </div>
          
          <div className="flex justify-center">
            <Button 
              onClick={() => onPriceAccept(currentPrice)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
            >
              Accept This Price
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Price Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            Price Breakdown
          </CardTitle>
          <CardDescription>
            How your price is calculated
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Distance</div>
                <div className="font-semibold">₦{currentPrice.breakdown.distanceCost.toLocaleString()}</div>
              </div>
              
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Time</div>
                <div className="font-semibold">{currentPrice.breakdown.timeMultiplier.toFixed(1)}x</div>
              </div>
              
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Demand</div>
                <div className="font-semibold">{currentPrice.breakdown.demandMultiplier.toFixed(1)}x</div>
              </div>
              
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Weather</div>
                <div className="font-semibold">{currentPrice.breakdown.weatherMultiplier.toFixed(1)}x</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Traffic</div>
                <div className="font-semibold">{currentPrice.breakdown.trafficMultiplier.toFixed(1)}x</div>
              </div>
              
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Complexity</div>
                <div className="font-semibold">{currentPrice.breakdown.complexityMultiplier.toFixed(1)}x</div>
              </div>
              
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Urgency</div>
                <div className="font-semibold">{currentPrice.breakdown.urgencyMultiplier.toFixed(1)}x</div>
              </div>
              
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Location</div>
                <div className="font-semibold">{currentPrice.breakdown.locationMultiplier.toFixed(1)}x</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Price Explanation */}
      <Card>
        <CardHeader>
          <CardTitle>Price Explanation</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              {currentPrice.explanation}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Market Conditions */}
      <Card>
        <CardHeader>
          <CardTitle>Current Market Conditions</CardTitle>
          <CardDescription>
            Factors affecting your price
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Demand Level</span>
                <span className="font-semibold">
                  {currentPrice.breakdown.demandMultiplier > 1.2 ? 'High' : 
                   currentPrice.breakdown.demandMultiplier > 0.8 ? 'Medium' : 'Low'}
                </span>
              </div>
              <Progress 
                value={currentPrice.breakdown.demandMultiplier * 50} 
                className="w-full"
              />
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Supply Level</span>
                <span className="font-semibold">
                  {currentPrice.breakdown.supplyMultiplier > 1.2 ? 'High' : 
                   currentPrice.breakdown.supplyMultiplier > 0.8 ? 'Medium' : 'Low'}
                </span>
              </div>
              <Progress 
                value={currentPrice.breakdown.supplyMultiplier * 50} 
                className="w-full"
              />
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Traffic Level</span>
                <span className="font-semibold">
                  {currentPrice.breakdown.trafficMultiplier > 1.2 ? 'Heavy' : 
                   currentPrice.breakdown.trafficMultiplier > 0.8 ? 'Moderate' : 'Light'}
                </span>
              </div>
              <Progress 
                value={currentPrice.breakdown.trafficMultiplier * 50} 
                className="w-full"
              />
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Weather Impact</span>
                <span className="font-semibold">
                  {currentPrice.breakdown.weatherMultiplier > 1.2 ? 'High' : 
                   currentPrice.breakdown.weatherMultiplier > 0.8 ? 'Medium' : 'Low'}
                </span>
              </div>
              <Progress 
                value={currentPrice.breakdown.weatherMultiplier * 50} 
                className="w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DynamicPricing;
