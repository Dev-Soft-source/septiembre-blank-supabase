
import React from "react";
import { Check } from "lucide-react";
import { useTranslationWithFallback } from "@/hooks/useTranslationWithFallback";
import { useUnifiedTranslations } from "@/hooks/useUnifiedTranslations";

interface HotelFeaturesInfoProps {
  hotelFeatures: string[];
  roomFeatures: string[];
}

export function HotelFeaturesInfo({ hotelFeatures, roomFeatures }: HotelFeaturesInfoProps) {
  const { t } = useTranslationWithFallback('hotel-detail');
  const { data: hotelFeatureOptions = [], isLoading: hotelLoading } = useUnifiedTranslations('hotel_features');
  const { data: roomFeatureOptions = [], isLoading: roomLoading } = useUnifiedTranslations('room_features');
  
  if (!hotelFeatures?.length && !roomFeatures?.length) return null;

  // Show loading state while translations are being fetched
  if (hotelLoading || roomLoading) {
    return (
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-6 text-white">{t('hotelDetail.hotelFeatures')}</h2>
        <div className="animate-pulse text-white">Loading features...</div>
      </div>
    );
  }

  // Create mapping objects for quick lookup
  const hotelFeatureMap = new Map(hotelFeatureOptions.map(option => [option.value, option.label]));
  const roomFeatureMap = new Map(roomFeatureOptions.map(option => [option.value, option.label]));

  // Function to translate features using the unified system
  const translateFeatures = (features: string[], featureMap: Map<string, string>) => {
    return features.map(feature => {
      // First try to find exact English-key match
      const exactMatch = featureMap.get(feature.toLowerCase().replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_'));
      if (exactMatch) return exactMatch;
      
      // Try to find by converting Spanish feature to English key
      const englishKey = feature
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove accents
        .replace(/[^a-zA-Z0-9\s]/g, '')
        .replace(/\s+/g, '_');
      
      const keyMatch = featureMap.get(englishKey);
      if (keyMatch) return keyMatch;
      
      // Fallback to original feature name
      return feature;
    });
  };

  const translatedHotelFeatures = translateFeatures(hotelFeatures || [], hotelFeatureMap);
  const translatedRoomFeatures = translateFeatures(roomFeatures || [], roomFeatureMap);

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-6 text-white">Features & Amenities</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {hotelFeatures?.length > 0 && (
          <div className="p-6 rounded-xl bg-[#6000B3] backdrop-blur-sm border border-white/20 shadow-[0_0_50px_rgba(96,0,179,0.8),0_0_80px_rgba(96,0,179,0.4)] hover:shadow-[0_0_60px_rgba(96,0,179,1),0_0_100px_rgba(96,0,179,0.6)] transition-all duration-300 transform hover:scale-[1.02]">
            <h3 className="text-lg font-bold mb-4 text-white text-center">{t('hotelDetail.hotelFeatures')}</h3>
            <div className="space-y-3">
              {translatedHotelFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 text-white">
                  <Check size={18} className="text-emerald-300 flex-shrink-0" />
                  <span className="text-sm font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {roomFeatures?.length > 0 && (
          <div className="p-6 rounded-xl bg-[#6000B3] backdrop-blur-sm border border-white/20 shadow-[0_0_50px_rgba(96,0,179,0.8),0_0_80px_rgba(96,0,179,0.4)] hover:shadow-[0_0_60px_rgba(96,0,179,1),0_0_100px_rgba(96,0,179,0.6)] transition-all duration-300 transform hover:scale-[1.02]">
            <h3 className="text-lg font-bold mb-4 text-white text-center">{t('hotelDetail.roomFeatures')}</h3>
            <div className="space-y-3">
              {translatedRoomFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 text-white">
                  <Check size={18} className="text-emerald-300 flex-shrink-0" />
                  <span className="text-sm font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
