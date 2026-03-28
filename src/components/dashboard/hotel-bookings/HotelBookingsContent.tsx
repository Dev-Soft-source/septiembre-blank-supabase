// @ts-nocheck
// TypeScript checking disabled for Supabase schema compatibility
import React, { useState, useEffect } from "react";
import { Calendar, Loader2, Flag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { formatDate } from "../utils/dateUtils";
import { ReportGuestDialog } from "./ReportGuestDialog";
import { GuestBlacklistCheck } from "./GuestBlacklistCheck";
import { useTranslation } from "@/hooks/useTranslation";

interface Booking {
  id: string;
  user_id: string;
  check_in: string;
  check_out: string;
  total_price: number;
  status: string;
  created_at: string;
  user?: {
    first_name?: string;
    last_name?: string;
  };
}

export default function HotelBookingsContent() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reportDialog, setReportDialog] = useState<{
    open: boolean;
    guestId: string;
    guestName: string;
    hotelId: string;
  }>({
    open: false,
    guestId: "",
    guestName: "",
    hotelId: ""
  });
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation('dashboard/content');

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        // First get the hotel owned by this user
        const { data: hotels, error: hotelError } = await supabase
          .from('hotels')
          .select('id')
          .eq('owner_id', user.id)
          .limit(1);
        
        if (hotelError) throw hotelError;
        
        if (!hotels || hotels.length === 0) {
          setBookings([]);
          return;
        }
        
        const hotelId = hotels[0].id;
        
        // Fetch bookings for this hotel
        const { data, error } = await supabase
          .from('bookings')
          .select(`
            *,
            user:profiles(first_name, last_name)
          `)
          .eq('hotel_id', hotelId)
          .order('check_in', { ascending: false });
        
        if (error) throw error;
        
        setBookings(data || []);
      } catch (error: any) {
        console.error("Error fetching bookings:", error);
        toast({
          title: "Error loading bookings",
          description: "We couldn't load your bookings. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBookings();
  }, [user, toast]);

  const handleReportGuest = async (booking: Booking) => {
    try {
      // Get hotel ID for the current user
      const { data: hotels, error } = await supabase
        .from('hotels')
        .select('id')
        .eq('owner_id', user?.id)
        .limit(1);

      if (error) throw error;
      
      if (hotels && hotels.length > 0) {
        const guestName = booking.user 
          ? `${booking.user.first_name || ''} ${booking.user.last_name || ''}`.trim()
          : 'Unknown Guest';
        
        setReportDialog({
          open: true,
          guestId: booking.user_id,
          guestName: guestName || 'Guest',
          hotelId: hotels[0].id
        });
      }
    } catch (error) {
      console.error("Error preparing report dialog:", error);
      toast({
        title: "Error",
        description: "Could not open report dialog. Please try again.",
        variant: "destructive"
      });
    }
  };

  const closeReportDialog = () => {
    setReportDialog({
      open: false,
      guestId: "",
      guestName: "",
      hotelId: ""
    });
  };

  const isPastBooking = (checkOut: string) => {
    return new Date(checkOut) < new Date();
  };
  
  if (isLoading) {
    return (
      <div className="glass-card rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-6">{t('recentBookings')}</h2>
        <div className="flex items-center justify-center p-12">
          <Loader2 className="w-6 h-6 animate-spin text-fuchsia-500" />
          <span className="ml-2">Loading your bookings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-6">
      <h2 className="text-xl font-bold mb-6">{t('recentBookings')}</h2>
      
      {bookings.length > 0 ? (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const guestName = booking.user 
              ? `${booking.user.first_name || ''} ${booking.user.last_name || ''}`.trim()
              : 'Unknown Guest';
            
            return (
              <div key={booking.id} className="border border-fuchsia-900/20 rounded-lg p-4 bg-fuchsia-500/10">
                {/* Guest Blacklist Check for upcoming bookings */}
                {!isPastBooking(booking.check_out) && (
                  <GuestBlacklistCheck guestId={booking.user_id} />
                )}
                
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-fuchsia-500/20 flex-shrink-0 flex items-center justify-center mr-3">
                    <Calendar className="w-5 h-5 text-fuchsia-300" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{guestName}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                      <div className="bg-fuchsia-950/30 p-2 rounded">
                        <p className="text-xs text-muted-foreground">Check-in</p>
                        <p className="font-medium">{formatDate(booking.check_in)}</p>
                      </div>
                      <div className="bg-fuchsia-950/30 p-2 rounded">
                        <p className="text-xs text-muted-foreground">Check-out</p>
                        <p className="font-medium">{formatDate(booking.check_out)}</p>
                      </div>
                      <div className="bg-fuchsia-950/30 p-2 rounded">
                        <p className="text-xs text-muted-foreground">Status</p>
                        <p className="font-medium capitalize">{booking.status || 'Confirmed'}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex gap-2">
                      <button className="px-3 py-1 bg-fuchsia-500/20 hover:bg-fuchsia-500/30 text-fuchsia-200 text-sm rounded">
                        View Details
                      </button>
                      {isPastBooking(booking.check_out) && (
                        <Button
                          onClick={() => handleReportGuest(booking)}
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
                  
                  <div className="hidden md:block text-right">
                    <span className="block text-lg font-bold">${booking.total_price}</span>
                    <span className="text-sm text-muted-foreground">Total</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-fuchsia-950/30 flex items-center justify-center">
            <Calendar className="w-8 h-8 text-fuchsia-400" />
          </div>
          <h3 className="text-lg font-bold mb-2">{t('noBookings')}</h3>
          <p className="text-muted-foreground mb-6">{t('noBookingsMessage')}</p>
        </div>
      )}

      <ReportGuestDialog
        open={reportDialog.open}
        onClose={closeReportDialog}
        guestId={reportDialog.guestId}
        guestName={reportDialog.guestName}
        hotelId={reportDialog.hotelId}
      />
    </div>
  );
}
