
import React from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { CountryFilterEN } from "./CountryFilter.en";
import { CountryFilterES } from "./CountryFilter.es";
import { CountryFilterPT } from "./CountryFilter.pt";
import { CountryFilterRO } from "./CountryFilter.ro";

interface CountryFilterProps {
  activeCountry: string | null;
  onChange: (value: string | null) => void;
}

export function CountryFilter({ activeCountry, onChange }: CountryFilterProps) {
  const { language } = useTranslation();
  
  if (language === 'en') return <CountryFilterEN activeCountry={activeCountry} onChange={onChange} />;
  if (language === 'es') return <CountryFilterES activeCountry={activeCountry} onChange={onChange} />;
  if (language === 'pt') return <CountryFilterPT activeCountry={activeCountry} onChange={onChange} />;
  if (language === 'ro') return <CountryFilterRO activeCountry={activeCountry} onChange={onChange} />;
  
  // Default fallback to English
  return <CountryFilterEN activeCountry={activeCountry} onChange={onChange} />;
}
