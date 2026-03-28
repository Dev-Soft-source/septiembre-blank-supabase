
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface DashboardNotification {
  id: string;
  hotel_id: string;
  type: 'availability' | 'price';
  created_at: string;
  hotel: {
    name: string;
    city: string;
    country: string;
    main_image_url: string | null;
  };
}

export const useUserDashboardNotifications = () => {
  const [notifications, setNotifications] = useState<DashboardNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchNotifications = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // First get user notifications
      const { data: notificationData, error: notificationError } = await supabase
        .from('user_notifications')
        .select('id, hotel_id, type, created_at')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (notificationError) throw notificationError;

      if (!notificationData || notificationData.length === 0) {
        setNotifications([]);
        return;
      }

      // Get hotel details for each notification
      const hotelIds = notificationData.map(n => n.hotel_id);
      const { data: hotelData, error: hotelError } = await supabase
        .from('hotels')
        .select('id, name, city, country, main_image_url')
        .in('id', hotelIds);

      if (hotelError) throw hotelError;

      // Combine notification data with hotel data
      const combinedData: DashboardNotification[] = notificationData.map(notification => {
        const hotel = hotelData?.find(h => h.id === notification.hotel_id);
        return {
          id: notification.id,
          hotel_id: notification.hotel_id,
          type: notification.type as 'availability' | 'price',
          created_at: notification.created_at,
          hotel: {
            name: hotel?.name || 'Unknown Hotel',
            city: hotel?.city || 'Unknown City',
            country: hotel?.country || 'Unknown Country',
            main_image_url: hotel?.main_image_url || null
          }
        };
      });

      setNotifications(combinedData);
    } catch (error) {
      console.error('Error fetching dashboard notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeNotification = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('user_notifications')
        .update({ is_active: false })
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (error) {
      console.error('Error removing notification:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [user]);

  return {
    notifications,
    loading,
    removeNotification,
    refetch: fetchNotifications
  };
};
