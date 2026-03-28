
// @ts-nocheck
// TypeScript checking disabled for Supabase schema compatibility
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

export function useCompletedStays() {
  const [completedStaysCount, setCompletedStaysCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const fetchCompletedStays = async () => {
      try {
        setIsLoading(true);
        
        const { count, error } = await supabase
          .from('bookings')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('status', 'completed');
        
        if (error) throw error;
        
        setCompletedStaysCount(count || 0);
      } catch (error) {
        console.error("Error fetching completed stays:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompletedStays();
  }, [user]);

  return { completedStaysCount, isLoading };
}
