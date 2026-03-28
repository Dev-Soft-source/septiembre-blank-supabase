
import React, { useEffect } from "react";
import { SearchResultsList } from "./SearchResultsList";
import { useHotels } from "@/hooks/useHotels";
import { FilterState } from "@/components/filters/FilterTypes";

interface SearchResultsEnhancedProps {
  filters?: FilterState;
}

export const SearchResultsEnhanced: React.FC<SearchResultsEnhancedProps> = ({ filters }) => {
  console.log("🎯 SearchResultsEnhanced rendered with filters:", filters);
  
  const { hotels, loading, error, updateFilters } = useHotels({ initialFilters: filters });

  // Update the hook's filters whenever the prop filters change
  useEffect(() => {
    console.log("🔄 SearchResultsEnhanced - filters changed, updating useHotels:", filters);
    if (filters) {
      updateFilters(filters);
    }
  }, [filters, updateFilters]);

  console.log("📈 SearchResultsEnhanced state:", {
    hotelsCount: hotels.length,
    loading,
    hasError: !!error,
    errorMessage: error?.message
  });

  // Debug information
  React.useEffect(() => {
    console.log("🔍 SearchResultsEnhanced - Hotels data updated:", {
      count: hotels.length,
      sampleHotel: hotels[0],
      loading,
      error: error?.message
    });
  }, [hotels, loading, error]);

  return (
    <div className="space-y-6">
      {/* Debug info in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-gray-100 p-4 rounded-lg text-sm">
          <strong>Debug Info:</strong>
          <div>Hotels found: {hotels.length}</div>
          <div>Loading: {loading ? 'Yes' : 'No'}</div>
          <div>Error: {error?.message || 'None'}</div>
          <div>Filters: {JSON.stringify(filters, null, 2)}</div>
        </div>
      )}
      
      <SearchResultsList 
        filteredHotels={hotels}
        isLoading={loading}
        error={error}
      />
    </div>
  );
};
