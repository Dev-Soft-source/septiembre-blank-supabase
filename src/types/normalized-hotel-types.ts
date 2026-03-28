/**
 * Normalized Hotel Type Definitions
 * Strict TypeScript interfaces aligned with backend schema
 * Implements type safety improvements from normalization plan
 */

// Base interfaces for consistent relation structures
export interface StrictThemeReference {
  id: string;
  name: string;
  description?: string | null;
  category?: string | null;
}

export interface StrictActivityReference {
  id: string;
  name: string;
  category?: string | null;
}

export interface StrictHotelTheme {
  theme_id: string;
  themes: StrictThemeReference;
}

export interface StrictHotelActivity {
  activity_id: string;
  activities: StrictActivityReference;
}

export interface StrictHotelImage {
  id: string;
  hotel_id: string;
  image_url: string;
  is_main: boolean;
  created_at: string;
}

// Typed JSONB field interfaces (no more 'any' types)
export interface HotelFeatures {
  // Common hotel features
  wifi?: boolean;
  pool?: boolean;
  gym?: boolean;
  spa?: boolean;
  restaurant?: boolean;
  bar?: boolean;
  parking?: boolean;
  air_conditioning?: boolean;
  heating?: boolean;
  elevator?: boolean;
  disabled_access?: boolean;
  pet_friendly?: boolean;
  business_center?: boolean;
  conference_rooms?: boolean;
  laundry_service?: boolean;
  room_service?: boolean;
  concierge?: boolean;
  security_24h?: boolean;
  
  // Additional features as key-value pairs
  [key: string]: boolean | undefined;
}

export interface RoomFeatures {
  // Common room features
  balcony?: boolean;
  kitchen?: boolean;
  kitchenette?: boolean;
  microwave?: boolean;
  refrigerator?: boolean;
  coffee_maker?: boolean;
  dishwasher?: boolean;
  washing_machine?: boolean;
  dryer?: boolean;
  iron?: boolean;
  safe?: boolean;
  minibar?: boolean;
  tv?: boolean;
  cable_tv?: boolean;
  streaming_services?: boolean;
  work_desk?: boolean;
  sofa?: boolean;
  bathtub?: boolean;
  shower?: boolean;
  hairdryer?: boolean;
  towels?: boolean;
  bedding?: boolean;
  
  // Additional features as key-value pairs  
  [key: string]: boolean | undefined;
}

export interface HotelRates {
  // Standard rate types
  daily?: number;
  weekly?: number;
  monthly?: number;
  seasonal_low?: number;
  seasonal_high?: number;
  
  // Custom rate periods
  [period: string]: number | undefined;
}

export interface BankingInfo {
  bank_name?: string;
  account_number?: string;
  routing_number?: string;
  swift_code?: string;
  iban?: string;
  account_holder_name?: string;
  
  // Additional banking fields
  [key: string]: string | undefined;
}

export interface LaundryService {
  available?: boolean;
  cost_per_load?: number;
  cost_per_item?: number;
  pickup_delivery?: boolean;
  same_day_service?: boolean;
  
  // Additional laundry options
  [key: string]: boolean | number | string | undefined;
}

export interface HotelFAQ {
  question: string;
  answer: string;
  category?: string;
  order?: number;
  is_featured?: boolean;
}

export interface PricingMatrixEntry {
  duration_days: number;
  base_price: number;
  discount_percentage?: number;
  final_price: number;
  meal_plan?: string;
  season?: string;
  
  // Additional pricing fields
  [key: string]: string | number | undefined;
}

// Main normalized hotel interface with strict typing
export interface NormalizedHotel {
  // Required core fields (never null/undefined)
  id: string;
  name: string;
  location: string;  // Computed field: "city, country"
  city: string;
  country: string;
  price_per_month: number;
  status: string;
  
  // Optional basic fields with explicit null handling
  description: string | null;
  category: number | null;
  main_image_url: string | null;
  address: string | null;
  property_type: string | null;
  property_style: string | null;
  total_rooms: number | null;
  rating: number | null;
  
  // Contact information
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  
  // Array fields with consistent structure (snake_case naming)
  available_months: string[] | null;
  meal_plans: string[] | null;
  stay_lengths: number[] | null;
  
  // Description fields (snake_case only - no camelCase duplicates)
  ideal_guests: string | null;
  atmosphere: string | null;
  perfect_location: string | null;
  
