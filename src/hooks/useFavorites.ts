
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

export function useFavorites() {
  const [favoriteHotelIds, setFavoriteHotelIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchFavorites();
    } else {
      setFavoriteHotelIds(new Set());
      setIsLoading(false);
    }
  }, [user]);

  const fetchFavorites = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('hotel_id')
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      const hotelIds: Set<string> = new Set();
      data.forEach(fav => {
        if (typeof fav.hotel_id === 'string') {
          hotelIds.add(fav.hotel_id);
        }
      });
      setFavoriteHotelIds(hotelIds);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFavorite = async (hotelId: string) => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to save hotels to your wishlist.",
        variant: "destructive"
      });
      return;
    }

    const isFavorite = favoriteHotelIds.has(hotelId);
    
    try {
      if (isFavorite) {
        // Remove from favorites
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('hotel_id', hotelId);
        
        if (error) throw error;
        
        setFavoriteHotelIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(hotelId);
          return newSet;
        });
        
        toast({
          title: "Hotel removed",
          description: "Hotel removed from your wishlist."
        });
      } else {
        // Add to favorites
        const { error } = await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            hotel_id: hotelId
          });
        
        if (error) throw error;
        
        setFavoriteHotelIds(prev => new Set([...prev, hotelId]));
        
        toast({
          title: "Hotel saved",
          description: "Hotel added to your wishlist!"
        });
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast({
        title: "Error",
        description: "Failed to update wishlist. Please try again.",
        variant: "destructive"
      });
    }
  };

  return {
    favoriteHotelIds,
    isLoading,
    toggleFavorite,
    isFavorite: (hotelId: string) => favoriteHotelIds.has(hotelId),
    refreshFavorites: fetchFavorites
  };
}
