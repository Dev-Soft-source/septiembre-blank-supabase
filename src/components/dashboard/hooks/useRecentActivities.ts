
// @ts-nocheck
// TypeScript checking disabled for Supabase schema compatibility
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { formatDistanceToNow } from "date-fns";
import { RecentActivity } from "../types/dashboard";

export function useRecentActivities() {
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const fetchRecentActivities = async () => {
      try {
        setIsLoading(true);
        
        const activities: RecentActivity[] = [];
        
        // Fetch recent bookings
        const { data: bookingsData, error: bookingsError } = await supabase
          .from('bookings')
          .select(`
            id,
            created_at,
            hotel_id
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(2);
        
        if (bookingsError) throw bookingsError;
        
        if (bookingsData && bookingsData.length > 0) {
          // For each booking, fetch the hotel details separately
          for (const booking of bookingsData) {
            // Fetch hotel details separately
            const { data: hotelData, error: hotelError } = await supabase
              .from('hotels')
              .select('name')
              .eq('id', booking.hotel_id)
              .single();
            
            if (!hotelError && hotelData) {
              activities.push({
                iconName: "Calendar",
                title: "New Booking",
                description: `You booked ${hotelData.name || 'a hotel'}`,
                time: formatDistanceToNow(new Date(booking.created_at), { addSuffix: true }),
                created_at: booking.created_at
              });
            } else {
              // Add activity even if hotel details are unavailable
              activities.push({
                iconName: "Calendar",
                title: "New Booking",
                description: "You booked a hotel",
                time: formatDistanceToNow(new Date(booking.created_at), { addSuffix: true }),
                created_at: booking.created_at
              });
            }
          }
        }
        
        // Fetch recent saved hotels
        const { data: favoritesData, error: favoritesError } = await supabase
          .from('favorites')
          .select(`
            id,
            created_at,
            hotel_id
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(2);
        
        if (favoritesError) throw favoritesError;
        
        if (favoritesData && favoritesData.length > 0) {
          // For each favorite, fetch the hotel details separately
          for (const favorite of favoritesData) {
            // Fetch hotel details separately
            const { data: hotelData, error: hotelError } = await supabase
              .from('hotels')
              .select('name')
              .eq('id', favorite.hotel_id)
              .single();
            
            if (!hotelError && hotelData) {
              activities.push({
                iconName: "Building",
                title: "Saved Hotel",
                description: `You saved ${hotelData.name || 'a hotel'} to your favorites`,
                time: formatDistanceToNow(new Date(favorite.created_at), { addSuffix: true }),
                created_at: favorite.created_at
              });
            } else {
              // Add activity even if hotel details are unavailable
              activities.push({
                iconName: "Building",
                title: "Saved Hotel",
                description: "You saved a hotel to your favorites",
                time: formatDistanceToNow(new Date(favorite.created_at), { addSuffix: true }),
                created_at: favorite.created_at
              });
            }
          }
        }
        
        // Sort all activities by created_at date
        activities.sort((a, b) => {
          if (!a.created_at || !b.created_at) return 0;
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
        
        // Take the most recent 5
        setRecentActivities(activities.slice(0, 5));
      } catch (error) {
        console.error("Error fetching recent activities:", error);
        setRecentActivities([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentActivities();
  }, [user]);

  return { recentActivities, isLoading };
}
