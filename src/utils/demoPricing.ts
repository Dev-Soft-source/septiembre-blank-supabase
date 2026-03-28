/**
 * DEMO Pricing Logic Implementation
 * 
 * Base monthly prices (29 days):
 * - Single room: $1,300 (accommodation only) / $1,600 (half board)
 * - Double room per person: always 20% lower → $1,040 / $1,280
 * 
 * Progressive price adjustment for shorter stays:
 * - 22 days: proportional price from 29 days +5%
 * - 15 days: proportional price from 22 days +5%
 * - 8 days: proportional price from 15 days +5%
 * Rule: every week less increases the proportional price by 5%
 */

export interface DemoPricingConfig {
  roomType: 'single' | 'double';
  mealPlan: 'room_only' | 'half_board';
  duration: number;
}

/**
 * Base prices for 29-day stays
 */
const BASE_PRICES_29_DAYS = {
  single: {
    room_only: 1300,
    half_board: 1600
  },
  double: {
    room_only: 1040,  // 20% lower than single
    half_board: 1280  // 20% lower than single
  }
};

/**
 * Calculate demo price based on the specified logic
 */
export function calculateDemoPrice(config: DemoPricingConfig): number {
  const { roomType, mealPlan, duration } = config;
  
  // Get base price for 29 days
  const basePriceFor29Days = BASE_PRICES_29_DAYS[roomType][mealPlan];
  
  // If it's exactly 29 days, return base price
  if (duration === 29) {
    return basePriceFor29Days;
  }
  
  // Calculate proportional base price
  const proportionalPrice = (basePriceFor29Days / 29) * duration;
  
  // Apply progressive adjustment based on duration
  let adjustmentPercent = 0;
  
  if (duration === 22) {
    adjustmentPercent = 5; // +5% from 29 days
  } else if (duration === 15) {
    adjustmentPercent = 10; // +5% from 22 days (+5% + 5%)
  } else if (duration === 8) {
    adjustmentPercent = 15; // +5% from 15 days (+5% + 5% + 5%)
  } else {
    // For other durations, calculate weeks difference from 29 days
    const weeksFromBase = Math.ceil((29 - duration) / 7);
    adjustmentPercent = weeksFromBase * 5;
  }
  
  // Apply adjustment
  const finalPrice = proportionalPrice * (1 + adjustmentPercent / 100);
  
  return Math.round(finalPrice);
}

/**
 * Generate demo packages for a hotel using the corrected pricing logic
 * Fixed to avoid duplicate date ranges - one package per duration only
 */
export function generateDemoPackages(hotelId: string, hotelName: string): Array<{
  id: string;
  hotel_id: string;
  start_date: string;
  end_date: string;
  duration_days: number;
  total_rooms: number;
  available_rooms: number;
  room_type: string;
  occupancy_mode: string;
  base_price_usd: number;
  current_price_usd: number;
  created_at: string;
  updated_at: string;
  isAvailable: boolean;
  isSoldOut: boolean;
  isFallback: boolean;
}> {
  const durations = [8, 15, 22, 29];
  
  // Generate packages with future dates, ensuring no overlap
  const baseDate = new Date();
  baseDate.setMonth(baseDate.getMonth() + 2);
  
  const packages = [];
  
  durations.forEach((duration, index) => {
    // Each duration gets unique dates with gaps between them
    const startDate = new Date(baseDate);
    startDate.setMonth(startDate.getMonth() + (index * 2)); // 2-month gaps between packages
    startDate.setDate(1);
    
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + duration - 1);
    
    // Calculate price using demo pricing logic for double room (default display)
    const doubleRoomPrice = calculateDemoPrice({
      roomType: 'double',
      mealPlan: 'half_board',
      duration
    });
    
    // Create one package per duration (not per room type)
    packages.push({
      id: `demo-${hotelId}-${duration}-${index}`,
      hotel_id: hotelId,
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0],
      duration_days: duration,
      total_rooms: 10,
      available_rooms: 8,
      room_type: 'Double Room', // Default to double, single pricing calculated in component
      occupancy_mode: 'per_person',
      base_price_usd: doubleRoomPrice,
      current_price_usd: doubleRoomPrice,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      isAvailable: true,
      isSoldOut: false,
      isFallback: true
    });
  });
  
  return packages;
}

/**
 * Calculate normalized 29-day monthly price from any package
 */
export function calculateNormalizedMonthlyPrice(packagePrice: number, packageDuration: number, roomType: 'single' | 'double'): number {
  // Reverse engineer the base 29-day price
  // First, calculate what the proportional price would be without adjustment
  const proportionalPrice = (packagePrice / packageDuration) * 29;
  
  // Calculate the adjustment that was applied
  let adjustmentPercent = 0;
  if (packageDuration === 22) {
    adjustmentPercent = 5;
  } else if (packageDuration === 15) {
    adjustmentPercent = 10;
  } else if (packageDuration === 8) {
    adjustmentPercent = 15;
  } else if (packageDuration !== 29) {
    const weeksFromBase = Math.ceil((29 - packageDuration) / 7);
    adjustmentPercent = weeksFromBase * 5;
  }
  
  // Remove the adjustment to get back to the base 29-day price
  const base29DayPrice = proportionalPrice / (1 + adjustmentPercent / 100);
  
  return Math.round(base29DayPrice);
}