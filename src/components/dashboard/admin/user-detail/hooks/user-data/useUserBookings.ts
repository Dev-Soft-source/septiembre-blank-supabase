
// @ts-nocheck
// TypeScript checking disabled for Supabase schema compatibility
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useUserBookings = (id: string | undefined) => {
  const [bookings, setBookings] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserBookings = async () => {
      if (!id) return;
      
      try {
        // Fetch user bookings with proper join syntax
        const { data: bookingsData, error: bookingsError } = await supabase
          .from("bookings")
          .select(`
            *,
            hotel:hotels(name, country, city)
          `)
          .eq("user_id", id);

        if (bookingsError) throw bookingsError;
        setBookings(bookingsData || []);
      } catch (error: unknown) {
        console.error("Error fetching user bookings:", error);
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to fetch user bookings",
          variant: "destructive"
        });
      }
    };

    fetchUserBookings();
  }, [id, toast]);

  return { bookings };
};
