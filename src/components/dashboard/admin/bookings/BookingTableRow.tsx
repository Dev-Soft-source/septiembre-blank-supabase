
import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { StatusBadge } from "./StatusBadge";
import { ActionsMenu } from "./ActionsMenu";
import { format } from "date-fns";

interface BookingTableRowProps {
  booking: any;
  formatDate: (dateString: string) => string;
  formatPrice: (price: number) => string;
  updateBookingStatus: (bookingId: string, newStatus: string) => Promise<void>;
}

export const BookingTableRow: React.FC<BookingTableRowProps> = ({
  booking,
  formatDate,
  formatPrice,
  updateBookingStatus
}) => {
  return (
    <TableRow key={booking.id}>
      <TableCell>{booking.hotel?.name || "Unknown Hotel"}</TableCell>
      <TableCell>
        {booking.user?.first_name} {booking.user?.last_name}
      </TableCell>
      <TableCell>{formatDate(booking.check_in)}</TableCell>
      <TableCell>{formatDate(booking.check_out)}</TableCell>
      <TableCell>{formatPrice(booking.total_price)}</TableCell>
      <TableCell>
        <StatusBadge status={booking.status} />
      </TableCell>
      <TableCell>
        <ActionsMenu 
          bookingId={booking.id} 
          currentStatus={booking.status}
          updateBookingStatus={updateBookingStatus}
        />
      </TableCell>
    </TableRow>
  );
};
