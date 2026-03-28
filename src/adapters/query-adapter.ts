/**
 * Query Adapter
 * Safely adapts frontend queries to backend database schema
 * Prevents queries for non-existent fields
 */

import { supabase } from '@/integrations/supabase/client';
import { FilterState } from '@/components/filters/FilterTypes';
import { adaptBackendHotelToFrontend } from './backend-field-adapter';
import type { FrontendHotel } from './backend-field-adapter';
import { calculateMonthlyPriceFromPackages } from '@/utils/calculateMonthlyPriceFromPackages';
import { useRealTimeAvailability } from '@/hooks/useRealTimeAvailability';

/**
 * Apply package-based price filtering to hotels
 */
function applyPackageBasedPriceFilter(hotel: FrontendHotel, filters: FilterState): boolean {
  const hasMinPrice = filters.minPrice !== undefined && filters.minPrice !== null && filters.minPrice > 0;
  const hasMaxPrice = filters.maxPrice !== undefined && filters.maxPrice !== null && filters.maxPrice > 0 && filters.maxPrice < 999999;
  
  if (!hasMinPrice && !hasMaxPrice) {
    return true; // No price filters applied
  }

  // Since we can't easily fetch packages here synchronously, we'll use a simplified approach
  // The hotel card will display the correct package-based price, and users will see accurate pricing
  // For now, we'll return all hotels and let the UI handle the display correctly
  
  // TODO: Implement async package-based filtering if needed
  // This would require refactoring the adapter to be async throughout
  return true;
}

/**
 * Safe hotel query that only uses available backend fields
 */