  // Strongly typed JSONB fields (no 'any' types)
  features_hotel: HotelFeatures | null;
  features_room: RoomFeatures | null;
  rates: HotelRates | null;
  banking_info: BankingInfo | null;
  laundry_service: LaundryService | null;
  faqs: HotelFAQ[] | null;
  pricing_matrix: PricingMatrixEntry[] | null;
  
  // Business configuration
  terms: string | null;
  enable_price_increase: boolean | null;
  price_increase_cap: number | null;
  
  // Strictly typed relations with consistent structure
  hotel_themes: StrictHotelTheme[];
  hotel_activities: StrictHotelActivity[];
  hotel_images: StrictHotelImage[];
  
  // Computed theme field for backward compatibility
  theme: string;
}

// Normalized filter state with strict typing
export interface NormalizedFilterState {
  // Location filters
  country?: string | null;
  city?: string | null;
  location?: string | null; // For backward compatibility
  
  // Time filters
  month?: string | null;
  available_months?: string[] | null;
  
  // Theme/affinity filters (consistent structure)
  themes?: string[] | null;
  affinities?: string[] | null; // For backward compatibility
  
  // Price filters
  price_range?: number | { min: number; max: number } | null;
  min_price?: number;
  max_price?: number;
  
  // Property filters
  property_type?: string | null;
  property_style?: string | null;
  stars?: string[] | null;
  category?: number[] | null;
  
  // Feature filters (consistent array structure)
  hotel_features?: string[] | null;
  room_features?: string[] | null;
  
  // Activity filters
  activities?: string[] | null;
  
  // Accommodation filters
  room_types?: string[] | null;
  meal_plans?: string[] | null;
  stay_lengths?: string | null; // Single select
  
  // Search filters
  search_term?: string | null;
  
  // Additional filters
  atmosphere?: string | null;
}

// Query response types with strict typing
export interface NormalizedQueryResult<T> {
  data: T;
  error: Error | null;
}

export interface NormalizedPaginatedResult<T> extends NormalizedQueryResult<T> {
  has_more: boolean;
  next_cursor?: string;
  total_count?: number;
  current_page?: number;
  total_pages?: number;
}

// Hotel list response for optimized queries
export interface NormalizedHotelListResult extends NormalizedPaginatedResult<NormalizedHotel[]> {
  filters_applied: NormalizedFilterState;
  execution_time?: number;
  cache_hit?: boolean;
}

// Hotel detail response
export interface NormalizedHotelDetailResult extends NormalizedQueryResult<NormalizedHotel | null> {
  hotel_id: string;
  includes_relations: boolean;
  cache_hit?: boolean;
}

// Performance monitoring types
export interface QueryPerformanceMetrics {
  query_type: string;
  execution_time: number;
  result_count: number;
  filters_used: string[];
  cache_hit: boolean;
  timestamp: string;
}

export interface AdapterPerformanceReport {
  test_date: string;
  total_queries: number;
  average_execution_time: number;
  cache_hit_rate: number;
  slowest_query: QueryPerformanceMetrics;
  fastest_query: QueryPerformanceMetrics;
  queries: QueryPerformanceMetrics[];
}

// Type guards for runtime validation
export function isNormalizedHotel(obj: any): obj is NormalizedHotel {
  return (
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.location === 'string' &&
    typeof obj.city === 'string' &&
    typeof obj.country === 'string' &&
    typeof obj.price_per_month === 'number' &&
    typeof obj.status === 'string'
  );
}

export function isValidFilterState(obj: any): obj is NormalizedFilterState {
  // Basic validation - all fields are optional
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }
  
  // Validate specific field types if present
  if (obj.min_price !== undefined && typeof obj.min_price !== 'number') {
    return false;
  }
  
  if (obj.max_price !== undefined && typeof obj.max_price !== 'number') {
    return false;
  }
  
  if (obj.hotel_features !== undefined && !Array.isArray(obj.hotel_features)) {
    return false;
  }
  
  return true;
}

// Utility types for adapter development
export type HotelFieldKeys = keyof NormalizedHotel;
export type FilterFieldKeys = keyof NormalizedFilterState;
export type RequiredHotelFields = Pick<NormalizedHotel, 'id' | 'name' | 'location' | 'city' | 'country' | 'price_per_month' | 'status'>;
export type OptionalHotelFields = Omit<NormalizedHotel, keyof RequiredHotelFields>;

// Export utility types
export type RequiredFields = RequiredHotelFields;
export type OptionalFields = OptionalHotelFields;