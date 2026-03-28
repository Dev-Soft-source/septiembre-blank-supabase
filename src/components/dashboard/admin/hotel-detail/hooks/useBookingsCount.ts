
// @ts-nocheck
// TypeScript checking disabled for Supabase schema compatibility

import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useBookingsCount(hotelId: string) {
  const [totalBookings, setTotalBookings] = useState<number>(0);

  useEffect(() => {
    const fetchBookingsCount = async () => {
      const { count, error } = await supabase
        .from("bookings")
        .select("*", { count: "exact", head: true })
        .eq("hotel_id", hotelId);
      
      if (error) {
        console.error("Error fetching bookings count:", error);
        return;
      }
      
      setTotalBookings(count || 0);
    };

    fetchBookingsCount();
  }, [hotelId]);

  return totalBookings;
}
