
import React from "react";

interface FreeNightsCardProps {
  freeNightsCount: number;
}

export const FreeNightsCard: React.FC<FreeNightsCardProps> = ({ freeNightsCount }) => {
  // Only show the card if there are redeemed free nights
  if (freeNightsCount === 0) return null;
  
  return (
    <div className="mt-4 p-4 bg-indigo-50 rounded-md border border-indigo-200">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-indigo-800">Free nights redeemed:</span>
        <span className="text-lg font-bold text-indigo-700">{freeNightsCount}</span>
      </div>
    </div>
  );
};
