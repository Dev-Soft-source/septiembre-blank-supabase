
import React from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { FilterState } from "@/components/filters/FilterTypes";
import { HotelFiltersEN } from "./HotelFilters.en";
import { HotelFiltersES } from "./HotelFilters.es";
import { HotelFiltersPT } from "./HotelFilters.pt";
import { HotelFiltersRO } from "./HotelFilters.ro";

interface HotelFiltersProps {
  filters: FilterState;
  onFiltersChange: (newFilters: Partial<FilterState>) => void;
}

export function HotelFilters({ filters, onFiltersChange }: HotelFiltersProps) {
  const { language } = useTranslation();
  
  if (language === 'en') return <HotelFiltersEN filters={filters} onFiltersChange={onFiltersChange} />;
  if (language === 'es') return <HotelFiltersES filters={filters} onFiltersChange={onFiltersChange} />;
  if (language === 'pt') return <HotelFiltersPT filters={filters} onFiltersChange={onFiltersChange} />;
  if (language === 'ro') return <HotelFiltersRO filters={filters} onFiltersChange={onFiltersChange} />;
  
  // Default fallback to English
  return <HotelFiltersEN filters={filters} onFiltersChange={onFiltersChange} />;
}
