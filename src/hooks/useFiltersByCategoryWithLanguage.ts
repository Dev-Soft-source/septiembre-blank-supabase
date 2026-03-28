import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "@/hooks/useTranslation";
import { getTranslationKey, getTranslationPath } from "@/utils/filterTranslationMappings";

interface FilterOption {
  id: string;
  value: string;
  category: string;
  source_type: string;
  is_active: boolean;
}

export function useFiltersByCategoryWithLanguage(category: string) {
  const { language, t } = useTranslation('filters');
  
  return useQuery({
    queryKey: ['filters-with-translations', category, language],
    queryFn: async (): Promise<FilterOption[]> => {
      console.log(`🔍 Fetching filters with translations for category: ${category}, language: ${language}`);
      
      // Map category to appropriate table
      const tableMapping: Record<string, string> = {
        'activities': 'activities',
        'countries': 'countries', 
        'affinities': 'affinities',
        'features': 'features',
        'meal_plans': 'meal_plans',
        'property_types': 'property_types',
        'rooms': 'rooms',
      };
      
      const tableName = tableMapping[category];
      if (!tableName) {
        console.warn(`Unknown category: ${category}`);
        return [];
      }

      // Get data from the appropriate table
      const { data: filters, error: filtersError } = await supabase
        .from(tableName)
        .select('id, name_en, name_es, name_pt, name_ro')
        .order('name_en');

      if (filtersError) {
        console.error(`❌ Error fetching ${category}:`, filtersError);
        throw filtersError;
      }

      if (!filters) {
        console.log(`✅ No items found for category ${category}`);
        return [];
      }

      // Transform to FilterOption format with language-specific names
      const translatedData: FilterOption[] = filters.map(item => {
        let displayValue = item.name_en; // Default to English
        
        // Select appropriate language field
        switch (language) {
          case 'es':
            displayValue = item.name_es || item.name_en;
            break;
          case 'pt':
            displayValue = item.name_pt || item.name_en;
            break;
          case 'ro':
            displayValue = item.name_ro || item.name_en;
            break;
          default:
            displayValue = item.name_en;
        }

        return {
          id: item.id,
          value: displayValue,
          category: category,
          source_type: 'database',
          is_active: true
        };
      });

      console.log(`✅ Found ${translatedData.length} translated items for category ${category} (${language}):`, translatedData.map(f => f.value));
      return translatedData;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}