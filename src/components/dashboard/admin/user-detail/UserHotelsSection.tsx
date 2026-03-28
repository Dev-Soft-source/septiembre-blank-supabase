
import React from "react";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { UserHotel } from "./hooks/user-data/useUserHotels";

interface UserHotelsSectionProps {
  hotels: UserHotel[];
  loading?: boolean;
}

export const UserHotelsSection = ({ hotels, loading = false }: UserHotelsSectionProps) => {
  if (loading) {
    return (
      <div className="py-4 text-center">
        <div className="animate-pulse flex space-x-2 justify-center">
          <div className="h-2.5 w-2.5 bg-gray-300 rounded-full"></div>
          <div className="h-2.5 w-2.5 bg-gray-300 rounded-full"></div>
          <div className="h-2.5 w-2.5 bg-gray-300 rounded-full"></div>
        </div>
        <p className="mt-2 text-sm text-gray-500">Loading hotel information...</p>
      </div>
    );
  }

  if (hotels.length === 0) {
    return <p className="text-center py-4 text-gray-500">No hotels registered for this user.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>City</TableHead>
          <TableHead>Country</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {hotels.map((hotel) => (
          <TableRow key={hotel.id}>
            <TableCell>{hotel.name}</TableCell>
            <TableCell>{hotel.city}</TableCell>
            <TableCell>{hotel.country}</TableCell>
            <TableCell>
              <StatusBadge status={hotel.status} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

// Helper component to render status badge with appropriate color
const StatusBadge = ({ status }: { status: string }) => {
  switch (status?.toLowerCase()) {
    case 'approved':
      return <Badge variant="success">{status}</Badge>;
    case 'pending':
      return <Badge variant="warning">{status}</Badge>;
    case 'rejected':
      return <Badge variant="destructive">{status}</Badge>;
    default:
      return <Badge variant="outline">{status || 'Unknown'}</Badge>;
  }
};
