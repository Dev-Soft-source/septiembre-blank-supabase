
interface BookingData {
  id: string;
  user_id: string;
  hotel_id: string;
  check_in: string;
  check_out: string;
  total_price: number;
  status: string;
  created_at: string;
  updated_at: string;
  hotels: {
    id: string;
    name: string;
    location: string;
    price_per_month: number;
    country: string;
    city: string;
  };
}

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

export function calculateBookingSummary(bookingData: BookingData): BookingSummary {
  // Calculate duration in days
  const checkInDate = new Date(bookingData.check_in);
  const checkOutDate = new Date(bookingData.check_out);
  const durationMs = checkOutDate.getTime() - checkInDate.getTime();
  const duration = Math.ceil(durationMs / (1000 * 60 * 60 * 24));

  // Calculate pricing details
  const pricePerMonth = bookingData.hotels.price_per_month;
  const basePrice = pricePerMonth;
  const totalPrice = bookingData.total_price;

  return {
    bookingId: bookingData.id,
    userId: bookingData.user_id,
    hotelInfo: {
      id: bookingData.hotels.id,
      name: bookingData.hotels.name,
      location: bookingData.hotels.location,
      country: bookingData.hotels.country,
      city: bookingData.hotels.city,
    },
    dates: {
      checkIn: bookingData.check_in,
      checkOut: bookingData.check_out,
      duration,
    },
    pricing: {
      basePrice,
      totalPrice,
      pricePerMonth,
    },
    status: bookingData.status,
    timestamps: {
      createdAt: bookingData.created_at,
      updatedAt: bookingData.updated_at,
    },
  };
}
