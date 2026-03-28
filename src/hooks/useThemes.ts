
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Theme } from "@/utils/theme-types";

// Function to get all themes from the database
const fetchThemesFromDB = async (): Promise<Theme[]> => {
  const { data, error } = await supabase
    .from('themes')
    .select('id, name, description, category, level, parent_id, sort_order')
    .order('name');

  if (error) {
    console.error("Error fetching themes:", error);
    throw error;
  }

  // Transform database themes to match the Theme interface
  return data.map(theme => ({
    id: theme.id,
    name: theme.name,
    description: theme.description || "",
    category: theme.category || "GENERAL",
    level: (theme.level as 1 | 2 | 3) || 1,
    parent_id: theme.parent_id,
    sort_order: theme.sort_order
  }));
};

// Custom hook to fetch themes
export const useThemes = () => {
  return useQuery({
    queryKey: ['themes'],
    queryFn: fetchThemesFromDB,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
    refetchOnWindowFocus: false,
  });
};
