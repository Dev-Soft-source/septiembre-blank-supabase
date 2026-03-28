import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ActivityOption {
  id: string;
  name: string;
  category?: string;
  level?: number;
}

export function useActivitiesData() {
  return useQuery({
    queryKey: ['activities'],
    queryFn: async (): Promise<ActivityOption[]> => {
      console.log(`🎯 Fetching activities from database`);
      
      const { data, error } = await supabase
        .from('activities')
        .select('id, name, category, level')
        .order('name');

      if (error) {
        console.error(`❌ Error fetching activities:`, error);
        throw error;
      }

      console.log(`✅ Found ${data?.length || 0} activities:`, data);
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}