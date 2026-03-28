
import React from "react";
import { Calendar } from "lucide-react";

export function EmptyCalendarState() {
  return (
    <div className="py-8 text-center text-sm text-fuchsia-300">
      <Calendar className="w-12 h-12 mx-auto mb-2 text-fuchsia-400/50" />
      <p>No rooms with bookings to display for this month</p>
      <p className="text-xs mt-1">New bookings will appear here</p>
    </div>
  );
}
