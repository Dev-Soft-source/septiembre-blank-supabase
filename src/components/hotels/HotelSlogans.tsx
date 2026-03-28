
import { TrendingUp } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { HotelSlogansEN, HotelTitleEN } from "./HotelSlogans.en";
import { HotelSlogansES } from "./HotelSlogans.es";
import { HotelSlogansPT } from "./HotelSlogans.pt";
import { HotelSlogansRO } from "./HotelSlogans.ro";

export function HotelTitle() {
  const { language } = useTranslation();
  
  if (language === 'en') return <HotelTitleEN />;
  if (language === 'es') return <HotelTitleEN />; // Will create other language versions if needed
  if (language === 'pt') return <HotelTitleEN />;
  if (language === 'ro') return <HotelTitleEN />;
  
  // Default fallback to English
  return <HotelTitleEN />;
}

export function HotelSlogans() {
  const { language } = useTranslation();
  
  if (language === 'en') return <HotelSlogansEN />;
  if (language === 'es') return <HotelSlogansES />;
  if (language === 'pt') return <HotelSlogansPT />;
  if (language === 'ro') return <HotelSlogansRO />;
  
  // Default fallback to English
  return <HotelSlogansEN />;
}
