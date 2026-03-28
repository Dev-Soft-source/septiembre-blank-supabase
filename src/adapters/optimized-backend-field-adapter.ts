/**
 * Optimized Backend Field Adapter
 * Implements normalized field mapping with snake_case consistency
 * and strict type safety as outlined in the normalization plan
 */

import type { Database } from '@/integrations/supabase/types';

type BackendHotel = Database['public']['Tables']['hotels']['Row'];

// Strict TypeScript interfaces aligned with backend schema
export interface StrictHotelTheme {
  theme_id: string;
  themes: {
    id: string;
    name: string;
    category: string | null;
  };
}

export interface StrictHotelActivity {
  activity_id: string;
  activities: {
    id: string;
    name: string;
    category: string | null;
  };
}

export interface StrictHotelImage {
  id: string;
  hotel_id: string;
  image_url: string;
  is_main: boolean;
  created_at: string;
}

// Normalized frontend hotel interface with strict typing
export interface NormalizedFrontendHotel {
  // Required fields (never null/undefined)
  id: string;
  name: string;
  location: string;  // Computed field: "city, country"
  city: string;
  country: string;
  price_per_month: number;
  status: string;
  
  // Optional fields with explicit null handling
  description: string | null;
  category: number | null;
  main_image_url: string | null;
  address: string | null;
  property_type: string | null;
  property_style: string | null;
  total_rooms: number | null;
  rating: number | null;
  
  // Contact fields
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  
  // Array fields with consistent structure
  available_months: string[] | null;
  meal_plans: string[] | null;
  stay_lengths: number[] | null;
  
  // Description fields (snake_case only - no dual mapping)
  ideal_guests: string | null;
  atmosphere: string | null;
  perfect_location: string | null;
  
  // Typed JSONB fields (no more 'any')
  features_hotel: Record<string, boolean> | null;
  features_room: Record<string, boolean> | null;
  rates: Record<string, number> | null;
  banking_info: Record<string, any> | null;
  laundry_service: Record<string, any> | null;
  faqs: Array<Record<string, any>> | null;
  pricing_matrix: Array<Record<string, any>> | null;
  
  // Business fields
  terms: string | null;
  enable_price_increase: boolean | null;
  price_increase_cap: number | null;
  
  // Strict relation types
  hotel_themes: StrictHotelTheme[];
  hotel_activities: StrictHotelActivity[];
  hotel_images: StrictHotelImage[];
  
  // Computed theme field for backward compatibility
  theme: string;
}

/**
 * Normalized field mapping - snake_case only, no dual mappings
 */
const NORMALIZED_FIELD_MAPPING = {
  // Direct mappings (no transformation needed)
  id: 'id',
  name: 'name',
  description: 'description',
  city: 'city',
  country: 'country',
  address: 'address',
  category: 'category',
  price_per_month: 'price_per_month',
  main_image_url: 'main_image_url',
  status: 'status',
  property_type: 'property_type',
  property_style: 'property_style',
  total_rooms: 'total_rooms',
  contact_name: 'contact_name',
  contact_email: 'contact_email',
  contact_phone: 'contact_phone',
  available_months: 'available_months',
  meal_plans: 'meal_plans',
  stay_lengths: 'stay_lengths',
  features_hotel: 'features_hotel',
  features_room: 'features_room',
  terms: 'terms',
  rating: 'rating',
  enable_price_increase: 'enable_price_increase',
  price_increase_cap: 'price_increase_cap',
  rates: 'rates',
  banking_info: 'banking_info',
  laundry_service: 'laundry_service',
  faqs: 'faqs',
  
  // Field transformations (backend -> frontend)
  ideal_guests_description: 'ideal_guests',
  atmosphere_description: 'atmosphere', 
  perfect_location: 'perfect_location',
  pricingmatrix: 'pricing_matrix'
} as const;

/**
 * Normalize array structures for consistent frontend consumption
 */
