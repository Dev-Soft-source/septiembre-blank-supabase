
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Theme, HierarchicalTheme } from "@/utils/theme-types";

export function useHierarchicalThemes() {
  const [themes, setThemes] = useState<HierarchicalTheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHierarchicalThemes();
  }, []);

  const fetchHierarchicalThemes = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('themes')
        .select('*')
        .order('level', { ascending: true })
        .order('sort_order', { ascending: true })
        .order('name', { ascending: true });

      if (fetchError) throw fetchError;

      // Organize themes into hierarchical structure
      const organized = organizeThemesHierarchically(data || []);
      setThemes(organized);
    } catch (err) {
      console.error('Error fetching hierarchical themes:', err);
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
