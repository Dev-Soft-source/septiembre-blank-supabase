
// @ts-nocheck
// TypeScript checking disabled for Supabase schema compatibility
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface SavedHotel {
  id: string;
  hotel_id: string;
  created_at: string;
  hotels: {
    id: string;
    name: string;
    city: string;
    country: string;
    main_image_url: string | null;
    price_per_month: number;
    available_months: string[] | null;
    status: string;
    category?: number;
  } | null;
}

export function useSavedHotels() {
  const [savedHotels, setSavedHotels] = useState<SavedHotel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const fetchSavedHotels = async () => {
      try {
        setIsLoading(true);
        
        // First get the favorites
        const { data: favoritesData, error: favoritesError } = await supabase
          .from('favorites')
          .select('id, hotel_id, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (favoritesError) throw favoritesError;
        
        if (!favoritesData || favoritesData.length === 0) {
          setSavedHotels([]);
          return;
        }

        // Then get the hotel details for each favorite
        const hotelIds = favoritesData.map(fav => fav.hotel_id);
        const { data: hotelsData, error: hotelsError } = await supabase
          .from('hotels')
          .select('id, name, city, country, main_image_url, price_per_month, available_months, status, category')
          .in('id', hotelIds);
        
        if (hotelsError) throw hotelsError;
        
        // Combine the data
        const combinedData: SavedHotel[] = favoritesData.map(favorite => {
          const hotel = hotelsData?.find(h => h.id === favorite.hotel_id);
          return {
            id: favorite.id,
            hotel_id: favorite.hotel_id,
            created_at: favorite.created_at,
            hotels: hotel || null
          };
        });
        
        setSavedHotels(combinedData);
      } catch (error) {
        console.error("Error fetching saved hotels:", error);
        toast({
          title: "Error",
          description: "Failed to load saved hotels. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSavedHotels();
  }, [user, toast]);

  const removeSavedHotel = async (favoriteId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('id', favoriteId)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      setSavedHotels(prev => prev.filter(hotel => hotel.id !== favoriteId));
      
      toast({
        title: "Hotel removed",
        description: "Hotel removed from your wish list."
      });
    } catch (error) {
      console.error("Error removing saved hotel:", error);
      toast({
        title: "Error",
        description: "Failed to remove hotel. Please try again.",
        variant: "destructive"
      });
    }
  };

  return { savedHotels, isLoading, removeSavedHotel };
}
