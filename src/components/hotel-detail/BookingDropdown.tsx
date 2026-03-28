
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PricingMatrixItem {
  roomType: string;
  stayLength: string | number;
  mealPlan: string;
  price: number;
}

interface BookingDropdownProps {
  pricingMatrix?: PricingMatrixItem[];
  onSelect?: (selection: PricingMatrixItem) => void;
}

export default function BookingDropdown({ pricingMatrix = [], onSelect }: BookingDropdownProps) {
  // Debug pricing matrix
  console.log("🎯 BookingDropdown Debug:", { pricingMatrix, length: pricingMatrix.length });
  const formatRoomType = (roomType: string) => {
    // Capitalize first letter and ensure it says "Room"
    const formatted = roomType.charAt(0).toUpperCase() + roomType.slice(1);
    return formatted.includes('Room') ? formatted : `${formatted} Room`;
  };

  const formatMealPlan = (mealPlan: string) => {
    // Capitalize first letter
    return mealPlan.charAt(0).toUpperCase() + mealPlan.slice(1);
  };

  const formatDropdownOption = (item: PricingMatrixItem) => {
    const roomTypeDisplay = formatRoomType(item.roomType);
    const mealPlanDisplay = formatMealPlan(item.mealPlan);
    const stayLengthValue = typeof item.stayLength === 'string' ? item.stayLength : item.stayLength.toString();
    
    // Format: [Room Type] – [Meal Plan] – [Number of nights] – [Price per person]
    return `${roomTypeDisplay} – ${mealPlanDisplay} – ${stayLengthValue} nights – $${item.price} per person`;
  };

  const formatDefaultDisplay = (item: PricingMatrixItem) => {
    const roomTypeDisplay = formatRoomType(item.roomType);
    // Format for default display: [Room Type] – [Price per person]
    return `${roomTypeDisplay} – $${item.price} per person`;
  };

  const handleSelectionChange = (value: string) => {
    const selectedItem = sortedPricingMatrix.find(item => formatDropdownOption(item) === value);
    if (selectedItem && onSelect) {
      onSelect(selectedItem);
    }
  };

  // Sort pricing matrix by price (cheapest first)
  const sortedPricingMatrix = [...pricingMatrix].sort((a, b) => a.price - b.price);
  
  // Get the cheapest option for default display
  const cheapestOption = sortedPricingMatrix[0];
  const defaultDisplayValue = cheapestOption ? formatDefaultDisplay(cheapestOption) : "Select room and pricing option";

  if (!pricingMatrix || pricingMatrix.length === 0) {
    return (
      <Select disabled>
        <SelectTrigger className="w-full bg-fuchsia-950/30 border border-fuchsia-800/30 text-white">
          <SelectValue placeholder="No pricing options available" />
        </SelectTrigger>
      </Select>
    );
  }

  return (
    <Select onValueChange={handleSelectionChange}>
      <SelectTrigger className="w-full bg-fuchsia-950/30 border border-fuchsia-800/30 text-white">
        <SelectValue placeholder={defaultDisplayValue} />
      </SelectTrigger>
      <SelectContent className="bg-card border border-border z-50">
        {sortedPricingMatrix.map((item, index) => {
          const optionValue = formatDropdownOption(item);
          return (
            <SelectItem 
              key={`${item.roomType}-${item.stayLength}-${item.mealPlan}-${index}`}
              value={optionValue}
              className="text-white hover:bg-fuchsia-700/50 focus:bg-fuchsia-700/50 data-[state=checked]:bg-fuchsia-700/50 focus:text-white cursor-pointer"
            >
              {optionValue}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
