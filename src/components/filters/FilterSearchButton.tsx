
import React from "react";
import { FilterButton } from "./FilterButton";

interface FilterSearchButtonProps {
  hasActiveFilters: boolean;
  onClearAllFilters: () => void;
  onSearch: () => void;
  showSearchButton: boolean;
  verticalLayout: boolean;
  compactSpacing: boolean;
  searchBgColor: string;
  searchHoverBgColor: string;
}

export const FilterSearchButton: React.FC<FilterSearchButtonProps> = ({
  hasActiveFilters,
  onClearAllFilters,
  onSearch,
  showSearchButton,
  verticalLayout,
  compactSpacing,
  searchBgColor,
  searchHoverBgColor
}) => {
  if (!showSearchButton || verticalLayout) {
    return null;
  }

  return (
    <div className={`${compactSpacing ? "mt-1" : "mt-2"} w-full`}>
      <FilterButton
        hasActiveFilters={hasActiveFilters}
        onClearAllFilters={onClearAllFilters}
        onSearch={onSearch}
        searchBgColor={searchBgColor}
        searchHoverBgColor={searchHoverBgColor}
      />
    </div>
  );
};
