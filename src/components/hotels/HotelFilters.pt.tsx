
import React from "react";
import { FilterState } from "@/components/filters/FilterTypes";
import { FilterSection } from "@/components/filters/FilterSection";

interface HotelFiltersPTProps {
  filters: FilterState;
  onFiltersChange: (newFilters: Partial<FilterState>) => void;
}

export function HotelFiltersPT({ filters, onFiltersChange }: HotelFiltersPTProps) {
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
          month: "Mês", 
          theme: "Afinidade",
          priceRange: "Preço por Mês"
        }}
        useLargerMobileText={true}
      />
    </div>
  );
}
