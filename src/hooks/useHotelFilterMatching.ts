import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface FilterMappings {
  meal_plans: Map<string, string>;
  room_types: Map<string, string>;
  property_styles: Map<string, string>;
}

/**
 * Hook to get filter mappings for hotel search/filtering
 * This enables matching hotels regardless of language used in filter vs. hotel data
 */
export function useHotelFilterMatching() {
  return useQuery({
    queryKey: ['hotel-filter-mappings'],
    queryFn: async (): Promise<FilterMappings> => {
      console.log('🔗 Fetching filter mappings for hotel matching');
      
      const { data: mappings, error } = await supabase
        .from('filter_value_mappings')
        .select('category, spanish_value, english_value')
        .eq('is_active', true);

      if (error) {
        console.error('❌ Error fetching filter mappings:', error);
        throw error;
      }

      // Create bidirectional mappings for each category
      const filterMappings: FilterMappings = {
        meal_plans: new Map(),
        room_types: new Map(),
        property_styles: new Map()
      };

      if (mappings) {
        mappings.forEach(mapping => {
          const category = mapping.category as keyof FilterMappings;
          if (filterMappings[category]) {
            // Bidirectional mapping: both directions for flexible matching
            filterMappings[category].set(mapping.spanish_value, mapping.english_value);
            filterMappings[category].set(mapping.english_value, mapping.spanish_value);
          }
        });
      }

      console.log('✅ Filter mappings loaded:', {
        meal_plans: filterMappings.meal_plans.size,
        room_types: filterMappings.room_types.size,
        property_styles: filterMappings.property_styles.size
      });

      return filterMappings;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}

/**
 * Helper function to check if a hotel value matches a filter value
 * considering language mappings
 */
export function doesValueMatch(
  hotelValue: string | string[],
  filterValue: string,
  mappings: Map<string, string>
): boolean {
  const hotelValues = Array.isArray(hotelValue) ? hotelValue : [hotelValue];
  
  return hotelValues.some(value => {
    // Direct match
    if (value === filterValue) return true;
    
    // Check if mapped value matches
    const mappedValue = mappings.get(filterValue);
    if (mappedValue && value === mappedValue) return true;
    
    // Check reverse mapping
    const reverseMappedValue = mappings.get(value);
    if (reverseMappedValue && reverseMappedValue === filterValue) return true;
    
    return false;
  });
}

/**
 * Helper function to extract room types from hotel JSONB room_types field
 */
export function extractRoomTypesFromHotel(roomTypes: any[]): string[] {
  if (!Array.isArray(roomTypes)) return [];
  
  return roomTypes.map(rt => {
    if (typeof rt === 'string') return rt;
    if (typeof rt === 'object' && rt.type) return rt.type;
    return '';
  }).filter(Boolean);
}