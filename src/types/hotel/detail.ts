import { Json } from '@/integrations/supabase/types';
import { HotelImage, HotelTheme, RoomType } from './base';

export interface BankingInfo {
  bank_name?: string | null;
  iban_account?: string | null;
  swift_bic?: string | null;
  bank_country?: string | null;
  account_holder?: string | null;
}

export interface LaundryService {
  available: boolean;
  self_service?: boolean;
  full_service?: boolean;
  external_redirect?: string | null;
  pricing?: string | null;
}

export interface HotelDetailProps {
  id: string;
  name: string;
  description: string | null;
  idealGuests?: string | null;
  atmosphere?: string | null;
  perfectLocation?: string | null;
  ideal_guests?: string | null;
  perfect_location?: string | null;
  city: string;
  country: string;
  category: number | null;
  price_per_month: number;
  main_image_url: string | null;
  average_rating?: number;
  hotelFeatures?: string[];
  roomFeatures?: string[];
  available_months?: string[];
  amenities?: string | null;
  activities?: string[];
  hotel_images: HotelImage[];
  hotel_themes?: string[] | null;
  hotel_activities?: string[] | null;
  themes?: HotelTheme[];
  room_types?: RoomType[] | any[];
  latitude?: number | string | null;
  longitude?: number | string | null;
  address?: string | null;
  property_type?: string | null;
  property_style?: string | null;
  meal_plans?: string[];
  stay_lengths?: number[];
  terms?: string | null;
  features_hotel?: Record<string, boolean> | null;
  features_room?: Record<string, boolean> | null;
  rates?: Record<string, number>;
  currency?: string;
  enable_price_increase?: boolean;
  price_increase_cap?: number;
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
  
  // New fields from updated JotForm - ALL SAFELY TYPED AND NULLABLE
  banking_info?: BankingInfo | null;
  laundry_service?: LaundryService | null;
  additional_amenities?: string[];
  special_features?: string[];
  accessibility_features?: string[];
  check_in_instructions?: string | null;
  local_recommendations?: string | null;
  house_rules?: string[];
  cancellation_policy?: string | null;
  additional_data?: Record<string, any> | null;
  custom_highlights?: string[];
}
