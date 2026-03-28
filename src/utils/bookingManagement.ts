
import { Room } from "@/types/booking";

/**
 * Gets all bookings for a specific month, grouped by room
 */
export const getMonthBookings = (
  allRooms: Room[],
  month: number, // 0-11
  year: number
): Room[] => {
  const monthStart = new Date(year, month, 1);
  const monthEnd = new Date(year, month + 1, 0);

  return allRooms
    .map((room) => ({
      ...room,
      bookings: room.bookings.filter(
        (booking) =>
          (booking.startDate >= monthStart || booking.startDate.getTime() === monthStart.getTime()) &&
          (booking.startDate <= monthEnd || booking.startDate.getTime() === monthEnd.getTime())
      ),
    }))
    .filter((room) => room.bookings.length > 0);
};

/**
 * Utility to simulate booking data for visualization
 */
export const generateSampleBookings = (): Room[] => {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  // Create sample room data
  const rooms: Room[] = [
    {
      id: "room-1",
      roomTypeId: "single",
      bookings: [
        {
          id: "booking-1",
          roomId: "room-1",
          startDate: new Date(currentYear, currentMonth, 5),
          endDate: new Date(currentYear, currentMonth, 13),
          duration: 8,
        },
      ],
    },
    {
      id: "room-2",
      roomTypeId: "single",
      bookings: [
        {
          id: "booking-2",
          roomId: "room-2",
          startDate: new Date(currentYear, currentMonth, 15),
          endDate: new Date(currentYear, currentMonth, 23),
          duration: 8,
        },
      ],
    },
    {
      id: "room-3",
      roomTypeId: "double",
      bookings: [
        {
          id: "booking-3",
          roomId: "room-3",
          startDate: new Date(currentYear, currentMonth, 18),
          endDate: new Date(currentYear, currentMonth, 34),
          duration: 16,
        },
      ],
    },
  ];

  return rooms;
};
