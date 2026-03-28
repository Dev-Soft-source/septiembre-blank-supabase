import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AvailabilityPackage } from '@/types/availability-package';

interface BookingData {
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  roomsToReserve: number;
  roomUsageType?: 'single' | 'double';
  pricePerPerson?: number;
}

export const usePackageBookingOperations = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Create Stripe payment session for package booking
  const createStripePaymentSession = async (
    selectedPackage: AvailabilityPackage,
    hotelId: string,
    bookingData: BookingData,
    totalPrice: number
  ) => {
    setLoading(true);

    try {
      console.log('Creating Stripe payment session:', {
        packageId: selectedPackage.id,
        hotelId,
        roomsRequested: bookingData.roomsToReserve,
        guestEmail: bookingData.guestEmail,
        totalPrice
      });

      // Call the create-stripe-session edge function
      const { data, error } = await supabase.functions.invoke('create-stripe-session', {
        body: {
          packageId: selectedPackage.id,
          hotelId,
          bookingData,
          totalPrice,
          successUrl: `${window.location.origin}/booking-success/{CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/booking-failed`
        }
      });

      if (error) {
        throw new Error(error.message || 'Failed to create payment session');
      }

      if (!data?.sessionUrl) {
        throw new Error('No payment session URL received');
      }

      console.log('Stripe session created successfully:', data.sessionId);

      // Redirect to Stripe Checkout
      window.location.href = data.sessionUrl;

    } catch (error: any) {
      console.error('Stripe payment session error:', error);
      
      toast({
        title: "Payment Error",
        description: error.message || 'Failed to start payment process. Please try again.',
        variant: "destructive",
        duration: 5000
      });
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const validateBookingData = (bookingData: BookingData, selectedPackage: AvailabilityPackage) => {
    if (!bookingData.guestName || !bookingData.guestEmail) {
      throw new Error('Guest name and email are required');
    }

    if (bookingData.roomsToReserve <= 0) {
      throw new Error('Number of rooms must be positive');
    }

    if (bookingData.roomsToReserve > selectedPackage.available_rooms) {
      throw new Error(`Only ${selectedPackage.available_rooms} rooms available`);
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(bookingData.guestEmail)) {
      throw new Error('Please enter a valid email address');
    }
  };

  return {
    loading,
    createStripePaymentSession,
    validateBookingData
  };
};