function normalizeHotelArrays(backendHotel: any) {
  return {
    themes: (backendHotel.hotel_themes || []).map((theme: any): StrictHotelTheme => ({
      theme_id: theme.theme_id || theme.themes?.id || 'unknown',
      themes: {
        id: theme.themes?.id || theme.theme_id || 'unknown',
        name: theme.themes?.name || 'Unknown Theme',
        category: theme.themes?.category || null
      }
    })),
    
    activities: (backendHotel.hotel_activities || []).map((activity: any): StrictHotelActivity => ({
      activity_id: activity.activity_id || activity.activities?.id || 'unknown',
      activities: {
        id: activity.activities?.id || activity.activity_id || 'unknown', 
        name: activity.activities?.name || 'Unknown Activity',
        category: activity.activities?.category || null
      }
    })),
    
    images: (backendHotel.hotel_images || []).map((img: any): StrictHotelImage => ({
      id: img.id || 'unknown',
      hotel_id: img.hotel_id || backendHotel.id,
      image_url: img.image_url || '',
      is_main: img.is_main || false,
      created_at: img.created_at || new Date().toISOString()
    }))
  };
}

/**
 * Normalize month format to consistent ISO format
 */
function normalizeMonthFormat(months: any): string[] | null {
  if (!months || !Array.isArray(months)) return null;
  
  return months.map(month => {
    // If already in ISO format (2024-01), keep it
    if (typeof month === 'string' && /^\d{4}-\d{2}$/.test(month)) {
      return month;
    }
    
    // If full month name, convert to ISO format for current year
    const monthMap: Record<string, string> = {
      'January': '01', 'February': '02', 'March': '03', 'April': '04',
      'May': '05', 'June': '06', 'July': '07', 'August': '08',
      'September': '09', 'October': '10', 'November': '11', 'December': '12'
    };
    
    if (typeof month === 'string' && monthMap[month]) {
      const currentYear = new Date().getFullYear();
      return `${currentYear}-${monthMap[month]}`;
    }
    
    return month; // Return as-is if no conversion possible
  });
}

/**
 * Safely parse and type JSONB fields
 */
function safeParseTypedJson<T>(value: any, defaultValue: T = null as T): T {
  if (value === null || value === undefined) {
    return defaultValue;
  }
  
  if (typeof value === 'string') {
    try {
      return JSON.parse(value) as T;
    } catch {
      return defaultValue;
    }
  }
  
  if (typeof value === 'object') {
    return value as T;
  }
  
  return defaultValue;
}

/**
 * Transform backend hotel data to normalized frontend format
 */
