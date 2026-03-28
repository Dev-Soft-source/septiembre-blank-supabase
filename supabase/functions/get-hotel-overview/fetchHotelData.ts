
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

interface HotelData {
  id: string;
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
  status: string;
  created_at: string;
  updated_at: string;
  owner_id: string;
  available_months: string[];
  features_hotel: Record<string, boolean>;
  features_room: Record<string, boolean>;
  room_types: any[];
  meal_plans: string[];
  stay_lengths: number[];
  terms: string | null;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  postal_code: string | null;
  enable_price_increase: boolean;
  price_increase_cap: number;
  hotel_images: {
    id: string;
    image_url: string;
    is_main: boolean;
    created_at: string;
  }[];
  hotel_themes: {
    theme_id: string;
    themes: {
      id: string;
      name: string;
      description: string | null;
      category: string;
    };
  }[];
  hotel_activities: {
    activity_id: string;
    activities: {
      id: string;
      name: string;
      category: string;
    };
  }[];
  bookings?: {
    id: string;
    user_id: string;
    check_in: string;
    check_out: string;
    status: string;
    total_price: number;
    created_at: string;
  }[];
}

export async function fetchHotelData(hotelId: string): Promise<HotelData | null> {
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Missing Supabase configuration");
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  try {
    // Fetch comprehensive hotel data with all related information
    const { data: hotelData, error: hotelError } = await supabase
      .from('hotels')
      .select(`
        *,
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
        ),
        bookings (
          id,
          user_id,
          check_in,
          check_out,
          status,
          total_price,
          created_at
        )
      `)
      .eq('id', hotelId)
      .maybeSingle();

    if (hotelError) {
      console.error("Error fetching hotel data:", hotelError);
      throw new Error(`Failed to fetch hotel data: ${hotelError.message}`);
    }

    return hotelData;
  } catch (error: any) {
    console.error("Exception in fetchHotelData:", error);
    throw new Error(`Database query failed: ${error.message}`);
  }
}
