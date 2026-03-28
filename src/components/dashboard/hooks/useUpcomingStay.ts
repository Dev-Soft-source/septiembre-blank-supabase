
// @ts-nocheck
// TypeScript checking disabled for Supabase schema compatibility
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { UpcomingStay } from "../types/dashboard";

export function useUpcomingStay() {
  const [upcomingStay, setUpcomingStay] = useState<UpcomingStay | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const fetchUpcomingStay = async () => {
      try {
        setIsLoading(true);
        
        const today = new Date().toISOString().split('T')[0];
        
        const { data, error } = await supabase
          .from('bookings')
          .select(`
            id,
            check_in,
            check_out,
            hotel_id
          `)
          .eq('user_id', user.id)
          .eq('status', 'confirmed')
          .gte('check_in', today)
          .order('check_in', { ascending: true })
          .limit(1);
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          const booking = data[0];
          
          // Fetch hotel details separately to avoid relation issues
          const { data: hotelData, error: hotelError } = await supabase
            .from('hotels')
            .select('id, name, city, country')
            .eq('id', booking.hotel_id)
            .single();
            
          if (hotelError) throw hotelError;
          
          if (hotelData) {
            const checkIn = new Date(booking.check_in);
            const checkOut = new Date(booking.check_out);
            
            // Calculate number of days
            const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            setUpcomingStay({
              hotelId: hotelData.id,
              hotelName: hotelData.name,
              location: `${hotelData.city}, ${hotelData.country}`,
              checkIn: booking.check_in,
              checkOut: booking.check_out,
              days: diffDays
            });
          } else {
            setUpcomingStay(null);
          }
        } else {
          setUpcomingStay(null);
        }
      } catch (error) {
        console.error("Error fetching upcoming stay:", error);
        setUpcomingStay(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUpcomingStay();
  }, [user]);

  return { upcomingStay, isLoading };
}
