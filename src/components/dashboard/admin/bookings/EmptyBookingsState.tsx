
import React from "react";
import { Calendar } from "lucide-react";

export const EmptyBookingsState: React.FC = () => {
  return (
    <div className="text-center py-10">
      <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
      <h3 className="mt-2 text-lg font-medium">No bookings found</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Try changing your search or filter criteria.
      </p>
    </div>
  );
};
