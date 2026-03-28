
import React from "react";
import { format } from "date-fns";
import { Table, TableBody } from "@/components/ui/table";
import { EmptyBookingsState } from "./EmptyBookingsState";
import { LoadingBookingsState } from "./LoadingBookingsState";
import { BookingsTableHeader } from "./TableHeader";
import { BookingTableRow } from "./BookingTableRow";

interface BookingTableProps {
  bookings: any[];
  loading: boolean;
  sortField: string;
  sortDirection: "asc" | "desc";
  handleSort: (field: string) => void;
  searchTerm: string;
  statusFilter: string;
  updateBookingStatus: (bookingId: string, newStatus: string) => Promise<void>;
}

export const BookingsTable: React.FC<BookingTableProps> = ({
  bookings,
  loading,
  sortField,
  sortDirection,
  handleSort,
  updateBookingStatus
}) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch (error) {
      return dateString;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (loading && bookings.length === 0) {
    return <LoadingBookingsState />;
  }

  if (bookings.length === 0) {
    return <EmptyBookingsState />;
  }

  return (
    <Table>
      <BookingsTableHeader 
        sortField={sortField} 
        sortDirection={sortDirection} 
        handleSort={handleSort} 
      />
      <TableBody>
        {bookings.map(booking => (
          <BookingTableRow 
            key={booking.id}
            booking={booking}
            formatDate={formatDate}
            formatPrice={formatPrice}
            updateBookingStatus={updateBookingStatus}
          />
        ))}
      </TableBody>
    </Table>
  );
};
