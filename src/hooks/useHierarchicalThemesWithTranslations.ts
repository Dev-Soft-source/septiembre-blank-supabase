
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "@/hooks/useTranslation";
import { HierarchicalTheme } from "@/utils/theme-types";

export function useHierarchicalThemesWithTranslations() {
  const [themes, setThemes] = useState<HierarchicalTheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { language } = useTranslation();

  useEffect(() => {
    fetchHierarchicalThemes();
  }, [language]);

  const fetchHierarchicalThemes = async () => {
    try {
      setLoading(true);
      setError(null);

      // First try to get themes with translations
      const { data, error: fetchError } = await supabase
        .from('themes')
        .select(`
          id,
          name,
          description,
          category,
          level,
          parent_id,
          sort_order,
          theme_translations(
            name,
            description,
            locale
          )
        `)
        .order('level', { ascending: true })
        .order('sort_order', { ascending: true })
        .order('name', { ascending: true });

      if (fetchError) throw fetchError;

      // Transform data to use translated names when available
      const transformedData = data?.map(theme => {
        const translation = theme.theme_translations?.find(
          (t: any) => t.locale === language
        );
        
        return {
          id: theme.id,
          name: translation?.name || theme.name,
          description: translation?.description || theme.description,
          level: theme.level as 1 | 2 | 3,
          sort_order: theme.sort_order,
          parent_id: theme.parent_id
        };
      }) || [];

      // Organize themes into hierarchical structure
      const organized = organizeThemesHierarchically(transformedData);
      setThemes(organized);
    } catch (err) {
      console.error('Error fetching hierarchical themes with translations:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch themes');
    } finally {
      setLoading(false);
    }
  };

  const organizeThemesHierarchically = (flatThemes: any[]): HierarchicalTheme[] => {
    const themeMap = new Map<string, HierarchicalTheme>();
    
    // Initialize all themes in the map
    flatThemes.forEach(theme => {
      themeMap.set(theme.id, {
        id: theme.id,
        name: theme.name,
        description: theme.description,
        level: theme.level as 1 | 2 | 3,
        sort_order: theme.sort_order,
        children: []
      });
    });

    const rootThemes: HierarchicalTheme[] = [];

    // Build the hierarchy
    flatThemes.forEach(theme => {
      const themeNode = themeMap.get(theme.id)!;
      
      if (theme.parent_id && themeMap.has(theme.parent_id)) {
        // Add to parent's children
        const parent = themeMap.get(theme.parent_id)!;
        parent.children.push(themeNode);
      } else {
        // Root level theme (category)
        rootThemes.push(themeNode);
      }
    });

    return rootThemes;
  };

  const refreshThemes = () => {
    fetchHierarchicalThemes();
  };

  return {
    themes,
    loading,
    error,
    refreshThemes
  };
}
