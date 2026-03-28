
import React from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { HotelContentEN } from "./HotelContent.en";
import { HotelContentES } from "./HotelContent.es";
import { HotelContentPT } from "./HotelContent.pt";
import { HotelContentRO } from "./HotelContent.ro";

export function HotelContent() {
  const { language } = useTranslation();
  
  if (language === 'en') return <HotelContentEN />;
  if (language === 'es') return <HotelContentES />;
  if (language === 'pt') return <HotelContentPT />;
  if (language === 'ro') return <HotelContentRO />;
  
  // Default fallback to English
  return <HotelContentEN />;
}
