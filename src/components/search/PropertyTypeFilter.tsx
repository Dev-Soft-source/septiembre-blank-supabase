
import React from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { PropertyTypeFilterEN } from "./PropertyTypeFilter.en";
import { PropertyTypeFilterES } from "./PropertyTypeFilter.es";
import { PropertyTypeFilterPT } from "./PropertyTypeFilter.pt";
import { PropertyTypeFilterRO } from "./PropertyTypeFilter.ro";

interface PropertyTypeFilterProps {
  activePropertyType: string | null;
  onChange: (value: string | null) => void;
}

export function PropertyTypeFilter({ activePropertyType, onChange }: PropertyTypeFilterProps) {
  const { language } = useTranslation();
  
  if (language === 'en') return <PropertyTypeFilterEN activePropertyType={activePropertyType} onChange={onChange} />;
  if (language === 'es') return <PropertyTypeFilterES activePropertyType={activePropertyType} onChange={onChange} />;
  if (language === 'pt') return <PropertyTypeFilterPT activePropertyType={activePropertyType} onChange={onChange} />;
  if (language === 'ro') return <PropertyTypeFilterRO activePropertyType={activePropertyType} onChange={onChange} />;
  
  // Default fallback to English
  return <PropertyTypeFilterEN activePropertyType={activePropertyType} onChange={onChange} />;
}
