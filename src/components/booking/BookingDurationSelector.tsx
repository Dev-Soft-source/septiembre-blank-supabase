
import { cn } from "@/lib/utils";
import { durations } from "@/utils/booking";

interface BookingDurationSelectorProps {
  duration: number;
  setDuration: (duration: number) => void;
  allowedDurations?: number[] | null;
}

export function BookingDurationSelector({ duration, setDuration, allowedDurations }: BookingDurationSelectorProps) {
  // If available (passed), use only those. Otherwise use fallback durations.
  const stayLengths = (allowedDurations && allowedDurations.length > 0)
    ? allowedDurations
    : durations.map(x => x.value);

  return (
    <div>
      <label className="block text-sm font-medium mb-1.5 text-white">Duration (days)</label>
      <div className="grid grid-cols-4 gap-2">
        {stayLengths.map((option) => (
          <button
            key={option}
            type="button"
            className={cn(
              "rounded-lg border py-2 text-center transition-all",
              duration === option
                ? "border-fuchsia-500 bg-fuchsia-500/20 text-fuchsia-200"
                : "border-border hover:border-fuchsia-500/50 hover:bg-fuchsia-500/10 text-white"
            )}
            onClick={() => setDuration(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
