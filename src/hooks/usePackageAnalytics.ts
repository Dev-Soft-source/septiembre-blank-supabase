import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface PackageAnalytics {
  totalPackages: number;
  totalBookings: number;
  conversionRate: number;
  occupancyByDuration: Array<{
    duration: number;
    totalRooms: number;
    bookedRooms: number;
    occupancyRate: number;
  }>;
  popularPackages: Array<{
    packageId: string;
    startDate: string;
    endDate: string;
    duration: number;
    bookingCount: number;
    conversionRate: number;
  }>;
  leastPopularPackages: Array<{
    packageId: string;
    startDate: string;
    endDate: string;
    duration: number;
    bookingCount: number;
    conversionRate: number;
  }>;
}

export const usePackageAnalytics = (hotelId?: string) => {
  const [analytics, setAnalytics] = useState<PackageAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!hotelId) {
      setAnalytics(null);
      setIsLoading(false);
      return;
    }

    const fetchAnalytics = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch packages with booking counts
        const { data: packagesData, error: packagesError } = await supabase
          .from('availability_packages')
          .select(`
            id,
            start_date,
            end_date,
            duration_days,
            total_rooms,
            available_rooms,
            bookings!package_id(id, status)
          `)
          .eq('hotel_id', hotelId);

        if (packagesError) throw packagesError;

        if (!packagesData || packagesData.length === 0) {
          setAnalytics({
            totalPackages: 0,
            totalBookings: 0,
            conversionRate: 0,
            occupancyByDuration: [],
            popularPackages: [],
            leastPopularPackages: []
          });
          return;
        }

        // Process analytics
        const processedPackages = packagesData.map(pkg => {
          const confirmedBookings = pkg.bookings?.filter(
            (booking: any) => booking.status === 'confirmed' || booking.status === 'pending'
          ) || [];
          
          const bookedRooms = pkg.total_rooms - pkg.available_rooms;
          const conversionRate = pkg.total_rooms > 0 ? (bookedRooms / pkg.total_rooms) * 100 : 0;

          return {
            packageId: pkg.id,
            startDate: pkg.start_date,
            endDate: pkg.end_date,
            duration: pkg.duration_days,
            totalRooms: pkg.total_rooms,
            bookedRooms,
            bookingCount: confirmedBookings.length,
            conversionRate
          };
        });

        // Calculate overall metrics
        const totalPackages = processedPackages.length;
        const totalBookings = processedPackages.reduce((sum, pkg) => sum + pkg.bookingCount, 0);
        const totalRoomsAcrossPackages = processedPackages.reduce((sum, pkg) => sum + pkg.totalRooms, 0);
        const totalBookedRooms = processedPackages.reduce((sum, pkg) => sum + pkg.bookedRooms, 0);
        const overallConversionRate = totalRoomsAcrossPackages > 0 ? (totalBookedRooms / totalRoomsAcrossPackages) * 100 : 0;

        // Calculate occupancy by duration
        const durationGroups = processedPackages.reduce((acc, pkg) => {
          if (!acc[pkg.duration]) {
            acc[pkg.duration] = { totalRooms: 0, bookedRooms: 0 };
          }
          acc[pkg.duration].totalRooms += pkg.totalRooms;
          acc[pkg.duration].bookedRooms += pkg.bookedRooms;
          return acc;
        }, {} as Record<number, { totalRooms: number; bookedRooms: number }>);

        const occupancyByDuration = Object.entries(durationGroups).map(([duration, data]) => ({
          duration: parseInt(duration),
          totalRooms: (data as { totalRooms: number; bookedRooms: number }).totalRooms,
          bookedRooms: (data as { totalRooms: number; bookedRooms: number }).bookedRooms,
          occupancyRate: (data as { totalRooms: number; bookedRooms: number }).totalRooms > 0 ? ((data as { totalRooms: number; bookedRooms: number }).bookedRooms / (data as { totalRooms: number; bookedRooms: number }).totalRooms) * 100 : 0
        })).sort((a, b) => a.duration - b.duration);

        // Sort packages by popularity
        const sortedByPopularity = [...processedPackages].sort((a, b) => b.conversionRate - a.conversionRate);
        
        const popularPackages = sortedByPopularity.slice(0, 5).map(pkg => ({
          packageId: pkg.packageId,
          startDate: pkg.startDate,
          endDate: pkg.endDate,
          duration: pkg.duration,
          bookingCount: pkg.bookingCount,
          conversionRate: pkg.conversionRate
        }));

        const leastPopularPackages = sortedByPopularity.slice(-5).reverse().map(pkg => ({
          packageId: pkg.packageId,
          startDate: pkg.startDate,
          endDate: pkg.endDate,
          duration: pkg.duration,
          bookingCount: pkg.bookingCount,
          conversionRate: pkg.conversionRate
        }));

        setAnalytics({
          totalPackages,
          totalBookings,
          conversionRate: overallConversionRate,
          occupancyByDuration,
          popularPackages,
          leastPopularPackages
        });

      } catch (err) {
        console.error('Error fetching package analytics:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch analytics');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [hotelId]);

  return {
    analytics,
    isLoading,
    error
  };
};