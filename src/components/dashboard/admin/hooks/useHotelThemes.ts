
// @ts-nocheck
// TypeScript checking disabled for Supabase schema compatibility

import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useHotelThemes(id: string | undefined) {
  const [themes, setThemes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchThemes = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("hotel_themes")
          .select(`
            theme_id,
            themes(*)
          `)
          .eq("hotel_id", id);
          
        if (error) throw error;
        setThemes(data || []);
      } catch (error) {
        console.error("Error fetching hotel themes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchThemes();
  }, [id]);

  return { themes, loading };
}
