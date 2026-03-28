
import React from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { LocationFilterEN } from "./LocationFilter.en";
import { LocationFilterES } from "./LocationFilter.es";
import { LocationFilterPT } from "./LocationFilter.pt";
import { LocationFilterRO } from "./LocationFilter.ro";

interface LocationFilterProps {
  activeLocation: string | null;
  onChange: (value: string | null) => void;
}

export function LocationFilter({ activeLocation, onChange }: LocationFilterProps) {
  const { language } = useTranslation();
  
  if (language === 'en') return <LocationFilterEN activeLocation={activeLocation} onChange={onChange} />;
  if (language === 'es') return <LocationFilterES activeLocation={activeLocation} onChange={onChange} />;
  if (language === 'pt') return <LocationFilterPT activeLocation={activeLocation} onChange={onChange} />;
  if (language === 'ro') return <LocationFilterRO activeLocation={activeLocation} onChange={onChange} />;
  
  // Default fallback to English
  return <LocationFilterEN activeLocation={activeLocation} onChange={onChange} />;
}
