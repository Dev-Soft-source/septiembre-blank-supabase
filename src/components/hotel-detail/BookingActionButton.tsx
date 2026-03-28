
import React from "react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface BookingActionButtonProps {
  isBookingDisabled: boolean;
  bookingConfirmed: boolean;
  handleBookingClick: () => void;
}

export function BookingActionButton({
  isBookingDisabled,
  bookingConfirmed,
  handleBookingClick
}: BookingActionButtonProps) {
  const { t } = useTranslation('booking');
  
  return (
    <Button 
      className={`w-full ${isBookingDisabled ? 'bg-gray-500 cursor-not-allowed' : 'bg-fuchsia-500 hover:bg-fuchsia-700'} text-white`} 
      onClick={handleBookingClick}
      disabled={isBookingDisabled}
    >
      {bookingConfirmed ? t('bookingConfirmed', 'Booking Confirmed') : t('bookNow', 'Book Now')}
    </Button>
  );
}
