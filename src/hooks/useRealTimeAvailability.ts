import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AvailabilityPackage } from '@/types/availability-package';
import { generateDemoPackages } from '@/utils/demoPricing';

interface UseRealTimeAvailabilityProps {
  hotelId?: string;
}

export function useRealTimeAvailability({ hotelId }: UseRealTimeAvailabilityProps) {
  const [packages, setPackages] = useState<AvailabilityPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchPackages = useCallback(async () => {
    if (!hotelId) {
      setPackages([]);
      setIsLoading(false);
      return;
    }

    try {
      setError(null);
      
      // Fetch packages and hotel information
      const [packagesResult, hotelResult] = await Promise.all([
        supabase
          .from('availability_packages')
          .select('*')
          .eq('hotel_id', hotelId),
        supabase
          .from('hotels_with_filters_view')
          .select('category, name')
          .eq('id', hotelId)
          .single()
      ]);
      if (packagesResult.error) {
        throw packagesResult.error;
      }

      if (hotelResult.error) {
        console.warn('Could not fetch hotel information:', hotelResult.error);
      }

      let packages = (packagesResult.data || []).map(pkg => ({
        ...pkg,
        // Map database fields to interface fields
        duration_days: pkg.duration || pkg.duration_days,
        current_price_usd: pkg.base_price || pkg.current_price_usd || 0,
        base_price_usd: pkg.base_price || pkg.base_price_usd || 0,
        // Calculate end_date if missing
        end_date: pkg.end_date || (() => {
          if (pkg.start_date && (pkg.duration || pkg.duration_days)) {
            const startDate = new Date(pkg.start_date);
            const duration = pkg.duration || pkg.duration_days;
            const endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + duration - 1);
            return endDate.toISOString().split('T')[0];
          }
          return pkg.end_date;
        })(),
        room_type: pkg.room_type || 'Double Room',
        occupancy_mode: pkg.occupancy_mode || 'per_person',
        available_rooms: pkg.available_rooms || pkg.rooms || pkg.total_rooms || 0,
        total_rooms: pkg.total_rooms || pkg.rooms || 0
      })) as AvailabilityPackage[];

      // Generate fallback packages if none exist
      if (packages.length === 0 && hotelResult.data) {
        const hotelName = hotelResult.data.name || 'Hotel';
        const fallbackPackages = generateFallbackPackages(hotelId, hotelName);
        packages = fallbackPackages;
      }

      // Process packages to add availability status and apply sorting
      const processedPackages = packages
        .map((pkg) => ({
          ...pkg,
          isAvailable: pkg.available_rooms > 0,
          isSoldOut: pkg.available_rooms === 0
        }))
        .sort((a, b) => {
          // First: sort by start_date (ascending - nearest first)
          const dateA = new Date(a.start_date).getTime();
          const dateB = new Date(b.start_date).getTime();
          if (dateA !== dateB) return dateA - dateB;
          
          // Second: sort by price (ascending - lowest first)
          const priceA = a.current_price_usd;
          const priceB = b.current_price_usd;
          if (priceA !== priceB) return priceA - priceB;
          
          // Third: sort by duration (descending - longer first)
          return b.duration_days - a.duration_days;
        });
          
      setPackages(processedPackages);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching packages:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [hotelId]);

  // Generate demo packages using corrected pricing logic
  const generateFallbackPackages = (
    hotelId: string, 
    hotelName: string
  ): AvailabilityPackage[] => {
    return generateDemoPackages(hotelId, hotelName) as AvailabilityPackage[];
  };

  // Set up real-time subscription for availability changes
  useEffect(() => {
    if (!hotelId) return;

    fetchPackages();

    // Subscribe to real-time changes for availability packages
    const channel = supabase
      .channel('package-availability-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'availability_packages',
          filter: `hotel_id=eq.${hotelId}`
        },
        (payload) => {
          console.log('Package availability changed:', payload);
          fetchPackages();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings',
          filter: `hotel_id=eq.${hotelId}`
        },
        (payload) => {
          console.log('Booking changed, refreshing availability:', payload);
          fetchPackages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [hotelId, fetchPackages]);

  // Manual refresh function
  const refreshAvailability = useCallback(() => {
    setIsLoading(true);
    fetchPackages();
  }, [fetchPackages]);

  return {
    packages,
    isLoading,
    error,
    lastUpdated,
    refreshAvailability
  };
}