
import React from "react";
import { useNavigate } from "react-router-dom";
import { HotelCard } from "@/components/HotelCard";

interface Hotel {
  id: string;
  name: string;
  location: string;
  price_per_month: number;
  category?: number;
  thumbnail?: string;
  theme?: string;
  hotel_images?: Array<{
    image_url: string;
    is_main?: boolean;
  }>;
  room_types?: Array<{
    baseRate?: number;
    basePrice?: number;
    rates?: Record<string, number>;
    name?: string;
  }>;
  stay_lengths?: number[];
  rates?: Record<string, number>;
  pricingmatrix?: Array<{
    roomType: string;
    stayLength: string;
    mealPlan: string;
    price: number;
  }>;
  pricingMatrix?: Array<{
    roomType: string;
    stayLength: string;
    mealPlan: string;
    price: number;
  }>;
  hotel_themes?: Array<{
    themes?: {
      name: string;
    };
  }>;
  hotel_activities?: Array<{
    activities?: {
      name: string;
    };
  }>;
  country?: string;
  stayLengths?: number[];
  availabilityPackages?: Array<{
    duration_days: number;
  }>;
}

interface SearchResultCardProps {
  hotel: Hotel;
}

export const SearchResultCard: React.FC<SearchResultCardProps> = ({ hotel }) => {
  const navigate = useNavigate();

  const handleHotelClick = () => {
    navigate(`/hotel/${hotel.id}`);
  };

  // Extract city and country from location
  const locationParts = hotel.location?.split(', ') || [];
  const city = locationParts[0] || '';
  const country = hotel.country || locationParts[1] || '';

  // Get main image with proper validation
  const getValidImage = () => {
    // Check thumbnail
    if (hotel.thumbnail && hotel.thumbnail !== "/placeholder.svg" && hotel.thumbnail.trim() !== '') {
      return hotel.thumbnail;
    }
    
    // Try to get main image from hotel_images array if available
    if (hotel.hotel_images && hotel.hotel_images.length > 0) {
      const mainImg = hotel.hotel_images.find(img => img.is_main)?.image_url;
      if (mainImg && mainImg !== "/placeholder.svg" && mainImg.trim() !== '') {
        return mainImg;
      }
      
      // Get first valid image
      const firstValidImg = hotel.hotel_images.find(img => 
        img.image_url && img.image_url !== "/placeholder.svg" && img.image_url.trim() !== ''
      )?.image_url;
      
      if (firstValidImg) {
        return firstValidImg;
      }
    }
    
    // Return a proper "image needed" placeholder instead of generic placeholder
    return "https://images.unsplash.com/photo-1586105251261-72a756497a11?w=400&q=50";
  };

  const mainImage = getValidImage();
  
  
  // Convert themes format
  const themes = hotel.hotel_themes?.map(ht => ({
    id: ht.themes?.name || '',
    name: ht.themes?.name || ''
  })) || [];

  return (
    <HotelCard
      id={hotel.id}
      name={hotel.name}
      city={city}
      country={country}
      category={hotel.category || 0}
      pricePerMonth={hotel.price_per_month}
      themes={themes}
      image={mainImage}
      availableMonths={[]}
      rates={hotel.rates}
      hotel_themes={hotel.hotel_themes}
      hotel_activities={hotel.hotel_activities}
      meal_plans={[]}
      location={hotel.location}
      thumbnail={hotel.thumbnail}
      onClick={handleHotelClick}
      stayLengths={hotel.stay_lengths}
      availabilityPackages={hotel.pricingMatrix?.map(pm => ({ duration_days: parseInt(pm.stayLength) })) || 
                           hotel.pricingmatrix?.map(pm => ({ duration_days: parseInt(pm.stayLength) })) || []}
    />
  );
};
