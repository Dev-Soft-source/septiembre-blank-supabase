
import React from "react";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MonthNavigationProps {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

export function MonthNavigation({ 
  currentDate, 
  onPrevMonth, 
  onNextMonth 
}: MonthNavigationProps) {
  return (
    <div className="flex items-center space-x-2">
      <button 
        onClick={onPrevMonth}
        className="p-1 rounded-full hover:bg-fuchsia-800/20"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <span className="text-sm font-medium">
        {format(currentDate, "MMMM yyyy")}
      </span>
      <button 
        onClick={onNextMonth}
        className="p-1 rounded-full hover:bg-fuchsia-800/20"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
