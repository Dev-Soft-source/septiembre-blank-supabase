
import React from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { HotelAccordionMenuEN } from "./HotelAccordionMenu.en";
import { HotelAccordionMenuES } from "./HotelAccordionMenu.es";
import { HotelAccordionMenuPT } from "./HotelAccordionMenu.pt";
import { HotelAccordionMenuRO } from "./HotelAccordionMenu.ro";

export function HotelAccordionMenu() {
  const { language } = useTranslation();
  
  if (language === 'en') return <HotelAccordionMenuEN />;
  if (language === 'es') return <HotelAccordionMenuES />;
  if (language === 'pt') return <HotelAccordionMenuPT />;
  if (language === 'ro') return <HotelAccordionMenuRO />;
  
  // Default fallback to English
  return <HotelAccordionMenuEN />;
}
