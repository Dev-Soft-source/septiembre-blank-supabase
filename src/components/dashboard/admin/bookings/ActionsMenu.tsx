
import React from "react";
import { Check, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ActionsMenuProps {
  bookingId: string;
  currentStatus: string;
  updateBookingStatus: (bookingId: string, newStatus: string) => Promise<void>;
}

export const ActionsMenu: React.FC<ActionsMenuProps> = ({ 
  bookingId, 
  currentStatus,
  updateBookingStatus 
}) => {
  const { toast } = useToast();
  
  return (
    <div className="flex items-center">
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          toast("Feature coming soon - Booking detail view is under development");
        }}
        className="mr-2"
      >
        View
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem 
            onClick={() => updateBookingStatus(bookingId, 'pending')}
            className="flex items-center"
          >
            {currentStatus === 'pending' && <Check className="mr-2 h-4 w-4" />}
            <span className={currentStatus === 'pending' ? 'font-medium' : ''}>Mark as Pending</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => updateBookingStatus(bookingId, 'confirmed')}
            className="flex items-center"
          >
            {currentStatus === 'confirmed' && <Check className="mr-2 h-4 w-4" />}
            <span className={currentStatus === 'confirmed' ? 'font-medium' : ''}>Mark as Confirmed</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => updateBookingStatus(bookingId, 'completed')}
            className="flex items-center"
          >
            {currentStatus === 'completed' && <Check className="mr-2 h-4 w-4" />}
            <span className={currentStatus === 'completed' ? 'font-medium' : ''}>Mark as Completed</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => updateBookingStatus(bookingId, 'cancelled')}
            className="flex items-center"
          >
            {currentStatus === 'cancelled' && <Check className="mr-2 h-4 w-4" />}
            <span className={currentStatus === 'cancelled' ? 'font-medium' : ''}>Mark as Cancelled</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
