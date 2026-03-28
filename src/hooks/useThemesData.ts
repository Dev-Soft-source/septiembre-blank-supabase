import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ThemeOption {
  id: string;
  name: string;
  category?: string;
  level?: number;
}

export function useThemesData() {
  return useQuery({
    queryKey: ['themes'],
    queryFn: async (): Promise<ThemeOption[]> => {
      console.log(`🎨 Fetching themes from database`);
      
      const { data, error } = await supabase
        .from('themes')
        .select('id, name, category, level')
        .order('name');

      if (error) {
        console.error(`❌ Error fetching themes:`, error);
        throw error;
      }

      console.log(`✅ Found ${data?.length || 0} themes:`, data);
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}