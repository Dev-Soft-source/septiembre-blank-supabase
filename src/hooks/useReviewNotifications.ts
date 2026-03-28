
import { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

type ReviewNotification = {
  id: string;
  hotelName: string;
  rating: number;
  timestamp: string;
  isNew: boolean;
};

export const useReviewNotifications = () => {
  const [notifications, setNotifications] = useState<ReviewNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [newNotificationsCount, setNewNotificationsCount] = useState(0);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch review notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Get hotels owned by the current user with error handling
        let hotels = [];
        try {
          const { data: hotelsData, error: hotelsError } = await supabase
            .from('hotels')
            .select('id, name')
            .eq('owner_id', user.id);
            
          if (hotelsError) {
            // Silently handle permissions errors to avoid console spam
            if (hotelsError.code !== 'RLS_POLICY_VIOLATION' && hotelsError.code !== 'PGRST301') {
              throw hotelsError;
            } else {
              console.log('useReviewNotifications: No access to hotels table');
              setNotifications([]);
              setLoading(false);
              return;
            }
          }
          
          hotels = hotelsData || [];
        } catch (error) {
          console.log('useReviewNotifications: Hotels query failed, user may not be hotel owner');
          setNotifications([]);
          setLoading(false);
          return;
        }
        
        if (hotels.length === 0) {
          setNotifications([]);
          setLoading(false);
          return;
        }
        
        const hotelIds = hotels.map(hotel => hotel.id);
        const hotelNames: Record<string, string> = {};
        hotels.forEach(hotel => {
          hotelNames[hotel.id] = hotel.name;
        });
        
        // Get recent reviews for these hotels with error handling
        try {
          const { data, error } = await supabase
            .from('reviews')
            .select('*')
            .in('hotel_id', hotelIds)
            .eq('is_notified', false)
            .order('created_at', { ascending: false });
            
          if (error) {
            // Silently handle permissions errors to avoid console spam
            if (error.code !== 'RLS_POLICY_VIOLATION' && error.code !== 'PGRST301') {
              throw error;
            } else {
              console.log('useReviewNotifications: No access to reviews table');
              setNotifications([]);
              setLoading(false);
              return;
            }
          }
          
          // Format notifications
          const formattedNotifications: ReviewNotification[] = (data || []).map(review => ({
            id: review.id,
            hotelName: hotelNames[review.hotel_id] || 'Unknown Hotel',
            rating: review.rating,
            timestamp: review.created_at,
            isNew: !review.is_notified
          }));
          
          setNotifications(formattedNotifications);
          setNewNotificationsCount(formattedNotifications.filter(n => n.isNew).length);
          
          // Mark these notifications as seen
          if (data && data.length > 0) {
            const reviewIds = data.map(review => review.id);
            
            // Update the is_notified flag
            try {
              await supabase
                .from('reviews')
                .update({ is_notified: true })
                .in('id', reviewIds);
            } catch (updateError) {
              console.log('useReviewNotifications: Could not mark notifications as read');
            }
          }
        } catch (error) {
          console.log('useReviewNotifications: Reviews query failed');
          setNotifications([]);
        }
      } catch (error) {
        console.error('Error fetching review notifications:', error);
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchNotifications();
    
    // Subscribe to realtime updates for new reviews (with error handling)
    if (user) {
      try {
        const channel = supabase
          .channel('public:reviews')
          .on('postgres_changes', 
            { 
              event: 'INSERT', 
              schema: 'public', 
              table: 'reviews' 
            }, 
            (payload) => {
              // Check if this review is for one of the user's hotels
              const fetchHotelDetails = async () => {
                try {
                  const { data: hotel } = await supabase
                    .from('hotels')
                    .select('id, name')
                    .eq('id', payload.new.hotel_id)
                    .eq('owner_id', user.id)
                    .single();
                    
                  if (hotel) {
                    // This is a review for one of the user's hotels
                    const newNotification: ReviewNotification = {
                      id: payload.new.id,
                      hotelName: hotel.name,
                      rating: payload.new.rating,
                      timestamp: payload.new.created_at,
                      isNew: true
                    };
                    
                    setNotifications(prev => [newNotification, ...prev]);
                    setNewNotificationsCount(prev => prev + 1);
                    
                    toast({
                      title: 'New Review',
                      description: `You've received a ${payload.new.rating}-star review for ${hotel.name}!`,
                    });
                  }
                } catch (error) {
                  console.log('useReviewNotifications: Real-time hotel details fetch failed');
                }
              };
              
              fetchHotelDetails();
            }
          )
          .subscribe();
          
        return () => {
          supabase.removeChannel(channel);
        };
      } catch (error) {
        console.log('useReviewNotifications: Real-time subscription failed');
      }
    }
  }, [user, toast]);

  const markAllAsRead = async () => {
    if (notifications.length === 0 || !user) return;
    
    try {
      const newNotificationIds = notifications
        .filter(n => n.isNew)
        .map(n => n.id);
        
      if (newNotificationIds.length === 0) return;
      
      await supabase
        .from('reviews')
        .update({ is_notified: true })
        .in('id', newNotificationIds);
        
      setNotifications(prev => 
        prev.map(notification => ({
          ...notification,
          isNew: false
        }))
      );
      
      setNewNotificationsCount(0);
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  return {
    notifications,
    loading,
    newNotificationsCount,
    markAllAsRead
  };
};
