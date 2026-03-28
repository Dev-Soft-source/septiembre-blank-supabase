
import { useState, useEffect } from "react";
import { useFirstBookingMode } from "@/hooks/useFirstBookingMode";

interface Hotel {
  id: string;
  name: string;
  location: string;
  price_per_month: number;
}

interface PricingMatrixItem {
  roomType: string;
  stayLength: string | number;
  mealPlan: string;
  price: number;
}

interface UseBookingLogicProps {
  hotel?: Hotel;
  stayDurations?: number[];
  selectedDuration?: number;
  setSelectedDuration?: (duration: number) => void;
  handleBookClick?: () => void;
  pricingMatrix?: PricingMatrixItem[];
}

export function useBookingLogic({
  hotel,
  stayDurations = [],
  selectedDuration = 1,
  setSelectedDuration,
  handleBookClick,
  pricingMatrix = []
}: UseBookingLogicProps) {
  const [selectedOption, setSelectedOption] = useState<PricingMatrixItem | null>(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [confirmedBookingData, setConfirmedBookingData] = useState<any>(null);
  
  const { isFirstTimeUser } = useFirstBookingMode();

  const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const handleBookingClick = (checkInDate?: Date) => {
    if (!selectedOption || !checkInDate) return;
    
    const bookingData = {
      ...selectedOption,
      checkInDate,
      checkOutDate: new Date(checkInDate.getTime() + parseInt(selectedOption.stayLength.toString()) * 24 * 60 * 60 * 1000)
    };
    
    setConfirmedBookingData(bookingData);
    setBookingConfirmed(true);
    
    if (handleBookClick) {
      handleBookClick();
    }
  };

  const isBookingDisabled = !selectedOption;

  return {
    selectedOption,
    setSelectedOption,
    bookingConfirmed,
    confirmedBookingData,
    isFirstTimeUser,
    capitalize,
    handleBookingClick,
    isBookingDisabled
  };
}
