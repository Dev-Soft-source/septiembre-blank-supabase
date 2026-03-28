
import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SecondFilterSidebar } from "@/components/search/SecondFilterSidebar";
import { SearchResults } from "@/components/search/SearchResults";
import { Starfield } from "@/components/Starfield";
import { useHotels } from "@/hooks/useHotels";
import { FilterState } from "@/components/filters/FilterTypes";
import { createDefaultFilters } from "@/utils/filterUtils";
import { PageTransitionBar } from "@/components/layout/PageTransitionBar";
import { ConnectionIndicator } from "@/components/ui/connection-indicator";
import { useSmartContentLoading } from "@/hooks/useSmartContentLoading";
import { Filter, X } from "lucide-react";
import { useAllMonthlyPriceFromPackages } from '@/hooks/useMonthlyPriceFromPackages';

export default function Search() {
  const [activeFilters, setActiveFilters] = useState<FilterState>(createDefaultFilters());
  const [filtersInitialized, setFiltersInitialized] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(true); // Default to open so filters are visible
  const [isMobile, setIsMobile] = useState(false);

  // Simple mobile detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Smart content loading
  const { prefetchLikelyRoutes } = useSmartContentLoading();

  // Prefetch likely next routes
  useEffect(() => {
    prefetchLikelyRoutes('/search');
  }, [prefetchLikelyRoutes]);

  const {
    hotels,
    loading,
    error,
    updateFilters
  } = useHotels({
    initialFilters: filtersInitialized ? activeFilters : createDefaultFilters()
  });
  // Compute monthly prices for each hotel individually
  const hotelIds = hotels.map(h => h.id);
  const hotelMonthlyPrices = useAllMonthlyPriceFromPackages(hotelIds, "USD");

  // Create a map of hotel_id to monthlyPrice for quick lookup
  const priceMap = Object.fromEntries(
      hotelMonthlyPrices.map(h => [h.hotel_id, h.monthlyPrice])
    );

  // update hotel.price_per_month value
  const hotelsWithPrices = hotels.map((item) => {
    const priceData = priceMap[item.id]; // Can be a number or an array of numbers
    let pricePerMonth = 0;

    // Ensure price_per_month is always a single number.
    // If multiple monthly prices exist, take the minimum (or maximum, depending on your use case)
    if (Array.isArray(priceData)) {
      pricePerMonth = Math.min(...priceData);
    } else if (typeof priceData === 'number') {
      pricePerMonth = priceData;
    }

    return {
      ...item,
      price_per_month: pricePerMonth, // always a number now
    };
  });


  //🔥 Apply price filtering to hotels based on computed monthly prices
  const priceHotels = hotelsWithPrices.filter(hotel => {
    const monthlyPrice = hotel.price_per_month; // use merged field directly
    const minPrice = Array.isArray(activeFilters.minPrice)? (activeFilters.minPrice[0] ?? 0) : (activeFilters.minPrice ?? 0);
    const maxPrice = Array.isArray(activeFilters.maxPrice)? (activeFilters.maxPrice[0] ?? Infinity) : (activeFilters.maxPrice ?? Infinity);

    return monthlyPrice >= minPrice && monthlyPrice <= maxPrice;
  });

  //🔥 Apply property_type filtering to hotels
  const propertyTypesFiltered = priceHotels.filter(hotel => {
    const typeFilter = activeFilters.propertyType;
    // If no filter is applied, include all hotels
    if (!typeFilter) return true;

    
    // If hotel has no style, exclude it
    if (!hotel.property_type) return false;
    // Compare lowercase to make it case-insensitive
    return hotel.property_type.toLowerCase() === typeFilter.toLowerCase();
  });

  //🔥 Apply property_style filtering to hotels
  const propertyStylesFiltered = propertyTypesFiltered.filter(hotel => {
    const styleFilter = activeFilters.propertyStyle;
    // If no filter is applied, include all hotels
    if (!styleFilter) return true;

    // If hotel has no style, exclude it
    if (!hotel.property_style) return false;
      // Compare lowercase to make it case-insensitive
    return hotel.property_style.toLowerCase() === styleFilter.toLowerCase();
  });
  
  // Parse URL parameters on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlFilters: Partial<FilterState> = {};

    // SECURITY FIX: Ignore any lovable token parameters and other system tokens
    const validParamKeys = ['country', 'month', 'theme', 'price', 'priceRange', 'location', 'propertyType', 'activities', 'search', 'q', 'city', 'stars', 'style', 'atmosphere', 'features', 'meals', 'stay'];
    const cleanParams = new URLSearchParams();

    // Only copy valid parameters, ignore tokens and system parameters
    for (const [key, value] of urlParams.entries()) {
      if (validParamKeys.includes(key) && !key.includes('token') && !key.includes('_lovable') && !key.includes('__')) {
        cleanParams.set(key, value);
      }
    }

    // Extract filters from clean URL parameters only
    const country = cleanParams.get('country');
    const month = cleanParams.get('month');
    const theme = cleanParams.get('theme');
    const price = cleanParams.get('price');
    const priceRange = cleanParams.get('priceRange'); // Alternative price parameter
    const location = cleanParams.get('location');
    const propertyType = cleanParams.get('propertyType');
    const propertyStyle = cleanParams.get('propertyStyle');
    const activities = cleanParams.get('activities');
    const searchTerm = cleanParams.get('search') || cleanParams.get('q');

    // Apply filters only if they have actual values and are not system tokens
    if (country && country.trim() !== '' && country !== 'null' && !country.includes('__lovable') && !country.includes('token')) {
      try {
        urlFilters.country = decodeURIComponent(country);
      } catch (e) {
        console.warn('⚠️ Failed to decode country parameter:', country);
      }
    }

    if (month && month.trim() !== '' && month !== 'null' && !month.includes('__lovable') && !month.includes('token')) {
      try {
        urlFilters.month = decodeURIComponent(month);
      } catch (e) {
        console.warn('⚠️ Failed to decode month parameter:', month);
      }
    }

    // THEME FILTER HANDLING - Convert theme name from URL to proper Theme object
    if (theme && theme.trim() !== '' && theme !== 'null' && !theme.includes('__lovable') && !theme.includes('token')) {
      try {
        const decodedTheme = decodeURIComponent(theme);
        // Create a proper Theme array that matches the expected format
        urlFilters.theme = [{
          id: decodedTheme,
          name: decodedTheme,
          level: 1 as const,
          category: 'AFFINITY' as const
        }];
        urlFilters.affinities = [decodedTheme]; // Also set affinities for consistency
      } catch (e) {
        console.warn('⚠️ Failed to decode theme parameter:', theme);
      }
    }

    if (location && location.trim() !== '' && location !== 'null') {
      urlFilters.location = decodeURIComponent(location);
    }

    if (searchTerm && searchTerm.trim() !== '' && searchTerm !== 'null') {
      urlFilters.searchTerm = decodeURIComponent(searchTerm);
    }

    if (activities && activities.trim() !== '' && activities !== 'null') {
      urlFilters.activities = decodeURIComponent(activities).split(',').map(a => a.trim()).filter(a => a.length > 0);
    }

    // Handle price parameter with proper validation - STANDARDIZED APPROACH
    const priceParam = price || priceRange;
    if (priceParam && priceParam.trim() !== '' && priceParam !== 'null' && !isNaN(Number(priceParam))) {
      const priceNum = parseInt(priceParam);

      // Standardized price range handling matching FilterSectionWrapper
      if (priceNum > 0) {
        let minPrice = 0;
        let maxPrice = priceNum;

        // Standard price range categories
        if (priceNum === 1000) {
          minPrice = 0;
          maxPrice = 1000;
        } else if (priceNum === 1500) {
          minPrice = 1001; // Exclude exactly 1000 to avoid overlap
          maxPrice = 1500;
        } else if (priceNum === 2000) {
          minPrice = 1501; // Exclude exactly 1500 to avoid overlap
          maxPrice = 2000;
        } else if (priceNum === 3000) {
          minPrice = 2001; // Exclude exactly 2000 to avoid overlap
          maxPrice = 999999;
        } else {
          // For custom price values, use as max price
          maxPrice = priceNum;
        }

        urlFilters.minPrice = minPrice;
        urlFilters.maxPrice = maxPrice;
        urlFilters.priceRange = priceNum;
      }
    }

    // Always set filters and mark as initialized
    const initialFilters = { ...createDefaultFilters(), ...urlFilters };

    setActiveFilters(initialFilters);
    updateFilters(initialFilters);
    setFiltersInitialized(true);
  }, []); // Empty dependency array to run only once on mount

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    let newFilters = {
      ...activeFilters,
      [key]: value
    };

    // STANDARDIZED PRICE RANGE HANDLING - Consistent with Index page
    if (key === 'priceRange') {
      if (typeof value === 'number' && value > 0) {
        let minPrice = 0;
        let maxPrice = value;

        // Standard price range categories matching FilterSectionWrapper
        if (value === 1000) {
          minPrice = 0;
          maxPrice = 1000;
        } else if (value === 1500) {
          minPrice = 1001; // Exclude exactly 1000 to avoid overlap
          maxPrice = 1500;
        } else if (value === 2000) {
          minPrice = 1501; // Exclude exactly 1500 to avoid overlap
          maxPrice = 2000;
        } else if (value === 3000) {
          minPrice = 2001; // Exclude exactly 2000 to avoid overlap
          maxPrice = 999999;
        } else {
          // For custom price values, use as max price
          maxPrice = value;
        }

        newFilters.minPrice = minPrice;
        newFilters.maxPrice = maxPrice;

      } else if (value === null) {
        // Clear all price-related filters when deselected
        newFilters.minPrice = undefined;
        newFilters.maxPrice = undefined;
        newFilters.priceRange = null;
      }
    }

    setActiveFilters(newFilters);
    updateFilters(newFilters);
  };

  const handleArrayFilterChange = (key: keyof FilterState, value: string, isSelected: boolean) => {

    const currentArray = activeFilters[key] as string[] || [];
    let newArray: string[];

    if (isSelected) {
      newArray = [...currentArray, value];
    } else {
      newArray = currentArray.filter(item => item !== value);
    }

    const newFilters = {
      ...activeFilters,
      [key]: newArray
    };

    setActiveFilters(newFilters);
    updateFilters(newFilters);
  };

  const onResetAllFilters = () => {
    const defaultFilters = createDefaultFilters();
    setActiveFilters(defaultFilters);
    updateFilters(defaultFilters);
  };

  return (
    <div className="min-h-screen flex flex-col animate-fade-in">
      <PageTransitionBar />
      <Starfield />
      <Navbar />

      <main className="flex-1 pt-16 animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
        <div className="container mx-auto px-0 py-0">
          {/* Mobile Filter Toggle Button - Only visible on mobile */}
          {isMobile && (
            <div className="fixed top-20 left-4 z-50">
              <button
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white p-2 rounded-lg shadow-lg transition-colors"
                aria-label="Toggle Filters"
              >
                {isFiltersOpen ? <X className="w-5 h-5" /> : <Filter className="w-5 h-5" />}
              </button>
            </div>
          )}

          {/* Desktop: Two-column layout, Mobile: Conditional layout */}
          <div className={`search-page-layout ${isMobile && isFiltersOpen ? 'mobile-filters-open' : ''}`}>
            {/* Filter Sidebar - Always visible on desktop, toggleable on mobile */}
            <div className={`search-filters-sidebar animate-fade-in ${isMobile && !isFiltersOpen ? 'hidden' : ''}`} style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
              <SecondFilterSidebar
                activeFilters={activeFilters}
                handleFilterChange={handleFilterChange}
                handleArrayFilterChange={handleArrayFilterChange}
                onResetAllFilters={onResetAllFilters}
              />
            </div>

            {/* Search Results - Takes remaining space on desktop */}
            <div className="search-results-content animate-fade-in" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
              <SearchResults
                hotels={propertyStylesFiltered}
                loading={loading}
                error={error}
                searchTerm={activeFilters?.searchTerm}
                activeFilters={activeFilters}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Connection Status Indicator */}
      <ConnectionIndicator />
    </div>
  );
}
