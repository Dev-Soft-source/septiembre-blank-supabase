
import React from "react";
import { FilterState } from "@/components/filters/FilterTypes";
import { FilterSection } from "@/components/filters/FilterSection";

interface HotelFiltersESProps {
  filters: FilterState;
  onFiltersChange: (newFilters: Partial<FilterState>) => void;
}

export function HotelFiltersES({ filters, onFiltersChange }: HotelFiltersESProps) {
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
          country: "País",
          month: "Mes", 
          theme: "Afinidad",
          priceRange: "Precio por Mes"
        }}
        useLargerMobileText={true}
      />
    </div>
  );
}
