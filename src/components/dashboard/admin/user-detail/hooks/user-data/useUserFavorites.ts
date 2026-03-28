
// @ts-nocheck
// TypeScript checking disabled for Supabase schema compatibility
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useUserFavorites = (id: string | undefined) => {
  const [favorites, setFavorites] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserFavorites = async () => {
      if (!id) return;
      
      try {
        // Updated favorites query with proper join
        const { data: favoritesData, error: favoritesError } = await supabase
          .from("favorites")
          .select(`
            id,
            created_at,
            hotel:hotels(name, country, city)
          `)
          .eq("user_id", id);

        if (favoritesError) throw favoritesError;
        setFavorites(favoritesData || []);
      } catch (error: unknown) {
        console.error("Error fetching user favorites:", error);
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to fetch user favorites",
          variant: "destructive"
        });
      }
    };

    fetchUserFavorites();
  }, [id, toast]);

  return { favorites };
};
