import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Star, Car, Users, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { findBestMatches, getInstantMatch, subscribeToMatches, Driver, CustomerRequest, MatchResult } from '@/utils/smartMatching';

interface SmartMatchingProps {
  request: CustomerRequest;
  onMatchSelected: (match: MatchResult) => void;
  onNoMatch: () => void;
}

const SmartMatching: React.FC<SmartMatchingProps> = ({ request, onMatchSelected, onNoMatch }) => {
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [isSearching, setIsSearching] = useState(true);
  const [searchProgress, setSearchProgress] = useState(0);
  const [selectedMatch, setSelectedMatch] = useState<MatchResult | null>(null);

  useEffect(() => {
    setIsSearching(true);
    setSearchProgress(0);
    
    // Simulate search progress
    const progressInterval = setInterval(() => {
      setSearchProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    // Start smart matching
    const startMatching = async () => {
      try {
        // Try to get instant match first
        const instantMatch = await getInstantMatch(request, await fetchAvailableDrivers());
        
        if (instantMatch) {
          setMatches([instantMatch]);
          setSelectedMatch(instantMatch);
          setIsSearching(false);
          return;
        }

        // If no instant match, get best matches
        const bestMatches = await findBestMatches(request, await fetchAvailableDrivers(), 5);
        setMatches(bestMatches);
        
        if (bestMatches.length > 0) {
          setSelectedMatch(bestMatches[0]);
        } else {
          onNoMatch();
        }
        
        setIsSearching(false);
      } catch (error) {
        console.error('Error finding matches:', error);
        onNoMatch();
        setIsSearching(false);
      }
    };

    startMatching();
  }, [request, onMatchSelected, onNoMatch]);

  const handleSelectMatch = (match: MatchResult) => {
    setSelectedMatch(match);
    onMatchSelected(match);
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

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 0.8) return 'Excellent Match';
    if (confidence >= 0.6) return 'Good Match';
    return 'Fair Match';
  };

  if (isSearching) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Finding Your Perfect Match
          </CardTitle>
          <CardDescription>
            Our smart algorithm is analyzing drivers in your area...
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Searching for drivers...</span>
              <span>{searchProgress}%</span>
            </div>
            <Progress value={searchProgress} className="w-full" />
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <div className="text-2xl">📍</div>
              <div className="text-sm text-gray-600">Location</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl">⭐</div>
              <div className="text-sm text-gray-600">Rating</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl">🚗</div>
              <div className="text-sm text-gray-600">Vehicle</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (matches.length === 0) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Drivers Available</h3>
          <p className="text-gray-600 mb-4">
            We couldn't find any available drivers in your area right now.
          </p>
          <Button onClick={onNoMatch} variant="outline">
            Try Again Later
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Found {matches.length} Available Driver{matches.length > 1 ? 's' : ''}
          </CardTitle>
          <CardDescription>
            Our smart algorithm found the best matches for your request
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Matches Grid */}
      <div className="grid gap-4">
        {matches.map((match, index) => (
          <Card 
            key={match.driver.id} 
            className={`cursor-pointer transition-all duration-200 ${
              selectedMatch?.driver.id === match.driver.id 
                ? 'ring-2 ring-blue-500 bg-blue-50' 
                : 'hover:shadow-md'
            }`}
            onClick={() => handleSelectMatch(match)}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={match.driver.avatar} />
                    <AvatarFallback>
                      {match.driver.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{match.driver.name}</h3>
                      <Badge variant="outline" className={getConfidenceColor(match.confidence)}>
                        {getConfidenceText(match.confidence)}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span>{match.driver.rating}/5</span>
                        <span className="text-gray-500">({match.driver.totalJobs} jobs)</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-blue-500" />
                        <span>{match.estimatedArrival} min</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Car className="w-4 h-4 text-green-500" />
                        <span>{getVehicleIcon(match.driver.vehicle.type)} {match.driver.vehicle.type}</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-red-500" />
                        <span>{Math.round(match.driver.location.lat * 100) / 100}km away</span>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <div className="text-sm text-gray-600 mb-2">Why this match:</div>
                      <div className="flex flex-wrap gap-1">
                        {match.reasons.map((reason, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {reason}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">
                    ₦{match.estimatedCost.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">Estimated cost</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {Math.round(match.confidence * 100)}% confidence
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Selected Match Summary */}
      {selectedMatch && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-green-800">
                  Selected: {selectedMatch.driver.name}
                </h3>
                <p className="text-sm text-green-600">
                  ETA: {selectedMatch.estimatedArrival} minutes • Cost: ₦{selectedMatch.estimatedCost.toLocaleString()}
                </p>
              </div>
              <Button 
                onClick={() => onMatchSelected(selectedMatch)}
                className="bg-green-600 hover:bg-green-700"
              >
                Confirm Selection
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Mock function to fetch available drivers
async function fetchAvailableDrivers(): Promise<Driver[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
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

export default SmartMatching;
