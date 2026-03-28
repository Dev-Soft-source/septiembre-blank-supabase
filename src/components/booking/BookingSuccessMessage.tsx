
import { Check } from "lucide-react";

interface BookingSuccessMessageProps {
  hotelName: string;
  onReset: () => void;
}

export function BookingSuccessMessage({ hotelName, onReset }: BookingSuccessMessageProps) {
  return (
    <div className="text-center py-8">
      <div className="w-16 h-16 rounded-full bg-fuchsia-500/20 flex items-center justify-center mx-auto mb-4">
        <Check className="w-8 h-8 text-fuchsia-400" />
      </div>
      <h4 className="text-lg font-bold mb-2">Booking confirmed!</h4>
      <p className="text-muted-foreground mb-4">
        Your stay at {hotelName} has been booked.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="w-full bg-fuchsia-500/20 hover:bg-fuchsia-500/30 text-fuchsia-200 font-medium rounded-lg px-4 py-2.5 transition-colors"
      >
        Book another stay
      </button>
    </div>
  );
}
