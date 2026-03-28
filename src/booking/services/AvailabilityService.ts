// @ts-nocheck
// TypeScript checking disabled for database schema compatibility
/**
 * Availability Logic Service
 * Handles room and package availability calculations
 */

import { supabase } from '@/integrations/supabase/client';
import { Room, BookingGap, StayRequest } from '@/types/booking';
import { addDays, differenceInDays, isWithinInterval, parseISO } from 'date-fns';

export interface AvailabilityQuery {
  hotelId: string;
  checkIn: Date;
  checkOut: Date;
  roomType?: string;
}

export class AvailabilityService {
  /**
   * Check room availability for given dates
   */
  async checkRoomAvailability(query: AvailabilityQuery): Promise<boolean> {
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('check_in, check_out')
      .eq('hotel_id', query.hotelId)
      .eq('status', 'confirmed')
      .gte('check_out', query.checkIn.toISOString())
      .lte('check_in', query.checkOut.toISOString());

    if (error) {
      console.error('Error checking availability:', error);
      return false;
    }

    // Check for conflicts
    const hasConflict = bookings?.some(booking => {
      const bookingStart = parseISO(booking.check_in);
      const bookingEnd = parseISO(booking.check_out);
      
      return isWithinInterval(query.checkIn, { start: bookingStart, end: bookingEnd }) ||
             isWithinInterval(query.checkOut, { start: bookingStart, end: bookingEnd }) ||
             (query.checkIn <= bookingStart && query.checkOut >= bookingEnd);
    });

    return !hasConflict;
  }

  /**
   * Find available rooms for a stay request
   */
  findAvailableRooms(rooms: Room[], stayRequest: StayRequest): Room[] {
    return rooms.filter(room => {
      // Check if room has conflicts with the requested dates
      const hasConflict = room.bookings.some(booking => {
        return this.datesOverlap(
          stayRequest.startDate,
          stayRequest.endDate,
          booking.startDate,
          booking.endDate
        );
      });

      return !hasConflict;
    });
  }

  /**
   * Find the best available room based on booking gaps
   */
  findBestAvailableRoom(rooms: Room[], stayRequest: StayRequest): Room | null {
    const availableRooms = this.findAvailableRooms(rooms, stayRequest);
    
    if (availableRooms.length === 0) {
      return null;
    }

    // Find room with the smallest suitable gap
    let bestRoom = availableRooms[0];
    let smallestGapSize = Infinity;

    for (const room of availableRooms) {
      const gaps = this.findBookingGaps(room);
      const suitableGap = gaps.find(gap => 
        gap.size >= stayRequest.duration &&
        gap.startDate <= stayRequest.startDate &&
        gap.endDate >= stayRequest.endDate
      );

      if (suitableGap && suitableGap.size < smallestGapSize) {
        smallestGapSize = suitableGap.size;
        bestRoom = room;
      }
    }

    return bestRoom;
  }

  /**
   * Calculate booking gaps in a room's schedule
   */
  findBookingGaps(room: Room): BookingGap[] {
    if (room.bookings.length === 0) {
      // Room has no bookings - full availability
      const yearStart = new Date(new Date().getFullYear(), 0, 1);
      const yearEnd = new Date(new Date().getFullYear(), 11, 31);
      return [{
        startDate: yearStart,
        endDate: yearEnd,
        size: differenceInDays(yearEnd, yearStart)
      }];
    }

    // Sort bookings by start date
    const sortedBookings = [...room.bookings].sort(
      (a, b) => a.startDate.getTime() - b.startDate.getTime()
    );

    const gaps: BookingGap[] = [];
    const yearStart = new Date(new Date().getFullYear(), 0, 1);

    // Gap before first booking
    if (sortedBookings[0].startDate > yearStart) {
      gaps.push({
        startDate: yearStart,
        endDate: sortedBookings[0].startDate,
        size: differenceInDays(sortedBookings[0].startDate, yearStart)
      });
    }

    // Gaps between bookings
    for (let i = 0; i < sortedBookings.length - 1; i++) {
      const currentEnd = sortedBookings[i].endDate;
      const nextStart = sortedBookings[i + 1].startDate;

      if (currentEnd < nextStart) {
        gaps.push({
          startDate: currentEnd,
          endDate: nextStart,
          size: differenceInDays(nextStart, currentEnd)
        });
      }
    }

    // Gap after last booking
    const yearEnd = new Date(new Date().getFullYear(), 11, 31);
    const lastBookingEnd = sortedBookings[sortedBookings.length - 1].endDate;
    if (lastBookingEnd < yearEnd) {
      gaps.push({
        startDate: lastBookingEnd,
        endDate: yearEnd,
        size: differenceInDays(yearEnd, lastBookingEnd)
      });
    }

    return gaps;
  }

  /**
   * Get hotel capacity and occupancy rates
   */
  async getOccupancyStats(hotelId: string, month: number, year: number) {
    const { data: hotel, error: hotelError } = await supabase
      .from('hotels')
      .select('total_rooms')
      .eq('id', hotelId)
      .single();

    if (hotelError || !hotel) {
      throw new Error('Hotel not found');
    }

    const monthStart = new Date(year, month, 1);
    const monthEnd = new Date(year, month + 1, 0);

    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('check_in, check_out')
      .eq('hotel_id', hotelId)
      .eq('status', 'confirmed')
      .gte('check_out', monthStart.toISOString())
      .lte('check_in', monthEnd.toISOString());

    if (bookingsError) {
      throw new Error('Failed to fetch booking data');
    }

    const daysInMonth = monthEnd.getDate();
    const totalRoomNights = hotel.total_rooms * daysInMonth;
    
    const occupiedNights = this.calculateOccupiedNights(bookings || [], monthStart, monthEnd);
    const occupancyRate = (occupiedNights / totalRoomNights) * 100;

    return {
      totalRooms: hotel.total_rooms,
      daysInMonth,
      totalRoomNights,
      occupiedNights,
      occupancyRate: Math.round(occupancyRate * 100) / 100
    };
  }

  /**
   * Private helper: Check if two date ranges overlap
   */
  private datesOverlap(start1: Date, end1: Date, start2: Date, end2: Date): boolean {
    return start1 < end2 && end1 > start2;
  }

  /**
   * Private helper: Calculate occupied nights in a month
   */
  private calculateOccupiedNights(bookings: any[], monthStart: Date, monthEnd: Date): number {
    return bookings.reduce((total, booking) => {
      const bookingStart = new Date(Math.max(parseISO(booking.check_in).getTime(), monthStart.getTime()));
      const bookingEnd = new Date(Math.min(parseISO(booking.check_out).getTime(), monthEnd.getTime()));
      
      if (bookingStart < bookingEnd) {
        return total + differenceInDays(bookingEnd, bookingStart);
      }
      return total;
    }, 0);
  }
}

export const availabilityService = new AvailabilityService();