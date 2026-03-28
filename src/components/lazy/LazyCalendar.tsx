
import React, { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load react-day-picker
const DayPicker = React.lazy(() => 
  import("react-day-picker").then(module => ({ default: module.DayPicker }))
);

const CalendarLoadingFallback = () => (
  <div className="p-4 space-y-4">
    <div className="flex justify-between items-center">
      <Skeleton className="h-6 w-24" />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-6" />
        <Skeleton className="h-6 w-6" />
      </div>
    </div>
    <div className="grid grid-cols-7 gap-2">
      {Array.from({ length: 42 }).map((_, i) => (
        <Skeleton key={i} className="h-8 w-8" />
      ))}
    </div>
  </div>
);

interface LazyCalendarProps {
  className?: string;
  [key: string]: any;
}

export function LazyDayPicker({ className, ...props }: LazyCalendarProps) {
  return (
    <Suspense fallback={<CalendarLoadingFallback />}>
      <DayPicker className={className} {...props} />
    </Suspense>
  );
}

// Hook for dynamic date-fns imports
export const useDateFns = () => {
  const importDateFns = async () => {
    const [
      { format },
      { isAfter },
      { isBefore },
      { addDays },
      { subDays },
      { startOfMonth },
      { endOfMonth }
    ] = await Promise.all([
      import("date-fns"),
      import("date-fns"),
      import("date-fns"),
      import("date-fns"),
      import("date-fns"),
      import("date-fns"),
      import("date-fns")
    ]);

    return { format, isAfter, isBefore, addDays, subDays, startOfMonth, endOfMonth };
  };

  return { importDateFns };
};
