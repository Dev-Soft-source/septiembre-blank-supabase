import React from "react";
import { HotelDetailProps } from "@/types/hotel";
import { HotelFeaturesInfo } from "./sections/HotelFeaturesInfo";
import { HotelLocation } from "../HotelLocation";
import { RedesignedBookingSection } from "../RedesignedBookingSection";
import { HotelNotificationButtons } from "../HotelNotificationButtons";
import { AvailabilityPackages } from "../AvailabilityPackages";
import { Card } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
interface HotelMainContentGridProps {
  hotel: HotelDetailProps;
  checkInDate: Date | undefined;
  setCheckInDate: (date: Date | undefined) => void;
  selectedDuration: number;
  setSelectedDuration: (duration: number) => void;
  stayDurations: number[];
  preparedRates: Record<string, number>;
  handleBookClick: () => void;
  checkInWeekday: string;
  pricingMatrix: Array<{
    roomType: string;
    stayLength: string;
    mealPlan: string;
    price: number;
  }>;
  isHotelAvailable: boolean;
}
export function HotelMainContentGrid({
  hotel,
  checkInDate,
  setCheckInDate,
  selectedDuration,
  setSelectedDuration,
  stayDurations,
  preparedRates,
  handleBookClick,
  checkInWeekday,
  pricingMatrix,
  isHotelAvailable
}: HotelMainContentGridProps) {
  const { t } = useTranslation('hotels');
  
  // Helper function to convert features to array format
  const convertFeaturesToArray = (features: any): string[] => {
    if (!features) return [];
    if (Array.isArray(features)) return features;
    if (typeof features === 'object') {
      // Convert object format {feature: true/false} to array of true features
      return Object.entries(features)
        .filter(([_, value]) => value === true)
        .map(([key, _]) => key);
    }
    return [];
  };

  const hotelFeaturesArray = convertFeaturesToArray(hotel.hotelFeatures || hotel.features_hotel);
  const roomFeaturesArray = convertFeaturesToArray(hotel.roomFeatures || hotel.features_room);

  console.log("🏨 Features Debug:", {
    raw_hotel_features: hotel.features_hotel,
    raw_room_features: hotel.features_room,
    converted_hotel: hotelFeaturesArray,
    converted_room: roomFeaturesArray
  });
  return <div className="grid lg:grid-cols-3 gap-8">
      {/* Left content area - Features and Map */}
      <div className="lg:col-span-2 space-y-8">
        {/* Hotel Features and Room Features */}
        <Card className="bg-[#6000B3] border-border shadow-2xl">
          <div className="p-6 bg-[#6000B3]">
            <HotelFeaturesInfo 
              hotelFeatures={hotelFeaturesArray} 
              roomFeatures={roomFeaturesArray} 
            />
          </div>
        </Card>
        
        {/* Availability Packages Section */}
        <AvailabilityPackages 
          hotelId={hotel.id}
          hotelName={hotel.name}
          pricePerMonth={hotel.price_per_month}
          onPackageSelect={(packageData) => {
            console.log('Package selected:', packageData);
          }}
        />
        
        {/* Google Map Section */}
        <Card className="bg-[#6000B3] border-border shadow-2xl">
          <div className="p-6 bg-[#6000B3]">
            <h2 className="text-2xl font-bold mb-6 text-white text-center">{t('hotelLocation')}</h2>
            <HotelLocation hotelId={hotel.id} latitude={Number(hotel.latitude)} longitude={Number(hotel.longitude)} hotelName={hotel.name} address={hotel.address || ""} city={hotel.city || ""} country={hotel.country || ""} />
          </div>
        </Card>
      </div>

      {/* Right sidebar - Booking Widget */}
      <div className="lg:col-span-1">
        <div className="sticky top-4 bg-[#6000B3]">
          <RedesignedBookingSection checkInDate={checkInDate} setCheckInDate={setCheckInDate} selectedDuration={selectedDuration} setSelectedDuration={setSelectedDuration} stayDurations={stayDurations} rates={preparedRates} currency={hotel.currency || "USD"} handleBookClick={handleBookClick} preferredWeekday={checkInWeekday} enable_price_increase={hotel.enable_price_increase} price_increase_cap={hotel.price_increase_cap} availableMonths={hotel.available_months} pricingMatrix={pricingMatrix} mealPlans={hotel.meal_plans} />
          
          {/* Add notification buttons */}
          <Card className="mt-4 bg-gradient-to-br from-gold-900/40 to-gold-800/30 border-gold-700/30 shadow-2xl">
            
          </Card>
        </div>
      </div>
    </div>;
}