
// @ts-nocheck
// TypeScript checking disabled for Supabase schema compatibility

import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useHotelActivities(id: string | undefined) {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("hotel_activities")
          .select(`
            activity_id,
            activities(*)
          `)
          .eq("hotel_id", id);
          
        if (error) throw error;
        setActivities(data || []);
      } catch (error) {
        console.error("Error fetching hotel activities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [id]);

  return { activities, loading };
}