export async function queryHotelsWithBackendAdapter(filters: FilterState = {}): Promise<{
  data: FrontendHotel[];
  error: Error | null;
}> {
  try {
    
    // Use the existing optimized view that works with the backend
    let query = supabase
      .from('hotels_with_filters_view')
      .select('*') as any;
    
    // Apply filters using only fields that exist in backend
    if (filters.country?.trim()) {
      query = query.eq('country', filters.country);
    }

    if (filters.location?.trim()) {
      query = query.eq('city', filters.location);
    }

    if (filters.stars?.length) {
      // Map string stars to integer values for database query
      const starValues = filters.stars.map(s => {
        if (typeof s === 'string') {
          // Extract number from star strings like "3" or "3-star"
          const match = s.match(/(\d+)/);
          return match ? parseInt(match[1]) : parseInt(s);
        }
        return parseInt(s);
      }).filter(n => !isNaN(n));
      
      if (starValues.length > 0) {
        // Since all hotels have NULL stars, this filter will return no results
        // This is correct behavior - the database has no star ratings
        query = query.in('category', starValues);
      }
    }

    // Handle month filter with backend available_months array
    if (filters.month?.trim()) {
      const monthValue = filters.month.toLowerCase().trim();
       // Use contains operator to check if the month is in the available_months array
      query = query.contains('available_months', [monthValue]);
    }

    if (filters.searchTerm?.trim()) {
      const searchTerm = filters.searchTerm.trim().toLowerCase();
      query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,city.ilike.%${searchTerm}%,country.ilike.%${searchTerm}%`);
    }

    // Handle themes/affinities using backend theme_names array
    if (filters.affinities?.length) {
      query = query.overlaps('theme_names', filters.affinities);
    }
    
    // Handle mealPlans filter with backend available_months array
    if (filters.mealPlans?.length) {               
      const mappedPlans = filters.mealPlans;                
      query = query.eq('meal_plans', mappedPlans);        
    }

    // Handle activities using backend activity_names array
    if (filters.activities?.length) {            
      const activityNames = filters.activities;      
      query = query.overlaps('activity_names', [activityNames]);
    }

    // Handle hotel and room features using JSONB amenities field
    if (filters.hotelFeatures?.length){   // || filters.roomFeatures?.length) {
      const hotelF = filters.hotelFeatures;      
      query = query.contains('features_hotel', [hotelF]);
    }

    if (filters.roomFeatures?.length){
      const roomsF = filters.roomFeatures;
      query = query.contains('features_room', [roomsF]);
    }

    // Handle stay lengths and meal plans via availability packages
    if (filters.stayLengths?.trim() || filters.mealPlans?.length) {
      let packageQuery = supabase.from('availability_packages_public_view').select('hotel_id');
      
      if (filters.stayLengths?.trim()) {
        const durationValue = parseInt(filters.stayLengths.split(' ')[0]);
        // Use 'duration' field instead of 'duration_days' since that's what exists in the database
        packageQuery = (packageQuery as any).eq('duration', durationValue);
      }        
      
      const { data: packages, error: packageError } = await packageQuery;
      
      if (packageError) {
        console.error('Package query error:', packageError);
        return { data: [], error: packageError };
      }
      
      // Only apply package hotel filter if we have packages or stay length filters
      if (packages && packages.length > 0) {
        const packageHotelIds = packages.map((p: any) => p.hotel_id) || [];
        
        if (packageHotelIds.length > 0) {
          query = query.in('id', packageHotelIds);
        }
      } else if (filters.stayLengths?.trim()) {
        // If no packages match stay length requirements, return empty
        return { data: [], error: null };
      }
      // For meal plans with no matching packages, continue without filtering (graceful fallback)
    }

    const response = await query;
    
    
    if (response.error) {
      console.error('❌ Backend query error:', response.error);
      return { data: [], error: response.error };
    }

    if (!response.data) {
      return { data: [], error: null };
    }

    
    // Transform backend data to frontend format and apply package-based price filtering
    const transformedHotels = response.data
      .map(hotel => adaptBackendHotelToFrontend(hotel))
      .filter(hotel => applyPackageBasedPriceFilter(hotel, filters));


    return { data: transformedHotels, error: null };

  } catch (error: any) {
    console.error('❌ Query adapter error:', error);
    return { data: [], error: error };
  }
}

/**
 * Safe hotel detail query
 */
export async function queryHotelDetailWithBackendAdapter(hotelId: string): Promise<{
  data: FrontendHotel | null;
  error: Error | null;
}> {
  try {
    console.log('🔍 Fetching hotel detail for ID:', hotelId);
    
    // First get the basic hotel data
    const { data: hotelData, error: hotelError } = await supabase
      .from('hotels_with_filters_view')
      .select('*')
      .eq('id', hotelId)
      .maybeSingle();

    if (hotelError) {
      console.error('❌ Hotel query error:', hotelError);
      return { data: null, error: hotelError };
    }

    if (!hotelData) {
      console.error('❌ Hotel not found:', hotelId);
      return { data: null, error: new Error('Hotel not found') };
    }


    // Get hotel images separately
    const { data: images } = await supabase
      .from('hotel_images')
      .select('id, image_url, is_main, created_at, image_type, display_order, alt_text_en')
      .eq('hotel_id', hotelId)
      .order('display_order');


    // Get themes separately with join
    const { data: themeData } = await supabase
      .from('hotel_themes')
      .select(`
        theme_id,
        themes (
          id,
          name,
          category
        )
      `)
      .eq('hotel_id', hotelId);

    // Get activities separately with join
    const { data: activityData } = await supabase
      .from('hotel_activities')
      .select(`
        activity_id,
        activities (
          id,
          name_en,
          category
        )
      `)
      .eq('hotel_id', hotelId);

    // Combine all data
    const combinedData = {
      ...hotelData,
      hotel_images: images || [],
      hotel_themes: themeData || [],
      hotel_activities: activityData || []
    };

    const transformedHotel = adaptBackendHotelToFrontend(combinedData);
    return { data: transformedHotel, error: null };

  } catch (error: any) {
    console.error('❌ Query adapter error:', error);
    return { data: null, error };
  }
}