import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { HotelDetailProps, RoomType } from "@/types/hotel";

const fetchHotelDetail = async (id: string | undefined): Promise<HotelDetailProps | null> => {
  if (!id) return null;
  
  try {
    console.log("Fetching hotel detail for ID:", id);
    
    // Try the public view first (works with actual database schema)
    console.log("Attempting to fetch from hotels_with_filters_view...");
    const { data: publicData, error: publicError } = await supabase
      .from("hotels_with_filters_view")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    
    let data = publicData;
    let error = publicError;
    
    if (!error && !data) {
      console.log("Hotel not found in public view, trying hotels table...");
      
      // Fall back to hotels table
      const hotelResult = await supabase
        .from("hotels")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      
      data = hotelResult.data;
      error = hotelResult.error;
    }
      
    if (error) throw error;
    
    if (!data) {
      console.log("No hotel found with ID:", id);
      return null;
    }
    
    console.log("Hotel data loaded successfully:", data.name);
    console.log("Hotel data structure:", Object.keys(data));
    
    // Get hotel images separately
    const { data: imagesData } = await supabase
      .from("hotel_images")
      .select("*")
      .eq("hotel_id", id);
    
    console.log("Hotel images fetched:", imagesData?.length || 0);
    
    // Extract themes from theme_names array or fallback
    const themes = Array.isArray(data.theme_names) 
      ? data.theme_names.map((name, index) => ({
          id: `theme-${index}`,
          name: name,
          description: null,
          category: null
        }))
      : [];

    // Extract activities from activity_names array or fallback  
    const activities = Array.isArray(data.activity_names) ? data.activity_names : [];
    
    // Process hotel images with proper validation
    const processedHotelImages = Array.isArray(imagesData) 
      ? imagesData.filter(img => img && typeof img === 'object' && img.image_url && typeof img.image_url === 'string' && img.image_url.trim() !== '')
      : [];
    
    // Map the actual database fields to expected interface
    const result: HotelDetailProps = {
      // Core identification
      id: data.id || '',
      name: data.name || 'Hotel Name',
      
      // Location fields - map actual DB fields
      address: data.address || '',
      city: data.city || '',
      country: data.country || '', // This field exists in the view
      latitude: data.latitude ? Number(data.latitude) : null,
      longitude: data.longitude ? Number(data.longitude) : null,
      
      // Content fields
      description: data.description || '',
      atmosphere: data.atmosphere_description, // Not in current schema
      ideal_guests: '', // Not in current schema  
      perfect_location: '', // Not in current schema
      
      // Property details - map to actual fields
      property_type: data.property_type || 'hotel',
      property_style: data.property_style || '',
      category: data.stars || 3, // Use stars as category
      
      // Pricing
      price_per_month: Number(data.price_per_month) || 0,
      enable_price_increase: false,
      price_increase_cap: 20,
      enablePriceIncrease: false,
      priceIncreaseCap: 20,
      
      // Images
      main_image_url: data.main_image_url || '',
      hotel_images: processedHotelImages,
      
      // Arrays - map to actual schema
      available_months: Array.isArray(data.available_months) ? data.available_months : [],
      stay_lengths: [7, 14, 21, 28], // Default values
      meal_plans: ['breakfast'], // Default values
      room_types: [], // Not in current schema
      
      // Objects - use actual schema fields
      rates: {},
      features_hotel: data.amenities || {},
      features_room: {},
      pricingMatrix: [],
      
      // Additional fields from actual schema
      banking_info: null,
      laundry_service: {
        available: false,
        self_service: false,
        full_service: false,
        external_redirect: null,
        pricing: null
      },
      
      // Relations - use processed data from arrays
      hotel_themes: data.theme_names || null,
      hotel_activities: data.activity_names || null,
      
            
      // Processed arrays for frontend
      hotelFeatures: [],
      roomFeatures: [],
      activities: activities,
      themes: themes,
      
      // Additional fields - map from actual schema
      additional_amenities: [],
      special_features: [],
      accessibility_features: Array.isArray(data.accessibility_features) ? data.accessibility_features : [],
      house_rules: Array.isArray(data.house_rules) ? data.house_rules : [],
      custom_highlights: [],
      check_in_instructions: null,
      local_recommendations: null,
      cancellation_policy: data.cancellation_policy || null,
      additional_data: {},
      
      // System fields - only include fields that exist in interface
      check_in_weekday: data.check_in_weekday || 'Monday',
      terms: null
    };
    
    console.log("Successfully processed hotel data for:", data.name);
    console.log("Final result fields:", Object.keys(result));
    
    return result;
  } catch (error) {
    console.error("Error fetching hotel details:", error);
    throw error;
  }
};

export function useHotelDetail(id: string | undefined) {
  return useQuery({
    queryKey: ["hotel", id],
    queryFn: () => fetchHotelDetail(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}