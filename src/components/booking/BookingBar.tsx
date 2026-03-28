
import React from "react";
import { BookedStay } from "@/types/booking";
import { formatDateForCalendar } from "@/utils/dateUtils";
import { getBookingColor, getHighlightClass } from "@/config/bookingColors";

interface BookingBarProps {
  booking: BookedStay;
  roomTypeId: string;
  position: { start: number; width: number };
  isHighlighted: boolean;
}

export function BookingBar({
  booking,
  roomTypeId,
  position,
  isHighlighted
}: BookingBarProps) {
  const colorClass = getBookingColor(roomTypeId, booking.duration);
  const highlightClass = getHighlightClass(isHighlighted);
  
  return (
    <div
      className={`absolute top-0 h-full rounded-md flex items-center justify-center text-xs 
        ${colorClass} ${highlightClass}`}
      style={{
        left: `${position.start}%`,
        width: `${position.width}%`,
        minWidth: '40px'
      }}
      title={`${formatDateForCalendar(booking.startDate)} - ${formatDateForCalendar(booking.endDate)} (${booking.duration} days)`}
    >
      {booking.duration}-day
    </div>
  );
}
