/**
 * Backend Field Adapter
 * Maps backend database fields to frontend interface expectations
 * Ensures frontend-backend compatibility without modifying backend schema
 */

import type { Database, Json } from '@/integrations/supabase/types';

type BackendHotel = Database['public']['Tables']['hotels']['Row'];

// Define the expected frontend hotel interface based on current usage
export interface FrontendHotel {
  id: string;
  name: string;
  location: string;
  city: string;
  country: string;
  description: string | null;
  category: number | null;
  price_per_month: number;
  thumbnail: string;
  main_image_url: string | null;
  status: string;
  theme: string;
  
  // Extended fields for detail views
  idealGuests?: string | null;
  atmosphere?: string | null;
  perfectLocation?: string | null;
  ideal_guests?: string | null;
  perfect_location?: string | null;
  address?: string | null;
  amenities?: string | null;
  property_type?: string | null;
  property_style?: string | null;
  total_rooms?: number | null;
  contact_name?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  available_months?: string[] | null;
  meal_plans?: string[] | null;
  stay_lengths?: number[] | null;
  features_hotel?: Record<string, boolean> | null;
  features_room?: Record<string, boolean> | null;
  terms?: string | null;
  rating?: number | null;
  enable_price_increase?: boolean | null;
  price_increase_cap?: number | null;
  rates?: Record<string, number> | null;
  banking_info?: any | null;
  laundry_service?: any | null;
  faqs?: any[] | null;
  pricingMatrix?: any[] | null;
  
  // Relations - compatible with existing HotelDetailProps
  hotel_themes: Array<{ 
    theme_id: string;
    themes: { 
      id: string; 
      name: string;
      description?: string | null;
      category?: string;
    } 
  }>;
  hotel_activities?: Array<{ 
    activity_id: string;
    activities?: { 
      id: string;
      name: string;
      category?: string;
    } 
  }>;
  hotel_images: Array<{
    id: string;
    hotel_id: string;
    image_url: string;
    is_main: boolean;
    created_at: string;
  }>;
}

/**
 * Core field mapping between backend and frontend
 */
const FIELD_MAPPING = {
  // Direct mappings (same field name, no transformation needed)
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
  total_rooms: 'total_rooms',
  contact_name: 'contact_name',
  contact_email: 'contact_email',
  contact_phone: 'contact_phone',
  amenities: 'amenities',
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

  // Field name transformations (backend snake_case -> frontend camelCase)
  ideal_guests_description: ['idealGuests', 'ideal_guests'], // Map to both formats
  atmosphere_description: 'atmosphere',
  perfect_location: ['perfectLocation', 'perfect_location'], // Map to both formats
  property_style: 'property_style',
  pricingmatrix: 'pricingMatrix'
} as const;

/**
 * Transform backend hotel data to frontend format
 */
