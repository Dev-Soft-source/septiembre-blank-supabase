import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "@/hooks/useTranslation";

interface ActivityOption {
  id: string;
  name: string;
  category?: string;
}

export function useActivitiesDataWithLanguage() {
  const { language, t } = useTranslation();
  
  return useQuery({
    queryKey: ['activities-with-language', language],
    queryFn: async (): Promise<ActivityOption[]> => {
      console.log(`🎯 Fetching activities for language: ${language}`);
      
      try {
        // Use the activities table instead of non-existent filters table
        console.log(`🎯 Using activities table for language: ${language}`);
        const { data, error } = await supabase
          .from('activities')
          .select('id, name_en, name_es, name_pt, name_ro, category')
          .order('name_en');

        if (error) {
          console.error('🎯 Error fetching from activities:', error);
          throw error;
        }

        console.log(`🎯 Activities data:`, data);
        
        // Transform data with language-specific names
        return data?.map(item => {
          let name = item.name_en; // Default to English
          
          // Select appropriate language field
          switch (language) {
            case 'es':
              name = item.name_es || item.name_en;
              break;
            case 'pt':
              name = item.name_pt || item.name_en;
              break;
            case 'ro':
              name = item.name_ro || item.name_en;
              break;
            default:
              name = item.name_en;
          }
          
          return {
            id: item.id,
            name: name,
            category: item.category
          };
        }) || [];
      } catch (error) {
        console.error('🎯 Error in useActivitiesDataWithLanguage:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}