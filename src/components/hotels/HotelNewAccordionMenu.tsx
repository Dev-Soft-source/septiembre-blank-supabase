
import { useTranslation } from "@/hooks/useTranslation";
import { HotelNewAccordionMenuEN } from "./HotelNewAccordionMenu.en";
import { HotelNewAccordionMenuES } from "./HotelNewAccordionMenu.es";
import { HotelNewAccordionMenuPT } from "./HotelNewAccordionMenu.pt";
import { HotelNewAccordionMenuRO } from "./HotelNewAccordionMenu.ro";

export function HotelNewAccordionMenu() {
  const { language } = useTranslation();
  
  if (language === 'en') return <HotelNewAccordionMenuEN />;
  if (language === 'es') return <HotelNewAccordionMenuES />;
  if (language === 'pt') return <HotelNewAccordionMenuPT />;
  if (language === 'ro') return <HotelNewAccordionMenuRO />;
  
  // Default fallback to English
  return <HotelNewAccordionMenuEN />;
}
