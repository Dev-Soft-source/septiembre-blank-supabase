import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Clock } from "lucide-react";
import { formatHotelPrice } from "@/utils/hotelPricing";
import { getStandardPrice, hasStandardPricing } from "@/utils/standardPricing";

interface AvailabilityPackage {
  id: string;
  start_date: string;
  end_date: string;
  duration_days: number;
  total_rooms: number;
  available_rooms: number;
  occupancy_mode: string;
  current_price_usd: number;
  base_price_usd?: number;
  meal_plan?: string;
}

interface AvailabilityPackagesEnhancedProps {
  packages: AvailabilityPackage[];
  currency?: string;
  hotelCategory?: number;
}

export function AvailabilityPackagesEnhanced({ 
  packages, 
  currency = "USD",
  hotelCategory = 3 
}: AvailabilityPackagesEnhancedProps) {
  if (!packages || packages.length === 0) {
    return (
      <div className="text-center p-8 text-white/70">
        <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>No availability packages found</p>
      </div>
    );
  }

  // Group packages by occupancy mode
  const groupedPackages = packages.reduce((acc, pkg) => {
    if (!acc[pkg.occupancy_mode]) {
      acc[pkg.occupancy_mode] = [];
    }
    acc[pkg.occupancy_mode].push(pkg);
    return acc;
  }, {} as Record<string, AvailabilityPackage[]>);

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-white mb-6">Available Packages</h3>
      
      {Object.entries(groupedPackages).map(([occupancyMode, pkgs]) => (
        <Card key={occupancyMode} className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="w-5 h-5" />
              {occupancyMode === 'double' ? 'Double Occupancy' : 'Single Occupancy'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {pkgs.sort((a, b) => a.duration_days - b.duration_days).map((pkg) => (
                <div
                  key={pkg.id}
                  className="bg-white/10 rounded-lg p-4 border border-white/20 hover:border-white/40 transition-all"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-4 h-4 text-purple-300" />
                    <Badge variant="secondary" className="bg-purple-600/50 text-white">
                      {pkg.duration_days} days
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-white/90 text-sm">
                    <div>
                      <span className="text-white/70">From:</span>{' '}
                      {new Date(pkg.start_date).toLocaleDateString()}
                    </div>
                    <div>
                      <span className="text-white/70">To:</span>{' '}
                      {new Date(pkg.end_date).toLocaleDateString()}
                    </div>
                    <div>
                      <span className="text-white/70">Available:</span>{' '}
                      {pkg.available_rooms}/{pkg.total_rooms} rooms
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-3 border-t border-white/20">
                    <div className="text-xl font-bold text-white">
                      {(() => {
                        // Use ACTUAL meal plan from package
                        if (hasStandardPricing(hotelCategory, pkg.duration_days)) {
                          const actualMealPlan = pkg.meal_plan || 'half_board';
                          const standardPrice = getStandardPrice({
                            hotelCategory,
                            duration: pkg.duration_days,
                            roomType: pkg.occupancy_mode as 'single' | 'double',
                            mealPlan: actualMealPlan // Use actual meal plan
                          });
                          if (standardPrice !== null) {
                            return formatHotelPrice(standardPrice, currency);
                          }
                        }
                        // Fallback to package price
                        return formatHotelPrice(pkg.current_price_usd, currency);
                      })()}
                    </div>
                    <div className="text-xs text-white/70">
                      per person
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}