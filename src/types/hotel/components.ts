
import { HotelTheme } from './base';
import { HotelDetailProps } from './detail';

// Update AmenitiesInfo to FeaturesInfo
export interface HotelFeaturesInfoProps {
  hotelFeatures: string[];
  roomFeatures: string[];
}

export interface HotelAvailableMonthsProps {
  months: string[];
  isLoading?: boolean;
}

export interface HotelDescriptionProps {
  description: string;
  idealGuests?: string;
  atmosphere?: string;
  perfectLocation?: string;
  isLoading?: boolean;
}

export interface HotelGalleryProps {
  images: string[];
  hotelName: string;
  isLoading?: boolean;
}

export interface HotelHeaderProps {
  name: string;
  stars: number;
  city: string;
  country: string;
  themes: HotelTheme[];
  isLoading?: boolean;
}

export interface HotelReviewsProps {
  hotelId: string;
  averageRating?: number;
  isLoading?: boolean;
}

export interface HotelDetailContentProps {
  hotel: HotelDetailProps;
  isLoading?: boolean;
}