export function adaptBackendHotelToNormalizedFrontend(
  backendHotel: BackendHotel & any
): NormalizedFrontendHotel {
  // Normalize array structures first
  const normalized = normalizeHotelArrays(backendHotel);
  
  const adapted: NormalizedFrontendHotel = {
    // Required fields with guaranteed values
    id: backendHotel.id,
    name: backendHotel.name || 'Unnamed Hotel',
    location: `${backendHotel.city || 'Unknown City'}, ${backendHotel.country || 'Unknown Country'}`,
    city: backendHotel.city || 'Unknown City',
    country: backendHotel.country || 'Unknown Country',
    price_per_month: backendHotel.price_per_month || 0,
    status: backendHotel.status || 'approved',
    
    // Optional fields with explicit null handling
    description: backendHotel.description || null,
    category: backendHotel.category || null,
    main_image_url: backendHotel.main_image_url || null,
    address: backendHotel.address || null,
    property_type: backendHotel.property_type || null,
    property_style: backendHotel.property_style || null,
    total_rooms: backendHotel.total_rooms || null,
    rating: backendHotel.rating || null,
    
    // Contact fields
    contact_name: backendHotel.contact_name || null,
    contact_email: backendHotel.contact_email || null,
    contact_phone: backendHotel.contact_phone || null,
    
    // Array fields with normalization
    available_months: normalizeMonthFormat(backendHotel.available_months),
    meal_plans: backendHotel.meal_plans || null,
    stay_lengths: backendHotel.stay_lengths || null,
    
    // Description fields (snake_case only - no camelCase duals)
    ideal_guests: backendHotel.ideal_guests_description || null,
    atmosphere: backendHotel.atmosphere_description || null, 
    perfect_location: backendHotel.perfect_location || null,
    
    // Typed JSONB fields with safe parsing
    features_hotel: safeParseTypedJson<Record<string, boolean>>(backendHotel.features_hotel),
    features_room: safeParseTypedJson<Record<string, boolean>>(backendHotel.features_room),
    rates: safeParseTypedJson<Record<string, number>>(backendHotel.rates),
    banking_info: safeParseTypedJson<Record<string, any>>(backendHotel.banking_info),
    laundry_service: safeParseTypedJson<Record<string, any>>(backendHotel.laundry_service),
    faqs: safeParseTypedJson<Array<Record<string, any>>>(backendHotel.faqs),
    pricing_matrix: safeParseTypedJson<Array<Record<string, any>>>(backendHotel.pricingmatrix),
    
    // Business fields
    terms: backendHotel.terms || null,
    enable_price_increase: backendHotel.enable_price_increase || null,
    price_increase_cap: backendHotel.price_increase_cap || null,
    
    // Normalized relation arrays
    hotel_themes: normalized.themes,
    hotel_activities: normalized.activities,
    hotel_images: normalized.images,
    
    // Computed theme field for backward compatibility
    theme: normalized.themes.map(t => t.themes.name).join(', ') || ''
  };

  // Handle legacy theme_names from view if available
  if (backendHotel.theme_names && Array.isArray(backendHotel.theme_names)) {
    adapted.theme = backendHotel.theme_names.join(', ');
    adapted.hotel_themes = backendHotel.theme_names.map((name: string) => ({
      theme_id: name.toLowerCase().replace(/\s+/g, '_'),
      themes: {
        id: name.toLowerCase().replace(/\s+/g, '_'),
        name,
        category: null
      }
    }));
  }

  // Handle legacy activity_names from view if available  
  if (backendHotel.activity_names && Array.isArray(backendHotel.activity_names)) {
    adapted.hotel_activities = backendHotel.activity_names.map((name: string) => ({
      activity_id: name.toLowerCase().replace(/\s+/g, '_'),
      activities: {
        id: name.toLowerCase().replace(/\s+/g, '_'),
        name,
        category: null
      }
    }));
  }

  return adapted;
}

/**
 * Optimized SQL select clause with only confirmed backend fields
 */
export function createOptimizedSelectClause(): string {
  const confirmedBackendFields = [
    'id', 'name', 'description', 'city', 'country', 'address', 'postal_code',
    'category', 'price_per_month', 'main_image_url', 'status', 'property_type',
    'property_style', 'total_rooms', 'rating', 'contact_name', 'contact_email',
    'contact_phone', 'contact_website', 'available_months', 'meal_plans',
    'stay_lengths', 'ideal_guests_description', 'atmosphere_description', 
    'perfect_location', 'room_description', 'features_hotel', 'features_room',
    'terms', 'enable_price_increase', 'price_increase_cap', 'price_increase_pct',
    'rates', 'banking_info', 'laundry_service', 'faqs', 'pricingmatrix',
    'is_featured', 'created_at', 'updated_at', 'owner_id'
  ];
  
  return confirmedBackendFields.join(', ');
}

/**
 * Optimized select for hotel queries with relations
 */
export function getOptimizedHotelQuerySelect(): string {
  const baseFields = createOptimizedSelectClause();
  
  const relationFields = `
    hotel_images (
      id,
      image_url,
      is_main, 
      created_at
    ),
    hotel_themes (
      theme_id,
      themes (
        id,
        name,
        description,
        category
      )
    ),
    hotel_activities (
      activity_id,
      activities (
        id,
        name,
        category
      )
    )
  `;
  
  return `${baseFields}, ${relationFields}`;
}

/**
 * Performance-optimized select for hotel list views
 */
export function getOptimizedHotelListSelect(): string {
  // Minimal fields for list performance
  return `
    id, name, city, country, category, price_per_month,
    main_image_url, status, property_type, available_months,
    theme_names, activity_names
  `;
}
