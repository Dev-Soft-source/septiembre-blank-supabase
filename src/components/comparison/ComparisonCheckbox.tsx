
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { useHotelComparison } from '@/hooks/useHotelComparison';

interface ComparisonCheckboxProps {
  hotel: {
    id: string;
    name: string;
    location: string;
    city?: string;
    country?: string;
    price_per_month?: number;
    hotel_themes?: Array<{ themes?: { name: string } }>;
    hotel_activities?: Array<{ activities?: { name: string } }>;
    meal_plans?: string[];
    available_months?: string[];
    rates?: Record<string, number>;
    thumbnail?: string;
  };
}

export const ComparisonCheckbox: React.FC<ComparisonCheckboxProps> = ({ hotel }) => {
  const { addToComparison, removeFromComparison, isInComparison } = useHotelComparison();

  const handleChange = (checked: boolean) => {
    if (checked) {
      addToComparison(hotel);
    } else {
      removeFromComparison(hotel.id);
    }
  };

  return (
    <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
      <Checkbox
        id={`compare-${hotel.id}`}
        checked={isInComparison(hotel.id)}
        onCheckedChange={handleChange}
        className="border-white data-[state=checked]:bg-purple-600"
      />
      <label 
        htmlFor={`compare-${hotel.id}`} 
        className="text-xs text-white cursor-pointer"
      >
        Compare
      </label>
    </div>
  );
};
