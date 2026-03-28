
import React from "react";

interface TotalSpentCardProps {
  formattedTotal: string;
}

export const TotalSpentCard: React.FC<TotalSpentCardProps> = ({ formattedTotal }) => {
  return (
    <div className="mt-4 p-4 bg-green-50 rounded-md border border-green-200">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-green-800">Total amount spent on confirmed bookings:</span>
        <span className="text-lg font-bold text-green-700">{formattedTotal}</span>
      </div>
    </div>
  );
};
