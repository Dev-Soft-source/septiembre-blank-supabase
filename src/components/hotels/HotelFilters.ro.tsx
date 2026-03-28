
import React from "react";
import { FilterState } from "@/components/filters/FilterTypes";
import { FilterSection } from "@/components/filters/FilterSection";

interface HotelFiltersROProps {
  filters: FilterState;
  onFiltersChange: (newFilters: Partial<FilterState>) => void;
}

export function HotelFiltersRO({ filters, onFiltersChange }: HotelFiltersROProps) {
  return (
    <div className="mb-8">
      <FilterSection 
        onFilterChange={onFiltersChange}
        showSearchButton={true}
        verticalLayout={false}
        useCollapsibleThemes={true}
        expandedLayout={true}
        compactSpacing={false}
        useBoldLabels={true}
        usePurpleFilterBackground={true}
        placeholders={{
          country: "Țară",
          month: "Luna", 
          theme: "Afinitate",
          priceRange: "Preț pe Lună"
        }}
        useLargerMobileText={true}
      />
    </div>
  );
}
