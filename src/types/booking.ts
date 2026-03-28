
import { addDays } from "date-fns";

// Enum for booking statuses
export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed'
}

// Type for a booked stay
export interface BookedStay {
  id: string;
  roomId: string;
  startDate: Date;
  endDate: Date;
  duration: number;
}

// Type for a room with its bookings
export interface Room {
  id: string;
  roomTypeId: string;
  bookings: BookedStay[];
}

// Type for a new stay request
export interface StayRequest {
  startDate: Date;
  endDate: Date;
  duration: number;
}

// Type for a gap between bookings
export interface BookingGap {
  startDate: Date;
  endDate: Date;
  size: number;
}

// Type for calendar display position
export interface CalendarPosition {
  start: number;
  width: number;
}

// Type for new booking highlight
export interface HighlightedBooking {
  roomId: string;
  startDate: Date;
  endDate: Date;
}

// Enhanced booking interface with modification capabilities
export interface BookingModification {
  bookingId: string;
  newCheckIn: string;
  newCheckOut: string;
  modifiedBy: string;
  modifiedAt: string;
}
