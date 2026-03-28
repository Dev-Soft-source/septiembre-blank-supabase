
import { useState } from "react";
import { UploadedImage } from "@/hooks/usePropertyImages";

export interface PropertyFormData {
  hotelName: string;
  totalRooms?: number;
  propertyType: string;
  description: string;
  idealGuests?: string;
  atmosphere?: string;
  perfectLocation?: string;
  style: string;
  country: string;
  address: string;
  city: string;
  postalCode: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  category: string;
  stayLengths: number[];
  mealPlans: string[];
  roomTypes: any[];
  themes: string[];
  activities: string[];
  faqs: any[];
  terms: string;
  termsAccepted: boolean;
  hotelImages?: UploadedImage[];
  mainImageUrl?: string;
  preferredWeekday?: string;
  featuresHotel?: Record<string, boolean>;  
  featuresRoom?: Record<string, boolean>;
  available_months?: string[]; // Added available_months to match database schema
  price_8?: number; // Price for 8-day stay
  price_16?: number; // Price for 16-day stay
  price_24?: number; // Price for 24-day stay
  price_32?: number; // Price for 32-day stay
  rates?: Record<string, number>; // For storing all rates together
  currency?: string; // Added to store currency information
  enablePriceIncrease?: boolean; // Added for dynamic pricing setting
  priceIncreaseCap?: number; // Added for dynamic pricing max percentage
  latitude?: number | string; // Add latitude for map location
  longitude?: number | string; // Add longitude for map location
  pricingMatrix?: any[]; // Added for pricing matrix from Step 4
  price_per_month?: number; // Added for calculated proportional monthly price
  checkinDay?: string; // Added for check-in day selection in Step 3
  stayDurations?: number[]; // Alternative to stayLengths for consistency
  affinities?: string[]; // Alternative to themes for consistency
  availabilityPackages?: any[]; // Added for availability packages from registration form
}

export const usePropertyFormData = () => {
  const [formData, setFormData] = useState<PropertyFormData>({
    hotelName: "",
    totalRooms: 0,
    propertyType: "",
    description: "",
    idealGuests: "",
    atmosphere: "",
    perfectLocation: "",
    style: "",
    country: "",
    address: "",
    city: "",
    postalCode: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    category: "",
    stayLengths: [],
    mealPlans: [],
    roomTypes: [],
    themes: [],
    activities: [],
    faqs: [],
    terms: "",
    termsAccepted: false,
    preferredWeekday: "Monday",
    featuresHotel: {},
    featuresRoom: {},
    available_months: [], // Initialize available_months as empty array
    price_8: 0,
    price_16: 0,
    price_24: 0,
    price_32: 0,
    rates: {},
    currency: "USD",
    enablePriceIncrease: false,
    priceIncreaseCap: 20,
    latitude: undefined,
    longitude: undefined,
    pricingMatrix: [],
    checkinDay: "Monday",
    stayDurations: [],
    affinities: []
  });

  const updateFormData = (field: keyof PropertyFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return {
    formData,
    setFormData,
    updateFormData
  };
};
