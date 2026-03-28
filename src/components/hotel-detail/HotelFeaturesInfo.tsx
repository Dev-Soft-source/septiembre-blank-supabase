import React from "react";
import { useTranslationWithFallback } from "@/hooks/useTranslationWithFallback";
import { safeFeatures } from "@/utils/safeDataAccess";

interface HotelFeaturesInfoProps {
  hotelFeatures: string[] | Record<string, boolean>;
  roomFeatures: string[] | Record<string, boolean>;
}

export function HotelFeaturesInfo({
  hotelFeatures,
  roomFeatures
}: HotelFeaturesInfoProps) {
  const { t, language } = useTranslationWithFallback('hotel-detail');
  
  // Process features with comprehensive safety - handle both array and object formats
  const getValidFeatures = (features: string[] | Record<string, boolean> | null | undefined): string[] => {
    if (Array.isArray(features)) {
      return features.filter(feature => feature && typeof feature === 'string' && feature.trim() !== '');
    } else if (features && typeof features === 'object') {
      // Handle JSONB object format from database
      return Object.keys(features).filter(key => features[key] === true);
    }
    return [];
  };
  
  const validHotelFeatures = getValidFeatures(hotelFeatures);
  const validRoomFeatures = getValidFeatures(roomFeatures);

  // If both arrays are empty, return null
  if (validHotelFeatures.length === 0 && validRoomFeatures.length === 0) {
    return null;
  }

  return (
    <div className="my-6 p-4 rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {validHotelFeatures.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold mb-4 text-white text-left">
              {t('hotelDetail.hotelFeatures')}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {validHotelFeatures.map((feature, index) => (
                <div key={`hotel-feature-${index}-${feature.slice(0, 10)}`} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {validRoomFeatures.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold mb-4 text-white text-left">
              {t('hotelDetail.roomFeatures')}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {validRoomFeatures.map((feature, index) => (
                <div key={`room-feature-${index}-${feature.slice(0, 10)}`} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}