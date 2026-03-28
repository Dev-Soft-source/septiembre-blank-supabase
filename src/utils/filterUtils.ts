
import { FilterState } from '@/components/filters/FilterTypes';

export const createDefaultFilters = (): FilterState => ({
  searchTerm: '',
  theme: [],
  affinities: [],
  country: null,
  month: null,
  minPrice: 0,
  maxPrice: null, // Changed from 10000 to null - no default price limit
  stars: [],
  location: null,
  propertyType: null,
  propertyStyle: null,
  activities: [],
  roomTypes: [],
  hotelFeatures: [],
  roomFeatures: [],
  mealPlans: [],
  stayLengths: null, // Single string, not array
  atmosphere: null
});

export const updateFiltersState = (
  currentFilters: FilterState,
  newFilters: Partial<FilterState>
): FilterState => {
  console.log("🔄 Updating filters from:", currentFilters, "to:", newFilters);
  return { ...currentFilters, ...newFilters };
};
