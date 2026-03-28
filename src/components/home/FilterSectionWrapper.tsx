import { useState } from 'react';
import { FilterState } from '@/components/filters';
import { IndexPageFilters } from './IndexPageFilters';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '@/hooks/useTranslation';
interface FilterSectionWrapperProps {
  onFilterChange: (filters: FilterState) => void;
  availableThemes?: string[];
}
export function FilterSectionWrapper({
  onFilterChange,
  availableThemes = []
}: FilterSectionWrapperProps) {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const {
    t
  } = useTranslation('filters');
  const [activeFilters, setActiveFilters] = useState<FilterState>({
    country: null,
    month: null,
    theme: null,
    affinities: [], // Add missing affinities field
    priceRange: null,
    searchTerm: null,
    location: null,
    propertyType: null,
    minPrice: 0,
    maxPrice: 1000,
    stars: [],
    propertyStyle: null,
    activities: [],
    roomTypes: [],
    hotelFeatures: [],
    roomFeatures: [],
    mealPlans: [],
    stayLengths: null,
    atmosphere: null
  });
  const handleIndividualFilterChange = (key: keyof FilterState, value: any) => {
    console.log(`🔄 FilterSectionWrapper: Individual filter change - ${key}:`, value);
    const updatedFilters = {
      ...activeFilters,
      [key]: value
    };
    console.log('📝 FilterSectionWrapper: Updated active filters', updatedFilters);
    setActiveFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };
  const handleSearch = () => {
    console.log('🚀 SEARCH INITIATED FROM INDEX PAGE');
    console.log('📋 Current active filters:', activeFilters);
    const params = new URLSearchParams();
    let hasFilters = false;
    if (activeFilters.country) {
      params.append("country", activeFilters.country);
      console.log(`🌍 Adding country to URL: ${activeFilters.country}`);
      hasFilters = true;
    }
    if (activeFilters.month) {
      params.append("month", activeFilters.month);
      console.log(`🗓️ Adding month to URL: ${activeFilters.month}`);
      hasFilters = true;
    }
    // Handle affinities for URL navigation - fix mismatch between theme and affinities
    if (activeFilters.affinities && activeFilters.affinities.length > 0) {
      // Convert affinities array (strings) to theme format expected by URL
      const affinityValue = activeFilters.affinities[0]; // Use first affinity
      params.append("theme", affinityValue);
      console.log(`🎯 Adding affinity as theme to URL: ${affinityValue}`);
      hasFilters = true;
    }
    // PRICE RANGE HANDLING - Standardize to number format for consistency
    if (activeFilters.priceRange) {
      let priceValue: number | null = null;
      
      if (typeof activeFilters.priceRange === 'number') {
        priceValue = activeFilters.priceRange;
      } else if (typeof activeFilters.priceRange === 'object' && activeFilters.priceRange.max) {
        priceValue = activeFilters.priceRange.max;
      }
      
      if (priceValue && priceValue > 0) {
        params.append("price", priceValue.toString());
        console.log(`💰 Adding standardized price to URL: ${priceValue}`);
        hasFilters = true;
      }
    }
    if (activeFilters.location) {
      params.append("location", activeFilters.location);
      console.log(`📍 Adding location to URL: ${activeFilters.location}`);
      hasFilters = true;
    }
    if (activeFilters.propertyType) {
      params.append("propertyType", activeFilters.propertyType);
      console.log(`🏨 Adding property type to URL: ${activeFilters.propertyType}`);
      hasFilters = true;
    }

    // If no filters are selected, navigate to search page without parameters to show all hotels
    const finalUrl = hasFilters ? `/search?${params.toString()}` : '/search';
    console.log(`🔗 Navigating to: ${finalUrl}`);
    console.log("Search with filters:", activeFilters);
    console.log("Has filters:", hasFilters);
    navigate(finalUrl);
  };
  return (
    <section className="py-0 px-2 mb-12 mt-2 w-full">
      <div className="container max-w-3xl mx-auto">
        <div style={{ backgroundColor: "#996515" }} className="rounded-lg shadow-lg border-2 border-fuchsia-400/80 overflow-hidden">
          <IndexPageFilters activeFilters={activeFilters} onFilterChange={handleIndividualFilterChange} />
          <Button
            size="sm"
            onClick={handleSearch}
            style={{ backgroundColor: "#996515" }}
            className="text-white w-full flex items-center justify-center font-bold border-t border-fuchsia-400/70 rounded-none h-10"
          >
            <Search className="w-4 h-4 mr-2" />
            <span className={`${isMobile ? "text-lg" : "text-base"} text-white`}>
              {t('filters.search')}
            </span>
          </Button>
        </div>
      </div>
    </section>
  );
}