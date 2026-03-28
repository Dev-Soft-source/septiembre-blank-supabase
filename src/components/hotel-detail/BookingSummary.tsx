
import React from "react";
import { format, addDays } from "date-fns";
import { Check } from "lucide-react";

interface BookingSummaryProps {
  selectedOption: any;
  checkInDate: Date | undefined;
  bookingConfirmed: boolean;
  confirmedBookingData: any;
  capitalize: (str: string) => string;
  checkoutDate: Date | null;
  isBookingDisabled: boolean;
}

export function BookingSummary({
  selectedOption,
  checkInDate,
  bookingConfirmed,
  confirmedBookingData,
  capitalize,
  checkoutDate,
  isBookingDisabled
}: BookingSummaryProps) {
  // Selected Option Display
  if (selectedOption && !bookingConfirmed) {
    return (
      <div className="space-y-4">
        <div className="mt-4 text-white text-sm">
          Selected: <strong>
            {capitalize(selectedOption.roomType)} Room – {selectedOption.stayLength} nights – {capitalize(selectedOption.mealPlan)} – ${selectedOption.price} per person
          </strong>
        </div>

        {/* Checkout Date Display */}
        {checkInDate && checkoutDate && (
          <div className="text-center space-y-2">
            <div className="text-white/90 text-sm">
              <div>Check-in: {format(checkInDate, "PPP")}</div>
              <div>Check-out: {format(checkoutDate, "PPP")}</div>
            </div>
          </div>
        )}

        {/* Booking Summary Display */}
        {checkInDate && (
          <div className="bg-fuchsia-950/40 border border-fuchsia-700/50 rounded-lg p-4">
            <h4 className="text-white font-semibold text-sm mb-2">You are about to book:</h4>
            <p className="text-white/90 text-sm">
              <strong>{capitalize(selectedOption.roomType)} Room – {selectedOption.stayLength} nights – {capitalize(selectedOption.mealPlan)} – ${selectedOption.price} per person</strong>
            </p>
            <p className="text-white/80 text-xs mt-1">
              Check-in: {format(checkInDate, "PPP")} | Check-out: {format(addDays(checkInDate, parseInt(selectedOption.stayLength)), "PPP")}
            </p>
          </div>
        )}

        {/* Validation message for missing selection */}
        {isBookingDisabled && (
          <div className="text-center">
            <p className="text-yellow-400 text-sm">
              {!selectedOption && "Please select a room and pricing option"}
              {!checkInDate && selectedOption && "Please select a check-in date"}
            </p>
          </div>
        )}
      </div>
    );
  }

  // Booking Confirmation Message
  if (bookingConfirmed && confirmedBookingData) {
    return (
      <div className="bg-green-900/40 border border-green-600/50 rounded-lg p-4">
        <div className="flex items-center mb-3">
          <Check className="w-5 h-5 text-green-400 mr-2" />
          <h4 className="text-white font-semibold text-sm">Your reservation has been confirmed!</h4>
        </div>
        <p className="text-white/90 text-sm mb-2">
          <strong>{capitalize(confirmedBookingData.roomType)} Room – {confirmedBookingData.stayLength} nights – {capitalize(confirmedBookingData.mealPlan)} – ${confirmedBookingData.price} per person</strong>
        </p>
        <p className="text-white/80 text-xs">
          Check-in: {format(confirmedBookingData.checkInDate, "PPP")} | Check-out: {format(confirmedBookingData.checkOutDate, "PPP")}
        </p>
      </div>
    );
  }

  return null;
}
