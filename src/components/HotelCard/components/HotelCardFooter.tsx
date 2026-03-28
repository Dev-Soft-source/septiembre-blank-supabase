import React from "react";
import { HotelCardPrice } from "./HotelCardPrice";
interface HotelCardFooterProps {
  availableMonths: string[];
  activities?: Array<{
    activities?: {
      name: string;
    };
  }>;
  mealPlans?: string[];
}
export const HotelCardFooter: React.FC<HotelCardFooterProps> = ({
  availableMonths,
  activities,
  mealPlans
}) => {
  return <div className="mt-3 pt-2 border-t border-gray-700/20 flex justify-between items-center bg-[#b32ae1]">
      {availableMonths && availableMonths.length > 0 && <div className="text-xs text-fuchsia-400">{availableMonths.length} months available</div>}
    </div>;
};