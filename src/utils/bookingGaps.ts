
import { differenceInDays, isAfter, isBefore, isSameDay, addDays } from "date-fns";
import { BookedStay, Room, BookingGap, CalendarPosition } from "@/types/booking";

/**
 * Sort bookings chronologically by start date
 */
export const sortBookings = (bookings: BookedStay[]): BookedStay[] => {
  return [...bookings].sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
};

/**
 * Find all gaps between bookings in a room
 * This includes the gap from "now" to the first booking
 * and the gap after the last booking
 */
export const findGapsBetweenBookings = (
  bookings: BookedStay[], 
  referenceDate: Date = new Date()
): BookingGap[] => {
  // If there are no bookings, the entire future is available
  if (bookings.length === 0) {
    return [{ 
      startDate: referenceDate, 
      endDate: addDays(referenceDate, 365), // Assume 1 year availability
      size: 365 
    }];
  }
  
  // Sort bookings chronologically
  const sortedBookings = sortBookings(bookings);
  const gaps: BookingGap[] = [];
  
  // Check if there's a gap before the first booking
  if (isBefore(referenceDate, sortedBookings[0].startDate)) {
    gaps.push({
      startDate: referenceDate,
      endDate: addDays(sortedBookings[0].startDate, -1),
      size: differenceInDays(sortedBookings[0].startDate, referenceDate)
    });
  }
  
  // Find gaps between bookings
  for (let i = 0; i < sortedBookings.length - 1; i++) {
    const currentBookingEnd = sortedBookings[i].endDate;
    const nextBookingStart = sortedBookings[i + 1].startDate;
    
    // If there's at least 1 day between bookings
    if (differenceInDays(nextBookingStart, currentBookingEnd) > 1) {
      gaps.push({
        startDate: addDays(currentBookingEnd, 1),
        endDate: addDays(nextBookingStart, -1),
        size: differenceInDays(nextBookingStart, currentBookingEnd) - 1
      });
    }
  }
  
  // Check if there's a gap after the last booking (assume 1 year availability)
  const lastBooking = sortedBookings[sortedBookings.length - 1];
  gaps.push({
    startDate: addDays(lastBooking.endDate, 1),
    endDate: addDays(lastBooking.endDate, 365), // Assume 1 year availability
    size: 365
  });
  
  return gaps;
};

/**
 * Calculate available gaps in a room for a specific month
 * Returns the gaps as positions for visualization
 */
export const calculateAvailableGapsForMonth = (
  room: Room,
  month: number,
  year: number
): CalendarPosition[] => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthStart = new Date(year, month, 1);
  const monthEnd = new Date(year, month, daysInMonth);
  
  // Get all bookings for this room in this month
  const relevantBookings = room.bookings.filter(booking => {
    // Check if booking overlaps with the month
    return (
      (isAfter(booking.startDate, monthStart) || isSameDay(booking.startDate, monthStart) || 
       isAfter(monthStart, booking.startDate)) &&
      (isBefore(booking.endDate, monthEnd) || isSameDay(booking.endDate, monthEnd) || 
       isBefore(monthEnd, booking.endDate))
    );
  });
  
  if (relevantBookings.length === 0) {
    // If no bookings, the entire month is available
    return [{
      start: 0,
      width: 100
    }];
  }
  
  // Find all gaps in the month
  const sortedBookings = sortBookings(relevantBookings);
  const gaps = [];
  
  // Check for gap at the beginning of the month
  const firstBooking = sortedBookings[0];
  if (isAfter(firstBooking.startDate, monthStart)) {
    const gapDays = differenceInDays(firstBooking.startDate, monthStart);
    if (gapDays > 0) {
      gaps.push({
        start: 0,
        width: (gapDays / daysInMonth) * 100
      });
    }
  }
  
  // Check for gaps between bookings
  for (let i = 0; i < sortedBookings.length - 1; i++) {
    const currentBookingEnd = sortedBookings[i].endDate;
    const nextBookingStart = sortedBookings[i + 1].startDate;
    
    if (isAfter(nextBookingStart, currentBookingEnd)) {
      // Ensure we're only considering days within the month
      const gapStart = isAfter(currentBookingEnd, monthStart) ? 
        currentBookingEnd : monthStart;
      const gapEnd = isBefore(nextBookingStart, monthEnd) ? 
        nextBookingStart : monthEnd;
      
      if (isAfter(gapEnd, gapStart)) {
        const startDay = Math.max(1, gapStart.getDate());
        const endDay = Math.min(gapEnd.getDate(), daysInMonth);
        const start = ((startDay - 1) / daysInMonth) * 100;
        const width = ((endDay - startDay + 1) / daysInMonth) * 100;
        
        if (width > 0) {
          gaps.push({ start, width });
        }
      }
    }
  }
  
  // Check for gap at the end of the month
  const lastBooking = sortedBookings[sortedBookings.length - 1];
  if (isBefore(lastBooking.endDate, monthEnd)) {
    const gapDays = differenceInDays(monthEnd, lastBooking.endDate);
    if (gapDays > 0) {
      const startDay = lastBooking.endDate.getDate() + 1;
      const start = ((startDay - 1) / daysInMonth) * 100;
      const width = ((daysInMonth - startDay + 1) / daysInMonth) * 100;
      
      if (width > 0) {
        gaps.push({ start, width });
      }
    }
  }
  
  return gaps;
};
