
import React from 'react';
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface BookingItemProps {
  name: string;
  dates: string;
  property: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  amount?: string;
}

export const BookingItem = ({
  name,
  dates,
  property,
  status,
  amount
}: BookingItemProps) => {
  return <div className="flex items-start p-3 rounded-lg border border-fuchsia-800/20 bg-[#eaf8ea]">
      <div className="w-10 h-10 rounded-full bg-fuchsia-500/20 flex-shrink-0 flex items-center justify-center mr-3">
        <Calendar className="w-5 h-5 text-fuchsia-300" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="truncate text-[#68178D] font-bold text-lg">{name}</p>
        <p className="truncate text-[#68178D] text-base font-medium">{property}</p>
        <p className="text-[#68178D] font-medium text-base">{dates}</p>
        {amount && <p className="text-[#68178D] font-medium">{amount}</p>}
      </div>
      <div className={cn("px-2 py-1 text-xs rounded-full", status === 'confirmed' ? "bg-green-500/20 text-green-300" : status === 'pending' ? "bg-amber-500/20 text-amber-300" : "bg-red-500/20 text-red-300")}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </div>
    </div>;
};

export default BookingItem;
