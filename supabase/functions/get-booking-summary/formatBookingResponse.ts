
interface BookingSummary {
  bookingId: string;
  userId: string;
  hotelInfo: {
    id: string;
    name: string;
    location: string;
    country: string;
    city: string;
  };
  dates: {
    checkIn: string;
    checkOut: string;
    duration: number;
  };
  pricing: {
    basePrice: number;
    totalPrice: number;
    pricePerMonth: number;
  };
  status: string;
  timestamps: {
    createdAt: string;
    updatedAt: string;
  };
}

interface FormattedResponse {
  success: boolean;
  data: {
    booking: {
      id: string;
      user_id: string;
      status: string;
      created_at: string;
      updated_at: string;
    };
    hotel: {
      id: string;
      name: string;
      location: string;
      country: string;
      city: string;
    };
    stay_details: {
      check_in: string;
      check_out: string;
      duration_days: number;
    };
    pricing: {
      base_price: number;
      total_price: number;
      price_per_month: number;
      currency: string;
    };
  };
  timestamp: string;
}

export function formatBookingResponse(summary: BookingSummary): FormattedResponse {
  return {
    success: true,
    data: {
      booking: {
        id: summary.bookingId,
        user_id: summary.userId,
        status: summary.status,
        created_at: summary.timestamps.createdAt,
        updated_at: summary.timestamps.updatedAt,
      },
      hotel: {
        id: summary.hotelInfo.id,
        name: summary.hotelInfo.name,
        location: summary.hotelInfo.location,
        country: summary.hotelInfo.country,
        city: summary.hotelInfo.city,
      },
      stay_details: {
        check_in: summary.dates.checkIn,
        check_out: summary.dates.checkOut,
        duration_days: summary.dates.duration,
      },
      pricing: {
        base_price: summary.pricing.basePrice,
        total_price: summary.pricing.totalPrice,
        price_per_month: summary.pricing.pricePerMonth,
        currency: "USD", // Default currency
      },
    },
    timestamp: new Date().toISOString(),
  };
}
