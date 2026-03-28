
// @ts-nocheck
// TypeScript checking disabled for Supabase schema compatibility
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Theme } from "@/utils/theme-types";

export interface ThemeWithCategory extends Theme {
  category: string;
}

interface UsePaginationOptions {
  enabled: boolean;
  pageSize: number;
}

interface UserThemesResult {
  themes: ThemeWithCategory[];
  userPreferences: any;
  loading: boolean;
  totalThemes: number;
  page: number;
  setPage: (page: number) => void;
  hasMore: boolean;
}

export const useUserThemes = (
  id: string | undefined, 
  pagination: UsePaginationOptions = { enabled: false, pageSize: 10 }
): UserThemesResult => {
  const [themes, setThemes] = useState<ThemeWithCategory[]>([]);
  const [userPreferences, setUserPreferences] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalThemes, setTotalThemes] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserThemes = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        // Fetch user preferences with themes
        const { data: prefsData, error: prefsError } = await supabase
          .from("user_preferences")
          .select("favorite_themes")
          .eq("user_id", id)
          .single();
        
        if (prefsError && prefsError.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
          throw prefsError;
        }
        
        // Set preferences even if empty, for UI display
        setUserPreferences(prefsData || { favorite_themes: [] });
        
        if (prefsData && prefsData.favorite_themes && prefsData.favorite_themes.length > 0) {
          setTotalThemes(prefsData.favorite_themes.length);
          
          // Determine which theme IDs to fetch based on pagination
          let themeIdsToFetch = prefsData.favorite_themes;
          
          if (pagination.enabled) {
            const start = (page - 1) * pagination.pageSize;
            const end = start + pagination.pageSize;
            themeIdsToFetch = prefsData.favorite_themes.slice(start, end);
          }
          
          // Fetch extended theme details based on IDs
          if (themeIdsToFetch.length > 0) {
            const { data: themesData, error: themesError } = await supabase
              .from("themes")
              .select("id, name, description, category")
              .in("id", themeIdsToFetch);

            if (themesError) throw themesError;
            setThemes(themesData as ThemeWithCategory[] || []);
          } else {
            setThemes([]);
          }
        } else {
          setThemes([]);
          setTotalThemes(0);
        }
      } catch (error: any) {
        console.error("Error fetching user themes:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to fetch user themes",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserThemes();
  }, [id, page, pagination.enabled, pagination.pageSize, toast]);

  // Calculate if there are more themes to load with pagination
  const hasMore = pagination.enabled && (page * pagination.pageSize) < totalThemes;

  return { 
    themes, 
    userPreferences, 
    loading, 
    totalThemes, 
    page, 
    setPage, 
    hasMore 
  };
};
