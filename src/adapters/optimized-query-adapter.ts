/**
 * Optimized Query Adapter - Fixed for production
 * @ts-ignore on specific problematic lines for Supabase type compatibility
 */

import { supabase } from '@/integrations/supabase/client';
import { FilterState } from '@/components/filters/FilterTypes';
import { adaptBackendHotelToFrontend, type FrontendHotel } from './backend-field-adapter';

interface QueryResult<T> {
  data: T;
  error: Error | null;
}

interface PaginatedResult<T> extends QueryResult<T> {
  hasMore: boolean;
  nextCursor?: string;
  totalCount?: number;
}

/**
 * Optimized hotel query using existing backend views
 * Fixed TypeScript issues and simplified implementation
 */
export async function queryOptimizedHotelsWithAdapter(
  filters: FilterState = {},
  options: {
    limit?: number;
    cursor?: string;
    includeCount?: boolean;
  } = {}
): Promise<PaginatedResult<FrontendHotel[]>> {
  
  try {
    console.log('🚀 Optimized query with filters:', filters, 'options:', options);
    
    const { limit = 50, cursor, includeCount = false } = options;
    
    // Use existing view with proper typing to avoid deep instantiation
    let query = supabase
      .from('hotels_with_filters_view')
      .select('*')
      .limit(limit) as any;

    // Cursor-based pagination for large datasets
    if (cursor) {
      query = query.gt('id', cursor);
    }

    // Apply basic filters using indexed columns
    if (filters.country?.trim()) {
      query = query.eq('country', filters.country);
    }

    if (filters.location?.trim()) {
      query = query.eq('city', filters.location);
    }

    if (filters.minPrice !== undefined && filters.minPrice > 0) {
      query = query.gte('price_per_month', filters.minPrice);
    }
    
    if (filters.maxPrice !== undefined && filters.maxPrice !== 999999 && filters.maxPrice > 0) {
      query = query.lte('price_per_month', filters.maxPrice);
    }

    if (filters.propertyType?.trim()) {
      query = query.eq('property_type', filters.propertyType);
    }

    if (filters.propertyStyle?.trim()) {
      query = query.eq('property_style', filters.propertyStyle);
    }

    if (filters.stars?.length) {
      query = query.in('category', filters.stars.map(s => parseInt(s)));
    }

    // Optimized month filtering using normalized available_months
    if (filters.month?.trim()) {
      const monthValue = filters.month.toLowerCase();
      const currentYear = new Date().getFullYear();
      
      // Map month names to ISO format for the current and next year
      const monthMapping: Record<string, string[]> = {
        'january': [`${currentYear}-01`, `${currentYear + 1}-01`],
        'february': [`${currentYear}-02`, `${currentYear + 1}-02`],
        'march': [`${currentYear}-03`, `${currentYear + 1}-03`],
        'april': [`${currentYear}-04`, `${currentYear + 1}-04`],
        'may': [`${currentYear}-05`, `${currentYear + 1}-05`],
        'june': [`${currentYear}-06`, `${currentYear + 1}-06`],
        'july': [`${currentYear}-07`, `${currentYear + 1}-07`],
        'august': [`${currentYear}-08`, `${currentYear + 1}-08`],
        'september': [`${currentYear}-09`, `${currentYear + 1}-09`],
        'october': [`${currentYear}-10`, `${currentYear + 1}-10`],
        'november': [`${currentYear}-11`, `${currentYear + 1}-11`],
        'december': [`${currentYear}-12`, `${currentYear + 1}-12`]
      };

      const possibleValues = monthMapping[monthValue] || [monthValue];
      query = query.overlaps('available_months', possibleValues);
    }

    // Text search using existing functionality
    if (filters.searchTerm?.trim()) {
      const searchTerm = filters.searchTerm.trim().toLowerCase();
      query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,city.ilike.%${searchTerm}%,country.ilike.%${searchTerm}%`);
    }

    // Optimized theme filtering using pre-computed theme_names
    if (filters.affinities?.length) {
      query = query.overlaps('theme_names', filters.affinities);
    }

    // Optimized activity filtering using pre-computed activity_names
    if (filters.activities?.length) {
      const activityKeyToName = getActivityNameMapping();
      const activityNames = filters.activities.map(key => 
        activityKeyToName[key] || key
      );
      query = query.overlaps('activity_names', activityNames);
    }

    // Feature filtering using existing JSONB approach (simplified for now)
    let hotelIds: string[] | undefined;

    if (filters.hotelFeatures?.length) {
      const { data: hotelFeatureHotels, error: hotelFeatureError } = await supabase
        .from('hotels_with_filters_view')
        .select('id')
        .or(filters.hotelFeatures.map(feature => 
          `features_hotel->>'${feature.toLowerCase().replace(/\s+/g, '_')}' = 'true'`
        ).join(','));
      
      if (hotelFeatureError || !hotelFeatureHotels) {
        console.error('Hotel feature query error:', hotelFeatureError);
        return { data: [], error: hotelFeatureError, hasMore: false };
      }
      
      hotelIds = hotelFeatureHotels.map((h: any) => h.id) || [];
      if (hotelIds.length === 0) {
        return { data: [], error: null, hasMore: false };
      }
    }

    if (filters.roomFeatures?.length) {
      const { data: roomFeatureHotels, error: roomFeatureError } = await supabase
        .from('hotels')
        .select('id')
        .or(filters.roomFeatures.map(feature => 
          `features_room->>'${feature.toLowerCase().replace(/\s+/g, '_')}' = 'true'`
        ).join(','));
      
      if (roomFeatureError || !roomFeatureHotels) {
        console.error('Room feature query error:', roomFeatureError);
        return { data: [], error: roomFeatureError, hasMore: false };
      }
      
      const roomFeatureIds = roomFeatureHotels.map((h: any) => h.id) || [];
      if (roomFeatureIds.length === 0) {
        return { data: [], error: null, hasMore: false };
      }

      hotelIds = hotelIds 
        ? hotelIds.filter(id => roomFeatureIds.includes(id))
        : roomFeatureIds;
    }

    // Apply hotel IDs filter if we have feature filters
    if (hotelIds !== undefined) {
      if (hotelIds.length === 0) {
        return { data: [], error: null, hasMore: false };
      }
      query = query.in('id', hotelIds);
    }

    // Optimized stay length and meal plan filtering
    if (filters.stayLengths?.trim() || filters.mealPlans?.length) {
      const packageFilters = await getPackageFilters(filters);
      if (packageFilters.length === 0) {
        return { data: [], error: null, hasMore: false };
      }
      query = query.in('id', packageFilters);
    }

    // Execute query with ordering for consistent pagination
    query = query.order('id');

    const response = await query;

    if (response.error) {
      console.error('❌ Optimized query error:', response.error);
      return { data: [], error: response.error, hasMore: false };
    }

    if (!response.data) {
      return { data: [], error: null, hasMore: false };
    }

    console.log(`✅ Optimized query successful, found ${response.data.length} hotels`);

    // Transform to frontend format using existing adapter
    const transformedHotels = response.data.map(hotel => 
      adaptBackendHotelToFrontend(hotel)
    );

    // Determine if there are more results for pagination
    const hasMore = response.data.length === limit;
    const nextCursor = hasMore && response.data.length > 0 ? response.data[response.data.length - 1].id : undefined;

    // Get total count if requested (expensive operation, use sparingly)
    let totalCount: number | undefined;
    if (includeCount) {
      const countQuery = supabase
        .from('hotels_with_filters_view')
        .select('id', { count: 'exact', head: true });
      
      const countResult = await countQuery;
      totalCount = countResult.count || undefined;
    }

    return { 
      data: transformedHotels, 
      error: null, 
      hasMore, 
      nextCursor,
      totalCount
    };

  } catch (error: any) {
    console.error('❌ Optimized query adapter error:', error);
    return { data: [], error: error, hasMore: false };
  }
}

/**
 * Optimized hotel detail query with eager loading
 */
export async function queryOptimizedHotelDetailWithAdapter(
  hotelId: string
): Promise<QueryResult<FrontendHotel | null>> {
  
  try {
    console.log('🎯 Optimized detail query for hotel:', hotelId);
    
    const { data, error } = await supabase
      .from('hotels_with_filters_view')
      .select(`
        *,
        hotel_images!inner (
          id,
          image_url,
          is_main,
          created_at
        ),
        hotel_themes!inner (
          theme_id,
          themes!inner (
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
      `)
      // @ts-ignore - Complex Supabase type compatibility
      .eq('id', hotelId)
      .maybeSingle();

    if (error) {
      console.error('❌ Optimized detail query error:', error);
      return { data: null, error };
    }

    if (!data) {
      return { data: null, error: new Error('Hotel not found') };
    }

    const transformedHotel = adaptBackendHotelToFrontend(data);
    console.log('✅ Optimized detail query successful for:', transformedHotel.name);

    return { data: transformedHotel, error: null };

  } catch (error: any) {
    console.error('❌ Optimized detail adapter error:', error);
    return { data: null, error };
  }
}

/**
 * Cached activity name mapping for performance
 */
function getActivityNameMapping(): Record<string, string> {
  return {
    'bachata_dancing': 'Baile Bachata',
    'classical_dancing': 'Baile Clásico',
    'ballroom_dancing': 'Baile de Salón',
    'rock_roll_dancing': 'Baile Rock & Roll',
    'salsa_dancing': 'Baile Salsa',
    'tango_dancing': 'Baile Tango',
    'ballet_dance': 'Ballet & Danza',
    'relaxing_yoga': 'Yoga Relax',
    'spanish_cooking_workshop': 'Taller Cocina Española',
    'hiking': 'Senderismo',
    'spa_massage': 'Spa & Masaje',
    'wine_tasting': 'Cata de Vinos',
    'fitness': 'Fitness',
    'meditation': 'Meditación',
    'live_music': 'Música en Vivo'
  };
}

/**
 * Optimized package filtering helper
 */
async function getPackageFilters(filters: FilterState): Promise<string[]> {
  let packageQuery = supabase
    .from('availability_packages_public_view')
    .select('hotel_id');
  
  if (filters.stayLengths?.trim()) {
    const durationDays = parseInt(filters.stayLengths.split(' ')[0]);
    if (!isNaN(durationDays)) {
      packageQuery = (packageQuery as any).eq('duration_days', durationDays);
    }
  }
  
  if (filters.mealPlans?.length) {
    const mealPlanMapping: Record<string, string> = {
      'accommodationOnly': 'room_only',
      'breakfastIncluded': 'breakfast', 
      'halfBoard': 'half_board',
      'fullBoard': 'full_board',
      'allInclusive': 'all_inclusive',
    };
    
    const mappedPlans = filters.mealPlans.map(plan => 
      mealPlanMapping[plan] || plan
    );
    
    packageQuery = (packageQuery as any).in('meal_plan', mappedPlans);
  }
  
  const { data: packages, error: packageError } = await packageQuery;
  
  if (packageError || !packages) {
    console.error('Package query error:', packageError);
    return [];
  }
  
  return packages.map((p: any) => p.hotel_id) || [];
}

/**
 * Batch query multiple hotels by IDs (for performance)
 */
export async function queryOptimizedHotelsByIds(
  hotelIds: string[]
): Promise<QueryResult<FrontendHotel[]>> {
  
  if (hotelIds.length === 0) {
    return { data: [], error: null };
  }
  
  try {
    const { data, error } = await (supabase as any)
      .from('hotels_with_filters_view')
      .select('*')
      .in('id', hotelIds);

    if (error) {
      return { data: [], error };
    }

    const transformedHotels = (data || []).map(hotel => 
      adaptBackendHotelToFrontend(hotel)
    );

    return { data: transformedHotels, error: null };

  } catch (error: any) {
    return { data: [], error };
  }
}

// Re-export for backward compatibility during migration
export {
  queryOptimizedHotelsWithAdapter as queryHotelsWithBackendAdapter,
  queryOptimizedHotelDetailWithAdapter as queryHotelDetailWithBackendAdapter
};