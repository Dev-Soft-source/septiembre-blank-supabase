/**
 * Hotel Detail Hook with Backend Adapter
 * Safely fetches hotel details using backend adapter
 */

import { useQuery } from "@tanstack/react-query";
import { queryHotelDetailWithBackendAdapter } from "@/adapters/query-adapter";

export function useHotelDetailWithBackendAdapter(hotelId?: string) {
  return useQuery({
    queryKey: ["hotel-detail-backend-adapter", hotelId],
    queryFn: async () => {
      if (!hotelId) {
        throw new Error("Hotel ID is required");
      }

      const { data, error } = await queryHotelDetailWithBackendAdapter(hotelId);
      
      if (error) {
        throw error;
      }
      
      return data;
    },
    enabled: !!hotelId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}