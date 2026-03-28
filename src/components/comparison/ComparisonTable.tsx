
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Calendar, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useHotelComparison } from '@/hooks/useHotelComparison';

interface ComparisonHotel {
  id: string;
  name: string;
  location: string;
  city?: string;
  country?: string;
  price_per_month?: number;
  hotel_themes?: Array<{ themes?: { name: string } }>;
  hotel_activities?: Array<{ activities?: { name: string } }>;
  meal_plans?: string[];
  available_months?: string[];
  rates?: Record<string, number>;
  thumbnail?: string;
}

interface ComparisonTableProps {
  hotels: ComparisonHotel[];
}

export const ComparisonTable: React.FC<ComparisonTableProps> = ({ hotels }) => {
  const { removeFromComparison } = useHotelComparison();

  // Get base price for 8-day stay
  const getBasePrice = (hotel: ComparisonHotel) => {
    if (hotel.rates) {
      // Look for 8-day rate
      const eightDayRate = hotel.rates['8'] || hotel.rates['8-days'] || hotel.rates['8 days'];
      if (eightDayRate) return eightDayRate;
      
      // Find closest rate to 8 days
      const rates = Object.entries(hotel.rates);
      let closestRate = null;
      let closestDiff = Infinity;
      
      rates.forEach(([key, value]) => {
        const dayMatch = key.match(/(\d+)/);
        if (dayMatch) {
          const days = parseInt(dayMatch[1]);
          const diff = Math.abs(days - 8);
          if (diff < closestDiff) {
            closestDiff = diff;
            closestRate = value;
          }
        }
      });
      
      if (closestRate) return closestRate;
    }
    
    // Fallback to monthly price divided by ~4
    return hotel.price_per_month ? Math.round(hotel.price_per_month / 4) : null;
  };

  // Get all unique affinities for comparison
  const allAffinities = new Set<string>();
  hotels.forEach(hotel => {
    hotel.hotel_themes?.forEach(theme => {
      if (theme.themes?.name) {
        allAffinities.add(theme.themes.name);
      }
    });
  });

  // Get all unique activities for comparison
  const allActivities = new Set<string>();
  hotels.forEach(hotel => {
    hotel.hotel_activities?.forEach(activity => {
      if (activity.activities?.name) {
        allActivities.add(activity.activities.name);
      }
    });
  });

  const hasAffinity = (hotel: ComparisonHotel, affinity: string) => {
    return hotel.hotel_themes?.some(theme => theme.themes?.name === affinity) || false;
  };

  const hasActivity = (hotel: ComparisonHotel, activity: string) => {
    return hotel.hotel_activities?.some(act => act.activities?.name === activity) || false;
  };

  return (
    <div className="space-y-6">
      {/* Hotel Headers */}
      <div className="grid gap-4" style={{ gridTemplateColumns: `200px repeat(${hotels.length}, 1fr)` }}>
        <div></div>
        {hotels.map(hotel => (
          <Card key={hotel.id} className="bg-purple-900/50 border-purple-500/30">
            <CardContent className="p-4">
              <div className="aspect-video bg-muted rounded-lg mb-3 overflow-hidden">
                <img 
                  src={hotel.thumbnail || '/placeholder.svg'} 
                  alt={hotel.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-bold text-white text-sm mb-1">{hotel.name}</h3>
              <p className="text-white/70 text-xs mb-3">{hotel.location}</p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => removeFromComparison(hotel.id)}
                className="w-full text-xs"
              >
                Remove
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Price Comparison */}
      <Card className="bg-purple-900/30 border-purple-500/30">
        <CardContent className="p-0">
          <div className="grid gap-4 p-4" style={{ gridTemplateColumns: `200px repeat(${hotels.length}, 1fr)` }}>
            <div className="flex items-center">
              <DollarSign className="w-4 h-4 mr-2 text-green-400" />
              <span className="font-semibold text-white">8-Day Stay Price</span>
            </div>
            {hotels.map(hotel => {
              const price = getBasePrice(hotel);
              return (
                <div key={hotel.id} className="text-center">
                  {price ? (
                    <div className="text-lg font-bold text-green-400">
                      ${price}
                    </div>
                  ) : (
                    <div className="text-white/50">Price on request</div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Affinities Comparison */}
      <Card className="bg-purple-900/30 border-purple-500/30">
        <CardContent className="p-4">
          <h3 className="font-semibold text-white mb-4">Affinities</h3>
          <div className="space-y-3">
            {Array.from(allAffinities).map(affinity => (
              <div key={affinity} className="grid gap-4" style={{ gridTemplateColumns: `200px repeat(${hotels.length}, 1fr)` }}>
                <div className="text-white text-sm">{affinity}</div>
                {hotels.map(hotel => (
                  <div key={hotel.id} className="text-center">
                    {hasAffinity(hotel, affinity) ? (
                      <CheckCircle className="w-5 h-5 text-green-400 mx-auto" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400 mx-auto" />
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Activities Comparison */}
      <Card className="bg-purple-900/30 border-purple-500/30">
        <CardContent className="p-4">
          <h3 className="font-semibold text-white mb-4">Activities</h3>
          <div className="space-y-3">
            {Array.from(allActivities).map(activity => (
              <div key={activity} className="grid gap-4" style={{ gridTemplateColumns: `200px repeat(${hotels.length}, 1fr)` }}>
                <div className="text-white text-sm">{activity}</div>
                {hotels.map(hotel => (
                  <div key={hotel.id} className="text-center">
                    {hasActivity(hotel, activity) ? (
                      <CheckCircle className="w-5 h-5 text-green-400 mx-auto" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400 mx-auto" />
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Meal Plans Comparison */}
      <Card className="bg-purple-900/30 border-purple-500/30">
        <CardContent className="p-4">
          <h3 className="font-semibold text-white mb-4">Meal Services</h3>
          <div className="grid gap-4" style={{ gridTemplateColumns: `200px repeat(${hotels.length}, 1fr)` }}>
            <div className="text-white text-sm">Available Meal Plans</div>
            {hotels.map(hotel => (
              <div key={hotel.id} className="space-y-1">
                {hotel.meal_plans && hotel.meal_plans.length > 0 ? (
                  hotel.meal_plans.map(plan => (
                    <Badge key={plan} variant="secondary" className="text-xs">
                      {plan}
                    </Badge>
                  ))
                ) : (
                  <span className="text-red-400 text-sm">No meal plans</span>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Availability Comparison */}
      <Card className="bg-purple-900/30 border-purple-500/30">
        <CardContent className="p-4">
          <h3 className="font-semibold text-white mb-4">Upcoming Availability</h3>
          <div className="grid gap-4" style={{ gridTemplateColumns: `200px repeat(${hotels.length}, 1fr)` }}>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-blue-400" />
              <span className="text-white text-sm">Available Months</span>
            </div>
            {hotels.map(hotel => (
              <div key={hotel.id} className="text-center">
                {hotel.available_months && hotel.available_months.length > 0 ? (
                  <div className="text-blue-400 font-semibold">
                    {hotel.available_months.length} months
                  </div>
                ) : (
                  <div className="text-white/50">Contact hotel</div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
