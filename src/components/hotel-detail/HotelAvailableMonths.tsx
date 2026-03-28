import { HotelAvailableMonthsProps } from "@/types/hotel";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "lucide-react";
export function HotelAvailableMonths({
  months,
  isLoading
}: HotelAvailableMonthsProps & {
  isLoading?: boolean;
}) {
  // Function to normalize, capitalize, and deduplicate month names
  const normalizeMonths = (monthsList: string[] = []): string[] => {
    if (!monthsList || !monthsList.length) return [];

    // Step 1: Normalize to title case (e.g., "January")
    const normalizedMonths = monthsList.map(month => {
      if (!month) return "";
      return month.charAt(0).toUpperCase() + month.slice(1).toLowerCase();
    });

    // Step 2: Remove duplicates using a Set
    return [...new Set(normalizedMonths)].filter(month => month !== "");
  };
  const normalizedMonths = normalizeMonths(months);
  if (isLoading) {
    return <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-5 w-5 rounded-full" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {Array.from({
          length: 6
        }).map((_, i) => <Skeleton key={i} className="h-12 w-full rounded-lg" />)}
        </div>
      </div>;
  }
  if (!normalizedMonths || normalizedMonths.length === 0) {
    return <div className="glass-card rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          Available Months
          <Calendar className="w-5 h-5 text-fuchsia-400" />
        </h2>
        <p className="text-foreground/60 italic">No available months at the moment.</p>
      </div>;
  }
  return <div className="glass-card rounded-2xl p-6 bg-[#957B23]">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        Available Months
        <Calendar className="w-5 h-5 text-fuchsia-400" />
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {normalizedMonths.map(month => <div key={month} className="text-center p-3 rounded-lg border border-border transition-colors bg-[#73127B]">
            <span className="font-medium">{month}</span>
          </div>)}
      </div>
    </div>;
}