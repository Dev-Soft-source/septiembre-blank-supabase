import React, { useState, useEffect } from "react";
import { HotelDetailProps } from "@/types/hotel";
import { HotelHeader } from "../HotelHeader";
import { HotelGallerySection } from "./sections/HotelGallerySection";
import { HotelAtAGlanceSection } from "./HotelAtAGlanceSection";
import { HotelPropertyDetailsSection } from "./HotelPropertyDetailsSection";
import { HotelThemesAndActivities } from "../HotelThemesAndActivities";
import { HotelAvailableMonths } from "../HotelAvailableMonths";
import { HotelFeaturesInfo } from "./sections/HotelFeaturesInfo";
import { HotelLocation } from "../HotelLocation";
import { HotelMainContentGrid } from "./HotelMainContentGrid";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin } from "lucide-react";
export interface HotelDetailContentProps {
  hotel: HotelDetailProps;
  isLoading?: boolean;
}
export function HotelDetailContent({
  hotel,
  isLoading = false
}: HotelDetailContentProps) {
  const [checkInDate, setCheckInDate] = useState<Date | undefined>(undefined);
  const [selectedDuration, setSelectedDuration] = useState<number>(8);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = hotel?.hotel_images?.length > 0 ? hotel.hotel_images.map(img => img.image_url) : hotel?.main_image_url ? [hotel.main_image_url] : [];
  const themes = hotel?.themes || [];
  const activities = hotel?.activities || [];

  // Debug logging for pricing matrix
  console.log("🏨 Hotel Detail Debug:", {
    hotelId: hotel?.id,
    hotelName: hotel?.name,
    pricingMatrix: hotel?.pricingMatrix,
    pricingmatrix: (hotel as any)?.pricingmatrix,
    features_hotel: hotel?.features_hotel,
    features_room: hotel?.features_room,
    address: hotel?.address,
    city: hotel?.city,
    postal_code: (hotel as any)?.postal_code
  });

  // Convert old night values to day values for consistency with UI
  const convertNightsToDays = (nightValues: number[]) => {
    const nightToDayMap: Record<number, number> = {
      8: 8,
      // 8 nights -> 8 days (special case)
      16: 15,
      // 16 nights -> 15 days  
      24: 22,
      // 24 nights -> 22 days
      32: 29 // 32 nights -> 29 days
    };
    return nightValues.map(night => nightToDayMap[night] || night);
  };
  const convertedStayLengths = convertNightsToDays(hotel.stay_lengths || []);

  // Get pricing matrix - handle both field name variations
  const hotelPricingMatrix = hotel?.pricingMatrix || (hotel as any)?.pricingmatrix || [];
  console.log("📊 Pricing Matrix Debug:", { hotelPricingMatrix, length: hotelPricingMatrix.length });

  // Prepare rates data
  const preparedRates: Record<string, number> = {};
  if (hotel.rates && typeof hotel.rates === 'object') {
    Object.entries(hotel.rates).forEach(([key, value]) => {
      if (typeof value === 'number') {
        preparedRates[key] = value;
      }
    });
  }
  const handleBookClick = () => {
    // For demo hotels, show unavailable message only at final booking step
    console.log("Booking attempt - this will show unavailable message at final step");
  };
  const isHotelAvailable = true; // For display purposes, status handled elsewhere
  const checkInWeekday = hotel.check_in_weekday || hotel.preferredWeekday || 'Monday';
  if (isLoading) {
    return <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-fuchsia-950 animate-pulse">
        <div className="h-96 bg-purple-800/50"></div>
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-8 bg-purple-700/50 rounded"></div>
              <div className="h-64 bg-purple-700/50 rounded"></div>
              <div className="space-y-4">
                <div className="h-4 bg-purple-700/50 rounded w-3/4"></div>
                <div className="h-4 bg-purple-700/50 rounded w-1/2"></div>
              </div>
            </div>
            <div className="h-96 bg-purple-700/50 rounded"></div>
          </div>
        </div>
      </div>;
  }
  if (!hotel) {
    return null;
  }

  // Format address display
  const formatAddress = (text: string) => {
    return text.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };
  const formatCountry = (country: string) => {
    if (country.toUpperCase() === 'US') {
      return 'United States';
    }
    return formatAddress(country);
  };
  const formattedCity = formatAddress(hotel.city);
  const formattedCountry = formatCountry(hotel.country);
  const formattedAddress = hotel.address ? formatAddress(hotel.address) : null;
  const fullAddress = formattedAddress ? `${formattedAddress}, ${formattedCity}, ${formattedCountry}` : `${formattedCity}, ${formattedCountry}`;
  return <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-fuchsia-950">
      {/* Hero Header Section */}
      <div className="relative overflow-hidden">
        {/* Background with main image */}
        <div className="relative h-[500px]">
          {images.length > 0 && <img src={images[0]} alt={hotel.name} className="w-full h-full object-cover" />}
          <div className="absolute inset-0 bg-gradient-to-t from-purple-950/90 via-purple-900/50 to-transparent" />
          
          {/* Hotel Header Content */}
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="container mx-auto">
              <div className="text-center space-y-4">
                {/* Hotel Name and Category */}
                <div className="space-y-2">
                  <h1 className="text-5xl md:text-6xl font-bold text-white drop-shadow-2xl">
                    {hotel.name}
                  </h1>
                  {hotel.category && <div className="flex justify-center items-center gap-1">
                      {Array.from({
                    length: hotel.category
                  }, (_, i) => <Star key={`detail-star-${i}`} className="w-6 h-6 fill-yellow-400 text-yellow-400" />)}
                    </div>}
                </div>

                {/* Full Address */}
                <div className="flex justify-center items-center gap-2 text-white/90 text-lg">
                  <MapPin className="w-5 h-5" />
                  <span>{fullAddress}</span>
                </div>

                {/* Affinity tags and Activity tags */}
                <div className="flex flex-wrap justify-center gap-2 mt-6">
                  {themes.map((theme, index) => <Badge key={`theme-${theme}-${index}`} variant="secondary" className="bg-purple-700/80 text-white border-purple-500/50 hover:bg-purple-600/80 px-3 py-1">
                      {theme.name}
                    </Badge>)}
                  {activities.map((activity, index) => <Badge key={`activity-${activity}-${index}`} variant="outline" className="bg-fuchsia-800/60 text-white border-fuchsia-400/50 hover:bg-fuchsia-700/60 px-3 py-1">
                      {activity}
                    </Badge>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Image Gallery Section */}
        {images.length > 1 && <Card className="mb-8 bg-[#957B23] border-border shadow-2xl">
            <div className="p-6 bg-[#957B23]">
              <h2 className="text-2xl font-bold mb-6 text-white text-center">Gallery</h2>
              <HotelGallerySection images={images} hotelName={hotel.name} currentImageIndex={currentImageIndex} setCurrentImageIndex={setCurrentImageIndex} />
            </div>
          </Card>}

        {/* Descriptive Content Section */}
        <Card className="mb-8 bg-[#957B23] border-border shadow-2xl">
          <div className="p-8 bg-[#957B23]">
          <HotelPropertyDetailsSection hotel={hotel} />
          </div>
        </Card>

        {/* Available Months Section */}
        {hotel.available_months && hotel.available_months.length > 0 && <Card className="mb-8 bg-[#957B23] border-border shadow-2xl">
            <div className="p-6 bg-[#957B23]">
              <HotelAvailableMonths months={hotel.available_months} />
            </div>
          </Card>}

        {/* Room Types and Stay Durations */}
        {hotel.room_types && hotel.room_types.length > 0 || convertedStayLengths.length > 0 && <Card className="mb-8 bg-[#957B23] border-border shadow-2xl">
            <div className="p-6 bg-[#957B23]">
              <h2 className="text-2xl font-bold mb-6 text-white">Room Types & Stay Options</h2>
              
              {hotel.room_types && hotel.room_types.length > 0 && <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 text-white">Available Room Types</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {hotel.room_types.map((roomType: any, index: number) => <div key={`room-${roomType.id || roomType.name}-${index}`} className="bg-gold-700/40 rounded-lg p-4 border border-gold-600/30">
                        <h4 className="font-semibold text-white mb-2">{roomType.name || roomType.type}</h4>
                        {roomType.description && <p className="text-white/80 text-sm">{roomType.description}</p>}
                        {roomType.capacity && <p className="text-white/70 text-sm mt-1">Capacity: {roomType.capacity} guests</p>}
                      </div>)}
                  </div>
                </div>}

              {convertedStayLengths.length > 0 && <div>
                  <h3 className="text-lg font-semibold mb-3 text-white">Available Stay Durations</h3>
                  <div className="flex flex-wrap gap-2">
                    {convertedStayLengths.map((length, index) => <Badge key={`stay-${length}-${index}`} className="bg-fuchsia-700/80 text-white px-4 py-2">
                        {length} {length === 1 ? 'day' : 'days'}
                      </Badge>)}
                  </div>
                </div>}
            </div>
          </Card>}

        {/* Main Content Grid with Booking */}
        <HotelMainContentGrid hotel={hotel} checkInDate={checkInDate} setCheckInDate={setCheckInDate} selectedDuration={selectedDuration} setSelectedDuration={setSelectedDuration} stayDurations={convertedStayLengths} preparedRates={preparedRates} handleBookClick={handleBookClick} checkInWeekday={checkInWeekday} pricingMatrix={hotelPricingMatrix} isHotelAvailable={isHotelAvailable} />
      </div>
    </div>;
}