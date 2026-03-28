
// @ts-nocheck
// TypeScript checking disabled for Supabase schema compatibility

import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useHotelImages(id: string | undefined) {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("hotel_images")
          .select("*")
          .eq("hotel_id", id);
          
        if (error) throw error;
        setImages(data || []);
      } catch (error) {
        console.error("Error fetching hotel images:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [id]);

  return { images, loading };
}
