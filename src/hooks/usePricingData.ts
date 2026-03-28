import { useMemo } from 'react';
import { roundPriceUp, calculateSingleRoomPrice, HotelCategory } from '@/utils/pricingRules';
import { PricingMatrixItem } from '@/types/pricing-matrix';

interface UsePricingDataProps {
  pricePerMonth?: number;
  pricingMatrix?: PricingMatrixItem[];
  hotelCategory?: HotelCategory;
  stayLengths?: number[];
}

/**
 * Hook to handle pricing data and calculations
 */
export function usePricingData({
  pricePerMonth,
  pricingMatrix = [],
  hotelCategory = 4,
  stayLengths = [8, 15, 22, 29]
}: UsePricingDataProps) {
  
  const enhancedPricingMatrix = useMemo(() => {
    // If we have an existing pricing matrix, use it
    if (pricingMatrix.length > 0) {
      return pricingMatrix.map(item => ({
        ...item,
        doubleRoom: roundPriceUp(item.doubleRoom),
        singleRoom: roundPriceUp(item.singleRoom)
      }));
    }
    
    // If we have pricePerMonth, generate a matrix
    if (pricePerMonth && stayLengths.length > 0) {
      return stayLengths.map(duration => {
        const dailyRate = pricePerMonth / 30;
        const basePrice = dailyRate * duration;
        const doubleRoomPrice = roundPriceUp(basePrice);
        const singleRoomPrice = calculateSingleRoomPrice(doubleRoomPrice);
        
        return {
          duration,
          doubleRoom: doubleRoomPrice,
          singleRoom: singleRoomPrice
        };
      });
    }
    
    return [];
  }, [pricePerMonth, pricingMatrix, stayLengths]);

  const getPriceForDuration = (duration: number, roomType: 'single' | 'double' = 'double') => {
    const pricing = enhancedPricingMatrix.find(p => p.duration === duration);
    if (!pricing) return 0;
    
    return roomType === 'double' ? pricing.doubleRoom : pricing.singleRoom;
  };

  const formatPriceDisplay = (price: number, currency: string = 'EUR') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0
    }).format(price);
  };

  return {
    pricingMatrix: enhancedPricingMatrix,
    getPriceForDuration,
    formatPriceDisplay,
    hotelCategory
  };
}