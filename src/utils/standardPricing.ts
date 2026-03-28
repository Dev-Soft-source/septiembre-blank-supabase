/**
 * DEMO Standard pricing system - Updated with corrected DEMO pricing logic
 * 
 * Base monthly prices (29 days):
 * - Single room: $1,300 (accommodation only) / $1,600 (half board)
 * - Double room per person: always 20% lower → $1,040 / $1,280
 * 
 * Progressive price adjustment for shorter stays:
 * - 22 days: proportional price from 29 days +5%
 * - 15 days: proportional price from 22 days +5%
 * - 8 days: proportional price from 15 days +5%
 */

export interface PricingParams {
  hotelCategory: number; // 3 or 4 stars
  duration: number; // 8, 15, 22, 29 days
  roomType: 'double' | 'single';
  mealPlan: string; // room_only, breakfast, half_board, full_board, all_inclusive
}

/**
 * DEMO pricing tables - Updated with corrected logic
 */
const STANDARD_PRICING = {
  3: { // 3-star hotels - DEMO pricing
    double: {
      // 8 days: 15% above proportional (base 29-day: $1,280)
      8: { 
        room_only: Math.round((1040 / 29) * 8 * 1.15), // $322
        breakfast: Math.round((1160 / 29) * 8 * 1.15), // $369
        half_board: Math.round((1280 / 29) * 8 * 1.15), // $408
        full_board: Math.round((1400 / 29) * 8 * 1.15), // $447
        all_inclusive: Math.round((1520 / 29) * 8 * 1.15) // $485
      },
      // 15 days: 10% above proportional
      15: { 
        room_only: Math.round((1040 / 29) * 15 * 1.10), // $591
        breakfast: Math.round((1160 / 29) * 15 * 1.10), // $660
        half_board: Math.round((1280 / 29) * 15 * 1.10), // $728
        full_board: Math.round((1400 / 29) * 15 * 1.10), // $796
        all_inclusive: Math.round((1520 / 29) * 15 * 1.10) // $865
      },
      // 22 days: 5% above proportional
      22: { 
        room_only: Math.round((1040 / 29) * 22 * 1.05), // $827
        breakfast: Math.round((1160 / 29) * 22 * 1.05), // $923
        half_board: Math.round((1280 / 29) * 22 * 1.05), // $1018
        full_board: Math.round((1400 / 29) * 22 * 1.05), // $1114
        all_inclusive: Math.round((1520 / 29) * 22 * 1.05) // $1209
      },
      // 29 days: Base prices
      29: { 
        room_only: 1040, 
        breakfast: 1160, 
        half_board: 1280, 
        full_board: 1400, 
        all_inclusive: 1520 
      }
    },
    single: {
      // 8 days: 15% above proportional (base 29-day: $1,600)
      8: { 
        room_only: Math.round((1300 / 29) * 8 * 1.15), // $413
        breakfast: Math.round((1450 / 29) * 8 * 1.15), // $461
        half_board: Math.round((1600 / 29) * 8 * 1.15), // $509
        full_board: Math.round((1750 / 29) * 8 * 1.15), // $558
        all_inclusive: Math.round((1900 / 29) * 8 * 1.15) // $606
      },
      // 15 days: 10% above proportional
      15: { 
        room_only: Math.round((1300 / 29) * 15 * 1.10), // $739
        breakfast: Math.round((1450 / 29) * 15 * 1.10), // $825
        half_board: Math.round((1600 / 29) * 15 * 1.10), // $910
        full_board: Math.round((1750 / 29) * 15 * 1.10), // $996
        all_inclusive: Math.round((1900 / 29) * 15 * 1.10) // $1082
      },
      // 22 days: 5% above proportional
      22: { 
        room_only: Math.round((1300 / 29) * 22 * 1.05), // $1034
        breakfast: Math.round((1450 / 29) * 22 * 1.05), // $1154
        half_board: Math.round((1600 / 29) * 22 * 1.05), // $1273
        full_board: Math.round((1750 / 29) * 22 * 1.05), // $1393
        all_inclusive: Math.round((1900 / 29) * 22 * 1.05) // $1512
      },
      // 29 days: Base prices
      29: { 
        room_only: 1300, 
        breakfast: 1450, 
        half_board: 1600, 
        full_board: 1750, 
        all_inclusive: 1900 
      }
    }
  },
  4: { // 4-star hotels (keeping existing values for now)
    double: {
      8: { room_only: 170, breakfast: 255, half_board: 340, full_board: 425, all_inclusive: 425 },
      15: { room_only: 320, breakfast: 480, half_board: 640, full_board: 800, all_inclusive: 800 },
      22: { room_only: 480, breakfast: 720, half_board: 960, full_board: 1200, all_inclusive: 1200 },
      29: { room_only: 640, breakfast: 960, half_board: 1280, full_board: 1600, all_inclusive: 1600 }
    },
    single: {
      8: { room_only: 230, breakfast: 340, half_board: 460, full_board: 575, all_inclusive: 575 },
      15: { room_only: 430, breakfast: 645, half_board: 860, full_board: 1075, all_inclusive: 1075 },
      22: { room_only: 650, breakfast: 975, half_board: 1300, full_board: 1625, all_inclusive: 1625 },
      29: { room_only: 865, breakfast: 1300, half_board: 1730, full_board: 2160, all_inclusive: 2160 }
    }
  }
} as const;

