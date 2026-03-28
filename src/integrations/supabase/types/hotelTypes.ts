
export type Hotel = {
  id: string;
  owner_id: string;
  name: string;
  description: string | null;
  country: string;
  city: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  price_per_month: number;
  main_image_url: string | null;
  category: number | null;
  property_type: string | null;
  style: string | null;
  ideal_guests: string | null;
  atmosphere: string | null;
  perfect_location: string | null;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  status: 'approved' | 'pending' | 'rejected';
  rejection_reason?: string | null;
  available_months?: string[];
  postal_code?: string | null;
  contact_name?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  features_hotel?: Record<string, boolean>;
  features_room?: Record<string, boolean>;
  meal_plans?: string[];
  room_types?: any[];
  stay_lengths?: number[] | string[];
  faqs?: any[];
  terms?: string | null;
  preferredWeekday?: string | null;
  rates?: Record<string, number>;
  pending_changes?: Record<string, any>;
  // USE CORRECT SNAKE_CASE FIELD NAMES FOR DYNAMIC PRICING
  enable_price_increase?: boolean;
  price_increase_cap?: number;
  // ADD THE NEW CAMELCASE COLUMNS FROM THE DATABASE
  enablePriceIncrease?: boolean;
  priceIncreaseCap?: number;
  // Add the new pricingMatrix column
  pricingMatrix?: Array<{
    roomType: string;
    stayLength: string;
    mealPlan: string;
    price: number;
  }>;
  hotel_images?: {
    id: string;
    hotel_id: string;
    image_url: string;
    is_main: boolean;
    created_at: string;
  }[];
  hotel_themes?: {
    theme_id: string;
    themes?: {
      id: string;
      name: string;
      description?: string | null;
      category?: string;
    };
  }[];
  hotel_activities?: {
    activity_id: string;
    activities?: {
      id: string;
      name: string;
      category?: string;
    };
  }[];
}

export type HotelImage = {
  id: string;
  hotel_id: string;
  image_url: string;
  is_main: boolean;
  created_at: string;
}

export type HotelTheme = {
  id: string;
  hotel_id: string;
  theme_id: string;
}

export type HotelActivity = {
  id: string;
  hotel_id: string;
  activity_id: string;
  created_at: string;
}

export type HotelAvailability = {
  id: string;
  hotel_id: string;
  availability_date: string;
  availability_month: string;
  availability_year: number;
  is_full_month: boolean;
  preferred_weekday: string;
  created_at: string;
  updated_at: string;
}

export type HotelReferral = {
  id: string;
  user_id?: string | null;
  hotel_name: string;
  contact_name: string;
  contact_email: string;
  contact_phone?: string | null;
  city?: string | null;
  additional_info?: string | null;
  created_at: string;
}
