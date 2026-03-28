
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

interface FetchBookingParams {
  bookingId?: string;
  userId?: string;
  hotelId?: string;
  checkIn?: string;
  checkOut?: string;
}

export async function fetchBookingData(params: FetchBookingParams) {
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Missing Supabase configuration");
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  // Fetch booking data
  let query = supabase
    .from('bookings')
    .select(`
      *,
      hotels (
        id,
        name,
        location,
        price_per_month,
        country,
        city
      )
    `);

  // Apply filters based on provided parameters
  if (params.bookingId) {
    query = query.eq('id', params.bookingId);
  }
  if (params.userId) {
    query = query.eq('user_id', params.userId);
  }
  if (params.hotelId) {
    query = query.eq('hotel_id', params.hotelId);
  }
  if (params.checkIn) {
    query = query.gte('check_in', params.checkIn);
  }
  if (params.checkOut) {
    query = query.lte('check_out', params.checkOut);
  }

  const { data: bookings, error: bookingsError } = await query;

  if (bookingsError) {
    console.error("Error fetching bookings:", bookingsError);
    throw new Error(`Failed to fetch bookings: ${bookingsError.message}`);
  }

  // Return the first booking if multiple found, or null if none
  return bookings && bookings.length > 0 ? bookings[0] : null;
}
