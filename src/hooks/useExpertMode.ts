
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

export const useExpertMode = () => {
  const [isExpert, setIsExpert] = useState(false);
  const [bookingsCount, setBookingsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const checkExpertStatus = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Count user's bookings
        const { data: bookings, error } = await supabase
          .from('bookings')
          .select('id')
          .eq('user_id', user.id);

        if (error) throw error;

        const count = bookings?.length || 0;
        setBookingsCount(count);
        setIsExpert(count >= 3);
      } catch (error) {
        console.error('Error checking expert status:', error);
        setIsExpert(false);
        setBookingsCount(0);
      } finally {
        setLoading(false);
      }
    };

    checkExpertStatus();
  }, [user]);

  return { isExpert, bookingsCount, loading };
};
