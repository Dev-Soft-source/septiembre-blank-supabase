
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface UserNotification {
  id: string;
  user_id: string;
  hotel_id: string;
  type: 'availability' | 'price';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useUserNotifications = (hotelId?: string) => {
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch user's notifications for a specific hotel
  const fetchNotifications = async () => {
    if (!user || !hotelId) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_notifications')
        .select('*')
        .eq('user_id', user.id)
        .eq('hotel_id', hotelId)
        .eq('is_active', true);

      if (error) throw error;
      
      // Type assertion to ensure the data matches our interface
      const typedData = (data || []) as UserNotification[];
      setNotifications(typedData);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add a new notification
  const addNotification = async (type: 'availability' | 'price') => {
    if (!user || !hotelId) return;

    try {
      setLoading(true);
      
      // Check if notification already exists
      const existing = notifications.find(n => n.type === type && n.is_active);
      if (existing) {
        toast({
          title: "Already subscribed",
          description: `You're already subscribed to ${type} notifications for this hotel.`,
        });
        return;
      }

      const { data, error } = await supabase
        .from('user_notifications')
        .insert({
          user_id: user.id,
          hotel_id: hotelId,
          type: type
        })
        .select()
        .single();

      if (error) throw error;

      // Type assertion for the returned data
      const typedData = data as UserNotification;
      setNotifications(prev => [...prev, typedData]);
      toast({
        title: "Notification enabled",
        description: `You'll be notified when the ${type === 'availability' ? 'hotel becomes available' : 'price drops'}.`,
      });
    } catch (error) {
      console.error('Error adding notification:', error);
      toast({
        title: "Error",
        description: "Failed to enable notification. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Remove a notification
  const removeNotification = async (type: 'availability' | 'price') => {
    if (!user || !hotelId) return;

    try {
      setLoading(true);
      
      const notification = notifications.find(n => n.type === type && n.is_active);
      if (!notification) return;

      const { error } = await supabase
        .from('user_notifications')
        .update({ is_active: false })
        .eq('id', notification.id);

      if (error) throw error;

      setNotifications(prev => prev.filter(n => n.id !== notification.id));
      toast({
        title: "Notification disabled",
        description: `${type === 'availability' ? 'Availability' : 'Price drop'} notifications disabled for this hotel.`,
      });
    } catch (error) {
      console.error('Error removing notification:', error);
      toast({
        title: "Error",
        description: "Failed to disable notification. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Check if user has a specific notification type
  const hasNotification = (type: 'availability' | 'price') => {
    return notifications.some(n => n.type === type && n.is_active);
  };

  useEffect(() => {
    fetchNotifications();
  }, [user, hotelId]);

  return {
    notifications,
    loading,
    addNotification,
    removeNotification,
    hasNotification,
    refetch: fetchNotifications
  };
};
