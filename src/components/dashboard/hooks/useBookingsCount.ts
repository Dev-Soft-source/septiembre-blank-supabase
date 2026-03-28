
// @ts-nocheck
// TypeScript checking disabled for Supabase schema compatibility
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

export function useBookingsCount() {
  const [bookingsCount, setBookingsCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const fetchBookingsCount = async () => {
      try {
        setIsLoading(true);
        
        const { count, error } = await supabase
          .from('bookings')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);
        
        if (error) throw error;
        
        setBookingsCount(count || 0);
      } catch (error) {
        console.error("Error fetching bookings count:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookingsCount();
  }, [user]);

  return { bookingsCount, isLoading };
}