/**
 * Normalize meal plan names to standard keys
 */
function normalizeMealPlan(mealPlan: string | null | undefined): keyof typeof STANDARD_PRICING[3]['double'][8] {
  if (!mealPlan) return 'half_board'; // Default fallback
  
  const normalized = mealPlan.toLowerCase().trim();
  
  // Map various meal plan names to our standard keys
  if (normalized.includes('room') || normalized.includes('aloj') || normalized === 'solo alojamiento') {
    return 'room_only';
  }
  if (normalized.includes('breakfast') || normalized.includes('desay') || normalized.includes('desayuno')) {
    return 'breakfast';
  }
  if (normalized.includes('half') || normalized.includes('media') || normalized.includes('demipensiune')) {
    return 'half_board';
  }
  if (normalized.includes('full') || normalized.includes('completa') || normalized.includes('pensiune completă')) {
    return 'full_board';
  }
  if (normalized.includes('all') || normalized.includes('todo') || normalized.includes('tudo')) {
    return 'all_inclusive';
  }
  
  // Direct key matches
  if (['room_only', 'breakfast', 'half_board', 'full_board', 'all_inclusive'].includes(normalized)) {
    return normalized as keyof typeof STANDARD_PRICING[3]['double'][8];
  }
  
  return 'half_board'; // Default fallback
}

/**
 * Get standard price for given parameters
 */
export function getStandardPrice(params: PricingParams): number | null {
  const { hotelCategory, duration, roomType, mealPlan } = params;
  // Validate hotel category
  if (![3, 4].includes(hotelCategory)) {
    console.warn(`Invalid hotel category: ${hotelCategory}, defaulting to 3`);
    return getStandardPrice({ ...params, hotelCategory: 3 });
  }
  
  // Validate duration
  if (![8, 15, 22, 29].includes(duration)) {
    console.warn(`Invalid duration: ${duration}, no standard pricing available`);
    return null;
  }
  
  // Validate room type
  if (!['double', 'single'].includes(roomType)) {
    console.warn(`Invalid room type: ${roomType}, defaulting to double`);
    return getStandardPrice({ ...params, roomType: 'double' });
  }
  
  const normalizedMealPlan = normalizeMealPlan(mealPlan);
  
  try {
    const categoryPricing = STANDARD_PRICING[hotelCategory as 3 | 4];
    const roomTypePricing = categoryPricing[roomType];
    const durationPricing = roomTypePricing[duration as 8 | 15 | 22 | 29];
    const price = durationPricing[normalizedMealPlan];
    
    if (typeof price !== 'number' || price <= 0) {
      console.warn(`Invalid price found: ${price} for params:`, params);
      return null;
    }
    
    return price;
  } catch (error) {
    console.error('Error getting standard price:', error, params);
    return null;
  }
}

/**
 * Get all available meal plans for a hotel category and duration
 */
export function getAvailableMealPlans(hotelCategory: number, duration: number): Array<{
  key: string;
  label: string;
  doublePrice: number | null;
  singlePrice: number | null;
}> {
  const mealPlans = [
    { key: 'room_only', label: 'Room Only' },
    { key: 'breakfast', label: 'Breakfast Included' },
    { key: 'half_board', label: 'Half Board' },
    { key: 'full_board', label: 'Full Board' },
    { key: 'all_inclusive', label: 'All Inclusive' }
  ];
  
  return mealPlans.map(plan => ({
    ...plan,
    doublePrice: getStandardPrice({ 
      hotelCategory, 
      duration, 
      roomType: 'double', 
      mealPlan: plan.key 
    }),
    singlePrice: getStandardPrice({ 
      hotelCategory, 
      duration, 
      roomType: 'single', 
      mealPlan: plan.key 
    })
  }));
}

/**
 * Validate if given parameters have standard pricing available
 */
export function hasStandardPricing(hotelCategory: number, duration: number): boolean {
  return [3, 4, 5].includes(hotelCategory) && [8, 15, 22, 29].includes(duration);
}