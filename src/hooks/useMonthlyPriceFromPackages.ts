import { useState, useEffect, useRef } from 'react';
import { useRealTimeAvailability } from './useRealTimeAvailability';
import { useRealTimeAvailabilityArray} from './useRealTimeAvailabilityArray';
import { calculateMonthlyPriceFromPackages, formatMonthlyPriceFromPackages } from '@/utils/calculateMonthlyPriceFromPackages';
import { AvailabilityPackage } from '@/types/availability-package';
import { supabase } from '@/integrations/supabase/client';
import { generateDemoPackages } from '@/utils/demoPricing';

/**
 * Hook to calculate and format monthly price from available packages
 */
export function useMonthlyPriceFromPackages(hotelId: string, currency: string = "USD") {
  const { packages, isLoading } = useRealTimeAvailability({ hotelId });
  const [monthlyPrice, setMonthlyPrice] = useState<number | null>(null);

  useEffect(() => {
   
    if (packages && packages.length > 0) {      
      const calculatedPrice = calculateMonthlyPriceFromPackages(packages);
      setMonthlyPrice(calculatedPrice);
    } else {
      setMonthlyPrice(null);
    }
  }, [packages, hotelId]);

  return {
    monthlyPrice,
    formattedPrice: formatMonthlyPriceFromPackages(monthlyPrice, currency),
    isLoading,
    hasPackages: packages && packages.length > 0
  };
}

export function useAllMonthlyPriceFromPackages(hotelIds: string[], currency: string = "USD") {
  const { packages} = useRealTimeAvailabilityArray();
  type HotelMonthlyPrice = {
    hotel_id: string;
    monthlyPrice: number[];
  };
  const [monthlyPriceArray, setMonthlyPriceArray] = useState<HotelMonthlyPrice[]>([]);

  // Group packages by hotel_id
  const grouped = (packages || []).reduce(
	(acc: Record<string, any[]>, pkg) => {
	  const key = pkg.hotel_id;          // group by hotel_id
	  if (!acc[key]) {
		acc[key] = [];                   // initialize if first time
	  }
	  acc[key].push(pkg);                // push current package
	  return acc;                        // return accumulator
	},
	{} as Record<string, any[]>
  );

  useEffect(() => {
    Object.keys(grouped).map(hotel_id => {
      if (hotel_id) {
        const pkg = grouped[hotel_id];
        const calculatedPrice = calculateMonthlyPriceFromPackages(pkg);

        setMonthlyPriceArray(prev => {
          // Check if hotel_id already exists
          const existing = prev.find(h => h.hotel_id === hotel_id);
          if (existing) {
            // Update the existing hotel's array
            return prev.map(h =>
              h.hotel_id === hotel_id
                ? { ...h, monthlyPrice: [...h.monthlyPrice, calculatedPrice] }
                : h
            );
          } else {
            // Add new hotel entry
            return [...prev, { hotel_id, monthlyPrice: [calculatedPrice] }];
          }
        });
      } else {
        setMonthlyPriceArray(prev => [...prev, { hotel_id, monthlyPrice: [null] }]);
      }
    });     
  }, [packages]);

  return monthlyPriceArray;
}
