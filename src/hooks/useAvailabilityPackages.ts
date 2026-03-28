import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AvailabilityPackage } from '@/types/availability-package';

export function useAvailabilityPackages(hotelId: string, selectedMonth?: string) {
  const [packages, setPackages] = useState<AvailabilityPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPackages = async () => {
    if (!hotelId) return;

    try {
      setIsLoading(true);
      setError(null);

      let query = supabase
        .from('availability_packages_public_view')
        .select('*')
        .eq('hotel_id', hotelId)
        .order('start_date', { ascending: true });

      // Filter by month if selected
      if (selectedMonth) {
        const [year, month] = selectedMonth.split('-');
        const startOfMonth = `${year}-${month}-01`;
        const endOfMonth = new Date(parseInt(year), parseInt(month), 0).toISOString().split('T')[0];
        
        query = query
          .gte('start_date', startOfMonth)
          .lte('start_date', endOfMonth);
      }

      const { data, error: queryError } = await query;

      if (queryError) {
        console.error('Error fetching availability packages:', queryError);
        setError(queryError.message);
        return;
      }

      setPackages(data || []);
    } catch (err) {
      console.error('Error in useAvailabilityPackages:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, [hotelId, selectedMonth]);

  return { packages, isLoading, error, refetch: fetchPackages };
}