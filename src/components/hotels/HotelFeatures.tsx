
import { Calendar, DollarSign, Users } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { HotelFeaturesEN } from "./HotelFeatures.en";
import { HotelFeaturesES } from "./HotelFeatures.es";
import { HotelFeaturesPT } from "./HotelFeatures.pt";
import { HotelFeaturesRO } from "./HotelFeatures.ro";

export function HotelFeatures() {
  const { language } = useTranslation();
  
  if (language === 'en') return <HotelFeaturesEN />;
  if (language === 'es') return <HotelFeaturesES />;
  if (language === 'pt') return <HotelFeaturesPT />;  
  if (language === 'ro') return <HotelFeaturesRO />;
  
  // Default fallback to English
  return <HotelFeaturesEN />;
}
