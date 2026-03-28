
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HotelCardBadgesProps {
  themes: Array<{ id: string; name: string }>;
  availableMonths: string[];
}

export const HotelCardBadges: React.FC<HotelCardBadgesProps> = ({
  themes,
  availableMonths
}) => {
  return (
    <>
      {themes.length > 0 && (
        <div className="absolute top-2 left-2">
          <Badge variant="secondary" className="bg-white/70 backdrop-blur-sm text-purple-900 hover:bg-white/80">
            {themes[0].name}
          </Badge>
        </div>
      )}
    </>
  );
};
