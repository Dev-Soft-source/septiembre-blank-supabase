import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface RecommendedHotel {
  id: string;
  name: string;
  city: string;
  country: string;
  main_image_url: string | null;
  price_per_month: number;
  rating?: number;
  category: number | null;
  description: string | null;
  hotel_images: any[];
  hotel_themes: any[];
  hotel_activities: any[];
  recommendation_reason?: string;
}

export const useRecommendedHotels = () => {
  const { user } = useAuth();
  const [hotels, setHotels] = useState<RecommendedHotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendedHotels = async () => {
      try {
        setLoading(true);
        setError(null);

        // User affinities feature discontinued - show general popular hotels instead
        const { data: hotelsData, error: hotelsError } = await supabase
          .from('hotels')
          .select(`
            id,
            name,
            city,
            country,
            main_image_url,
            price_per_month,
            rating,
            category,
            description,
            hotel_images(*),
            hotel_themes(theme_id, themes(*)),
            hotel_activities(activity_id, activities(*))
          `)
          .eq('status', 'approved')
          .order('rating', { ascending: false, nullsFirst: false })
          .limit(20);

        if (hotelsError) throw hotelsError;

        setHotels(hotelsData || []);
      } catch (err) {
        console.error('Error fetching recommended hotels:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedHotels();
  }, [user]);

  return { hotels, loading, error };
};