
// @ts-nocheck
// TypeScript checking disabled for Supabase schema compatibility

import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AdminHotelDetail } from "@/types/hotel";

export function useHotelBasicDetails(id: string | undefined) {
  const [hotel, setHotel] = useState<AdminHotelDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchHotelDetails = async () => {
    console.log("useHotelBasicDetails - Starting fetch for ID:", id);
    setLoading(true);
    setHotel(null);
    setError(null);
    
    if (!id) {
      console.log("useHotelBasicDetails - No ID provided");
      setLoading(false);
      setError("No hotel ID provided");
      return;
    }
    
    try {
      console.log("useHotelBasicDetails - Fetching hotel with ID:", id);
      
      const { data: hotelData, error: hotelError } = await supabase
        .from("hotels")
        .select(`
          *,
          hotel_images(*),
          hotel_themes(
            theme_id,
            themes(*)
          ),
          hotel_activities(
            activity_id,
            activities(*)
          )
        `)
        .eq("id", id)
        .maybeSingle();

      if (hotelError) {
        console.error("useHotelBasicDetails - Error fetching hotel details:", hotelError);
        setError(`Database error: ${hotelError.message}`);
        toast({
          title: "Error loading hotel",
          description: hotelError.message || "Failed to fetch hotel details",
          variant: "destructive"
        });
        return;
      }

      if (!hotelData) {
        console.log("useHotelBasicDetails - No hotel found with ID:", id);
        setError("Hotel not found");
        setHotel(null);
        return;
      }

      console.log("useHotelBasicDetails - Successfully fetched hotel data:", hotelData);
      console.log("Dynamic pricing values from DB:", {
        enable_price_increase: hotelData.enable_price_increase,
        price_increase_cap: hotelData.price_increase_cap
      });
      
      // Ensure required structures exist
      const processedHotelData = {
        ...hotelData,
        // room_types was removed from the schema
        hotel_images: hotelData.hotel_images || [],
        hotel_themes: hotelData.hotel_themes || [],
        hotel_activities: hotelData.hotel_activities || [],
        features_hotel: hotelData.features_hotel || {},
        features_room: hotelData.features_room || {},
        pending_changes: hotelData.pending_changes || {},
        // Map dynamic pricing fields correctly
        enablePriceIncrease: hotelData.enable_price_increase ?? false,
        priceIncreaseCap: hotelData.price_increase_cap ?? 20,
        enable_price_increase: hotelData.enable_price_increase ?? false,
        price_increase_cap: hotelData.price_increase_cap ?? 20
      };
      
      console.log("useHotelBasicDetails - Setting processed hotel data with dynamic pricing:", {
        enablePriceIncrease: processedHotelData.enablePriceIncrease,
        priceIncreaseCap: processedHotelData.priceIncreaseCap,
        enable_price_increase: processedHotelData.enable_price_increase,
        price_increase_cap: processedHotelData.price_increase_cap
      });
      setHotel(processedHotelData as AdminHotelDetail);
      setError(null);
    } catch (error: any) {
      console.error("useHotelBasicDetails - Exception occurred:", error);
      const errorMessage = error.message || "An unexpected error occurred";
      setError(errorMessage);
      toast({
        title: "Error loading hotel",
        description: errorMessage,
        variant: "destructive"
      });
      setHotel(null);
    } finally {
      setLoading(false);
      console.log("useHotelBasicDetails - Fetch completed");
    }
  };

  useEffect(() => {
    if (id) {
      console.log("useHotelBasicDetails - ID changed, fetching hotel:", id);
      fetchHotelDetails();
    } else {
      console.log("useHotelBasicDetails - No ID, setting loading to false");
      setLoading(false);
      setHotel(null);
      setError("No hotel ID provided");
    }
  }, [id]);

  const refetch = async () => {
    console.log("useHotelBasicDetails - Manual refetch requested");
    await fetchHotelDetails();
  };

  return { hotel, loading, error, refetch };
}
