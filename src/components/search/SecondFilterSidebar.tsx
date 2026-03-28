import React from "react";
import { CountryFilter } from "./CountryFilter";
import { LocationFilter } from "./LocationFilter";
import { LengthOfStayFilter } from "./LengthOfStayFilter";
import { CategoryFilter } from "./CategoryFilter";
import { MonthFilter } from "./MonthFilter";
import { PropertyTypeFilter } from "./PropertyTypeFilter";
import { PropertyStyleFilter } from "./PropertyStyleFilter";
import { PriceRangeFilter } from "./PriceRangeFilter";
import { HotelFeaturesFilter } from "./HotelFeaturesFilter";
import { RoomFeaturesFilter } from "./RoomFeaturesFilter";
import { ActivityFilter } from "./ActivityFilter";
import { MealPlanFilter } from "./MealPlanFilter";
import { ThemeFilter } from "./ThemeFilter";
import { FilterState } from "@/components/filters/FilterTypes";
import { useTranslation } from "@/hooks/useTranslation";
interface FilterSidebarProps {
  activeFilters: FilterState;
  handleFilterChange: (key: keyof FilterState, value: any) => void;
  handleArrayFilterChange: (key: keyof FilterState, value: string, isSelected: boolean) => void;
  onResetAllFilters: () => void;
}
export function SecondFilterSidebar({
  activeFilters,
  handleFilterChange,
  handleArrayFilterChange,
  onResetAllFilters
}: FilterSidebarProps) {
  
  const {
    t,
    isReady
  } = useTranslation('filters');
  const handleHotelFeaturesChange = (value: string, isChecked: boolean) => {
    handleArrayFilterChange('hotelFeatures', value, isChecked);
  };
  const handleRoomFeaturesChange = (value: string, isChecked: boolean) => {
    handleArrayFilterChange('roomFeatures', value, isChecked);
  };
  const handleActivitiesChange = (value: string, isChecked: boolean) => {
    handleArrayFilterChange('activities', value, isChecked);
  };
  const handleMealPlansChange = (value: string, isChecked: boolean) => {
    handleArrayFilterChange('mealPlans', value, isChecked);
  };
  const handleThemeChange = (value: string, isChecked: boolean) => {
    handleArrayFilterChange('affinities', value, isChecked);
  };

  // Helper function to get price value as number for PriceRangeFilter
  const getPriceValue = (): number | null => {
    if (typeof activeFilters.priceRange === 'number') {
      return activeFilters.priceRange;
    }
    return null;
  };
  return <div className="flex flex-col w-fit max-w-full bg-gradient-to-b from-[#460F54] to-[#300A38] mobile-filter-spacing">
      {/* Removed blue glow completely from filter sidebar */}
      {/* FIXED TOP RESET BUTTON */}
      {isReady && <div className="p-4 border-b border-white/10 bg-[#850ab3]">
          <button onClick={onResetAllFilters} className="w-full bg-[#68178D] hover:bg-[#68178D]/80 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm">
            {t('filters.resetFilters').toUpperCase()}
          </button>
        </div>}

      {/* SCROLLABLE FILTER AREA */}
      <div className="p-2 sm:p-4 space-y-1.5 sm:space-y-3 bg-[#952fc1]/[0.96]">{/* Reduced mobile spacing from space-y-2.5 to space-y-1.5 (30% reduction) */}
        {/* PRICE PER MONTH */}
        <PriceRangeFilter activePrice={getPriceValue()} onChange={value => handleFilterChange('priceRange', value)} />

        {/* COUNTRY */}
        <CountryFilter activeCountry={activeFilters.country} onChange={value => handleFilterChange('country', value)} />

        {/* LOCATION */}
        <LocationFilter activeLocation={activeFilters.location} onChange={value => handleFilterChange('location', value)} />

        {/* THEME/AFFINITY */}
        <ThemeFilter activeTheme={activeFilters.affinities} onChange={handleThemeChange} />

        {/* ACTIVITIES */}
        <ActivityFilter activeActivities={activeFilters.activities || []} onChange={handleActivitiesChange} />

        {/* STAY LENGTH */}
        <LengthOfStayFilter activeLength={activeFilters.stayLengths} onChange={value => handleFilterChange('stayLengths', value)} />

        {/* MONTH */}
        <MonthFilter activeMonth={activeFilters.month} onChange={value => handleFilterChange('month', value)} />

        {/* MEAL PLAN */}
        <MealPlanFilter activeMealPlans={activeFilters.mealPlans} onChange={handleMealPlansChange} />

        {/* PROPERTY TYPE */}
        <PropertyTypeFilter activePropertyType={activeFilters.propertyType} onChange={value => handleFilterChange('propertyType', value)} />

        {/* PROPERTY STYLE */}
        <PropertyStyleFilter activePropertyStyle={activeFilters.propertyStyle} onChange={value => handleFilterChange('propertyStyle', value)} />

        {/* CATEGORY */}
        <CategoryFilter activeCategory={activeFilters.stars?.[0] || null} onChange={value => handleFilterChange('stars', value ? [value] : [])} />

        {/* HOTEL FEATURES */}
        <div className="debug-hotel-features">
          <HotelFeaturesFilter activeHotelFeatures={activeFilters.hotelFeatures || []} onChange={handleHotelFeaturesChange} />
        </div>

        {/* ROOM FEATURES */}
        <div className="debug-room-features">
          <RoomFeaturesFilter activeRoomFeatures={activeFilters.roomFeatures || []} onChange={handleRoomFeaturesChange} />
        </div>
      </div>

      {/* FIXED BOTTOM RESET BUTTON */}
      {isReady && <div className="p-4 border-t border-white/10">
          <button onClick={onResetAllFilters} className="w-full bg-[#68178D] hover:bg-[#68178D]/80 text-white px-4 py-2 rounded-lg font-medium transition-colors">
            {t('filters.resetFilters').toUpperCase()}
          </button>
        </div>}
    </div>;
}