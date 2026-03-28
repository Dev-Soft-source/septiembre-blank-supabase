
import React from "react";
import { CalendarPosition } from "@/types/booking";

interface GapIndicatorProps {
  gaps: CalendarPosition[];
}

export function GapIndicator({ gaps }: GapIndicatorProps) {
  return (
    <div className="relative h-1 mb-1">
      {gaps.map((gap, i) => (
        <div
          key={`gap-${i}`}
          className="absolute top-0 h-full bg-green-500/30"
          style={{
            left: `${gap.start}%`,
            width: `${gap.width}%`,
          }}
          title="Available gap"
        />
      ))}
    </div>
  );
}
