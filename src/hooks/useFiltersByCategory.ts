import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface FilterOption {
  id: string;
  value: string;
  category: string;
  source_type: string;
  is_active: boolean;
}

export function useFiltersByCategory(category: string) {
  return useQuery({
    queryKey: ['filters', category],
    queryFn: async (): Promise<FilterOption[]> => {
      console.log(`🔍 Fetching filters for category: ${category}`);
      
      // Map category to appropriate table
      const tableMapping: Record<string, string> = {
        'activities': 'activities',
        'countries': 'countries', 
        'affinities': 'affinities',
        'features': 'features',
        'meal_plans': 'meal_plans',
        'property_types': 'property_types'
      };
      
      const tableName = tableMapping[category];
      if (!tableName) {
        console.warn(`Unknown category: ${category}`);
        return [];
      }

      const { data, error } = await supabase
        .from(tableName)
        .select('id, name_en')
        .order('name_en');

      if (error) {
        console.error(`❌ Error fetching ${category}:`, error);
        throw error;
      }

      console.log(`✅ Found ${data?.length || 0} items for category ${category}:`, data);
      
      // Transform to FilterOption format
      return data?.map(item => ({
        id: item.id,
        value: item.name_en,
        category: category,
        source_type: 'database',
        is_active: true
      })) || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}