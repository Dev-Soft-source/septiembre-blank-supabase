
import React from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { WhyHotelLivingSectionEN } from "./WhyHotelLivingSection.en";
import { WhyHotelLivingSectionES } from "./WhyHotelLivingSection.es";
import { WhyHotelLivingSectionPT } from "./WhyHotelLivingSection.pt";
import { WhyHotelLivingSectionRO } from "./WhyHotelLivingSection.ro";

export function WhyHotelLivingSection() {
  const { language } = useTranslation();
  
  if (language === 'en') return <WhyHotelLivingSectionEN />;
  if (language === 'es') return <WhyHotelLivingSectionES />;
  if (language === 'pt') return <WhyHotelLivingSectionPT />;
  if (language === 'ro') return <WhyHotelLivingSectionRO />;
  
  // Default fallback to English
  return <WhyHotelLivingSectionEN />;
}
