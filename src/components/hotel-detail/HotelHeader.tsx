import React from "react";
import { MapPin, Heart } from "lucide-react";
import { HotelDetailProps } from "@/types/hotel";
import { FavoriteButton } from "@/components/ui/FavoriteButton";
import { useFavorites } from "@/hooks/useFavorites";

interface HotelHeaderProps {
  hotel: HotelDetailProps;
}

// Helper function to format address with proper capitalization
const formatAddress = (text: string) => {
  if (!text || typeof text !== 'string') return '';
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Helper function to format country code
const formatCountry = (country: string) => {
  if (!country || typeof country !== 'string') return '';
  if (country.toUpperCase() === 'US') {
    return 'United States';
  }
  return formatAddress(country);
};

export function HotelHeader({ hotel }: HotelHeaderProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  
  // Safe access with fallbacks for all fields
  const hotelName = hotel?.name || 'Hotel Name';
  const hotelCity = hotel?.city || '';
  const hotelCountry = hotel?.country || '';
  const hotelAddress = hotel?.address || '';
  const hotelCategory = hotel?.category || 0;
  const hotelId = hotel?.id || '';
  
  const formattedCity = formatAddress(hotelCity);
  const formattedCountry = formatCountry(hotelCountry);
  const formattedAddress = hotelAddress ? formatAddress(hotelAddress) : '';
  
  const addressDisplay = formattedAddress 
    ? `${formattedAddress}, ${formattedCity}, ${formattedCountry}` 
    : `${formattedCity}, ${formattedCountry}`;

  // Generate star rating display safely
  const starRating = hotelCategory > 0 && hotelCategory <= 5 ? "★".repeat(hotelCategory) : '';

  return (
    <div className="flex justify-between items-start">
      <div className="w-full">
        <h1 className="text-4xl font-extrabold text-white mb-1">
          {hotelName} {starRating}
        </h1>
        <p className="text-white flex items-center gap-1">
          <MapPin size={16} /> {addressDisplay}
        </p>
      </div>
      <FavoriteButton
        isFavorite={isFavorite(hotelId)}
        onClick={() => toggleFavorite(hotelId)}
        size="lg"
        className="shrink-0 ml-4"
      />
    </div>
  );
}