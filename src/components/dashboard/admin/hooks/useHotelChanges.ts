
import { useState, useEffect } from "react";
import { AdminHotelDetail } from "@/types/hotel";

type FieldType = 'text' | 'number' | 'boolean' | 'array' | 'object';

interface HotelChange {
  fieldName: string;
  displayName: string;
  previousValue: any;
  newValue: any;
  fieldType: FieldType;
}

// Field display name mapping
const fieldDisplayNames: { [key: string]: string } = {
  name: "Hotel Name",
  description: "Description",
  address: "Address",
  city: "City",
  country: "Country",
  postal_code: "Postal Code",
  category: "Star Rating",
  property_type: "Property Type",
  atmosphere: "Atmosphere",
  ideal_guests: "Ideal Guests",
  perfect_location: "Location Description",
  features_hotel: "Hotel Features",
  features_room: "Room Features",
  meal_plans: "Meal Plans",
  contact_name: "Contact Name",
  contact_email: "Contact Email",
  contact_phone: "Contact Phone",
  price_per_month: "Price Per Month",
  stay_lengths: "Stay Lengths",
  room_types: "Room Types",
  terms: "Terms & Conditions",
  faqs: "FAQs",
  enable_price_increase: "Dynamic Pricing Enabled",
  price_increase_cap: "Price Increase Cap (%)",
  // ADD MAPPING FOR NEW CAMELCASE COLUMNS
  enablePriceIncrease: "Dynamic Pricing Enabled",
  priceIncreaseCap: "Price Increase Cap (%)"
};

// Field type mapping
const fieldTypes: { [key: string]: FieldType } = {
  name: 'text',
  description: 'text',
  address: 'text',
  city: 'text',
  country: 'text',
  postal_code: 'text',
  category: 'number',
  property_type: 'text',
  atmosphere: 'text',
  ideal_guests: 'text',
  perfect_location: 'text',
  features_hotel: 'object',
  features_room: 'object',
  meal_plans: 'array',
  contact_name: 'text',
  contact_email: 'text',
  contact_phone: 'text',
  price_per_month: 'number',
  stay_lengths: 'array',
  room_types: 'array',
  terms: 'text',
  faqs: 'array',
  enable_price_increase: 'boolean',
  price_increase_cap: 'number',
  // ADD MAPPING FOR NEW CAMELCASE COLUMNS
  enablePriceIncrease: 'boolean',
  priceIncreaseCap: 'number'
};

export function useHotelChanges(hotel: AdminHotelDetail | null) {
  const [changes, setChanges] = useState<HotelChange[]>([]);

  useEffect(() => {
    if (hotel && hotel.pending_changes) {
      // Process pending changes
      const pendingChanges: HotelChange[] = [];
      for (const [key, value] of Object.entries(hotel.pending_changes)) {
        if (value !== null) {
          pendingChanges.push({
            fieldName: key,
            displayName: fieldDisplayNames[key] || key,
            previousValue: hotel[key as keyof typeof hotel],
            newValue: value,
            fieldType: fieldTypes[key] || 'text'
          });
        }
      }
      setChanges(pendingChanges);
    } else {
      setChanges([]);
    }
  }, [hotel]);

  return { changes };
}
