export interface AvailabilityPackage {
  id: string;
  hotel_id: string;
  start_date: string;
  end_date: string;
  duration_days: number;
  total_rooms: number;
  available_rooms: number;
  room_type: string;
  occupancy_mode: string;
  meal_plan?: string;
  base_price_usd: number;
  current_price_usd: number;
  created_at: string;
  updated_at: string;
}

export interface AvailabilityPackageWithStatus extends AvailabilityPackage {
  isAvailable: boolean;
  isSoldOut: boolean;
  isFallback?: boolean; // Mark fallback packages
}

export interface AvailabilityPackagesProps {
  hotelId: string;
  onPackageSelect?: (packageData: AvailabilityPackage) => void;
  hotelName?: string;
  pricePerMonth?: number;
  pricingMatrix?: Array<{
    duration: number;
    doubleRoom: number;
    singleRoom: number;
  }>;
  hotelCategory?: number;
}