import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AvailabilityPackage } from '@/types/availability-package';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

export function useAvailabilityPackagesManagement() {
  const [packages, setPackages] = useState<AvailabilityPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { profile } = useAuth();
  const { toast } = useToast();

  const fetchPackages = async () => {
    if (!profile?.id) return;

    try {
      setIsLoading(true);
      setError(null);

      // Fetch packages for hotels owned by the current user
      const { data: hotelData, error: hotelError } = await supabase
        .from('hotels')
        .select('id')
        .eq('owner_id', profile.id);

      if (hotelError) {
        throw hotelError;
      }

      if (!hotelData || hotelData.length === 0) {
        setPackages([]);
        return;
      }

      const hotelIds = hotelData.map(hotel => hotel.id);

      const { data, error: queryError } = await supabase
        .from('availability_packages')
        .select('*')
        .in('hotel_id', hotelIds)
        .order('start_date', { ascending: true });

      if (queryError) {
        throw queryError;
      }

      setPackages(data || []);
    } catch (err) {
      console.error('Error fetching packages:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const createPackage = async (packageData: Omit<AvailabilityPackage, 'id' | 'created_at' | 'updated_at' | 'base_price_usd' | 'current_price_usd'>) => {
    try {
      // Validate business rules before creation
      const allowedDurations = [8, 15, 22, 29];
      if (!allowedDurations.includes(packageData.duration_days)) {
        throw new Error(`Duration must be one of: ${allowedDurations.join(', ')} days`);
      }

      if (packageData.available_rooms > packageData.total_rooms) {
        throw new Error('Available rooms cannot exceed total rooms');
      }

      if (packageData.available_rooms < 0 || packageData.total_rooms <= 0) {
        throw new Error('Room counts must be positive numbers');
      }

      // Calculate pricing based on sacred policy instead of hotel's price_per_month
      const { data: hotelData, error: hotelError } = await supabase
        .from('hotels')
        .select('category, meal_plans')
        .eq('id', packageData.hotel_id)
        .maybeSingle();

      if (hotelError) throw hotelError;
      
      const hotelCategory = hotelData?.category || 4;
      const mealPlans = hotelData?.meal_plans || ['half_board'];
      const primaryMealPlan = mealPlans[0] || 'half_board';
      
      // Use hotel-defined pricing only - get from packageData directly
      const basePrice = 1000; // Default base price

      const { data, error } = await supabase
        .from('availability_packages')
        .insert({ 
          ...packageData, 
          occupancy_mode: (packageData as any).occupancy_mode ?? 'double', 
          base_price_usd: basePrice,
          current_price_usd: basePrice
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Log successful creation
      console.log(`Package created successfully:`, data);

      toast({
        title: "Package Created",
        description: "Availability package has been created successfully.",
      });

      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create package';
      console.error('Package creation error:', err);
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      throw err;
    }
  };

  const updatePackage = async (id: string, updates: Partial<AvailabilityPackage>) => {
    try {
      // Get current package and check for active bookings
      const { data: currentPackage, error: fetchError } = await supabase
        .from('availability_packages')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError || !currentPackage) {
        throw new Error('Package not found');
      }

      // Check if there are any active bookings for this package
      const { data: activeBookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('id')
        .eq('package_id', id)
        .in('status', ['pending', 'confirmed']);

      if (bookingsError) {
        throw new Error('Failed to check active bookings');
      }

      const bookedRooms = activeBookings?.length || 0;

      // Validate room count reduction constraints
      if (updates.total_rooms !== undefined && updates.total_rooms < bookedRooms) {
        throw new Error(`Cannot reduce total rooms below ${bookedRooms} (currently booked rooms)`);
      }

      if (updates.available_rooms !== undefined && updates.available_rooms < 0) {
        throw new Error('Available rooms cannot be negative');
      }

      // If reducing available rooms, ensure it doesn't go below current bookings
      if (updates.available_rooms !== undefined) {
        const newTotalRooms = updates.total_rooms || currentPackage.total_rooms;
        const maxAvailableRooms = newTotalRooms - bookedRooms;
        
        if (updates.available_rooms > maxAvailableRooms) {
          updates.available_rooms = maxAvailableRooms;
        }
      }

      // Log the update attempt for audit purposes
      console.log(`Attempting to update package ${id}:`, {
        currentPackage,
        updates,
        bookedRooms,
        activeBookings: activeBookings?.length || 0
      });

      const { data, error } = await supabase
        .from('availability_packages')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Log successful update
      console.log(`Package ${id} updated successfully:`, data);

      toast({
        title: "Package Updated",
        description: "Availability package has been updated successfully.",
      });

      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update package';
      console.error('Package update error:', err);
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      throw err;
    }
  };

  const deletePackage = async (id: string) => {
    try {
      // Check if there are any bookings for this package
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('id, status')
        .eq('package_id', id);

      if (bookingsError) {
        throw new Error('Failed to check package bookings');
      }

      if (bookings && bookings.length > 0) {
        const activeBookings = bookings.filter(b => 
          b.status === 'pending' || b.status === 'confirmed'
        );
        
        if (activeBookings.length > 0) {
          throw new Error(`Cannot delete package with ${activeBookings.length} active booking(s)`);
        }
      }

      // Log deletion attempt for audit purposes
      console.log(`Attempting to delete package ${id}. Found ${bookings?.length || 0} total bookings.`);

      const { error } = await supabase
        .from('availability_packages')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Log successful deletion
      console.log(`Package ${id} deleted successfully.`);

      toast({
        title: "Package Deleted",
        description: "Availability package has been deleted successfully.",
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete package';
      console.error('Package deletion error:', err);
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchPackages();
  }, [profile?.id]);

  return {
    packages,
    isLoading,
    error,
    refetch: fetchPackages,
    createPackage,
    updatePackage,
    deletePackage
  };
}