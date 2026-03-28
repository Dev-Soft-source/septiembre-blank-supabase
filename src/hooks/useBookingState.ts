
import { useState, useEffect } from "react";
import { durations } from "@/utils/booking";
import { 
  calculateDynamicPrice, 
  calculateTotalNightsInMonth,
  calculateNightsSold
} from "@/utils/dynamicPricing";
import { Room, StayRequest } from "@/types/booking";
import { assignRoom } from "@/utils/roomAssignmentLogic";
import { generateSampleBookings } from "@/utils/bookingManagement";

export function useBookingState(pricePerMonth: number, hotelName: string) {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [duration, setDuration] = useState<number>(8);
  const [loading, setLoading] = useState(false);
  const [booked, setBooked] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoomType, setSelectedRoomType] = useState("single");
  const [newBooking, setNewBooking] = useState<{
    roomId: string;
    startDate: Date;
    endDate: Date;
  } | null>(null);

  const [nightsSold, setNightsSold] = useState<number>(0);
  const [totalNights, setTotalNights] = useState<number>(0);
  const [dynamicPrice, setDynamicPrice] = useState<number>(pricePerMonth);
  const [priceIncrease, setPriceIncrease] = useState<number>(0);

  useEffect(() => {
    const sampleRooms = generateSampleBookings();
    setRooms(sampleRooms);
  }, []);

  useEffect(() => {
    if (!startDate) return;
    const month = startDate.getMonth();
    const year = startDate.getFullYear();
    const totalRooms = 30;
    const totalAvailableNights = calculateTotalNightsInMonth(totalRooms, year, month);
    setTotalNights(totalAvailableNights);
    const allBookings = rooms.flatMap(room => 
      room.bookings.map(booking => ({
        startDate: booking.startDate,
        endDate: booking.endDate
      }))
    );
    const soldNights = calculateNightsSold(allBookings, year, month);
    setNightsSold(soldNights);

    const dailyPrice = pricePerMonth / 30;
    const dynamicDailyPrice = calculateDynamicPrice(
      dailyPrice,
      totalAvailableNights,
      soldNights
    );

    const percentIncrease = ((dynamicDailyPrice / dailyPrice) - 1) * 100;
    setPriceIncrease(Math.round(percentIncrease));

    setDynamicPrice(dynamicDailyPrice * duration);
  }, [pricePerMonth, duration, startDate, rooms]);

  return {
    startDate, setStartDate,
    duration, setDuration,
    loading, setLoading,
    booked, setBooked,
    rooms, setRooms,
    selectedRoomType, setSelectedRoomType,
    newBooking, setNewBooking,
    nightsSold, totalNights, dynamicPrice, priceIncrease
  };
}
