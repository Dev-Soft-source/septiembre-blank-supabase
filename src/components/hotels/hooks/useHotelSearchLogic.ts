
import { useState, useEffect } from "react";
import { FilterState } from "@/components/filters/FilterTypes";
import { useHotels } from "@/hooks/useHotels";

interface Hotel {
  id: string;
  name: string;
  location: string;
  price_per_month: number;
  thumbnail?: string;
  theme?: string;
}

interface UseHotelSearchLogicProps {
  initialFilters?: FilterState;
  itemsPerPage?: number;
}

export function useHotelSearchLogic({ 
  initialFilters, 
  itemsPerPage = 12 
}: UseHotelSearchLogicProps = {}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedHotel, setSelectedHotel] = useState<string>();
  
  const { hotels, loading, error, filters, updateFilters } = useHotels({ 
    initialFilters 
  });

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // Calculate pagination
  const totalPages = Math.ceil(hotels.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedHotels = hotels.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handleFiltersChange = (newFilters: Partial<FilterState>) => {
    updateFilters(newFilters);
  };

  const handleHotelSelect = (hotelId: string) => {
    setSelectedHotel(hotelId);
  };

  return {
    // Hotel data
    hotels: paginatedHotels,
    allHotels: hotels,
    loading,
    error,
    
    // Filters
    filters,
    onFiltersChange: handleFiltersChange,
    
    // Pagination
    currentPage,
    totalPages,
    totalItems: hotels.length,
    itemsPerPage,
    onPageChange: handlePageChange,
    
    // Selection
    selectedHotel,
    onHotelSelect: handleHotelSelect,
  };
}
