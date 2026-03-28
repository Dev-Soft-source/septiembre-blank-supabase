
import React from "react";
import { Check, X } from "lucide-react";

interface FeaturesInfoProps {
  hotelFeatures: Record<string, boolean>;
  roomFeatures: Record<string, boolean>;
}

export function FeaturesInfo({ hotelFeatures, roomFeatures }: FeaturesInfoProps) {
  const renderFeatureList = (features: Record<string, boolean>) => {
    const enabledFeatures = Object.entries(features)
      .filter(([_, isEnabled]) => isEnabled)
      .map(([feature]) => feature);
    
    if (enabledFeatures.length === 0) {
      return <p className="text-gray-400 italic">No features specified</p>;
    }
    
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {enabledFeatures.map(feature => (
          <div key={feature} className="flex items-center gap-2 p-2 bg-purple-900/20 rounded-md">
            <Check className="h-4 w-4 text-purple-400" />
            <span className="text-sm">{feature.replace(/_/g, ' ')}</span>
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <div className="rounded-xl p-6 bg-[#5A0080]">
      <h3 className="text-xl font-semibold mb-4 border-b pb-2 border-purple-700">
        Features
      </h3>
      
      <div className="space-y-6">
        <div>
          <h4 className="text-lg text-purple-300 font-medium mb-3">Hotel Features</h4>
          {renderFeatureList(hotelFeatures)}
        </div>
        
        <div>
          <h4 className="text-lg text-purple-300 font-medium mb-3">Room Features</h4>
          {renderFeatureList(roomFeatures)}
        </div>
      </div>
    </div>
  );
}
