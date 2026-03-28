
import React from "react";
import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";
import { formatCurrency } from "@/utils/dynamicPricing";

export const BasicInfo = ({ hotel }: { hotel: any }) => {
  const renderStars = (count: number) => {
    return Array.from({ length: count }).map((_, index) => (
      <Star 
        key={index} 
        className="h-4 w-4 fill-yellow-500 text-yellow-500" 
      />
    ));
  };
  
  // Parse all complex rate keys and organize them by room type
  const parseAllRates = () => {
    const rates = hotel.rates || {};
    const organizedRates: Record<string, Array<{
      duration: string;
      mealPlan: string;
      price: number;
      originalKey: string;
    }>> = {};
    
    Object.keys(rates).forEach(key => {
      // Parse complex keys like "double-32 days-breakfast", "single-16 days-half-board"
      if (key.includes('-')) {
        const parts = key.split('-');
        if (parts.length >= 3) {
          const roomType = parts[0]; // single, double, etc.
          const duration = parts[1]; // "8 days", "16 days", etc.
          const mealPlan = parts.slice(2).join('-'); // "breakfast", "half-board", etc.
          
          if (!organizedRates[roomType]) {
            organizedRates[roomType] = [];
          }
          
          organizedRates[roomType].push({
            duration,
            mealPlan,
            price: rates[key],
            originalKey: key
          });
        }
      }
      // Handle simple numeric keys as fallback
      else if (/^\d+$/.test(key)) {
        if (!organizedRates['standard']) {
          organizedRates['standard'] = [];
        }
        organizedRates['standard'].push({
          duration: `${key} days`,
          mealPlan: 'standard',
          price: rates[key],
          originalKey: key
        });
      }
    });
    
    return organizedRates;
  };
  
  // Format meal plan names for display
  const formatMealPlan = (mealPlan: string) => {
    const mealPlanMap: Record<string, string> = {
      'breakfast': 'Breakfast',
      'half-board': 'Half Board',
      'full-board': 'Full Board',
      'all-inclusive': 'All Inclusive',
      'standard': 'Standard'
    };
    return mealPlanMap[mealPlan] || mealPlan.charAt(0).toUpperCase() + mealPlan.slice(1);
  };
  
  // Format room type names for display
  const formatRoomType = (roomType: string) => {
    const roomTypeMap: Record<string, string> = {
      'single': 'Single Room',
      'double': 'Double Room',
      'triple': 'Triple Room',
      'quad': 'Quad Room',
      'standard': 'Standard Room'
    };
    return roomTypeMap[roomType] || roomType.charAt(0).toUpperCase() + roomType.slice(1) + ' Room';
  };
  
  // Display all rates with complete details
  const displayAllRates = () => {
    const organizedRates = parseAllRates();
    
    if (Object.keys(organizedRates).length === 0) {
      return hotel.price_per_month ? 
        `${formatCurrency(hotel.price_per_month, hotel.currency || "USD")} (Monthly rate)` : 
        "Not specified";
    }
    
    return (
      <div className="space-y-3">
        {Object.entries(organizedRates).map(([roomType, rates]) => (
          <div key={roomType} className="bg-purple-900/30 p-3 rounded-md">
            <h5 className="font-medium text-fuchsia-200 mb-2">{formatRoomType(roomType)}</h5>
            <div className="space-y-1">
              {rates
                .sort((a, b) => {
                  // Sort by duration (extract number from "X days")
                  const aDuration = parseInt(a.duration.split(' ')[0]);
                  const bDuration = parseInt(b.duration.split(' ')[0]);
                  return aDuration - bDuration;
                })
                .map((rate, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span className="text-gray-300">
                      {rate.duration} + {formatMealPlan(rate.mealPlan)}
                    </span>
                    <span className="text-white font-medium">
                      {formatCurrency(rate.price, hotel.currency || "USD")}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className="rounded-xl p-6 bg-[#5A0080]">
      <h3 className="text-xl font-semibold mb-4 border-b pb-2 border-purple-700">Basic Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium text-fuchsia-200">Hotel Name</h4>
          <p className="text-white">{hotel.name}</p>
        </div>
        
        <div>
          <h4 className="font-medium text-fuchsia-200">Category</h4>
          <div className="flex items-center">
            {hotel.category ? renderStars(hotel.category) : "Not specified"}
          </div>
        </div>
        
        <div>
          <h4 className="font-medium text-fuchsia-200">Property Type</h4>
          <p className="text-white">{hotel.property_type || "Not specified"}</p>
        </div>
        
        <div>
          <h4 className="font-medium text-fuchsia-200">Style</h4>
          <p className="text-white">{hotel.style || "Not specified"}</p>
        </div>
        
        <div className="md:col-span-2">
          <h4 className="font-medium text-fuchsia-200 mb-2">All Pricing Details</h4>
          {displayAllRates()}
        </div>
        
        <div>
          <h4 className="font-medium text-fuchsia-200">Status</h4>
          <p className="text-white capitalize">
            {hotel.status === 'pending' ? 'Pending approval' : 
             hotel.status === 'approved' ? 'Approved' : 
             hotel.status === 'rejected' ? 'Rejected' : hotel.status}
          </p>
        </div>
      </div>
      
      {hotel.description && (
        <div className="mt-4">
          <h4 className="font-medium text-fuchsia-200">Description</h4>
          <p className="text-white whitespace-pre-wrap">{hotel.description}</p>
        </div>
      )}
      
      {hotel.rejection_reason && hotel.status === 'rejected' && (
        <div className="mt-4 p-3 bg-red-900/30 border border-red-700 rounded-md">
          <h4 className="font-medium text-red-200">Rejection Reason</h4>
          <p className="text-white">{hotel.rejection_reason}</p>
        </div>
      )}
    </Card>
  );
};
