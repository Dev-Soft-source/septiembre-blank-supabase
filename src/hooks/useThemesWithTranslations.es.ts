
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Theme } from "@/utils/theme-types";

const fetchThemesES = async (): Promise<Theme[]> => {
  const { data, error } = await supabase
    .from('themes')
    .select(`
      id, 
      name, 
      description, 
      category, 
      level, 
      parent_id, 
      sort_order,
      theme_translations!inner(
        name,
        description,
        locale
      )
    `)
    .eq('theme_translations.locale', 'es')
    .order('level', { ascending: true })
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true });

  if (error) {
    console.error("Error fetching themes with translations:", error);
    
    const { data: fallbackData, error: fallbackError } = await supabase
      .from('themes')
      .select('id, name, description, category, level, parent_id, sort_order')
      .order('level', { ascending: true })
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true });
    
    if (fallbackError) {
      throw fallbackError;
    }
    
    return fallbackData?.map(theme => ({
      ...theme,
      level: (theme.level as 1 | 2 | 3) || 1
    })) || [];
  }

  return data?.map(theme => ({
    id: theme.id,
    name: theme.theme_translations?.[0]?.name || theme.name,
    description: theme.theme_translations?.[0]?.description || theme.description || "",
    category: theme.category || "GENERAL",
    level: (theme.level as 1 | 2 | 3) || 1,
    parent_id: theme.parent_id,
    sort_order: theme.sort_order
  })) || [];
};

export const useThemesWithTranslationsES = () => {
  return useQuery({
    queryKey: ['themes-with-translations', 'es'],
    queryFn: () => fetchThemesES(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};
