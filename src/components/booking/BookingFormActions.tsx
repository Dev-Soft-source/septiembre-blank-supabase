
import { BookingCalendarSelector } from "./BookingCalendarSelector";
import { BookingDurationSelector } from "./BookingDurationSelector";
import { RoomTypeSelector } from "./RoomTypeSelector";
import { BookingSummaryCard } from "./BookingSummaryCard";
import { RoomType } from "@/types/hotel";

interface BookingFormActionsProps {
  startDate: Date | null;
  setStartDate: (date: Date) => void;
  duration: number;
  setDuration: (val: number) => void;
  selectedRoomType: string;
  setSelectedRoomType: (type: string) => void;
  rooms: any[];
  newBooking: any;
  endDate: Date | null;
  dynamicPrice: number;
  availableStayLengths?: number[];
  availableMonths?: string[];
  preferredWeekday?: string;
  roomTypes?: RoomType[];
}

export function BookingFormActions({
  startDate,
  setStartDate,
  duration,
  setDuration,
  selectedRoomType,
  setSelectedRoomType,
  rooms,
  newBooking,
  endDate,
  dynamicPrice,
  availableStayLengths,
  availableMonths,
  preferredWeekday,
  roomTypes
}: BookingFormActionsProps) {
  return (
    <div className="space-y-4">
      <BookingCalendarSelector
        startDate={startDate}
        setStartDate={setStartDate}
        availableMonths={availableMonths}
        preferredWeekday={preferredWeekday}
      />
      <BookingDurationSelector
        duration={duration}
        setDuration={setDuration}
        allowedDurations={availableStayLengths}
      />
      <RoomTypeSelector
        selectedRoomType={selectedRoomType}
        setSelectedRoomType={setSelectedRoomType}
        roomTypes={roomTypes}
      />
      {startDate && endDate && (
        <BookingSummaryCard
          startDate={startDate}
          endDate={endDate}
          duration={duration}
          dynamicPrice={dynamicPrice}
        />
      )}
    </div>
  );
}
