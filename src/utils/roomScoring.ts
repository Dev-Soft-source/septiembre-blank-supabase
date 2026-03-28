
import { differenceInDays, isAfter, isBefore, isSameDay } from "date-fns";
import { BookedStay, Room, StayRequest, BookingGap } from "@/types/booking";
import { findGapsBetweenBookings } from "./bookingGaps";
import { dateRangesOverlap } from "./dateUtils";

/**
 * Checks if a new stay overlaps with any existing bookings in a room
 */
export const hasOverlap = (newStay: StayRequest, existingBookings: BookedStay[]): boolean => {
  return existingBookings.some(booking => 
    dateRangesOverlap(
      newStay.startDate,
      newStay.endDate,
      booking.startDate,
      booking.endDate
    )
  );
};

/**
 * Check if a stay can fit within a specific gap
 */
export const stayFitsInGap = (stay: StayRequest, gap: BookingGap): boolean => {
  const stayDuration = differenceInDays(stay.endDate, stay.startDate);
  
  // Check if the stay's start date is within the gap
  const startDateInGap = 
    (isAfter(stay.startDate, gap.startDate) || isSameDay(stay.startDate, gap.startDate)) &&
    (isBefore(stay.startDate, gap.endDate) || isSameDay(stay.startDate, gap.endDate));
    
  // Check if the stay's end date is within the gap
  const endDateInGap = 
    (isAfter(stay.endDate, gap.startDate) || isSameDay(stay.endDate, gap.startDate)) &&
    (isBefore(stay.endDate, gap.endDate) || isSameDay(stay.endDate, gap.endDate));
    
  // Check if the stay encompasses the entire gap
  const stayEncompassesGap = 
    (isBefore(stay.startDate, gap.startDate) || isSameDay(stay.startDate, gap.startDate)) &&
    (isAfter(stay.endDate, gap.endDate) || isSameDay(stay.endDate, gap.endDate));
    
  return (startDateInGap && endDateInGap) || stayEncompassesGap;
};

/**
 * Check if a stay can fit in any gap in a room
 */
export const stayFitsInRoom = (stay: StayRequest, room: Room): boolean => {
  // If there are no bookings, the room is available
  if (room.bookings.length === 0) return true;
  
  // If there's an overlap with existing bookings, the room is not available
  if (hasOverlap(stay, room.bookings)) return false;
  
  // Find all gaps and check if the stay fits in any of them
  const gaps = findGapsBetweenBookings(room.bookings);
  return gaps.some(gap => stayFitsInGap(stay, gap));
};

/**
 * Calculate a room score based on how efficiently it uses space
 * Higher scores mean better utilization
 */
export const calculateRoomScore = (stay: StayRequest, room: Room): number => {
  // If the room can't accommodate the stay, return a very negative score
  if (!stayFitsInRoom(stay, room)) return -1000;
  
  // Start with a base score
  let score = 0;
  
  // Find all gaps in the room
  const gaps = findGapsBetweenBookings(room.bookings);
  
  // Find the best fitting gap
  let bestGap: BookingGap | null = null;
  let minWastedSpace = Number.MAX_VALUE;
  
  for (const gap of gaps) {
    if (stayFitsInGap(stay, gap)) {
      // Calculate wasted space (gap size - stay duration)
      const wastedSpace = gap.size - stay.duration;
      
      if (wastedSpace < minWastedSpace) {
        minWastedSpace = wastedSpace;
        bestGap = gap;
      }
    }
  }
  
  if (bestGap) {
    // Adjust score based on how efficiently the gap is used
    // Minimize wasted space (10 points for perfect fit, less for wasted space)
    score += Math.max(0, 10 - minWastedSpace);
    
    // Bonus for filling smaller gaps (promotes efficient room utilization)
    score += Math.max(0, 20 - bestGap.size);
    
    // Bonus for rooms with more bookings (to consolidate bookings)
    score += Math.min(10, room.bookings.length * 2);
  }
  
  return score;
};
