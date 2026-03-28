
import React from 'react';
import { Users, Calendar, DollarSign, Flag } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { formatDate } from "./utils/dateUtils";
import { GuestBlacklistCheck } from "./hotel-bookings/GuestBlacklistCheck";

interface GuestData {
  user_id: string;
  first_name: string;
  last_name: string;
  total_stays: number;
  total_spent: number;
  last_visit: string;
  first_visit: string;
  has_reports: boolean;
}

interface GuestListProps {
  guests: GuestData[];
  onReportGuest: (guest: GuestData) => void;
}

export const GuestList: React.FC<GuestListProps> = ({ guests, onReportGuest }) => {
  const getGuestStatusBadge = (guest: GuestData) => {
    if (guest.has_reports) {
      return <span className="px-2 py-1 bg-red-500/20 text-red-300 text-xs rounded">Flagged</span>;
    }
    if (guest.total_stays >= 3) {
      return <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded">Frequent</span>;
    }
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    if (new Date(guest.first_visit) > thirtyDaysAgo) {
      return <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded">New</span>;
    }
    return null;
  };

  if (guests.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No guests found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {guests.map((guest) => {
        const guestName = `${guest.first_name} ${guest.last_name}`.trim() || 'Unknown Guest';
        const isPastGuest = new Date(guest.last_visit) < new Date();
        
        return (
          <div key={guest.user_id} className="border border-fuchsia-900/20 rounded-lg p-4 bg-fuchsia-500/10">
            {/* Guest Alert Check */}
            {guest.has_reports && (
              <GuestBlacklistCheck guestId={guest.user_id} />
            )}
            
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-fuchsia-500/20 flex-shrink-0 flex items-center justify-center mr-3">
                <Users className="w-5 h-5 text-fuchsia-300" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold text-lg">{guestName}</h3>
                  {getGuestStatusBadge(guest)}
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-4">
                  <div className="bg-fuchsia-950/30 p-3 rounded">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-4 h-4 text-fuchsia-300" />
                      <p className="text-xs text-muted-foreground">Total Stays</p>
                    </div>
                    <p className="font-medium">{guest.total_stays}</p>
                  </div>
                  <div className="bg-fuchsia-950/30 p-3 rounded">
                    <div className="flex items-center gap-2 mb-1">
                      <DollarSign className="w-4 h-4 text-fuchsia-300" />
                      <p className="text-xs text-muted-foreground">Total Spent</p>
                    </div>
                    <p className="font-medium">${guest.total_spent}</p>
                  </div>
                  <div className="bg-fuchsia-950/30 p-3 rounded">
                    <p className="text-xs text-muted-foreground">First Visit</p>
                    <p className="font-medium">{formatDate(guest.first_visit)}</p>
                  </div>
                  <div className="bg-fuchsia-950/30 p-3 rounded">
                    <p className="text-xs text-muted-foreground">Last Visit</p>
                    <p className="font-medium">{formatDate(guest.last_visit)}</p>
                  </div>
                </div>
                
                <div className="mt-4 flex gap-2">
                  <button className="px-3 py-1 bg-fuchsia-500/20 hover:bg-fuchsia-500/30 text-fuchsia-200 text-sm rounded">
                    View History
                  </button>
                  {isPastGuest && (
                    <Button
                      onClick={() => onReportGuest(guest)}
                      variant="outline"
                      size="sm"
                      className="px-3 py-1 text-sm"
                    >
                      <Flag className="w-3 h-3 mr-1" />
                      Report Guest
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
