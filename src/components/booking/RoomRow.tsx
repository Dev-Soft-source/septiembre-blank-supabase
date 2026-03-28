
import React from "react";
import { Room, HighlightedBooking } from "@/types/booking";
import { calculateBookingPosition } from "@/utils/dateUtils";
import { calculateAvailableGapsForMonth } from "@/utils/bookingGaps";
import { BookingBar } from "./BookingBar";
import { GapIndicator } from "./GapIndicator";

interface RoomRowProps {
  room: Room;
  month: number;
  year: number;
  daysArray: number[];
  highlightedBooking: HighlightedBooking | null;
}

export function RoomRow({ 
  room, 
  month, 
  year, 
  daysArray, 
  highlightedBooking 
}: RoomRowProps) {
  // Calculate available gaps for visualization
  const availableGaps = calculateAvailableGapsForMonth(room, month, year);
  
  // Check if a booking is the highlighted one
  const isHighlightedBooking = (roomId: string, booking: { startDate: Date; endDate: Date }) => {
    if (!highlightedBooking) return false;
    
    return (
      roomId === highlightedBooking.roomId &&
      booking.startDate.getTime() === highlightedBooking.startDate.getTime() &&
      booking.endDate.getTime() === highlightedBooking.endDate.getTime()
    );
  };
  
  return (
    <div className="flex border-b border-fuchsia-800/20 hover:bg-fuchsia-900/10">
      <div className="w-1/6 p-2 text-xs">
        {room.id} ({room.roomTypeId})
      </div>
      <div className="w-5/6 relative py-2">
        {/* Day columns for visualization */}
        <div className="absolute inset-0 flex">
          {daysArray.map((day) => (
            <div 
              key={day} 
              className="flex-1 border-l border-fuchsia-800/10 h-full" 
            />
          ))}
        </div>
        
        {/* Available gaps in room */}
        <GapIndicator gaps={availableGaps} />
        
        {/* Bookings for this room */}
        <div className="relative h-8">
          {room.bookings.map((booking, i) => {
            const position = calculateBookingPosition(
              booking, 
              month, 
              year
            );
            
            const isHighlighted = isHighlightedBooking(room.id, booking);
            
            return (
              <BookingBar
                key={i}
                booking={booking}
                roomTypeId={room.roomTypeId}
                position={position}
                isHighlighted={isHighlighted}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
