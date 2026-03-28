
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface ExpertStats {
  citiesCount: number;
  affinitiesCount: number;
  totalStays: number;
  favoriteDestination?: string;
}

export const useExpertStats = () => {
  const [stats, setStats] = useState<ExpertStats>({
    citiesCount: 0,
    affinitiesCount: 0,
    totalStays: 0
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Get booking data with hotel information
        const { data: bookings, error: bookingsError } = await supabase
          .from('bookings')
          .select(`
            id,
            hotels (
              city,
              country,
              hotel_themes (
                themes (
                  name
                )
              )
            )
          `)
          .eq('user_id', user.id);

        if (bookingsError) throw bookingsError;

        if (!bookings || bookings.length === 0) {
          setLoading(false);
          return;
        }

        // Calculate unique cities
        const cities = new Set<string>();
        const affinities = new Set<string>();
        const destinations = new Map<string, number>();

        bookings.forEach(booking => {
          if (booking.hotels) {
            const city = booking.hotels.city;
            const country = booking.hotels.country;
            
            if (city && country) {
              const destination = `${city}, ${country}`;
              cities.add(destination);
              
              // Track favorite destination
              const count = destinations.get(destination) || 0;
              destinations.set(destination, count + 1);
            }

            // Extract affinities/themes
            if (booking.hotels.hotel_themes) {
              booking.hotels.hotel_themes.forEach((ht: any) => {
                if (ht.themes?.name) {
                  affinities.add(ht.themes.name);
                }
              });
            }
          }
        });

        // Find most visited destination
        let favoriteDestination = '';
        let maxVisits = 0;
        destinations.forEach((count, destination) => {
          if (count > maxVisits) {
            maxVisits = count;
            favoriteDestination = destination;
          }
        });

        setStats({
          citiesCount: cities.size,
          affinitiesCount: affinities.size,
          totalStays: bookings.length,
          favoriteDestination: maxVisits > 1 ? favoriteDestination : undefined
        });
      } catch (error) {
        console.error('Error fetching expert stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  return { stats, loading };
};
