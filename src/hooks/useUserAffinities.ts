
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface UserAffinity {
  id: string;
  user_id: string;
  theme_id: string;
  created_at: string;
  themes: {
    id: string;
    name: string;
    description?: string;
    category?: string;
  };
}

export const useUserAffinities = () => {
  const [userAffinities, setUserAffinities] = useState<UserAffinity[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchUserAffinities = async () => {
    if (!user) return;

    try {
      setLoading(true);
      // User affinities feature discontinued - return empty array
      setUserAffinities([]);
      console.log('User affinities feature discontinued');
    } catch (error: any) {
      console.error('Error in fetchUserAffinities:', error);
    } finally {
      setLoading(false);
    }
  };

  const addAffinity = async (themeId: string) => {
    console.log('Affinity feature discontinued:', themeId);
    toast({
      title: "Feature Discontinued", 
      description: "User affinities feature is no longer available."
    });
  };

  const removeAffinity = async (themeId: string) => {
    console.log('Remove affinity feature discontinued:', themeId);
    toast({
      title: "Feature Discontinued", 
      description: "User affinities feature is no longer available."
    });
  };

  useEffect(() => {
    fetchUserAffinities();
  }, [user]);

  return {
    userAffinities,
    loading,
    addAffinity,
    removeAffinity,
    refetch: fetchUserAffinities
  };
};
