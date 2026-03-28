import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, Clock, Utensils } from 'lucide-react';
import { AvailabilityPackage } from '@/types/availability-package';
import { format, parseISO } from 'date-fns';
import { formatCurrency } from '@/utils/dynamicPricing';
import { useTranslation } from '@/hooks/useTranslation';
import { formatHotelPrice, getPriceUnavailableText, getMealPlanLabel, validatePrice } from '@/utils/hotelPricing';
import { getStandardPrice, hasStandardPricing } from '@/utils/standardPricing';

interface AvailabilityPackageCardProps {
  package: AvailabilityPackage;
  onReserve: (packageData: AvailabilityPackage) => void;
  onJoinWaitlist?: (packageData: AvailabilityPackage) => void;
  hotelName?: string;
  pricePerMonth?: number;
  pricingMatrix?: Array<{
    duration: number;
    doubleRoom: number;
    singleRoom: number;
  }>;
  mealPlan?: string;
  hotelCategory?: number;
}

export function AvailabilityPackageCard({ 
  package: pkg, 
  onReserve, 
  onJoinWaitlist, 
  hotelName,
  pricePerMonth,
  pricingMatrix = [],
  mealPlan = 'room_only', // Changed default to Room Only
  hotelCategory = 3
}: AvailabilityPackageCardProps) {
  const { language, t } = useTranslation('hotel');
  const isAvailable = pkg.available_rooms > 0;
  const isSoldOut = pkg.available_rooms === 0;

  // Use the ACTUAL meal plan from package, not forced Room Only
  const getPackagePrice = (roomType: 'single' | 'double') => {
    // Detect actual meal plan from package
    const actualMealPlan = pkg.meal_plan || mealPlan || 'half_board';
    
    // Use standard pricing with ACTUAL meal plan
    if (hasStandardPricing(hotelCategory, pkg.duration_days)) {
      const standardPrice = getStandardPrice({
        hotelCategory,
        duration: pkg.duration_days,
        roomType,
        mealPlan: actualMealPlan // Use ACTUAL meal plan, not forced Room Only
      });
     
      if (standardPrice !== null) {
        return standardPrice;
      }
    }
    
    console.warn('⚠️ No standard pricing found, using fallback');
    return null;
  };

  // Calculate prices using hotel-defined pricing only
  const doubleRoomPrice = getPackagePrice('double');
  const singleRoomPrice = getPackagePrice('single');

  const formatDateRange = (startDate: string, endDate: string) => {
    try {
      // Validate dates before parsing
      if (!startDate || !endDate) {
        console.warn('Missing date values:', { startDate, endDate });
        return 'Invalid dates';
      }
      
      const start = parseISO(startDate);
      const end = parseISO(endDate);
      
      // Check if dates are valid
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        console.warn('Invalid date values:', { startDate, endDate });
        return `${startDate} – ${endDate}`;
      }
      
      const startFormatted = format(start, 'MMM d');
      const endFormatted = format(end, 'MMM d');
      return `${startFormatted} – ${endFormatted}`;
    } catch (error) {
      console.error('Error formatting dates:', error, { startDate, endDate });
      return `${startDate} – ${endDate}`;
    }
  };

  const getStatusIcon = () => {
    return isAvailable ? '🟢' : '🔴';
  };

  const getStatusText = () => {
    if (isSoldOut) return 'SOLD OUT';
    if (pkg.available_rooms === 1) return '1 room available';
    return `${pkg.available_rooms} rooms available`;
  };

  return (
    <Card className={`border-2 transition-all duration-200 ${
      isAvailable 
        ? 'border-green-500/30 bg-green-950/20 hover:border-green-400/50 hover:bg-green-950/30' 
        : 'border-red-500/30 bg-red-950/20'
    }`}>
      <div className="p-4">
        {/* Mobile: Vertical Layout, Desktop: Horizontal Layout */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-3 space-y-4 lg:space-y-0">
          <div className="flex items-center gap-2">
            <span className="text-lg">{getStatusIcon()}</span>
            <div className="flex-1">
              <h3 className="font-semibold text-white text-lg">
                {formatDateRange(pkg.start_date, pkg.end_date)}
              </h3>
              {/* Mobile: Stack items vertically, Desktop: Horizontal */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 text-sm text-white/70 mt-1 space-y-1 sm:space-y-0">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{pkg.duration_days} days</span>
                </div>
                <div className="flex items-center gap-1">
                  <Utensils className="w-4 h-4" />
                  <span>{getMealPlanLabel(pkg.meal_plan || mealPlan, language)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{getStatusText()}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Mobile: Full width pricing section, Desktop: Right aligned */}
          <div className="w-full lg:w-auto lg:text-right">
            <div className="space-y-1 mb-2">
              {/* Double occupancy price */}
              {doubleRoomPrice ? (
                <div className="space-y-1">
                  <div className="text-xs text-white/60">
                    Per person (double room)
                  </div>
                  <div className="text-lg font-bold text-white">
                    {formatHotelPrice(doubleRoomPrice)}
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="text-xs text-white/60">
                    Per person (double room)
                  </div>
                  <div className="text-lg font-bold text-white/70">
                    {getPriceUnavailableText(language)}
                  </div>
                </div>
              )}
              
              {/* Single occupancy price */}
              {singleRoomPrice ? (
                <div className="space-y-1 mt-2">
                  <div className="text-xs text-white/60">
                    Per person (single room)
                  </div>
                  <div className="text-sm font-semibold text-white/90">
                    {formatHotelPrice(singleRoomPrice)}
                  </div>
                </div>
              ) : (
                <div className="space-y-1 mt-2">
                  <div className="text-xs text-white/60">
                    Per person (single room)
                  </div>
                  <div className="text-sm font-semibold text-white/70">
                    {getPriceUnavailableText(language)}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex flex-col lg:flex-row lg:items-center gap-2">
              <Badge 
                variant={isAvailable ? "default" : "destructive"}
                className={`${
                  isAvailable 
                    ? 'bg-green-700/80 text-green-100 hover:bg-green-600/80' 
                    : 'bg-red-700/80 text-red-100'
                }`}
              >
                {isAvailable ? 'Available' : 'Sold Out'}
              </Badge>
              
              {isAvailable && (
                <Button
                  onClick={() => onReserve(pkg)}
                  className="bg-purple-600 hover:bg-purple-700 text-white border-purple-500/50 w-full lg:w-auto"
                  size="sm"
                >
                  Reserve
                </Button>
              )}
            </div>
          </div>
        </div>
        
        {isSoldOut && (
          <div className="mt-3 p-2 bg-red-900/30 border border-red-700/50 rounded">
            <div className="flex items-center justify-between">
              <span className="text-red-200 text-sm font-medium">This package is fully booked</span>
              {onJoinWaitlist && (
                <Button
                  onClick={() => onJoinWaitlist(pkg)}
                  variant="outline"
                  size="sm"
                  className="border-red-500/50 text-red-300 hover:bg-red-900/50 hover:text-red-200"
                >
                  Join Waitlist
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}