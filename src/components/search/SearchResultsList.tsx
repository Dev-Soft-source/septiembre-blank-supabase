import React, { useState, useMemo } from "react";
import { CompareButton } from "@/components/comparison/CompareButton";
import { SearchResultCard } from "./SearchResultCard";
import { NoResultsView } from "./NoResultsView";
import { SkeletonLoader } from "@/components/ui/skeleton-loader";
import { NameSortingDropdown } from "@/components/sorting/NameSortingDropdown";
import { PriceSortingDropdown } from "@/components/sorting/PriceSortingDropdown";

interface Hotel {
  id: string;
  name: string;
  location: string;
  price_per_month: number;
  // ... rest of your interface
}

interface SearchResultsListProps {
  filteredHotels: Hotel[];
  isLoading: boolean;
  error: Error | null;
}

export const SearchResultsList: React.FC<SearchResultsListProps> = ({
  filteredHotels,
  isLoading,
  error,
}) => {
  const [nameSort, setNameSort] = useState<"asc" | "desc" | null>(null);
  const [priceSort, setPriceSort] = useState<"asc" | "desc" | null>(null);

  const hasResults = filteredHotels && filteredHotels.length > 0;

  // Sort hotels based on dropdowns
  const sortedHotels = useMemo(() => {
    if (!hasResults) return [];

    let hotels = [...filteredHotels];  // Create a copy of filteredHotels

    // Sort by price if priceSort is active
    if (priceSort) {
      hotels.sort((a, b) =>
        priceSort === "asc"
          ? a.price_per_month - b.price_per_month
          : b.price_per_month - a.price_per_month
      );
    }

    // Sort by name if nameSort is active
    if (nameSort) {
      hotels.sort((a, b) =>
        nameSort === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name)
      );
    }

    return hotels;
  }, [filteredHotels, nameSort, priceSort, hasResults]);

  const handlePriceSortChange = (value: "asc" | "desc" | null) => {
    setPriceSort(value);
    // If price is selected, reset name sort
    if (value) {
      setNameSort(null);
    }
  };

  const handleNameSortChange = (value: "asc" | "desc" | null) => {
    setNameSort(value);
    // If name is selected, reset price sort
    if (value) {
      setPriceSort(null);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <SkeletonLoader variant="card" count={6} />
      </div>
    );
  }

  return (
    <>
      <NoResultsView
        isLoading={isLoading}
        error={error}
        hasResults={hasResults}
      />

      {hasResults && (
        <>
          {/* Sorting Dropdowns */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-start mb-6">
            <NameSortingDropdown onChange={handleNameSortChange} />
            <PriceSortingDropdown onChange={handlePriceSortChange} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
            {sortedHotels.map((hotel) => (
              <SearchResultCard key={hotel.id} hotel={hotel} />
            ))}
          </div>
        </>
      )}

      <CompareButton />
    </>
  );
};


