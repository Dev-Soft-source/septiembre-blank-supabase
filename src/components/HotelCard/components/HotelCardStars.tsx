
import React from "react";
import { Star } from "lucide-react";

interface HotelCardStarsProps {
  stars: number;
}

export const HotelCardStars: React.FC<HotelCardStarsProps> = ({ stars }) => {
  // Ensure stars is between 3-5 as per hotel categories
  const validStars = Math.max(3, Math.min(5, stars || 3));
  
  return (
    <div className="flex items-center justify-center gap-1">
      {Array.from({ length: validStars }).map((_, i) => (
        <Star key={`star-${i}`} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      ))}
    </div>
  );
};
