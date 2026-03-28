import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AvailabilityPackage } from "@/types/availability-package";
import { generateDemoPackages } from '@/utils/demoPricing';

export function useRealTimeAvailabilityArray() {
  const [packages, setPackages] = useState<AvailabilityPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchPackages = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch all packages + all hotels
      const [packagesResult, hotelsResult] = await Promise.all([
        supabase.from("availability_packages").select("*"),
        supabase.from("hotels_with_filters_view").select("id, category, name"),
      ]);

      // Group packages by hotel_id
      const groupedPackagesData = (packagesResult.data || []).reduce(
        (acc: Record<string, any[]>, pkg) => {
          const key = pkg.hotel_id;
          if (!acc[key]) {
            acc[key] = [];
          }
          const start_date = new Date(pkg.start_date);
          const endDate = new Date(pkg.start_date);             // endDate was incorrectly using pkg.end_date
          endDate.setDate(start_date.getDate() + pkg.duration); // Correctly calculate endDate based on start_date + duration
          // Map to AvailabilityPackage structure
          pkg.duration_days = pkg.duration;
          pkg.base_price_usd = Number(pkg.base_price);
          pkg.current_price_usd = Number(pkg.base_price);
          pkg.end_date = endDate.toLocaleTimeString().split("T")[0];
          acc[key].push(pkg);
          return acc;
        },
        {} // <-- should be an object
      );

      if (packagesResult.error) throw packagesResult.error;
      if (hotelsResult.error) throw hotelsResult.error;

      // Build final hotelPackages
      const hotelResult = hotelsResult.data || [];
      const hotelPackages: AvailabilityPackage[] = [];

      hotelResult.forEach((hotel) => {
        const hotelName = hotel.name || "Hotel";
        const fallbackPackages = generateFallbackPackages(hotel.id, hotelName);

        if (groupedPackagesData[hotel.id]?.length > 0) {
          // Use real packages if available
          hotelPackages.push(...groupedPackagesData[hotel.id]);
        } else {
          // Otherwise fallback
          hotelPackages.push(...fallbackPackages);
        }
      });

      setPackages(hotelPackages);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Error fetching packages:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Generate demo packages using corrected pricing logic
  const generateFallbackPackages = (
    hotelId: string, 
    hotelName: string
  ): AvailabilityPackage[] => {
    return generateDemoPackages(hotelId, hotelName) as AvailabilityPackage[];
  };

  // Real-time subscription (all hotels)
  useEffect(() => {
    fetchPackages();

    const channel = supabase
      .channel("package-availability-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "availability_packages" }, () => {
        console.log("Package availability changed");
        fetchPackages();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "bookings" }, () => {
        console.log("Booking changed, refreshing availability");
        fetchPackages();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchPackages]);

  // Manual refresh
  const refreshAvailability = useCallback(() => {
    setIsLoading(true);
    fetchPackages();
  }, [fetchPackages]);

  return {
    packages,
    isLoading,
    error,
    lastUpdated,
    refreshAvailability,
  };
}