export function adaptBackendHotelToFrontend(backendHotel: BackendHotel & any): FrontendHotel {
  const adapted: FrontendHotel = {
    // Required fields
    id: backendHotel.id,
    name: backendHotel.name || 'Unnamed Hotel',
    location: `${backendHotel.city || 'Unknown City'}, ${backendHotel.country || 'Unknown Country'}`,
    city: backendHotel.city || 'Unknown City',
    country: backendHotel.country || 'Unknown Country',
    description: backendHotel.description,
    category: backendHotel.category,
    price_per_month: backendHotel.price_per_month || 0,
    thumbnail: backendHotel.main_image_url || '',
    main_image_url: backendHotel.main_image_url,
    status: backendHotel.status || 'approved',
    theme: '', // Will be set from relations

    // Optional fields with safe mapping
    idealGuests: backendHotel.ideal_guests_description,
    atmosphere: backendHotel.atmosphere_description,
    perfectLocation: backendHotel.perfect_location,    
    ideal_guests: backendHotel.ideal_guests, // Legacy support
    perfect_location: backendHotel.perfect_location, // Legacy support
    address: backendHotel.address,
    property_type: backendHotel.property_type,
    property_style: backendHotel.property_style,
    total_rooms: backendHotel.total_rooms,
    contact_name: backendHotel.contact_name,
    contact_email: backendHotel.contact_email,
    contact_phone: backendHotel.contact_phone,
    available_months: backendHotel.available_months,
    
    meal_plans: backendHotel.meal_plans,
    stay_lengths: backendHotel.stay_lengths,
    terms: backendHotel.terms,
    rating: backendHotel.rating,
    enable_price_increase: backendHotel.enable_price_increase,
    price_increase_cap: backendHotel.price_increase_cap,
    
    // Handle JSON fields safely
    amenities: backendHotel.amenities,
    features_hotel: safeParseJson(backendHotel.features_hotel),
    features_room: safeParseJson(backendHotel.features_room),
    rates: safeParseJson(backendHotel.rates),
    banking_info: safeParseJson(backendHotel.banking_info),
    laundry_service: safeParseJson(backendHotel.laundry_service),
    faqs: safeParseJson(backendHotel.faqs),
    pricingMatrix: safeParseJson(backendHotel.pricingmatrix),

    // Handle relations (these come from joined data) - ensure required fields
    hotel_themes: (backendHotel.hotel_themes || []).map((theme: any) => ({
      theme_id: theme.theme_id || 'unknown',
      themes: {
        id: theme.themes?.id || 'unknown',
        name: theme.themes?.name || 'Unknown Theme',
        description: theme.themes?.description || null,
        category: theme.themes?.category || null
      }
    })),
    hotel_activities: (backendHotel.hotel_activities || []).map((activity: any) => ({
      activity_id: activity.activity_id || 'unknown',
      activities: {
        id: activity.activities?.id || 'unknown',
        name: activity.activities?.name_en || activity.activities?.name || 'Unknown Activity',
        category: activity.activities?.category || null
      }
    })),
    hotel_images: (backendHotel.hotel_images || []).map((img: any) => ({
      ...img,
      hotel_id: img.hotel_id || backendHotel.id // Ensure hotel_id is present
    }))
  };

  // Set theme from relations
  if (backendHotel.theme_names && Array.isArray(backendHotel.theme_names)) {
    adapted.theme = backendHotel.theme_names.join(', ');
    adapted.hotel_themes = backendHotel.theme_names.map((name: string) => ({ 
      theme_id: name.toLowerCase().replace(/\s+/g, '_'),
      themes: { 
        id: name.toLowerCase().replace(/\s+/g, '_'), 
        name,
        description: null,
        category: null 
      } 
    }));
  }

  // Set activities from relations
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
 * Safely parse JSON fields that might be null, string, or object
 */
function safeParseJson(value: any): any {
  if (value === null || value === undefined) {
    return null;
  }
  
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  }
  
  if (typeof value === 'object') {
    return value;
  }
  
  return null;
}

/**
 * Create SQL select clause that only requests available backend fields
 */
export function createSafeSelectClause(): string {
  // Only select fields that actually exist in the backend
  const backendFields = [
    'id', 'name', 'description', 'city', 'country', 'address', 'postal_code',
    'category', 'price_per_month', 'main_image_url', 'status', 'property_type',
    'property_style', 'total_rooms', 'rating', 'contact_name', 'contact_email',
    'contact_phone', 'contact_website', 'available_months', 'meal_plans', 
    'stay_lengths', 'ideal_guests', 'atmosphere_description',
    'perfect_location', 'room_description', 'features_hotel', 'features_room',
    'terms', 'enable_price_increase', 'price_increase_cap', 'price_increase_pct',
    'rates', 'banking_info', 'laundry_service', 'faqs', 'pricingmatrix',
    'is_featured', 'created_at', 'updated_at', 'owner_id'
  ];
  
  return backendFields.join(', ');
}

/**
 * Get fields for hotel queries with relations
 */
export function getHotelQuerySelect(): string {
  const baseFields = createSafeSelectClause();
  
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
 * Get minimal fields for hotel list queries (performance optimization)
 */
export function getHotelListSelect(): string {
  return `
    id, name, city, country, category, price_per_month, 
    main_image_url, status, property_type, available_months
  `;
}