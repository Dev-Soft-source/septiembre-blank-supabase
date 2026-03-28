import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Calendar, Users, MapPin, CreditCard } from "lucide-react";
import { format } from "date-fns";
import { AvailabilityPackage } from "@/types/availability-package";
import { useToast } from "@/hooks/use-toast";
import { usePackageBookingOperations } from "@/hooks/usePackageBookingOperations";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PricingMatrixItem, RoomUsageType } from "@/types/pricing-matrix";
import { roundPriceUp, getRoomTypeLabel } from "@/utils/pricingRules";
import { formatCurrency } from "@/utils/dynamicPricing";
import { useTranslation } from "@/hooks/useTranslation";

interface PackageBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  package: AvailabilityPackage | null;
  hotelName: string;
  hotelId: string;
  pricePerMonth?: number;
  pricingMatrix?: PricingMatrixItem[];
}

export function PackageBookingModal({
  isOpen,
  onClose,
  package: selectedPackage,
  hotelName,
  hotelId,
  pricePerMonth,
  pricingMatrix = []
}: PackageBookingModalProps) {
  const [roomsToReserve, setRoomsToReserve] = useState(1);
  const [roomUsageType, setRoomUsageType] = useState<RoomUsageType>('double');
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const { toast } = useToast();
  const { loading, createStripePaymentSession, validateBookingData } = usePackageBookingOperations();
  const { language } = useTranslation();

  if (!selectedPackage) return null;

  // Calculate price based on pricing matrix or fallback to pricePerMonth
  const calculateTotalPrice = () => {
    if (pricingMatrix && pricingMatrix.length > 0) {
      // Find pricing for this duration
      const pricingForDuration = pricingMatrix.find(p => p.duration === selectedPackage.duration_days);
      
      if (pricingForDuration) {
        const pricePerPerson = roomUsageType === 'double' 
          ? pricingForDuration.doubleRoom 
          : pricingForDuration.singleRoom;
        
        const guestsPerRoom = roomUsageType === 'double' ? 2 : 1;
        const rawTotal = pricePerPerson * guestsPerRoom * roomsToReserve;
        return roundPriceUp(rawTotal);
      }
    }
    
    // Fallback to pricePerMonth calculation
    if (pricePerMonth) {
      const dailyRate = pricePerMonth / 30;
      const basePrice = dailyRate * selectedPackage.duration_days;
      const adjustedPrice = roomUsageType === 'single' ? basePrice * 1.3 : basePrice;
      const rawTotal = adjustedPrice * roomsToReserve;
      return roundPriceUp(rawTotal);
    }
    
    return 0;
  };

  const totalPrice = calculateTotalPrice();
  
  // Get price per person for display
  const getPricePerPerson = () => {
    if (pricingMatrix && pricingMatrix.length > 0) {
      const pricingForDuration = pricingMatrix.find(p => p.duration === selectedPackage.duration_days);
      if (pricingForDuration) {
        const basePrice = roomUsageType === 'double' 
          ? pricingForDuration.doubleRoom 
          : pricingForDuration.singleRoom;
        return roundPriceUp(basePrice);
      }
    }
    
    if (pricePerMonth) {
      const dailyRate = pricePerMonth / 30;
      const basePrice = dailyRate * selectedPackage.duration_days;
      const adjustedPrice = roomUsageType === 'single' ? basePrice * 1.3 : basePrice;
      return roundPriceUp(adjustedPrice);
    }
    
    return 0;
  };

  const handleBookingSubmit = async () => {
    try {
      const bookingData = {
        guestName,
        guestEmail,
        guestPhone,
        roomsToReserve,
        roomUsageType,
        pricePerPerson: getPricePerPerson()
      };

      // Validate booking data
      validateBookingData(bookingData, selectedPackage);

      // Create Stripe payment session
      await createStripePaymentSession(selectedPackage, hotelId, bookingData, totalPrice);

      toast({
        title: "Booking Confirmed!",
        description: `Your reservation at ${hotelName} has been confirmed for ${roomsToReserve} room(s).`,
      });

      // Reset form and close modal
      setRoomsToReserve(1);
      setRoomUsageType('double');
      setGuestName("");
      setGuestEmail("");
      setGuestPhone("");
      onClose();

    } catch (error: any) {
      toast({
        title: "Booking Failed",
        description: error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl mx-auto max-h-[75vh] overflow-y-auto" aria-describedby="booking-modal-description">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between text-lg md:text-xl">
            Book Your Package
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div id="booking-modal-description" className="sr-only">
          Complete your booking for this availability package by providing your contact information and confirming the details.
        </div>

        <div className="space-y-4 md:space-y-6">
          {/* Package Details */}
          <div className="bg-secondary/10 rounded-lg p-3 md:p-4 space-y-2 md:space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              {hotelName}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4" />
                <span>
                  {format(new Date(selectedPackage.start_date), 'MMM dd')} - {format(new Date(selectedPackage.end_date), 'MMM dd, yyyy')}
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4" />
                <span>{selectedPackage.duration_days} days • {selectedPackage.available_rooms} rooms available</span>
              </div>
            </div>
          </div>

          {/* Main Form Content - Responsive Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            
            {/* Left Column: Room Selection & Guest Information */}
            <div className="space-y-4">
              {/* Room Selection */}
              <div className="space-y-3">
                <h3 className="font-medium text-sm md:text-base">Room Details</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="rooms" className="text-sm">Number of Rooms</Label>
                    <Input
                      id="rooms"
                      type="number"
                      min="1"
                      max={selectedPackage.available_rooms}
                      value={roomsToReserve}
                      onChange={(e) => setRoomsToReserve(parseInt(e.target.value) || 1)}
                      className="h-10"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="roomType" className="text-sm">Room Usage</Label>
                    <Select value={roomUsageType} onValueChange={(value: RoomUsageType) => setRoomUsageType(value)}>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Select room usage" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="double">Double Room (2 guests)</SelectItem>
                        <SelectItem value="single">Single Room (1 guest)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Guest Information */}
              <div className="space-y-3">
                <h3 className="font-medium text-sm md:text-base">Guest Information</h3>
                
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm">Full Name *</Label>
                      <Input
                        id="name"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        placeholder="Enter your full name"
                        className="h-10"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="h-10"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm">Phone Number</Label>
                    <Input
                      id="phone"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      placeholder="Enter your phone number"
                      className="h-10"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Pricing Summary */}
            <div className="space-y-4">
              <div className="bg-primary/5 rounded-lg p-3 md:p-4 h-fit">
                <div className="flex items-center gap-2 mb-3">
                  <CreditCard className="h-4 w-4" />
                  <span className="font-medium text-sm md:text-base">Total Amount</span>
                </div>
                <div className="text-2xl md:text-3xl font-bold text-primary mb-2">
                  {formatCurrency(totalPrice)}
                </div>
                <div className="text-sm text-muted-foreground mb-2">
                  {formatCurrency(getPricePerPerson())} per person × {roomUsageType === 'double' ? 2 : 1} guest(s) × {roomsToReserve} room(s)
                </div>
                <div className="text-xs text-muted-foreground">
                  {getRoomTypeLabel(roomUsageType, language as any)} • {selectedPackage.duration_days} days
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons - Full Width at Bottom */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-border/50">
            <Button variant="outline" onClick={onClose} className="flex-1 h-11">
              Cancel
            </Button>
            <Button 
              onClick={handleBookingSubmit} 
              disabled={loading || !guestName || !guestEmail}
              className="flex-1 h-11"
            >
              {loading ? "Processing..." : "Confirm Booking"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}