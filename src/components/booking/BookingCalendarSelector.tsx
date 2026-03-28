
import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format, addDays } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { weekdayMap } from "@/utils/dateUtils";

interface BookingCalendarSelectorProps {
  startDate: Date | null;
  setStartDate: (date: Date) => void;
  availableMonths?: string[];
  preferredWeekday?: string;
  stayDurations?: number[];
  setStayDuration?: (days: number) => void;
  setCheckOutDate?: (date: Date) => void;
}

export function BookingCalendarSelector({
  startDate,
  setStartDate,
  availableMonths = [],
  preferredWeekday = "Monday",
  stayDurations = [],
  setStayDuration,
  setCheckOutDate
}: BookingCalendarSelectorProps) {
  const [open, setOpen] = useState(false);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [label, setLabel] = useState("Stay Duration");

  const preferredDayNum = preferredWeekday ? weekdayMap[preferredWeekday] : 1;

  const isDateSelectable = (date: Date) => {
    if (date.getDay() !== preferredDayNum) return false;
    if (availableMonths.length > 0) {
      const monthName = format(date, 'MMMM').toLowerCase();
      if (!availableMonths.map(m => m.toLowerCase()).includes(monthName)) return false;
    }
    return date >= new Date();
  };

  const handleDateSelect = (date: Date) => {
    if (!isDateSelectable(date)) return;
    setStartDate(date);
    setLabel("Stay Duration?");
    if (stayDurations.length === 1 && setCheckOutDate) {
      const checkout = addDays(date, stayDurations[0]);
      setCheckOutDate(checkout);
    }
  };

  return (
    <div className="w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button className="w-full text-left flex items-center justify-between border rounded px-3 py-2">
            <span>{startDate ? format(startDate, "PPP") : "Select a date"}</span>
            <CalendarIcon className="h-4 w-4 opacity-50" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={startDate || undefined}
            onSelect={(date) => date && handleDateSelect(date)}
            modifiers={{
              selectable: (date) => isDateSelectable(date),
              preferredWeekday: (date) => date.getDay() === preferredDayNum,
            }}
            modifiersClassNames={{
              selectable: "text-white hover:bg-purple-800",
              selected: "bg-white text-[#68178D] border border-purple-400",
              preferredWeekday: "bg-white text-[#73149E] font-bold hover:bg-white/90",
            }}
            className="rounded-md border pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
      <div className="mt-2 text-white font-semibold">{label}</div>
    </div>
  );
}
