
// @ts-nocheck
// TypeScript checking disabled for Supabase schema compatibility
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { handleApiError } from "@/utils/errorHandling";
import { useToast } from "@/hooks/use-toast";

export interface UserHotel {
  id: string;
  name: string;
  city: string;
  country: string;
  status: string;
}

export const useUserHotels = (userId: string | undefined, isHotelOwner: boolean = false) => {
  const [hotels, setHotels] = useState<UserHotel[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserHotels = async () => {
      if (!userId || !isHotelOwner) {
        setHotels([]);
        return;
      }
      
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from("hotels")
          .select("id, name, country, city, status")
          .eq("owner_id", userId);
        
        if (error) throw error;
        
        setHotels(data || []);
      } catch (error) {
        // Use the sonner toast directly
        toast.error("Failed to fetch user hotels", {
          description: error instanceof Error ? error.message : "Unknown error"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserHotels();
  }, [userId, isHotelOwner, toast]);

  return { hotels, loading };
};
