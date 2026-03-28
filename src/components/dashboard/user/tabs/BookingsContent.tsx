
import React, { useState, useEffect, useCallback } from "react";
import { Calendar, Loader2, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/useTranslation";
import { EnhancedBookingCard } from "./EnhancedBookingCard";
import { BookingDetailModal } from "./BookingDetailModal";
import { ReviewModal } from "./ReviewModal";

export default function BookingsContent() {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviewBooking, setReviewBooking] = useState(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [existingReviews, setExistingReviews] = useState(new Set());
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation('dashboard/user');

  const fetchBookings = useCallback(async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          hotels(
            name, 
            city, 
            country, 
            main_image_url,
            contact_name,
            contact_email,
            contact_phone
          )
        `)
        .eq('user_id', user.id)
        .order('check_in', { ascending: true });
      
      if (error) throw error;
      
      setBookings(data || []);

      // Fetch existing reviews for these bookings
      if (data && data.length > 0) {
        const hotelIds = data.map(booking => booking.hotel_id);
        const { data: reviews } = await supabase
          .from('reviews')
          .select('hotel_id')
          .in('hotel_id', hotelIds)
          .eq('user_id', user.id);
        
        if (reviews) {
          setExistingReviews(new Set(reviews.map(review => review.hotel_id)));
        }
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast({
        title: "Error loading bookings",
        description: "We couldn't load your bookings. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Set up real-time subscription for booking updates
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('booking-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'bookings',
        filter: `user_id=eq.${user.id}`
      }, (payload) => {
        console.log('Real-time booking update:', payload);
        // Refresh bookings when changes occur
        fetchBookings();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchBookings]);

  const handleViewDetails = (booking: any) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
  };

  const handleRateStay = (booking: any) => {
    setReviewBooking(booking);
    setIsReviewModalOpen(true);
  };

  const handleCloseReviewModal = () => {
    setIsReviewModalOpen(false);
    setReviewBooking(null);
    // Refresh existing reviews after submission
    if (user && bookings.length > 0) {
      const hotelIds = bookings.map(booking => booking.hotel_id);
      supabase
        .from('reviews')
        .select('hotel_id')
        .in('hotel_id', hotelIds)
        .eq('user_id', user.id)
        .then(({ data }) => {
          if (data) {
            setExistingReviews(new Set(data.map(review => review.hotel_id)));
          }
        });
    }
  };

  const isPastStay = (checkOutDate: string) => {
    return new Date(checkOutDate) < new Date();
  };

  const hasReview = (hotelId: string) => {
    return existingReviews.has(hotelId);
  };
  
  if (isLoading) {
    return (
      <div className="glass-card rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-6">{t('userDashboard.bookings.title')}</h2>
        <div className="flex items-center justify-center p-12">
          <Loader2 className="w-6 h-6 animate-spin text-fuchsia-500" />
          <span className="ml-2">{t('userDashboard.bookings.loading')}</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="glass-card rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-6">{t('userDashboard.bookings.title')}</h2>
        
        {bookings.length > 0 ? (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <EnhancedBookingCard 
                key={booking.id} 
                booking={booking}
                onViewDetails={() => handleViewDetails(booking)}
                onRateStay={isPastStay(booking.check_out) && !hasReview(booking.hotel_id) ? () => handleRateStay(booking) : undefined}
                hasReview={hasReview(booking.hotel_id)}
                isPastStay={isPastStay(booking.check_out)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-fuchsia-950/30 flex items-center justify-center">
              <Calendar className="w-8 h-8 text-fuchsia-400" />
            </div>
            <h3 className="text-lg font-bold mb-2">{t('userDashboard.bookings.noBookings')}</h3>
            <p className="text-muted-foreground mb-6">{t('userDashboard.bookings.noBookingsDesc')}</p>
            <a href="/" className="inline-block py-2 px-4 rounded-lg bg-fuchsia-500/20 hover:bg-fuchsia-500/30 text-fuchsia-200 text-sm font-medium transition-colors">
              {t('userDashboard.dashboard.quickActions.browseHotels')}
            </a>
          </div>
        )}
      </div>

      <BookingDetailModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        booking={selectedBooking}
      />

      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={handleCloseReviewModal}
        booking={reviewBooking}
      />
    </>
  );
}
