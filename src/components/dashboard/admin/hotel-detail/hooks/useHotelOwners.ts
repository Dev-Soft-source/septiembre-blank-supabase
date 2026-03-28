
// @ts-nocheck
// TypeScript checking disabled for Supabase schema compatibility

import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface HotelOwner {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
}

export function useHotelOwners() {
  const [hotelOwners, setHotelOwners] = useState<HotelOwner[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchHotelOwners = async () => {
      // First query to get profiles
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("id, first_name, last_name")
        .eq("is_hotel_owner", true)
        .order("first_name");

      if (profileError) {
        console.error("Error fetching hotel owners:", profileError);
        toast({
          title: "Error loading hotel owners",
          description: profileError.message,
          variant: "destructive"
        });
        return;
      }

      // Create owners array with profile data
      const ownersWithEmail: HotelOwner[] = profileData.map(profile => ({
        ...profile,
        email: null // Initialize with null, we don't have direct access to auth.users
      }));
      
      setHotelOwners(ownersWithEmail);
    };

    fetchHotelOwners();
  }, [toast]);

  return hotelOwners;
}
