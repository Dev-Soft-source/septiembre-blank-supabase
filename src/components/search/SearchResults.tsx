
import React from "react";
import { SearchResultsList } from "./SearchResultsList";

interface Hotel {
  id: string;
  name: string;
  location: string;
  city?: string;
  country?: string;
  price_per_month: number;
  thumbnail?: string;
  theme?: string;
  category?: number;
  hotel_images?: Array<{ image_url: string, is_main?: boolean }>;
  themes?: Array<{ id: string; name: string }>;
  availableMonths?: string[];
  rates?: Record<string, number>;
  hotel_themes?: Array<{ themes?: { name: string } }>;
  hotel_activities?: Array<{ activities?: { name: string } }>;
  meal_plans?: string[];
  stay_lengths?: number[];
}

interface SearchResultsProps {
  hotels: Hotel[];
  loading: boolean;
  error: Error | null;
  searchTerm?: string;
  activeFilters?: any;
}

export function SearchResults({ hotels, loading, error, searchTerm, activeFilters }: SearchResultsProps) {
  return (
    <div className="space-y-6 px-2">
      {!loading && !error && hotels && hotels.length > 0 && (
        <div className="text-white text-lg font-semibold">
          {hotels.length} hotel{hotels.length !== 1 ? 's' : ''} found
        </div>
      )}
      
      <SearchResultsList 
        filteredHotels={hotels || []}
        isLoading={loading}
        error={error}
      />
    </div>
  );
}
