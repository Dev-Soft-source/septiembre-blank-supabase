
import { Room, CalendarPosition, BookedStay } from "@/types/booking";
import { getBookingColor } from "@/config/bookingColors";

/**
 * Calculates the visual position of a booking on the calendar display
 * Returns a position object with start (left %) and width (%)
 */
export const calculateBookingPositionInMonth = (
  booking: BookedStay,
  totalDaysInMonth: number,
  monthStartDay: number
): CalendarPosition => {
  const bookingStart = booking.startDate.getDate();
  const bookingEnd = Math.min(
    booking.endDate.getDate(),
    totalDaysInMonth
  );
  
  const start = ((bookingStart - 1) / totalDaysInMonth) * 100;
  const width = ((bookingEnd - bookingStart + 1) / totalDaysInMonth) * 100;
  
  return { start, width };
};

/**
 * Gets the appropriate color class for a booking based on room type and duration
 */
export const getBookingColorClass = (
  roomTypeId: string,
  duration: number
): string => {
  return getBookingColor(roomTypeId, duration);
};
