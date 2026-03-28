import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface RobustTranslation {
  value: string;
  label: string;
}

/**
 * Robust version of translations hook with comprehensive error handling
 */
export function useRobustTranslations(category: 'hotel_features' | 'room_features') {
  console.log(`🔍 useRobustTranslations called for: ${category}`);
  
  return useQuery({
    queryKey: ['robust-translations', category],
    queryFn: async (): Promise<RobustTranslation[]> => {
      console.log(`📡 Fetching ${category} with robust error handling`);
      
      try {
        const { data, error } = await supabase
          .from('filter_value_mappings')
          .select('english_value')
          .eq('category', category)
          .eq('is_active', true);

        if (error) {
          console.error(`❌ Supabase error for ${category}:`, error);
          return getFallbackData(category);
        }

        if (!data || data.length === 0) {
          console.warn(`⚠️ No data found for ${category}, using fallback`);
          return getFallbackData(category);
        }

        console.log(`✅ Successfully fetched ${category}:`, data.length, 'items');

        return data.map(item => ({
          value: item.english_value
            .toLowerCase()
            .replace(/[^a-zA-Z0-9\s]/g, '')
            .replace(/\s+/g, '_')
            .replace(/^_+|_+$/g, ''),
          label: item.english_value
        }));

      } catch (err) {
        console.error(`💥 Unexpected error in ${category}:`, err);
        return getFallbackData(category);
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 2,
    retryDelay: 1000,
  });
}

function getFallbackData(category: 'hotel_features' | 'room_features'): RobustTranslation[] {
  console.log(`🛡️ Using fallback data for ${category}`);
  
  if (category === 'hotel_features') {
    return [
      { value: 'pool', label: 'Pool' },
      { value: 'gym', label: 'Gym' },
      { value: 'spa', label: 'Spa' },
      { value: 'restaurant', label: 'Restaurant' },
      { value: 'bar', label: 'Bar' },
      { value: 'wifi', label: 'WiFi' },
      { value: 'parking', label: 'Parking' }
    ];
  }
  
  if (category === 'room_features') {
    return [
      { value: 'air_conditioning', label: 'Air Conditioning' },
      { value: 'private_bathroom', label: 'Private Bathroom' },
      { value: 'balcony', label: 'Balcony' },
      { value: 'kitchen', label: 'Kitchen' },
      { value: 'tv', label: 'TV' },
      { value: 'mini_bar', label: 'Mini Bar' },
      { value: 'safe', label: 'Safe' }
    ];
  }
  
  return [];
}