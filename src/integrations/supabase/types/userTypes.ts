
export type Profile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  is_hotel_owner: boolean;
  created_at: string;
  updated_at: string;
  admin_note?: string | null;
  role?: string;
  email_verified?: boolean;
  is_active?: boolean;
  preferred_language?: string | null;
  jotform_token?: string | null;
}

export type UserRole = {
  user_id: string;
  role: string;
}

export type UserAffinity = {
  id: string;
  user_id: string;
  theme_id: string;
  created_at: string;
}

export type UserPreference = {
  id: string;
  user_id: string;
  price_range_min?: number;
  price_range_max?: number;
  preferred_countries?: string[];
  favorite_themes?: string[];
  language_preferences?: string[];
  created_at: string;
  updated_at: string;
}

export type UserNotification = {
  id: string;
  user_id: string;
  hotel_id: string;
  type: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type UserReward = {
  id: string;
  user_id: string;
  reward_type: string;
  quantity: number;
  source: string;
  is_used: boolean;
  used_at?: string | null;
  booking_id?: string | null;
  created_at: string;
  updated_at: string;
}

export type UserReport = {
  id: string;
  reported_user_id: string;
  hotel_id: string;
  reason: string;
  status: string;
  created_at: string;
  updated_at: string;
}
