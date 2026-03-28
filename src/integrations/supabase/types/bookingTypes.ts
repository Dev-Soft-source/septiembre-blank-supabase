
export type Booking = {
  id: string;
  user_id: string;
  hotel_id: string;
  check_in: string;
  check_out: string;
  total_price: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  created_at: string;
  updated_at: string;
}

export type Payment = {
  id: string;
  user_id?: string | null;
  hotel_id?: string | null;
  booking_id?: string | null;
  amount: number;
  method: string;
  status: string;
  transaction_id?: string | null;
  created_at: string;
  updated_at: string;
}

export type StayExtension = {
  id: string;
  original_booking_id: string;
  new_booking_id: string;
  original_duration: number;
  new_duration: number;
  original_price: number;
  new_price: number;
  price_difference: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export type Review = {
  id: string;
  user_id: string;
  hotel_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  updated_at: string;
  is_flagged?: boolean;
  is_hidden?: boolean;
  is_notified?: boolean;
  admin_note?: string | null;
  response_text?: string | null;
}

export type Favorite = {
  id: string;
  user_id: string;
  hotel_id: string;
  created_at: string;
}
