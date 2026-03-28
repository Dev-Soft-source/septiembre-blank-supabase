
export interface HotelTheme {
  id: string;
  name: string;
  description?: string | null;
  category?: string;
}

export interface HotelActivity {
  activity_id: string;
  activities?: {
    id: string;
    name: string;
    category?: string;
  };
}

export interface HotelImage {
  id: string;
  hotel_id: string;
  image_url: string;
  is_main: boolean;
  created_at: string;
}

export interface RoomType {
  id: string;
  name: string;
  description?: string;
  maxOccupancy?: number;
  size?: number;
  roomCount?: number;
  basePrice?: number;
  baseRate?: number;
  rates?: Record<number, number>;
  images?: string[];
  availabilityDates?: string[];
}
