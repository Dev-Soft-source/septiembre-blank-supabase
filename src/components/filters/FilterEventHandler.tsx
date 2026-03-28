
import React, { useEffect } from "react";
import { FilterState } from "./FilterTypes";

interface FilterEventHandlerProps {
  updateFilter: (key: keyof FilterState, value: any) => void;
}

export const FilterEventHandler: React.FC<FilterEventHandlerProps> = ({ updateFilter }) => {
  useEffect(() => {
    const handleFilterUpdate = (e: CustomEvent) => {
      if (e.detail && e.detail.key && e.detail.value !== undefined) {
        updateFilter(e.detail.key as keyof FilterState, e.detail.value);
      }
    };

    // Listen for both event types to ensure compatibility
    document.addEventListener('filter:update', handleFilterUpdate as any);
    document.addEventListener('updateFilter', handleFilterUpdate as any);
    
    // Also listen on the filter container for bubbled events
    const filterContainer = document.querySelector('.filter-dropdown-container');
    if (filterContainer) {
      filterContainer.addEventListener('filter:update', handleFilterUpdate as any);
    }
    
    return () => {
      document.removeEventListener('filter:update', handleFilterUpdate as any);
      document.removeEventListener('updateFilter', handleFilterUpdate as any);
      if (filterContainer) {
        filterContainer.removeEventListener('filter:update', handleFilterUpdate as any);
      }
    };
  }, [updateFilter]);

  return null;
};
