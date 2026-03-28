import React from "react";
import { getHotelLeader } from "@/data/hotel-leader-mapping";

interface HotelCardGroupLeaderProps {
  hotelId: string;
}

export const HotelCardGroupLeader: React.FC<HotelCardGroupLeaderProps> = ({ hotelId }) => {
  const leader = getHotelLeader(hotelId);

  if (!leader) {
    return <div className="h-16 mb-3"></div>; // Maintain spacing even when no leader
  }

  return (
    <div className="flex items-center justify-center mb-3 h-16">
      <div className="flex items-center gap-2">
        <div 
          className="w-10 h-10 rounded-full overflow-hidden border-2 border-purple-400/50 bg-purple-600/20"
          style={{ minWidth: '40px', minHeight: '40px' }}
        >
          <img
            src={leader.avatar_url}
            alt={`Group Leader ${leader.full_name}`}
            className="w-full h-full object-cover"
            style={{ 
              width: '40px', 
              height: '40px', 
              objectFit: 'cover',
              display: 'block'
            }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        </div>
        <span className="text-xs text-white/90 font-medium">
          Group Leader
        </span>
      </div>
    </div>
  );
};