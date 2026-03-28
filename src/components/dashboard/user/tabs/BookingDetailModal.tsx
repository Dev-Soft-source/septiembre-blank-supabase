
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, CreditCard, Star } from "lucide-react";
import { formatDate } from "../../utils/dateUtils";

interface BookingDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: any;
}

export const BookingDetailModal = ({ isOpen, onClose, booking }: BookingDetailModalProps) => {
  if (!booking) return null;

  const calculateDuration = (checkIn: string, checkOut: string) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const duration = calculateDuration(booking.check_in, booking.check_out);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#5A0080] max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">Booking Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Hotel Information */}
          <div className="space-y-4">
            {booking.hotels?.main_image_url && (
              <div className="aspect-video rounded-lg overflow-hidden">
                <img 
                  src={booking.hotels.main_image_url} 
                  alt={booking.hotels?.name || 'Hotel'} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">
                {booking.hotels?.name || 'Unknown Hotel'}
              </h3>
              <div className="flex items-center text-fuchsia-200 mb-4">
                <MapPin className="w-4 h-4 mr-2" />
                <span>{booking.hotels ? `${booking.hotels.city}, ${booking.hotels.country}` : 'Unknown Location'}</span>
              </div>
            </div>
          </div>

          {/* Booking Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-fuchsia-950/30 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Calendar className="w-4 h-4 text-fuchsia-300 mr-2" />
                <span className="text-sm text-fuchsia-200">Check-in</span>
              </div>
              <p className="text-white font-medium">{formatDate(booking.check_in)}</p>
            </div>
            
            <div className="bg-fuchsia-950/30 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Calendar className="w-4 h-4 text-fuchsia-300 mr-2" />
                <span className="text-sm text-fuchsia-200">Check-out</span>
              </div>
              <p className="text-white font-medium">{formatDate(booking.check_out)}</p>
            </div>
            
            <div className="bg-fuchsia-950/30 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Clock className="w-4 h-4 text-fuchsia-300 mr-2" />
                <span className="text-sm text-fuchsia-200">Duration</span>
              </div>
              <p className="text-white font-medium">{duration} days</p>
            </div>
            
            <div className="bg-fuchsia-950/30 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <CreditCard className="w-4 h-4 text-fuchsia-300 mr-2" />
                <span className="text-sm text-fuchsia-200">Total Price</span>
              </div>
              <p className="text-white font-medium">${booking.total_price}</p>
            </div>
          </div>

          {/* Booking Status */}
          <div className="bg-fuchsia-950/30 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-fuchsia-200">Status</span>
              <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                booking.status === 'confirmed' 
                  ? 'bg-green-500/20 text-green-300' 
                  : booking.status === 'pending'
                  ? 'bg-amber-500/20 text-amber-300'
                  : 'bg-red-500/20 text-red-300'
              }`}>
                {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1) || 'Confirmed'}
              </span>
            </div>
          </div>

          {/* Hotel Contact Info */}
          {booking.hotels && (booking.hotels.contact_email || booking.hotels.contact_phone) && (
            <div className="bg-fuchsia-950/30 p-4 rounded-lg">
              <h4 className="text-lg font-medium text-white mb-3">Hotel Contact Information</h4>
              <div className="space-y-2">
                {booking.hotels.contact_name && (
                  <p className="text-fuchsia-200">
                    <span className="font-medium">Contact Person:</span> {booking.hotels.contact_name}
                  </p>
                )}
                {booking.hotels.contact_email && (
                  <p className="text-fuchsia-200">
                    <span className="font-medium">Email:</span> {booking.hotels.contact_email}
                  </p>
                )}
                {booking.hotels.contact_phone && (
                  <p className="text-fuchsia-200">
                    <span className="font-medium">Phone:</span> {booking.hotels.contact_phone}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button 
              onClick={onClose}
              variant="outline" 
              className="flex-1"
            >
              Close
            </Button>
            <Button 
              className="flex-1 bg-fuchsia-600 hover:bg-fuchsia-700"
              onClick={() => {
                // Future: Navigate to review page
                console.log("Leave review for booking:", booking.id);
              }}
            >
              <Star className="w-4 h-4 mr-2" />
              Leave Review
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
