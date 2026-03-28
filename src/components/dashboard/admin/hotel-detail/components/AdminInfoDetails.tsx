
import React from "react";
import { AdminHotelDetail } from "@/types/hotel";
import { useHotelAvailability } from "../hooks/useHotelAvailability";

interface AdminInfoDetailsProps {
  hotel: AdminHotelDetail;
  totalBookings: number;
}

export function AdminInfoDetails({ hotel, totalBookings }: AdminInfoDetailsProps) {
  // Calculate total rooms from the hotel's total_rooms field
  const totalRooms = hotel.total_rooms || 0;
  // Get availability for next 90 days
  const { availableDays } = useHotelAvailability(hotel.id);
  
  return (
    <>
      <div>
        <p className="text-sm text-gray-400">Hotel ID</p>
        <p className="font-medium font-mono text-xs">{hotel.id}</p>
      </div>
      <div>
        <p className="text-sm text-gray-400">Published</p>
        <p className="font-medium">{hotel.status === 'approved' ? "Yes" : "No"}</p>
      </div>
      <div>
        <p className="text-sm text-gray-400">Total Bookings</p>
        <p className="font-medium">{totalBookings}</p>
      </div>
      <div>
        <p className="text-sm text-gray-400">Total Rooms</p>
        <p className="font-medium">{totalRooms}</p>
      </div>
      <div>
        <p className="text-sm text-gray-400">Available days (next 90)</p>
        <p className="font-medium">{availableDays}</p>
      </div>
      <div>
        <p className="text-sm text-gray-400">Created At</p>
        <p className="font-medium">{new Date(hotel.created_at).toLocaleString()}</p>
      </div>
      <div>
        <p className="text-sm text-gray-400">Last Updated</p>
        <p className="font-medium">{new Date(hotel.updated_at).toLocaleString()}</p>
      </div>
      {/* Removed rejection_reason field as it no longer exists in the schema */}
    </>
  );
}
