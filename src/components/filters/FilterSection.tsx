
import { useNavigate } from "react-router-dom";
import { FilterSectionProps } from "./FilterTypes";
import { FilterContainer } from "./FilterContainer";
import { useFilterState } from "./hooks/useFilterState";
import { FilterEventHandler } from "./FilterEventHandler";
import { FilterSearchButton } from "./FilterSearchButton";
import { FilterDropdownList } from "./FilterDropdownList";

export const FilterSection = ({ 
  onFilterChange, 
  showSearchButton = false, 
  verticalLayout = false,
  useCollapsibleThemes = false,
  expandedLayout = false,
  compactSpacing = false,
  useBoldLabels = false,
  usePurpleFilterBackground = false,
  placeholders = {
    country: "Country",
    month: "Month",
    theme: "Affinity",
    priceRange: "Price per Month"
  },
  availableThemes = [],
  useLargerMobileText = false,
  textColor = "#3300B0",
  labelTextSize = "text-sm", // Added default value for labelTextSize
  filterBgColor = "bg-[#FFF8A9]"
}: FilterSectionProps) => {
  const navigate = useNavigate();
  
  const {
    filters,
    openDropdown,
    themeQuery,
    openThemeCategory,
    setThemeQuery,
    toggleDropdown,
    toggleThemeCategory,
    updateFilter,
    clearFilter,
    clearAllFilters,
    hasActiveFilters
  } = useFilterState(onFilterChange);
  
  const handleSearch = () => {
    const params = new URLSearchParams();
    
    if (filters.country) params.append("country", filters.country);
    if (filters.month) params.append("month", filters.month);
    if (filters.theme && filters.theme.length > 0) {
      // For multiple themes, we'll use the first one for URL compatibility  
      const firstTheme = filters.theme[0];
      params.append("theme", firstTheme.id);
    }
    if (typeof filters.priceRange === 'number') params.append("price", filters.priceRange.toString());
    
    console.log("Search filters applied:", filters);
    
    navigate(`/search?${params.toString()}`);
  };

  const formWrapperBgColor = 'bg-[#5d0083]';
  const searchBgColor = 'bg-white';
  const searchHoverBgColor = 'hover:bg-white/90';
  
  return (
    <FilterContainer
      verticalLayout={verticalLayout}
      expandedLayout={expandedLayout}
      compactSpacing={compactSpacing}
      formWrapperBgColor={formWrapperBgColor}
    >
      <FilterDropdownList 
        filters={filters}
        openDropdown={openDropdown}
        toggleDropdown={toggleDropdown}
        updateFilter={updateFilter}
        clearFilter={clearFilter}
        placeholders={placeholders}
        filterBgColor={filterBgColor}
        compactSpacing={compactSpacing}
        useBoldLabels={useBoldLabels}
        useLargerMobileText={useLargerMobileText}
        themeQuery={themeQuery}
        setThemeQuery={setThemeQuery}
        useCollapsibleThemes={useCollapsibleThemes}
        openThemeCategory={openThemeCategory}
        toggleThemeCategory={toggleThemeCategory}
        textColor={textColor}
        availableThemes={availableThemes}
        labelTextSize={labelTextSize}
      />
      
      <FilterSearchButton 
        hasActiveFilters={hasActiveFilters()}
        onClearAllFilters={clearAllFilters}
        onSearch={handleSearch}
        showSearchButton={showSearchButton}
        verticalLayout={verticalLayout}
        compactSpacing={compactSpacing}
        searchBgColor={searchBgColor}
        searchHoverBgColor={searchHoverBgColor}
      />
      
      <FilterEventHandler updateFilter={updateFilter} />
    </FilterContainer>
  );
};
