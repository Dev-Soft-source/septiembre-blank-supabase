import React from "react";
import { HotelTheme } from "@/types/hotel";
import { useTranslationWithFallback } from "@/hooks/useTranslationWithFallback";
import { safeArray, safeThemes, safeActivities } from "@/utils/safeDataAccess";

interface HotelThemesAndActivitiesProps {
  stayLengths: number[];
  hotelThemes: HotelTheme[];
  hotelActivities: string[];
}

export function HotelThemesAndActivities({
  stayLengths,
  hotelThemes,
  hotelActivities
}: HotelThemesAndActivitiesProps) {
  const { t, language } = useTranslationWithFallback('hotel-detail');
  
  // Safe access with fallbacks
  const safeStayLengths = Array.isArray(stayLengths) ? stayLengths.filter(length => typeof length === 'number' && length > 0) : [];
  const safeHotelThemes = safeThemes(hotelThemes, language);
  const safeHotelActivities = safeActivities(hotelActivities, language);
  
  return (
    <>
      {safeStayLengths.length > 0 && (
        <p className="text-white mt-3 text-base font-medium">
          {t('hotelDetail.hotelOffersStays')} {safeStayLengths.join(", ").replace(/, ([^,]*)$/, ` ${t('hotelDetail.and')} $1`)} {t('hotelDetail.days')}.
        </p>
      )}
      
      {Array.isArray(safeHotelThemes) && safeHotelThemes.length > 0 && (
        <p className="text-white mt-1 text-base">
          {t('hotelDetail.affinitiesText')} {safeHotelThemes.map(theme => theme?.name || theme?.themes?.name || '').filter(name => name).join(", ").replace(/, ([^,]*)$/, ` ${t('hotelDetail.and')} $1`)}.
        </p>
      )}
      
      {Array.isArray(safeHotelActivities) && safeHotelActivities.length > 0 && (
        <p className="text-white mt-1 text-base">
          {t('hotelDetail.activitiesText')} {safeHotelActivities.join(", ").replace(/, ([^,]*)$/, ` ${t('hotelDetail.and')} $1`)}.
        </p>
      )}
      
      {/* Show fallbacks when no data is available */}
      {typeof safeHotelThemes === 'string' && (
        <p className="text-white/70 mt-1 text-sm italic">
          {safeHotelThemes}
        </p>
      )}
      
      {typeof safeHotelActivities === 'string' && (
        <p className="text-white/70 mt-1 text-sm italic">
          {safeHotelActivities}
        </p>
      )}
    </>
  );
}