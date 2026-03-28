
import React from "react";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";

interface FeaturesSectionProps {
  hotel: any;
}

export function FeaturesSection({ hotel }: FeaturesSectionProps) {
  const hotelFeatures = hotel.features_hotel || {};
  const roomFeatures = hotel.features_room || {};
  
  const renderFeatureList = (features: Record<string, boolean>) => {
    const enabledFeatures = Object.entries(features)
      .filter(([_, isEnabled]) => isEnabled)
      .map(([feature]) => feature);
    
    if (enabledFeatures.length === 0) {
      return <p className="text-sm text-gray-400 italic">No features specified</p>;
    }
    
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {enabledFeatures.map(feature => (
          <div key={feature} className="flex items-center gap-2 p-2 bg-purple-900/20 rounded-md">
            <Check className="h-4 w-4 text-purple-400" />
            <span className="text-sm text-white">{feature.replace(/_/g, ' ')}</span>
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <Card className="p-6 bg-[#7204B8]">
      <h3 className="text-base font-semibold mb-4 border-b pb-2 border-purple-700">
        Features
      </h3>
      
      <div className="space-y-6">
        <div>
          <h4 className="text-sm text-purple-300 font-medium mb-3">Hotel Features</h4>
          {renderFeatureList(hotelFeatures)}
        </div>
        
        <div>
          <h4 className="text-sm text-purple-300 font-medium mb-3">Room Features</h4>
          {renderFeatureList(roomFeatures)}
        </div>
      </div>
    </Card>
  );
}
