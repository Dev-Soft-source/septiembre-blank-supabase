
import { useToast, toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, addDays } from "date-fns";
import { BookingFormActions } from "./BookingFormActions";
import { DynamicPricingBar } from "./DynamicPricingBar";
import { BookingSuccessMessage } from "./BookingSuccessMessage";
import { useBookingState } from "@/hooks/useBookingState";

interface BookingFormProps {
  hotelId: string;
  hotelName: string;
  pricePerMonth: number;
  availableStayLengths?: number[];
}

export function BookingForm({ hotelId, hotelName, pricePerMonth, availableStayLengths }: BookingFormProps) {
  const {
    startDate, setStartDate,
    duration, setDuration,
    loading, setLoading,
    booked, setBooked,
    rooms, setRooms,
    selectedRoomType, setSelectedRoomType,
    newBooking, setNewBooking,
    nightsSold, totalNights, dynamicPrice, priceIncrease
  } = useBookingState(pricePerMonth, hotelName);
  const { toast: useToastRef } = useToast();

  const endDate = startDate ? addDays(startDate, duration) : null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!startDate) {
      toast.error("Please select a check-in date");
      return;
    }
   
    setTimeout(() => {
      // Assign the room (existing logic)
      const { assignRoom } = require("@/utils/roomAssignmentLogic");
      const { StayRequest } = require("@/types/booking");
      const stayRequest = {
        startDate,
        endDate: endDate!,
        duration
      };
      const { roomId, isNewRoom } = assignRoom(stayRequest, rooms, selectedRoomType);
      const newBookingId = `booking-${Date.now()}`;
      const bookingToAdd = {
        id: newBookingId,
        roomId,
        startDate,
        endDate: endDate!,
        duration
      };
      setRooms((prevRooms: any[]) => {
        if (isNewRoom) {
          return [
            ...prevRooms,
            {
              id: roomId,
              roomTypeId: selectedRoomType,
              bookings: [bookingToAdd]
            }
          ];
        } else {
          return prevRooms.map(room => 
            room.id === roomId
              ? { ...room, bookings: [...room.bookings, bookingToAdd] }
              : room
          );
        }
      });
      setNewBooking({ roomId, startDate, endDate: endDate! });
      setLoading(false);
      setBooked(true);
      toast.success("Booking confirmed!", {
        description: `Your stay at ${hotelName} has been booked in ${roomId}.`
      });
    }, 1500);
  };

  return (
    <div className="rounded-2xl overflow-hidden bg-[#5C088F]">
      <div className="p-6">
        <h3 className="text-xl font-bold mb-4 text-white">Book your stay</h3>
        {booked ? (
          <BookingSuccessMessage
            hotelName={hotelName}
            onReset={() => setBooked(false)}
          />
        ) : (
          <form onSubmit={handleSubmit}>
            <BookingFormActions
              startDate={startDate}
              setStartDate={setStartDate}
              duration={duration}
              setDuration={setDuration}
              selectedRoomType={selectedRoomType}
              setSelectedRoomType={setSelectedRoomType}
              rooms={rooms}
              newBooking={newBooking}
              endDate={endDate}
              dynamicPrice={dynamicPrice}
              availableStayLengths={availableStayLengths}
            />
            <DynamicPricingBar
              nightsSold={nightsSold}
              totalNights={totalNights}
              priceIncrease={priceIncrease}
            />
            <button
              type="submit"
              disabled={loading || !startDate}
              className={cn(
                "w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg px-4 py-3 transition-colors",
                (loading || !startDate) && "opacity-70 cursor-not-allowed"
              )}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                "Book now"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
