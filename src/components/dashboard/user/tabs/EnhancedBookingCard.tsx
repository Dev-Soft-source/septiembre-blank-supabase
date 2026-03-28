
import React, { useState } from "react";
import { format } from "date-fns";
import { Calendar, MapPin, Star, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/useTranslation";
import { useBookingOperations } from "@/hooks/useBookingOperations";
import { BookingModificationModal } from "./BookingModificationModal";
import { BookingStatusBadge } from "./BookingStatusBadge";

interface EnhancedBookingCardProps {
  booking: any;
  onViewDetails: () => void;
  onRateStay?: () => void;
  hasReview: boolean;
  isPastStay: boolean;
}

export const EnhancedBookingCard = ({
  booking,
  onViewDetails,
  onRateStay,
  hasReview,
  isPastStay
}: EnhancedBookingCardProps) => {
  const { t } = useTranslation();
  const { 
    loading, 
    canModifyBooking, 
    canCancelBooking, 
    cancelBooking 
  } = useBookingOperations();
  const [showModifyModal, setShowModifyModal] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleCancelBooking = async () => {
    if (window.confirm(t('booking.actions.confirmCancel'))) {
      const success = await cancelBooking(booking.id);
      if (success) {
        setRefreshTrigger(prev => prev + 1);
        // Force a page refresh to show updated status
        window.location.reload();
      }
    }
  };

  const handleModifySuccess = () => {
    setRefreshTrigger(prev => prev + 1);
    // Force a page refresh to show updated booking
    window.location.reload();
  };

  const canModify = canModifyBooking(booking.status);
  const canCancel = canCancelBooking(booking.status);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch (error) {
      return dateString;
    }
  };

  return (
    <>
      <div className="glass-card rounded-2xl p-6 hover:shadow-lg transition-shadow">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Hotel Image */}
          <div className="lg:w-48 lg:h-32 w-full h-48 rounded-xl overflow-hidden bg-fuchsia-950/30 flex-shrink-0">
            {booking.hotels?.main_image_url ? (
              <img
                src={booking.hotels.main_image_url}
                alt={booking.hotels.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <MapPin className="w-8 h-8 text-fuchsia-400" />
              </div>
            )}
          </div>

          {/* Booking Details */}
          <div className="flex-1 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">
                  {booking.hotels?.name || "Hotel Name"}
                </h3>
                <p className="text-white/70 text-sm flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {booking.hotels?.city}, {booking.hotels?.country}
                </p>
              </div>
              <BookingStatusBadge status={booking.status} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-white/80">
                <Calendar className="w-4 h-4 text-fuchsia-400" />
                <span>Check-in: {formatDate(booking.check_in)}</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <Calendar className="w-4 h-4 text-fuchsia-400" />
                <span>Check-out: {formatDate(booking.check_out)}</span>
              </div>
            </div>

            {/* Contact Information */}
            {booking.hotels?.contact_name && (
              <div className="text-sm text-white/70">
                <p>Contact: {booking.hotels.contact_name}</p>
                {booking.hotels.contact_email && (
                  <p>Email: {booking.hotels.contact_email}</p>
                )}
                {booking.hotels.contact_phone && (
                  <p>Phone: {booking.hotels.contact_phone}</p>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onViewDetails}
                className="text-fuchsia-200 border-fuchsia-200 hover:bg-fuchsia-200/10"
              >
                View Details
              </Button>

              {/* Modify Booking Button */}
              {canModify && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowModifyModal(true)}
                  disabled={loading}
                  className="text-blue-200 border-blue-200 hover:bg-blue-200/10"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  {t('booking.actions.modify')}
                </Button>
              )}

              {/* Cancel Booking Button */}
              {canCancel && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancelBooking}
                  disabled={loading}
                  className="text-red-200 border-red-200 hover:bg-red-200/10"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  {loading ? t('booking.actions.cancelling') : t('booking.actions.cancel')}
                </Button>
              )}

              {/* Rate Stay Button */}
              {isPastStay && !hasReview && onRateStay && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onRateStay}
                  className="text-yellow-200 border-yellow-200 hover:bg-yellow-200/10"
                >
                  <Star className="w-4 h-4 mr-1" />
                  Rate Stay
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modification Modal */}
      <BookingModificationModal
        isOpen={showModifyModal}
        onClose={() => setShowModifyModal(false)}
        booking={booking}
        onSuccess={handleModifySuccess}
      />
    </>
  );
};
