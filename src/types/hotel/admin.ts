
import { HotelImage, HotelTheme, RoomType } from './base';

export interface AdminHotelDetail {
  id: string;
  name: string;
  description: string | null;
  idealGuests?: string | null;
  atmosphere?: string | null;
  perfectLocation?: string | null;
  city: string;
  country: string;
  category: number | null;
  price_per_month: number;
  main_image_url: string | null;
  average_rating?: number;
  hotelFeatures?: string[];
  roomFeatures?: string[];
  available_months?: string[];
  activities?: string[];
  hotel_images: {
    id: string;
    hotel_id: string;
    image_url: string;
    is_main: boolean;
    created_at: string;
  }[];
  hotel_themes: {
    theme_id: string;
    themes?: {
      id: string;
      name: string;
      description?: string;
      category?: string;
    };
  }[];
  hotel_activities: {
    activity_id: string;
    activities?: {
      id: string;
      name: string;
      category?: string;
    };
  }[];
  latitude?: number | string | null;
  longitude?: number | string | null;
  address?: string | null;
  property_type?: string | null;
  style?: string | null;
  meal_plans?: string[];
  stay_lengths?: number[];
  terms?: string | null;
  features_hotel?: Record<string, boolean>;
  features_room?: Record<string, boolean>;
  rates?: Record<string, number>;
  currency?: string;
  enable_price_increase?: boolean;
  price_increase_cap?: number;
  // ADD THE NEW CAMELCASE COLUMNS FROM THE DATABASE
  enablePriceIncrease?: boolean;
  priceIncreaseCap?: number;
  preferredWeekday?: string;
  check_in_weekday?: string;
  pricingMatrix?: Array<{
    roomType: string;
    stayLength: string;
    mealPlan: string;
    price: number;
  }>;
  
  // Add the following fields to fix TypeScript errors
  status?: string;
  created_at: string;
  updated_at: string;
  owner_id?: string | null;
  pending_changes?: Record<string, any>;
  ideal_guests?: string | null;
  perfect_location?: string | null;
  total_rooms?: number;
}
