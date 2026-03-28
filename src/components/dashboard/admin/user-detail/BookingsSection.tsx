
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface BookingsSectionProps {
  bookings: any[];
}

export const BookingsSection = ({ bookings }: BookingsSectionProps) => {
  if (bookings.length === 0) {
    return <p className="text-center py-4">No bookings found for this user.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Hotel</TableHead>
          <TableHead>Check In</TableHead>
          <TableHead>Check Out</TableHead>
          <TableHead>Total Price</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {bookings.map((booking) => (
          <TableRow key={booking.id}>
            <TableCell>{booking.hotel?.name || "Unknown Hotel"}</TableCell>
            <TableCell>{new Date(booking.check_in).toLocaleDateString()}</TableCell>
            <TableCell>{new Date(booking.check_out).toLocaleDateString()}</TableCell>
            <TableCell>${booking.total_price}</TableCell>
            <TableCell>
              <span className={`px-2 py-1 rounded-full text-xs ${
                booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                'bg-red-100 text-red-800'
              }`}>
                {booking.status}
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
