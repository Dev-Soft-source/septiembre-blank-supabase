
import React from "react";
import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";
import { formatCurrency } from "@/utils/dynamicPricing";

interface BasicInformationProps {
  hotel: any;
}

export function BasicInformation({ hotel }: BasicInformationProps) {
  const renderStars = (count: number) => {
    return Array.from({ length: count }).map((_, index) => (
      <Star 
        key={index} 
        className="h-4 w-4 fill-yellow-500 text-yellow-500" 
      />
    ));
  };
  
  const displayRates = () => {
    const rates = hotel.rates || {};
    const stayLengths = ["8", "15", "22", "29"];
    const availableRates = stayLengths.filter(length => rates[length]);
    
    if (availableRates.length === 0) {
      return hotel.price_per_month ? `${formatCurrency(hotel.price_per_month, hotel.currency || "USD")}` : "Not specified";
    }
    
    return (
      <>
        From: {availableRates.map(length => 
          `${formatCurrency(rates[length], hotel.currency || "USD")} (${length} days)`
        ).join(" · ")}
      </>
    );
  };

  return (
    <Card className="p-6 bg-[#7204B8]">
      <h3 className="text-base font-semibold mb-4 border-b pb-2 border-purple-700">Basic Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-medium text-fuchsia-200">Hotel Name</h4>
          <p className="text-sm text-white">{hotel.name}</p>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-fuchsia-200">Category</h4>
          <div className="flex items-center">
            {hotel.category ? renderStars(hotel.category) : <span className="text-sm text-white">Not specified</span>}
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-fuchsia-200">Property Type</h4>
          <p className="text-sm text-white">{hotel.property_type || "Not specified"}</p>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-fuchsia-200">Style</h4>
          <p className="text-sm text-white">{hotel.style || "Not specified"}</p>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-fuchsia-200">Pricing</h4>
          <p className="text-sm text-white">{displayRates()}</p>
        </div>
      </div>
      
      {hotel.description && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-fuchsia-200">Description</h4>
          <p className="text-sm text-white whitespace-pre-wrap">{hotel.description}</p>
        </div>
      )}
      
      {(hotel.atmosphere || hotel.ideal_guests || hotel.perfect_location) && (
        <div className="mt-6 space-y-4">
          {hotel.atmosphere && (
            <div>
              <h4 className="text-sm font-medium text-fuchsia-200">Atmosphere</h4>
              <p className="text-sm text-white">{hotel.atmosphere}</p>
            </div>
          )}
          {hotel.ideal_guests && (
            <div>
              <h4 className="text-sm font-medium text-fuchsia-200">Ideal For</h4>
              <p className="text-sm text-white">{hotel.ideal_guests}</p>
            </div>
          )}
          {hotel.perfect_location && (
            <div>
              <h4 className="text-sm font-medium text-fuchsia-200">Perfect Location</h4>
              <p className="text-sm text-white">{hotel.perfect_location}</p>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
