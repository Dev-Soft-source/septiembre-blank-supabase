/**
 * Pricing rules and utilities for Hotel Living platform
 * Implements maximum price tables, rounding rules, and room type differentiation
 */

// Official Hotel Living Maximum Reference Prices per stay per room
export const MAX_PRICES_3_STAR = {
  8: 520,    // 8 days
  15: 1050,  // 15 days
  22: 1540,  // 22 days
  29: 2030,  // 29 days
} as const;

export const MAX_PRICES_4_STAR = {
  8: 750,    // 8 days
  15: 1500,  // 15 days
  22: 2200,  // 22 days
  29: 2900,  // 29 days
} as const;

export type HotelCategory = 3 | 4;
export type StayDuration = keyof typeof MAX_PRICES_3_STAR;

/**
 * Get maximum allowed price for a hotel category and stay duration
 */
export function getMaxPrice(category: HotelCategory, duration: StayDuration): number {
  if (category === 4) {
    return MAX_PRICES_4_STAR[duration];
  }
  return MAX_PRICES_3_STAR[duration];
}

/**
 * Round price up to the nearest 5 or 10
 * Examples: €137 → €140, €142 → €145, €148 → €150
 */
export function roundPriceUp(price: number): number {
  if (price <= 0) return 0;
  
  // For prices ending in 1-2, round to nearest 5
  // For prices ending in 3-7, round to nearest 5
  // For prices ending in 8-9, round to nearest 10
  
  const remainder = price % 10;
  
  if (remainder === 0) {
    return price; // Already rounded
  } else if (remainder <= 5) {
    // Round up to nearest 5
    return Math.ceil(price / 5) * 5;
  } else {
    // Round up to nearest 10
    return Math.ceil(price / 10) * 10;
  }
}

/**
 * Calculate valid price range for a hotel
 * @param category Hotel category (3 or 4 star)
 * @param duration Stay duration in days
 * @param isDemoHotel Whether this is a demo hotel (null owner_id)
 */
export function getPriceRange(category: HotelCategory, duration: StayDuration, isDemoHotel: boolean = false): {
  min: number;
  max: number;
} {
  const maxPrice = getMaxPrice(category, duration);
  
  if (isDemoHotel) {
    // Demo hotels: 50-90% of maximum
    return {
      min: Math.round(maxPrice * 0.5),
      max: Math.round(maxPrice * 0.9)
    };
  } else {
    // Real hotels: up to 100% of maximum
    return {
      min: Math.round(maxPrice * 0.1), // Allow very low prices for flexibility
      max: maxPrice
    };
  }
}

/**
 * Calculate single room price from double room price
 * Single room = 130% of double room price (per-person cost is higher for single occupancy)
 */
export function calculateSingleRoomPrice(doubleRoomPrice: number): number {
  return roundPriceUp(doubleRoomPrice * 1.3);
}

/**
 * Calculate double room price from single room price
 */
export function calculateDoubleRoomPrice(singleRoomPrice: number): number {
  return roundPriceUp(singleRoomPrice / 1.3);
}

/**
 * Validate if a price is within allowed range for hotel category
 */
export function validatePrice(
  price: number, 
  category: HotelCategory, 
  duration: StayDuration,
  isDemoHotel: boolean = false
): { isValid: boolean; message?: string } {
  const range = getPriceRange(category, duration, isDemoHotel);
  
  if (price < range.min) {
    return {
      isValid: false,
      message: `Price €${price} is below minimum allowed €${range.min} for ${category}-star hotel`
    };
  }
  
  if (price > range.max) {
    return {
      isValid: false,
      message: `Price €${price} exceeds maximum allowed €${range.max} for ${category}-star hotel`
    };
  }
  
  return { isValid: true };
}

/**
 * Check if a hotel is a demo hotel (has null owner_id)
 */
export function isDemoHotel(hotel: { owner_id?: string | null }): boolean {
  return hotel.owner_id === null || hotel.owner_id === undefined;
}

/**
 * Get meal plan translations
 */
export const MEAL_PLANS = {
  en: {
    'room_only': 'Room only',
    'breakfast': 'Breakfast included',
    'half_board': 'Half board',
    'full_board': 'Full board',
    'all_inclusive': 'All inclusive'
  },
  es: {
    'room_only': 'Solo alojamiento',
    'breakfast': 'Desayuno incluido',
    'half_board': 'Media pensión',
    'full_board': 'Pensión completa',
    'all_inclusive': 'Todo incluido'
  },
  pt: {
    'room_only': 'Apenas alojamento',
    'breakfast': 'Pequeno-almoço incluído',
    'half_board': 'Meia pensão',
    'full_board': 'Pensão completa',
    'all_inclusive': 'Tudo incluído'
  },
  ro: {
    'room_only': 'Doar cazare',
    'breakfast': 'Mic dejun inclus',
    'half_board': 'Demipensiune',
    'full_board': 'Pensiune completă',
    'all_inclusive': 'All inclusive'
  }
} as const;

/**
 * Get room type labels
 */
export const ROOM_TYPE_LABELS = {
  en: {
    single: 'Price per person (single room)',
    double: 'Price per person (double room)'
  },
  es: {
    single: 'Precio por persona (habitación individual)',
    double: 'Precio por persona (habitación doble)'
  },
  pt: {
    single: 'Preço por pessoa (quarto individual)',
    double: 'Preço por pessoa (quarto duplo)'
  },
  ro: {
    single: 'Preț per persoană (cameră single)',
    double: 'Preț per persoană (cameră dublă)'
  }
} as const;

/**
 * Get meal plan label in specified language
 */
export function getMealPlanLabel(
  mealPlan: string, 
  language: keyof typeof MEAL_PLANS = 'en'
): string {
  const normalizedPlan = mealPlan.toLowerCase().replace(/\s+/g, '_');
  const plans = MEAL_PLANS[language];
  
  // Try exact match first
  if (plans[normalizedPlan as keyof typeof plans]) {
    return plans[normalizedPlan as keyof typeof plans];
  }
  
  // Try partial matches
  if (normalizedPlan.includes('room') || normalizedPlan.includes('accommodation')) {
    return plans.room_only;
  }
  if (normalizedPlan.includes('breakfast')) {
    return plans.breakfast;
  }
  if (normalizedPlan.includes('half') || normalizedPlan.includes('media')) {
    return plans.half_board;
  }
  if (normalizedPlan.includes('full') || normalizedPlan.includes('completa')) {
    return plans.full_board;
  }
  if (normalizedPlan.includes('all') || normalizedPlan.includes('todo')) {
    return plans.all_inclusive;
  }
  
  // Default fallback
  return mealPlan;
}

/**
 * Get room type label in specified language
 */
export function getRoomTypeLabel(
  roomType: 'single' | 'double',
  language: keyof typeof ROOM_TYPE_LABELS = 'en'
): string {
  return ROOM_TYPE_LABELS[language][roomType];
}