import React from "react";

interface HotelCardStayDurationsProps {
  stayLengths?: number[];
  availabilityPackages?: Array<{
    duration_days: number;
  }>;
}

export const HotelCardStayDurations: React.FC<HotelCardStayDurationsProps> = ({ 
  stayLengths, 
  availabilityPackages 
}) => {
  // Get durations from either source
  let durations: number[] = [];
  
  if (availabilityPackages && availabilityPackages.length > 0) {
    durations = [...new Set(availabilityPackages.map(pkg => pkg.duration_days))];

  } else if (stayLengths && stayLengths.length > 0) {
    durations = [...new Set(stayLengths)];
  }

  const formatDurations = (durations: number[]): string => {
    if (durations.length === 0) return '';
    
    if (durations.length === 1) {
      return `${durations[0]} days stays`;
    }
    
    const min = Math.min(...durations);
    const max = Math.max(...durations);
    
    if (durations.length === 2) {
      return `${min}–${max} days stays`;
    }
    
    return `${durations.join('–')} days stays`;
  };

  return (
    <div className="mb-3 text-center min-h-[25px] flex items-center justify-center">
      {durations.length > 0 ? (
        <p className="text-xs text-white/80 font-medium">
          {formatDurations(durations)}
        </p>
      ) : (
        <div className="h-full"></div>
      )}
    </div>
  );
};