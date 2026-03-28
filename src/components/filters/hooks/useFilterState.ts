import { useState } from "react";
import { FilterState } from "../FilterTypes";

export const useFilterState = (onFilterChange: (filters: FilterState) => void) => {
  const [filters, setFilters] = useState<FilterState>({
    country: null,
    month: null,
    theme: [],
    affinities: [],
    priceRange: null,
    searchTerm: '',
    minPrice: 0,
    maxPrice: null,
    stars: [],
    location: null,
    propertyType: null,
    propertyStyle: null,
    activities: [],
    roomTypes: [],
    hotelFeatures: [],
    roomFeatures: [],
    mealPlans: [],
    stayLengths: null,
    atmosphere: null
  });
  
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [themeQuery, setThemeQuery] = useState("");
  const [openThemeCategory, setOpenThemeCategory] = useState<string | null>(null);
  
  const toggleDropdown = (dropdown: string) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };
  
  const toggleThemeCategory = (category: string) => {
    setOpenThemeCategory(openThemeCategory === category ? null : category);
  };
  
  const updateFilter = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    
    // Special handling for priceRange to ensure minPrice and maxPrice are also set
    if (key === 'priceRange' && typeof value === 'number') {
      let minPrice = 0;
      let maxPrice = value;
      
      if (value === 1000) {
        minPrice = 0;
        maxPrice = 1000;
      } else if (value === 1500) {
        minPrice = 1000;
        maxPrice = 1500;
      } else if (value === 2000) {
        minPrice = 1500;
        maxPrice = 2000;
      } else if (value === 3000) {
        minPrice = 2000;
        maxPrice = 999999;
      }
      
      newFilters.minPrice = minPrice;
      newFilters.maxPrice = maxPrice;
    }
    
    setFilters(newFilters);
    onFilterChange(newFilters);
    setOpenDropdown(null);
  };
  
  const clearFilter = (key: keyof FilterState) => {
    const newFilters = { ...filters };
    
    if (key === 'priceRange') {
      // Clear all price-related filters
      newFilters.priceRange = null;
      newFilters.minPrice = 0;
      newFilters.maxPrice = undefined;
    } else if (key === 'theme' || key === 'affinities' || key === 'activities' || key === 'hotelFeatures' || key === 'roomFeatures' || key === 'stars' || key === 'roomTypes' || key === 'mealPlans') {
      (newFilters[key] as any) = [];
    } else {
      (newFilters[key] as any) = null;
    }
    
    setFilters(newFilters);
    onFilterChange(newFilters);
  };
  
  const clearAllFilters = () => {
    const clearedFilters: FilterState = {
      country: null,
      month: null,  
      theme: [],
      affinities: [],
      priceRange: null,
      searchTerm: '',
      minPrice: 0,
      maxPrice: null,
      stars: [],
      location: null,
      propertyType: null,
      propertyStyle: null,
      activities: [],
      roomTypes: [],
      hotelFeatures: [],
      roomFeatures: [],
      mealPlans: [],
      stayLengths: null,
      atmosphere: null
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const hasActiveFilters = (): boolean => {
    return !!(
      filters.country || 
      filters.month || 
      (filters.theme && filters.theme.length > 0) || 
      (filters.affinities && filters.affinities.length > 0) ||
      filters.priceRange ||
      filters.searchTerm ||
      filters.minPrice ||
      filters.maxPrice ||
      (filters.stars && filters.stars.length > 0) ||
      filters.location ||
      filters.propertyType ||
      filters.propertyStyle ||
      (filters.activities && filters.activities.length > 0) ||
      (filters.roomTypes && filters.roomTypes.length > 0) ||
      (filters.hotelFeatures && filters.hotelFeatures.length > 0) ||
      (filters.roomFeatures && filters.roomFeatures.length > 0) ||
      (filters.mealPlans && filters.mealPlans.length > 0) ||
      filters.stayLengths ||
      filters.atmosphere
    );
  };

  return {
    filters,
    openDropdown,
    themeQuery,
    openThemeCategory,
    toggleDropdown,
    toggleThemeCategory,
    setThemeQuery,
    updateFilter,
    clearFilter,
    clearAllFilters,
    hasActiveFilters
  };
};