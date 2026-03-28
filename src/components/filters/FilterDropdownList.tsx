
import React from "react";
import { FilterState } from "./FilterTypes";
import { FilterDropdown } from "./FilterDropdown";
import { renderDropdownOptions } from "./FilterDropdownOptions";

interface FilterDropdownListProps {
  filters: FilterState;
  openDropdown: string | null;
  toggleDropdown: (dropdown: string) => void;
  updateFilter: (key: keyof FilterState, value: any) => void;
  clearFilter: (key: keyof FilterState) => void;
  placeholders: {
    country?: string;
    month?: string;
    theme?: string;
    priceRange?: string;
  };
  filterBgColor: string;
  compactSpacing: boolean;
  useBoldLabels: boolean;
  useLargerMobileText: boolean;
  themeQuery: string;
  setThemeQuery: (query: string) => void;
  useCollapsibleThemes: boolean;
  openThemeCategory: string | null;
  toggleThemeCategory: (category: string) => void;
  textColor: string;
  availableThemes: string[];
  labelTextSize?: string;
}

export const FilterDropdownList: React.FC<FilterDropdownListProps> = ({
  filters,
  openDropdown,
  toggleDropdown,
  updateFilter,
  clearFilter,
  placeholders,
  filterBgColor,
  compactSpacing,
  useBoldLabels,
  useLargerMobileText,
  themeQuery,
  setThemeQuery,
  useCollapsibleThemes,
  openThemeCategory,
  toggleThemeCategory,
  textColor,
  availableThemes,
  labelTextSize = "text-sm"
}) => {
  // For mobile, make the text 20% smaller (0.8em)
  const mobileTextSize = useLargerMobileText ? "text-[0.8em]" : labelTextSize;
  
  return (
    <>
      <FilterDropdown
        type="country"
        label={placeholders.country || "COUNTRY"}
        value={filters.country}
        options={[]} // Options are handled by renderDropdownOptions
        onChange={(key, value) => updateFilter(key as keyof FilterState, value)}
        onClear={clearFilter}
        isOpen={openDropdown === "country"}
        toggleOpen={toggleDropdown}
        filterBgColor={filterBgColor}
        compactSpacing={compactSpacing}
        useBoldLabels={useBoldLabels}
        useLargerMobileText={useLargerMobileText}
        renderOptions={renderDropdownOptions}
        textColor={textColor}
        labelTextSize={mobileTextSize}
      />
      
      <FilterDropdown
        type="month"
        label={placeholders.month || "MONTH"}
        value={filters.month}
        options={[]} // Options are handled by renderDropdownOptions
        onChange={(key, value) => updateFilter(key as keyof FilterState, value)}
        onClear={clearFilter}
        isOpen={openDropdown === "month"}
        toggleOpen={toggleDropdown}
        filterBgColor={filterBgColor}
        compactSpacing={compactSpacing}
        useBoldLabels={useBoldLabels}
        useLargerMobileText={useLargerMobileText}
        renderOptions={renderDropdownOptions}
        textColor={textColor}
        labelTextSize={mobileTextSize}
      />
      
      <FilterDropdown
        type="theme"
        label={placeholders.theme || "AFFINITY"}
        value={filters.theme}
        options={availableThemes}
        onChange={(key, value) => updateFilter(key as keyof FilterState, value)}
        onClear={clearFilter}
        isOpen={openDropdown === "theme"}
        toggleOpen={toggleDropdown}
        filterBgColor={filterBgColor}
        compactSpacing={compactSpacing}
        useBoldLabels={useBoldLabels}
        useLargerMobileText={useLargerMobileText}
        renderOptions={(type) => renderDropdownOptions(type as keyof FilterState, {
          filters,
          updateFilter,
          themeQuery,
          setThemeQuery,
          useCollapsibleThemes,
          openThemeCategory,
          toggleThemeCategory,
          useLargerMobileText
        })}
        textColor={textColor}
        labelTextSize={mobileTextSize}
      />
      
      <FilterDropdown
        type="activities"
        label="ACTIVITIES"
        value={filters.activities}
        options={[]}
        onChange={(key, value) => updateFilter(key as keyof FilterState, value)}
        onClear={clearFilter}
        isOpen={openDropdown === "activities"}
        toggleOpen={toggleDropdown}
        filterBgColor={filterBgColor}
        compactSpacing={compactSpacing}
        useBoldLabels={useBoldLabels}
        useLargerMobileText={useLargerMobileText}
        renderOptions={renderDropdownOptions}
        textColor={textColor}
        labelTextSize={mobileTextSize}
      />
      
      <FilterDropdown
        type="priceRange"
        label={placeholders.priceRange || "PRICE PER MONTH"}
        value={filters.priceRange}
        options={[]} // Options are handled by renderDropdownOptions
        onChange={(key, value) => updateFilter(key as keyof FilterState, value)}
        onClear={clearFilter}
        isOpen={openDropdown === "priceRange"}
        toggleOpen={toggleDropdown}
        filterBgColor={filterBgColor}
        compactSpacing={compactSpacing}
        useBoldLabels={useBoldLabels}
        useLargerMobileText={useLargerMobileText}
        renderOptions={(type) => renderDropdownOptions(type as keyof FilterState, {
          filters,
          updateFilter,
          themeQuery,
          setThemeQuery,
          useCollapsibleThemes,
          openThemeCategory,
          toggleThemeCategory,
          useLargerMobileText,
          onChange: (key, value) => updateFilter(key as keyof FilterState, value)
        })}
        textColor={textColor}
        labelTextSize={mobileTextSize}
      />
    </>
  );
};
