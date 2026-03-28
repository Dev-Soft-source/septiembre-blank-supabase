
interface HotelData {
  id: string;
  status: string;
  room_types: any[];
  available_months: string[];
  bookings?: {
    id: string;
    status: string;
    check_in: string;
    check_out: string;
    total_price: number;
  }[];
  hotel_images: any[];
  hotel_themes: any[];
  hotel_activities: any[];
  created_at: string;
  price_per_month: number;
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

export function calculateOverviewStats(hotelData: HotelData): OverviewStats {
  // Basic activity status
  const isActive = hotelData.status === 'approved';
  
  // Room and availability stats
  const totalRoomTypes = Array.isArray(hotelData.room_types) ? hotelData.room_types.length : 0;
  const availableMonthsCount = Array.isArray(hotelData.available_months) ? hotelData.available_months.length : 0;
  const hasRoomTypes = totalRoomTypes > 0;
  const hasAvailability = availableMonthsCount > 0;
  
  // Booking statistics
  const bookings = hotelData.bookings || [];
  const totalBookings = bookings.length;
  const activeBookings = bookings.filter(b => ['confirmed', 'pending'].includes(b.status)).length;
  const completedBookings = bookings.filter(b => b.status === 'completed').length;
  
  // Revenue calculations
  const totalRevenue = bookings
    .filter(b => ['confirmed', 'completed'].includes(b.status))
    .reduce((sum, booking) => sum + (booking.total_price || 0), 0);
  const averageBookingValue = totalBookings > 0 ? totalRevenue / totalBookings : 0;
  
  // Media and content stats
  const totalImages = hotelData.hotel_images?.length || 0;
  const mainImageSet = hotelData.hotel_images?.some(img => img.is_main) || false;
  const totalThemes = hotelData.hotel_themes?.length || 0;
  const totalActivities = hotelData.hotel_activities?.length || 0;
  
  // Account age in days
  const createdDate = new Date(hotelData.created_at);
  const accountAge = Math.floor((Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // Pricing features
  const hasDynamicPricing = hotelData.enable_price_increase || false;
  
  // Completion score (0-100) based on profile completeness
  let completionScore = 0;
  const maxScore = 100;
  const scoreComponents = [
    { condition: hasRoomTypes, points: 20 },
    { condition: hasAvailability, points: 20 },
    { condition: totalImages > 0, points: 15 },
    { condition: mainImageSet, points: 10 },
    { condition: totalThemes > 0, points: 15 },
    { condition: totalActivities > 0, points: 10 },
    { condition: isActive, points: 10 }
  ];
  
  scoreComponents.forEach(component => {
    if (component.condition) {
      completionScore += component.points;
    }
  });
  
  return {
    isActive,
    totalRoomTypes,
    availableMonthsCount,
    totalBookings,
    activeBookings,
    completedBookings,
    totalRevenue,
    averageBookingValue,
    totalImages,
    mainImageSet,
    totalThemes,
    totalActivities,
    accountAge,
    hasRoomTypes,
    hasAvailability,
    hasDynamicPricing,
    completionScore: Math.min(completionScore, maxScore)
  };
}
