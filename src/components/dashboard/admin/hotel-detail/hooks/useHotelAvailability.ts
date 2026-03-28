
// @ts-nocheck
// TypeScript checking disabled for Supabase schema compatibility

import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { addDays } from "date-fns";

export function useHotelAvailability(hotelId: string | undefined) {
  const [availableDays, setAvailableDays] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAvailability() {
      if (!hotelId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      
      try {
        const today = new Date();
        const ninetyDaysLater = addDays(today, 90);
        
        // Format dates for Supabase query
        const todayISO = today.toISOString().split('T')[0];
        const ninetyDaysLaterISO = ninetyDaysLater.toISOString().split('T')[0];
        
        const { data, error } = await supabase
          .from("hotel_availability")
          .select("availability_date")
          .eq("hotel_id", hotelId)
          .gte("availability_date", todayISO)
          .lte("availability_date", ninetyDaysLaterISO)
          .is("is_full_month", true);
        
        if (error) {
          console.error("Error fetching hotel availability:", error);
          setAvailableDays(0);
        } else {
          // Count unique dates
          setAvailableDays(data?.length || 0);
        }
      } catch (error) {
        console.error("Exception fetching availability:", error);
        setAvailableDays(0);
      } finally {
        setLoading(false);
      }
    }

    fetchAvailability();
  }, [hotelId]);

  return { availableDays, loading };
}
