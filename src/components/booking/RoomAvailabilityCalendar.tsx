
import React, { useState } from "react";
import { Room, HighlightedBooking } from "@/types/booking";
import { format, addMonths, subMonths } from "date-fns";
import { Calendar } from "lucide-react";
import { MonthNavigation } from "./MonthNavigation";
import { CalendarHeader } from "./CalendarHeader";
import { RoomRow } from "./RoomRow";
import { EmptyCalendarState } from "./EmptyCalendarState";

interface RoomAvailabilityCalendarProps {
  rooms: Room[];
  onAddStay?: (roomId: string, startDate: Date, duration: number) => void;
  highlightNewBooking?: HighlightedBooking | null;
}

export function RoomAvailabilityCalendar({ 
  rooms,
  onAddStay,
  highlightNewBooking
}: RoomAvailabilityCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  // Generate array of days for the month header
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  
  // Group days by tens for cleaner header
  const dayGroups = [];
  for (let i = 0; i < daysInMonth; i += 10) {
    const end = Math.min(i + 9, daysInMonth);
    dayGroups.push(`${i + 1}-${end}`);
  }
  
  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };
  
  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };
  
  return (
    <div className="bg-[#5A1876]/20 rounded-lg p-4 border border-fuchsia-800/30 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-medium">Room Availability Calendar</h3>
        <MonthNavigation 
          currentDate={currentDate}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
        />
      </div>
      
      <div className="overflow-x-auto">
        <div className="min-w-[640px]">
          {/* Calendar header with days */}
          <CalendarHeader dayGroups={dayGroups} />
          
          {/* Room rows */}
          {rooms.length > 0 ? (
            rooms.map((room) => (
              <RoomRow
                key={room.id}
                room={room}
                month={currentMonth}
                year={currentYear}
                daysArray={daysArray}
                highlightedBooking={highlightNewBooking}
              />
            ))
          ) : (
            <EmptyCalendarState />
          )}
        </div>
      </div>
    </div>
  );
}
