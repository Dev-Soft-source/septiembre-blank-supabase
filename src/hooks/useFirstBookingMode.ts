
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

export const useFirstBookingMode = () => {
  const [isFirstTimeUser, setIsFirstTimeUser] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const checkFirstTimeUser = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Check if user has any bookings
        const { data: bookings, error } = await supabase
          .from('bookings')
          .select('id')
          .eq('user_id', user.id)
          .limit(1);

        if (error) {
          console.error('Error checking user bookings:', error);
          setIsFirstTimeUser(false);
        } else {
          setIsFirstTimeUser(!bookings || bookings.length === 0);
        }
      } catch (error) {
        console.error('Error in checkFirstTimeUser:', error);
        setIsFirstTimeUser(false);
      } finally {
        setLoading(false);
      }
    };

    checkFirstTimeUser();
  }, [user]);

  return { isFirstTimeUser, loading };
};
