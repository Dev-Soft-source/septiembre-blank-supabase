import React from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { HotelBannerEN } from "./HotelBanner.en";
import { HotelBannerES } from "./HotelBanner.es";
import { HotelBannerPT } from "./HotelBanner.pt";
import { HotelBannerRO } from "./HotelBanner.ro";

export function HotelBanner() {
  const { language } = useTranslation();
  
  if (language === 'en') return <HotelBannerEN />;
  if (language === 'es') return <HotelBannerES />;
  if (language === 'pt') return <HotelBannerPT />;
  if (language === 'ro') return <HotelBannerRO />;
  
  // Default fallback to English
  return <HotelBannerEN />;
}