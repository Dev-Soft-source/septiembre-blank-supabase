
import React from "react";
import { useTranslationWithFallback } from "@/hooks/useTranslationWithFallback";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { HotelCardStars } from "./HotelCard/components/HotelCardStars";
import { HotelCardPrice } from "./HotelCard/components/HotelCardPrice";
import { HotelCardGroupLeader } from "./HotelCard/components/HotelCardGroupLeader";
import { HotelCardAffinities } from "./HotelCard/components/HotelCardAffinities";
import { HotelCardActivities } from "./HotelCard/components/HotelCardActivities";
import { HotelCardStayDurations } from "./HotelCard/components/HotelCardStayDurations";
import { Heart } from "lucide-react";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { formatUSAddress } from "@/data/us-city-state-mapping";

interface Theme {
  id: string;
  name: string;
}

interface Activity {
  activities?: {
    name: string;
  };
}

interface HotelCardProps {
  id: string;
  name: string;
  city?: string;
  country?: string;
  category?: number;
  pricePerMonth?: number;
  themes?: Theme[];
  image?: string;
  availableMonths?: string[];
  rates?: Record<string, number>;
  hotel_themes?: Array<{
    themes?: {
      name: string;
    };
  }>;
  hotel_activities?: Activity[];
  meal_plans?: string[];
  location?: string;
  thumbnail?: string;
  onClick?: () => void;
  stayLengths?: number[];
  availabilityPackages?: Array<{
    duration_days: number;
  }>;
}

export const HotelCard = React.memo<HotelCardProps>(({
  id,
  name,
  city,
  country,
  category,
  pricePerMonth,
  themes = [],
  image,
  rates,
  hotel_themes = [],
  hotel_activities = [],
  onClick,
  stayLengths,
  availabilityPackages
}) => {
  const navigate = useNavigate();
  const { t } = useTranslationWithFallback();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/hotel/${id}`);
    }
  };
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Handle favorite functionality here
  };

  // Get affinities from hotel themes
  const affinities = hotel_themes
    ?.map(ht => ht.themes?.name)
    .filter(Boolean)
    .slice(0, 3) || [];

  // Get activities from hotel activities
  const activities = hotel_activities
    ?.map(ha => ha.activities?.name)
    .filter(Boolean)
    .slice(0, 3) || [];

  // Format location with proper US address formatting
  const formatLocation = () => {
    if (!city || !country) return '';
    return formatUSAddress(city, country === 'USA' ? 'United States' : country);
  };

  return (
    <div 
      style={{
        boxShadow: '0 0 40px rgba(0,200,255,0.4), 0 0 80px rgba(0,200,255,0.32), 0 0 120px rgba(0,200,255,0.24)',
        border: '1px solid rgba(0,200,255,0.32)',
        borderRadius: '12px',
        padding: '4px',
        width: '100%',
        maxWidth: '100%',
        flex: '1 1 auto',
        display: 'block'
      }}
    >
      <Card 
        className="bg-gradient-to-b from-purple-800 to-purple-900 text-white cursor-pointer transition-all duration-300 overflow-hidden h-full flex flex-col"
        onClick={handleClick}
        style={{
          boxShadow: '0 0 32px rgba(0,200,255,0.4), 0 0 64px rgba(0,200,255,0.32), 0 0 96px rgba(0,200,255,0.24)',
          border: '1px solid rgba(0,200,255,0.2)',
          width: '100%',
          maxWidth: '100%',
          flex: '1 1 auto',
          display: 'block'
        }}
      >
      {/* Hotel Image */}
      <div className="relative h-48 overflow-hidden">
        <OptimizedImage
          src={image || "https://images.unsplash.com/photo-1586105251261-72a756497a11?w=400&q=50"}
          alt={name}
          className="w-full h-full object-cover"
          fallbackSrc="https://images.unsplash.com/photo-1586105251261-72a756497a11?w=400&q=50"
          lazy={true}
          style={{ width: '100%', maxWidth: '100%' }}
        />
        <button
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 p-2 bg-[#68178D]/20 hover:bg-[#68178D]/40 rounded-full transition-colors"
          aria-label={`Add ${name} to favorites`}
        >
          <Heart className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Card Content */}
      <CardContent className="p-3 sm:p-4 flex-1 flex flex-col">
        {/* Stars above hotel name - centered */}
        {category > 0 && (
          <div className="flex justify-center mb-2">
            <HotelCardStars stars={category} />
          </div>
        )}

        {/* Hotel Name - Fixed height container for uniform alignment */}
        <div className="h-12 sm:h-14 flex items-center justify-center mb-2">
          <h3 className="text-lg sm:text-xl font-bold text-center line-clamp-2">
            {name}
          </h3>
        </div>

        {/* Location - Centered with proper US formatting */}
        <p className="text-white/80 text-sm sm:text-base mb-3 text-center">
          {formatLocation() || t('system:location.notSpecified')}
        </p>

        {/* Group Leader Section */}
        <HotelCardGroupLeader hotelId={id} />

        {/* Affinities Section */}
        <HotelCardAffinities affinities={affinities} />

        {/* Activities Section */}
        <HotelCardActivities activities={activities} />

        {/* Stay Durations Section */}
        <div className="mt-auto text-center">
          {stayLengths && (
            <p>{stayLengths} stay days</p>
          )}
        </div>
        {/* <HotelCardStayDurations 
          stayLengths={stayLengths}
          availabilityPackages={availabilityPackages}
        /> */}

        {/* Price - Centered */}
        <div className="mt-auto text-center">
          <HotelCardPrice 
            rates={rates} 
            pricePerMonth={pricePerMonth}
            currency="USD"
            hotelId={id}
          />
        </div>
      </CardContent>
    </Card>
    </div>
  );
});
