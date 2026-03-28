
import React from "react";
import { MapPin } from "lucide-react";
import { HotelDetailProps } from "@/types/hotel";
import { FavoriteButton } from "@/components/ui/FavoriteButton";
import { useFavorites } from "@/hooks/useFavorites";

interface HotelHeaderProps {
  hotel: HotelDetailProps;
}

// Helper function to format address with proper capitalization
const formatAddress = (text: string) => {
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Helper function to format country code
const formatCountry = (country: string) => {
  if (country.toUpperCase() === 'US') {
    return 'United States';
  }
  return formatAddress(country);
};

export function HotelHeader({ hotel }: HotelHeaderProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const formattedCity = formatAddress(hotel.city);
  const formattedCountry = formatCountry(hotel.country);
  const formattedAddress = hotel.address ? formatAddress(hotel.address) : null;
  
  const addressDisplay = formattedAddress 
    ? `${formattedAddress}, ${formattedCity}, ${formattedCountry}` 
    : `${formattedCity}, ${formattedCountry}`;

  return (
    <div className="flex justify-between items-start">
      <div className="w-full">
        <h1 className="text-4xl font-extrabold text-white mb-1">
          {hotel.name} {hotel.category && "★".repeat(hotel.category)}
        </h1>
        <p className="text-white flex items-center gap-1">
          <MapPin size={16} /> {addressDisplay}
        </p>
      </div>
      <FavoriteButton
        isFavorite={isFavorite(hotel.id)}
        onClick={() => toggleFavorite(hotel.id)}
        size="lg"
        className="shrink-0 ml-4"
      />
    </div>
  );
}
