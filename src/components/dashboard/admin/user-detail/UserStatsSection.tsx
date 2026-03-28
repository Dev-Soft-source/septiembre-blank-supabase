
import React from "react";
import { formatDate } from "../../utils/dateUtils";

interface UserStatsSectionProps {
  bookings: any[];
  favorites: any[];
}

export const UserStatsSection = ({ bookings, favorites }: UserStatsSectionProps) => {
  // Calculate statistics
  const totalBookings = bookings.length;
  const totalFavorites = favorites.length;
  
  // Sort bookings by date for first/last booking
  const sortedBookings = [...bookings].sort((a, b) => 
    new Date(a.check_in).getTime() - new Date(b.check_in).getTime()
  );
  
  const firstBookingDate = sortedBookings[0]?.check_in 
    ? formatDate(sortedBookings[0].check_in) 
    : "N/A";
    
  const lastBookingDate = sortedBookings[sortedBookings.length - 1]?.check_in 
    ? formatDate(sortedBookings[sortedBookings.length - 1].check_in) 
    : "N/A";

  return (
    <div className="glass-card rounded-xl p-6 bg-white/5 backdrop-blur-sm mb-6">
      <h3 className="text-xl font-semibold mb-4 border-b pb-2">User Activity Overview</h3>
      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        <div className="p-3 rounded-lg bg-white/10 text-center">
          <div className="text-3xl font-bold">{totalBookings}</div>
          <div className="text-sm text-muted-foreground">Total Bookings</div>
        </div>
        <div className="p-3 rounded-lg bg-white/10 text-center">
          <div className="text-3xl font-bold">{totalFavorites}</div>
          <div className="text-sm text-muted-foreground">Saved Hotels</div>
        </div>
        <div className="p-3 rounded-lg bg-white/10 text-center">
          <div className="text-sm text-muted-foreground">First Booking</div>
          <div className="text-base font-medium">{firstBookingDate}</div>
        </div>
        <div className="p-3 rounded-lg bg-white/10 text-center">
          <div className="text-sm text-muted-foreground">Latest Booking</div>
          <div className="text-base font-medium">{lastBookingDate}</div>
        </div>
      </div>
    </div>
  );
};
