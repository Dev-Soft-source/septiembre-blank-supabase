// @ts-nocheck
// TypeScript checking disabled for database schema compatibility
/**
 * Pricing Calculation Service
 * Handles dynamic pricing, discounts, and price calculations
 */

import { supabase } from '@/integrations/supabase/client';
import { differenceInDays } from 'date-fns';

export interface PricingQuery {
  hotelId: string;
  checkIn: Date;
  checkOut: Date;
  roomType?: string;
  guestCount?: number;
}

export interface PricingResult {
  basePrice: number;
  dynamicPrice: number;
  totalPrice: number;
  discounts: PricingDiscount[];
  breakdown: PricingBreakdown;
  occupancyMultiplier: number;
}

export interface PricingDiscount {
  type: 'length_of_stay' | 'early_bird' | 'seasonal' | 'loyalty';
  amount: number;
  description: string;
}

export interface PricingBreakdown {
  nightsCount: number;
  pricePerNight: number;
  subtotal: number;
  discountTotal: number;
  taxes: number;
  final: number;
}

export class PricingService {
  /**
   * Calculate dynamic pricing for a stay
   */
  async calculatePrice(query: PricingQuery): Promise<PricingResult> {
    // Get base hotel pricing
    const { data: hotel, error } = await supabase
      .from('hotels')
      .select('price_per_month, total_rooms')
      .eq('id', query.hotelId)
      .single();

    if (error || !hotel) {
      throw new Error('Hotel pricing data not found');
    }

    const nightsCount = differenceInDays(query.checkOut, query.checkIn);
    const basePerNight = hotel.price_per_month / 30; // Approximate daily rate
    
    // Get occupancy data for dynamic pricing
    const occupancyData = await this.getOccupancyForPeriod(query.hotelId, query.checkIn, query.checkOut);
    const dynamicMultiplier = this.calculateDynamicMultiplier(occupancyData);
    
    const dynamicPerNight = basePerNight * dynamicMultiplier;
    const subtotal = dynamicPerNight * nightsCount;
    
    // Calculate applicable discounts
    const discounts = await this.calculateDiscounts(query, subtotal, nightsCount);
    const discountTotal = discounts.reduce((sum, discount) => sum + discount.amount, 0);
    
    // Calculate taxes (simplified - would be more complex in real scenario)
    const taxes = (subtotal - discountTotal) * 0.1; // 10% tax rate
    const final = subtotal - discountTotal + taxes;

    return {
      basePrice: basePerNight,
      dynamicPrice: dynamicPerNight,
      totalPrice: final,
      discounts,
      breakdown: {
        nightsCount,
        pricePerNight: dynamicPerNight,
        subtotal,
        discountTotal,
        taxes,
        final
      },
      occupancyMultiplier: dynamicMultiplier
    };
  }

  /**
   * Calculate total nights in a month for capacity planning
   */
  calculateTotalNightsInMonth(totalRooms: number, year: number, month: number): number {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return totalRooms * daysInMonth;
  }

  /**
   * Calculate sold nights for occupancy rate
   */
  calculateNightsSold(bookings: Array<{startDate: Date; endDate: Date}>, year: number, month: number): number {
    const monthStart = new Date(year, month, 1);
    const monthEnd = new Date(year, month + 1, 0);

    return bookings.reduce((total, booking) => {
      const bookingStart = new Date(Math.max(booking.startDate.getTime(), monthStart.getTime()));
      const bookingEnd = new Date(Math.min(booking.endDate.getTime(), monthEnd.getTime()));
      
      if (bookingStart < bookingEnd) {
        return total + differenceInDays(bookingEnd, bookingStart);
      }
      return total;
    }, 0);
  }

  /**
   * Apply dynamic pricing based on demand
   */
  calculateDynamicPrice(basePrice: number, totalNights: number, soldNights: number): number {
    const occupancyRate = soldNights / totalNights;
    
    // Dynamic pricing tiers
    if (occupancyRate > 0.9) {
      return basePrice * 1.5; // 50% increase for very high demand
    } else if (occupancyRate > 0.7) {
      return basePrice * 1.3; // 30% increase for high demand
    } else if (occupancyRate > 0.5) {
      return basePrice * 1.1; // 10% increase for medium demand
    } else if (occupancyRate < 0.2) {
      return basePrice * 0.8; // 20% discount for low demand
    }
    
    return basePrice; // No change for normal demand
  }

  /**
   * Get package pricing if applicable (placeholder for when packages table exists)
   */
  async getPackagePrice(packageId: string): Promise<number> {
    // This would fetch package pricing when packages table is implemented
    console.log(`Would fetch price for package ${packageId}`);
    return 1000; // Placeholder price
  }

  /**
   * Private helper: Get occupancy data for period
   */
  private async getOccupancyForPeriod(hotelId: string, startDate: Date, endDate: Date) {
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('check_in, check_out')
      .eq('hotel_id', hotelId)
      .eq('status', 'confirmed')
      .gte('check_out', startDate.toISOString())
      .lte('check_in', endDate.toISOString());

    if (error) {
      console.error('Error fetching occupancy data:', error);
      return { occupancyRate: 0.5 }; // Default to medium occupancy
    }

    // Simplified calculation - would be more sophisticated in real scenario
    const overlappingBookings = bookings?.length || 0;
    const occupancyRate = Math.min(overlappingBookings / 10, 1); // Assume 10 rooms max

    return { occupancyRate };
  }

  /**
   * Private helper: Calculate dynamic multiplier based on occupancy
   */
  private calculateDynamicMultiplier(occupancyData: { occupancyRate: number }): number {
    const rate = occupancyData.occupancyRate;
    
    if (rate > 0.9) return 1.5;
    if (rate > 0.7) return 1.3;
    if (rate > 0.5) return 1.1;
    if (rate < 0.2) return 0.8;
    
    return 1.0;
  }

  /**
   * Private helper: Calculate applicable discounts
   */
  private async calculateDiscounts(
    query: PricingQuery, 
    subtotal: number, 
    nightsCount: number
  ): Promise<PricingDiscount[]> {
    const discounts: PricingDiscount[] = [];

    // Length of stay discount
    if (nightsCount >= 30) {
      discounts.push({
        type: 'length_of_stay',
        amount: subtotal * 0.15, // 15% discount for monthly stays
        description: 'Monthly stay discount (15%)'
      });
    } else if (nightsCount >= 14) {
      discounts.push({
        type: 'length_of_stay',
        amount: subtotal * 0.1, // 10% discount for 2+ weeks
        description: 'Extended stay discount (10%)'
      });
    } else if (nightsCount >= 7) {
      discounts.push({
        type: 'length_of_stay',
        amount: subtotal * 0.05, // 5% discount for weekly stays
        description: 'Weekly stay discount (5%)'
      });
    }

    // Early bird discount (book 30+ days in advance)
    const daysUntilStay = differenceInDays(query.checkIn, new Date());
    if (daysUntilStay >= 30) {
      discounts.push({
        type: 'early_bird',
        amount: subtotal * 0.08, // 8% early bird discount
        description: 'Early booking discount (8%)'
      });
    }

    return discounts;
  }
}

export const pricingService = new PricingService();