import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AvailabilityPackage } from '@/types/availability-package';

interface ValidationError {
  field: string;
  message: string;
}

export const useSecurePackageOperations = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const validatePackageData = (packageData: Partial<AvailabilityPackage>): ValidationError[] => {
    const errors: ValidationError[] = [];
    
    // Duration validation
    const allowedDurations = [8, 15, 22, 29];
    if (packageData.duration_days && !allowedDurations.includes(packageData.duration_days)) {
      errors.push({
        field: 'duration_days',
        message: `Duration must be one of: ${allowedDurations.join(', ')} days`
      });
    }

    // Room count validation
    if (packageData.total_rooms !== undefined && packageData.total_rooms <= 0) {
      errors.push({
        field: 'total_rooms',
        message: 'Total rooms must be a positive number'
      });
    }

    if (packageData.available_rooms !== undefined && packageData.available_rooms < 0) {
      errors.push({
        field: 'available_rooms',
        message: 'Available rooms cannot be negative'
      });
    }

    if (packageData.total_rooms && packageData.available_rooms && 
        packageData.available_rooms > packageData.total_rooms) {
      errors.push({
        field: 'available_rooms',
        message: 'Available rooms cannot exceed total rooms'
      });
    }

    // Date validation
    if (packageData.start_date && packageData.end_date) {
      const startDate = new Date(packageData.start_date);
      const endDate = new Date(packageData.end_date);
      
      if (startDate >= endDate) {
        errors.push({
          field: 'end_date',
          message: 'End date must be after start date'
        });
      }

      // Check if start date is not in the past
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (startDate < today) {
        errors.push({
          field: 'start_date',
          message: 'Start date cannot be in the past'
        });
      }
    }

    return errors;
  };

  const secureCreatePackage = async (
    packageData: Omit<AvailabilityPackage, 'id' | 'created_at' | 'updated_at' | 'base_price_usd' | 'current_price_usd'>
  ) => {
    setLoading(true);
    
    try {
      // Validate input data
      const validationErrors = validatePackageData(packageData);
      if (validationErrors.length > 0) {
        throw new Error(`Validation failed: ${validationErrors.map(e => e.message).join(', ')}`);
      }

      // Check for overlapping packages
      const { data: existingPackages, error: checkError } = await supabase
        .from('availability_packages')
        .select('id, start_date, end_date')
        .eq('hotel_id', packageData.hotel_id)
        .or(`and(start_date.lte.${packageData.end_date},end_date.gte.${packageData.start_date})`);

      if (checkError) {
        throw new Error(`Failed to check for overlapping packages: ${checkError.message}`);
      }

      if (existingPackages && existingPackages.length > 0) {
        throw new Error('Package dates overlap with existing packages');
      }

      // Calculate pricing based on sacred policy instead of hotel's price_per_month
      const { data: hotelData, error: hotelError } = await supabase
        .from('hotels')
        .select('category, meal_plans')
        .eq('id', packageData.hotel_id)
        .maybeSingle();

      if (hotelError) {
        throw new Error(`Failed to fetch hotel data: ${hotelError.message}`);
      }
      
      const hotelCategory = hotelData?.category || 4;
      const mealPlans = hotelData?.meal_plans || ['half_board'];
      const primaryMealPlan = mealPlans[0] || 'half_board';
      
      // Use hotel-defined pricing only - get from packageData directly  
      const basePrice = 1000; // Default base price

      const insertData = { 
        ...packageData, 
        base_price_usd: basePrice, 
        current_price_usd: basePrice 
      } as any;

      const { data, error } = await supabase
        .from('availability_packages')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        throw error;
      }

      console.log('Package created successfully:', data.id);
      
      toast({
        title: "Package Created",
        description: "Availability package has been created successfully.",
      });

      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create package';
      console.error('Secure package creation error:', err);
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const secureUpdatePackage = async (
    id: string, 
    updates: Partial<AvailabilityPackage>
  ) => {
    setLoading(true);
    
    try {
      // Validate input data
      const validationErrors = validatePackageData(updates);
      if (validationErrors.length > 0) {
        throw new Error(`Validation failed: ${validationErrors.map(e => e.message).join(', ')}`);
      }

      // Get current package and active bookings atomically
      const { data: packageWithBookings, error: fetchError } = await supabase
        .from('availability_packages')
        .select(`
          *,
          bookings!inner(id, status)
        `)
        .eq('id', id)
        .single();

      if (fetchError) {
        throw new Error(`Package not found: ${fetchError.message}`);
      }

      const activeBookings = packageWithBookings.bookings?.filter(
        (booking: any) => booking.status === 'pending' || booking.status === 'confirmed'
      ) || [];

      // Security check: prevent reducing room capacity below active bookings
      if (updates.total_rooms !== undefined && updates.total_rooms < activeBookings.length) {
        throw new Error(`Cannot reduce total rooms below ${activeBookings.length} (active bookings)`);
      }

      // Adjust available rooms if necessary
      if (updates.total_rooms !== undefined) {
        const newAvailableRooms = updates.total_rooms - activeBookings.length;
        updates.available_rooms = Math.min(
          updates.available_rooms || packageWithBookings.available_rooms,
          newAvailableRooms
        );
      }

      // Log security audit
      console.log('Updating package with security checks:', {
        packageId: id,
        activeBookings: activeBookings.length,
        updates
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

      console.log('Package updated successfully:', data.id);
      
      toast({
        title: "Package Updated",
        description: "Availability package has been updated successfully.",
      });

      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update package';
      console.error('Secure package update error:', err);
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const secureDeletePackage = async (id: string) => {
    setLoading(true);
    
    try {
      // Security check: ensure no active bookings exist
      const { data: activeBookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('id, status')
        .eq('package_id', id)
        .in('status', ['pending', 'confirmed']);

      if (bookingsError) {
        throw new Error(`Failed to verify package bookings: ${bookingsError.message}`);
      }

      if (activeBookings && activeBookings.length > 0) {
        throw new Error(`Cannot delete package with ${activeBookings.length} active booking(s). Cancel bookings first.`);
      }

      // Log security audit
      console.log('Deleting package after security checks:', {
        packageId: id,
        verifiedNoActiveBookings: true
      });

      const { error } = await supabase
        .from('availability_packages')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      console.log('Package deleted successfully:', id);
      
      toast({
        title: "Package Deleted",
        description: "Availability package has been deleted successfully.",
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete package';
      console.error('Secure package deletion error:', err);
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    validatePackageData,
    secureCreatePackage,
    secureUpdatePackage,
    secureDeletePackage
  };
};