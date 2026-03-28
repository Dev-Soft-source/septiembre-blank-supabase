
import React from "react";
import { FilterState } from "./FilterTypes";
import { CountryOptions } from "./dropdown-options/CountryOptions";
import { MonthOptions } from "./dropdown-options/MonthOptions";
import { ThemeOptionsWrapper } from "./dropdown-options/ThemeOptionsWrapper";
import { PriceOptions } from "./dropdown-options/PriceOptions";
import { ActivityFilterList } from "./activities-options/ActivityFilterList";

interface ThemeOptionsProps {
  filters: FilterState;
  updateFilter: (key: keyof FilterState, value: any) => void;
  themeQuery: string;
  setThemeQuery: (query: string) => void;
  useCollapsibleThemes: boolean;
  openThemeCategory: string | null;
  toggleThemeCategory: (category: string) => void;
  useLargerMobileText?: boolean;
  onChange?: (key: keyof FilterState, value: any) => void;
}

export const renderDropdownOptions = (
  type: keyof FilterState,
  props?: ThemeOptionsProps
) => {
  const useLargerMobileText = props?.useLargerMobileText || false;
  const optionFontSize = useLargerMobileText ? 'text-base' : 'text-sm';

  switch (type) {
    case "country":
      return <CountryOptions type={type} fontSize={optionFontSize} />;
    case "month":
      return <MonthOptions type={type} fontSize={optionFontSize} />;
    case "theme":
      return <ThemeOptionsWrapper props={props} type={type} fontSize={optionFontSize} />;
    case "priceRange":
      return <PriceOptions type={type} fontSize={optionFontSize} onChange={props?.onChange} />;
    case "activities":
      return <ActivityFilterList type={type} fontSize={optionFontSize} />;
    default:
      return null;
  }
};

// Filter update event handler with proper cleanup
let updateFilterHandler: ((e: any) => void) | null = null;

const initializeFilterHandler = () => {
  if (updateFilterHandler) {
    document.removeEventListener('updateFilter', updateFilterHandler);
  }
  
  updateFilterHandler = (e: any) => {
    const customEvent = e as CustomEvent<{ key: keyof FilterState; value: any }>;
    const filterDropdown = document.querySelector('.filter-dropdown-container');
    
    if (filterDropdown) {
      const updateFilterEvent = new CustomEvent('filter:update', { 
        detail: customEvent.detail,
        bubbles: true
      });
      filterDropdown.dispatchEvent(updateFilterEvent);
      
      // Also dispatch to document to ensure it reaches the handler
      document.dispatchEvent(updateFilterEvent);
    }
  };
  
  document.addEventListener('updateFilter', updateFilterHandler);
};

// Initialize the handler
initializeFilterHandler();
