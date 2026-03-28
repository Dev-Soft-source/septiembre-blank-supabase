
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';
import { BookingStatus } from '@/types/booking';

export const useBookingOperations = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();

  const canModifyBooking = (status: string) => {
    return status === BookingStatus.PENDING || status === BookingStatus.CONFIRMED;
  };

  const canCancelBooking = (status: string) => {
    return status === BookingStatus.PENDING || status === BookingStatus.CONFIRMED;
  };

  const cancelBooking = async (bookingId: string) => {
    try {
      setLoading(true);

      // First, get the booking details to restore package availability
      const { data: booking, error: fetchError } = await supabase
        .from('bookings')
        .select('package_id, hotel_id, check_in, check_out')
        .eq('id', bookingId)
        .single();

      if (fetchError || !booking) {
        throw new Error('Booking not found');
      }

      // Calculate rooms from booking (assume 1 room per booking for now)
      const roomsToRestore = 1;

      // Restore package availability atomically if package_id exists using enhanced function
      if (booking.package_id) {
        // Simple update approach - get current rooms then increment
        const { data: currentPackage, error: fetchError } = await supabase
          .from('availability_packages')
          .select('rooms')
          .eq('id', booking.package_id)
          .single();

        if (fetchError) {
          throw new Error(`Failed to fetch current package: ${fetchError.message}`);
        }

        const { data: restoreSuccess, error: restoreError } = await supabase
          .from('availability_packages')
          .update({ 
            rooms: (currentPackage.rooms || 0) + roomsToRestore
          })
          .eq('id', booking.package_id);

        if (restoreError || !restoreSuccess) {
          throw new Error(`Failed to restore package availability: ${restoreError?.message || 'Unknown error'}`);
        }
      }

      // Update booking status
      const { error } = await supabase
        .from('bookings')
        .update({ 
          status: BookingStatus.CANCELLED,
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId);

      if (error) throw error;

      // Log the cancellation for audit purposes
      console.log(`Booking ${bookingId} cancelled successfully. Package ${booking.package_id} availability restored with ${roomsToRestore} rooms.`);

      toast({
        title: t('booking.messages.cancelSuccess'),
        description: t('booking.messages.cancelSuccess')
      });

      return true;
    } catch (error: any) {
      console.error('Error cancelling booking:', error);
      toast({
        title: t('booking.messages.cancelError'),
        description: error.message || t('booking.messages.cancelError'),
        variant: 'destructive'
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const modifyBooking = async (bookingId: string, newCheckIn: string, newCheckOut: string) => {
    try {
      setLoading(true);

      // Get current booking details
      const { data: currentBooking, error: fetchError } = await supabase
        .from('bookings')
        .select('package_id, check_in, check_out')
        .eq('id', bookingId)
        .single();

      if (fetchError || !currentBooking) {
        throw new Error('Booking not found');
      }

      // If booking has package_id, prevent modifications to dates (package dates are fixed)
      if (currentBooking.package_id) {
        throw new Error('Cannot modify dates for package-based bookings. Package dates are fixed.');
      }

      // For non-package bookings, allow date modifications
      const { error } = await supabase
        .from('bookings')
        .update({ 
          check_in: newCheckIn,
          check_out: newCheckOut,
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId);

      if (error) throw error;

      // Log the modification for audit purposes
      console.log(`Booking ${bookingId} modified: ${currentBooking.check_in}-${currentBooking.check_out} → ${newCheckIn}-${newCheckOut}`);

      toast({
        title: t('booking.messages.modifySuccess'),
        description: t('booking.messages.modifySuccess')
      });

      return true;
    } catch (error: any) {
      console.error('Error modifying booking:', error);
      toast({
        title: t('booking.messages.modifyError'),
        description: error.message || t('booking.messages.modifyError'),
        variant: 'destructive'
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    canModifyBooking,
    canCancelBooking,
    cancelBooking,
    modifyBooking
  };
};
