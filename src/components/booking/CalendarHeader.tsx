
import React from "react";

interface CalendarHeaderProps {
  dayGroups: string[];
}

export function CalendarHeader({ dayGroups }: CalendarHeaderProps) {
  return (
    <div className="flex border-b border-fuchsia-800/30">
      <div className="w-1/6 p-2 font-medium text-xs">Room</div>
      <div className="w-5/6 flex">
        {dayGroups.map((group, i) => (
          <div 
            key={i} 
            className="flex-1 p-2 text-center text-xs font-medium border-l border-fuchsia-800/20"
          >
            {group}
          </div>
        ))}
      </div>
    </div>
  );
}
