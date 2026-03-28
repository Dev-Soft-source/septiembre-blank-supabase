
interface HotelData {
  id: string;
  name: string;
  description: string | null;
  country: string;
  city: string;
  address: string | null;
  price_per_month: number;
  main_image_url: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  owner_id: string;
  property_type: string | null;
  style: string | null;
  ideal_guests: string | null;
  atmosphere: string | null;
  perfect_location: string | null;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  available_months: string[];
  features_hotel: Record<string, boolean>;
  features_room: Record<string, boolean>;
  room_types: any[];
  meal_plans: string[];
  stay_lengths: number[];
  hotel_images: any[];
  hotel_themes: any[];
  hotel_activities: any[];
  enable_price_increase: boolean;
  price_increase_cap: number;
}

interface OverviewStats {
  isActive: boolean;
  totalRoomTypes: number;
  availableMonthsCount: number;
  totalBookings: number;
  activeBookings: number;
  completedBookings: number;
  totalRevenue: number;
  averageBookingValue: number;
  totalImages: number;
  mainImageSet: boolean;
  totalThemes: number;
  totalActivities: number;
  accountAge: number;
  hasRoomTypes: boolean;
  hasAvailability: boolean;
  hasDynamicPricing: boolean;
  completionScore: number;
}

interface FormattedResponse {
  success: boolean;
  data: {
    hotel: {
      id: string;
      name: string;
      description: string | null;
      status: string;
      created_at: string;
      updated_at: string;
      owner_id: string;
    };
    location: {
      country: string;
      city: string;
      address: string | null;
    };
    contact: {
      name: string | null;
      email: string | null;
      phone: string | null;
    };
    property: {
      type: string | null;
      style: string | null;
      price_per_month: number;
      main_image_url: string | null;
    };
    content: {
      ideal_guests: string | null;
      atmosphere: string | null;
      perfect_location: string | null;
    };
    features: {
      hotel_features: Record<string, boolean>;
      room_features: Record<string, boolean>;
      meal_plans: string[];
      stay_lengths: number[];
    };
    availability: {
      available_months: string[];
      room_types: any[];
    };
    media: {
      total_images: number;
      main_image_set: boolean;
      images: any[];
    };
    themes_activities: {
      total_themes: number;
      total_activities: number;
      themes: any[];
      activities: any[];
    };
    pricing: {
      dynamic_pricing_enabled: boolean;
      price_increase_cap: number;
    };
    statistics: OverviewStats;
  };
  timestamp: string;
}

export function formatOverviewResponse(hotelData: HotelData, stats: OverviewStats): FormattedResponse {
  return {
    success: true,
    data: {
      hotel: {
        id: hotelData.id,
        name: hotelData.name,
        description: hotelData.description,
        status: hotelData.status,
        created_at: hotelData.created_at,
        updated_at: hotelData.updated_at,
        owner_id: hotelData.owner_id,
      },
      location: {
        country: hotelData.country,
        city: hotelData.city,
        address: hotelData.address,
      },
      contact: {
        name: hotelData.contact_name,
        email: hotelData.contact_email,
        phone: hotelData.contact_phone,
      },
      property: {
        type: hotelData.property_type,
        style: hotelData.style,
        price_per_month: hotelData.price_per_month,
        main_image_url: hotelData.main_image_url,
      },
      content: {
        ideal_guests: hotelData.ideal_guests,
        atmosphere: hotelData.atmosphere,
        perfect_location: hotelData.perfect_location,
      },
      features: {
        hotel_features: hotelData.features_hotel || {},
        room_features: hotelData.features_room || {},
        meal_plans: hotelData.meal_plans || [],
        stay_lengths: hotelData.stay_lengths || [],
      },
      availability: {
        available_months: hotelData.available_months || [],
        room_types: hotelData.room_types || [],
      },
      media: {
        total_images: stats.totalImages,
        main_image_set: stats.mainImageSet,
        images: hotelData.hotel_images || [],
      },
      themes_activities: {
        total_themes: stats.totalThemes,
        total_activities: stats.totalActivities,
        themes: hotelData.hotel_themes || [],
        activities: hotelData.hotel_activities || [],
      },
      pricing: {
        dynamic_pricing_enabled: hotelData.enable_price_increase || false,
        price_increase_cap: hotelData.price_increase_cap || 0,
      },
      statistics: stats,
    },
    timestamp: new Date().toISOString(),
  };
}
