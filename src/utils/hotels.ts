
import { Theme } from './themes';

// Hotel model definition
export interface Hotel {
  id: string;
  name: string;
  country: string;
  city: string;
  address: string;
  description: string;
  mainImage: string;
  images: string[];
  pricePerMonth: number;
  stars: number;
  rating: number;
  reviews: number;
  themes: Theme[];
  availableMonths: string[];
  features: string[];
  amenities: string[];
}

// Empty hotel data array for development (previously contained mock data)
export const hotels: Hotel[] = [];
