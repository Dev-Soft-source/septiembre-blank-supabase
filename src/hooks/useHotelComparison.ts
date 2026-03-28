
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ComparisonHotel {
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
}

export const useHotelComparison = () => {
  const [selectedHotels, setSelectedHotels] = useState<ComparisonHotel[]>([]);
  const { toast } = useToast();

  const addToComparison = (hotel: ComparisonHotel) => {
    if (selectedHotels.length >= 4) {
      toast({
        title: "Maximum hotels reached",
        description: "You can compare up to 4 hotels at once"
      });
      return;
    }

    if (selectedHotels.find(h => h.id === hotel.id)) {
      return; // Already added
    }

    setSelectedHotels(prev => [...prev, hotel]);
    toast({
      title: "Hotel added to comparison",
      description: `${hotel.name} added to comparison`
    });
  };

  const removeFromComparison = (hotelId: string) => {
    setSelectedHotels(prev => prev.filter(h => h.id !== hotelId));
  };

  const clearComparison = () => {
    setSelectedHotels([]);
  };

  const isInComparison = (hotelId: string) => {
    return selectedHotels.some(h => h.id === hotelId);
  };

  return {
    selectedHotels,
    addToComparison,
    removeFromComparison,
    clearComparison,
    isInComparison,
    canCompare: selectedHotels.length >= 2
  };
};
