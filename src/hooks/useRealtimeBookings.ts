
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Booking } from "@/integrations/supabase/types-custom";

export function useRealtimeBookings(hotelId?: string) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      setBookings([]);
      setIsLoading(false);
      return;
    }

    // Initial fetch of bookings
    const fetchBookings = async () => {
      setIsLoading(true);
      try {
        let query = supabase
          .from('bookings')
          .select('*');
        
        // Filter by user ID if no hotel ID is provided
        if (!hotelId) {
          query = query.eq('user_id', user.id);
        } else {
          query = query.eq('hotel_id', hotelId);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        setBookings(data as Booking[]);
      } catch (error: any) {
        console.error("Error fetching bookings:", error);
        toast({
          title: "Error fetching bookings",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('booking-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'bookings',
        filter: hotelId 
          ? `hotel_id=eq.${hotelId}` 
          : `user_id=eq.${user.id}`
      }, (payload) => {
        console.log('Real-time booking update:', payload);
        
        if (payload.eventType === 'INSERT') {
          setBookings(prev => [...prev, payload.new as Booking]);
          toast({
            title: "New Booking",
            description: "A new booking has been created."
          });
        } else if (payload.eventType === 'UPDATE') {
          setBookings(prev => prev.map(booking => 
            booking.id === payload.new.id ? payload.new as Booking : booking
          ));
          toast({
            title: "Booking Updated",
            description: "A booking has been updated."
          });
        } else if (payload.eventType === 'DELETE') {
          setBookings(prev => prev.filter(booking => booking.id !== payload.old.id));
          toast({
            title: "Booking Removed",
            description: "A booking has been cancelled."
          });
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, hotelId, toast]);

  return { bookings, isLoading };
}
