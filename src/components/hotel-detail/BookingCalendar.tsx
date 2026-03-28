
import React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";

interface BookingCalendarProps {
  checkInDate: Date | undefined;
  setCheckInDate: (date: Date | undefined) => void;
  preferredWeekday: string;
  availableMonths?: string[];
  bookingConfirmed: boolean;
}

export function BookingCalendar({
  checkInDate,
  setCheckInDate,
  preferredWeekday,
  availableMonths,
  bookingConfirmed
}: BookingCalendarProps) {
  const availableDates = availableMonths || [];

  const isDateAvailable = (date: Date): boolean => {
    if (!availableDates || availableDates.length === 0) {
      return true;
    }

    const formattedDate = format(date, "MMMM").toLowerCase();
    return availableDates.some(month => month.toLowerCase() === formattedDate);
  };

  const isDateSelectable = (date: Date): boolean => {
    const day = format(date, "EEEE");
    const isPreferredDay = day === preferredWeekday;
    const isAvailable = isDateAvailable(date);
    
    return isPreferredDay && isAvailable;
  };

  if (bookingConfirmed) {
    return null;
  }

  return (
    <Card className="border-none shadow-none bg-transparent">
      <Calendar
        mode="single"
        selected={checkInDate}
        onSelect={(date) => {
          if (date && isDateSelectable(date)) {
            setCheckInDate(date);
          }
        }}
        disabled={date => !isDateSelectable(date)}
        className="border rounded-md w-full mx-auto bg-fuchsia-950/30 text-white"
      />
    </Card>
  );
}
