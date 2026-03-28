import { useState, useEffect } from "react";
import { FilterState } from "@/components/filters/FilterTypes";
import { queryHotelsWithBackendAdapter } from "@/adapters/query-adapter";
import type { FrontendHotel } from "@/adapters/backend-field-adapter";

// Use the adapted hotel type
type Hotel = FrontendHotel;

interface UseHotelsProps {
  initialFilters?: FilterState;
}

export function useHotels({ initialFilters }: UseHotelsProps = {}) {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [filters, setFilters] = useState<FilterState>(initialFilters || {});

  const fetchHotels = async (currentFilters: FilterState = {}) => {
    setLoading(true);
    setError(null);

    try {
      // Use the backend adapter for safe queries
      const { data, error } = await queryHotelsWithBackendAdapter(currentFilters);
      
      if (error) {
        console.error('❌ Backend adapter error:', error);
        setError(error);
        setHotels([]);
        return;
      }

      setHotels(data);

    } catch (err) {
      console.error('❌ fetchHotels error:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(new Error(`Failed to fetch hotels: ${errorMessage}`));
      setHotels([]);
    } finally {
      setLoading(false);
    }
  };

  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...filters, ...newFilters };
    
    setFilters(updatedFilters);
    fetchHotels(updatedFilters);
  };

  useEffect(() => {
    fetchHotels(filters);
  }, []);

  return {
    hotels,
    loading,
    error,
    filters,
    updateFilters,
    refetch: () => fetchHotels(filters)
  };
}