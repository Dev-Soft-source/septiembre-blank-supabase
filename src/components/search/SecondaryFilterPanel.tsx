
import React from 'react';
import { LengthOfStayFilterEN } from './LengthOfStayFilter.en';
import { LengthOfStayFilterES } from './LengthOfStayFilter.es';
import { LengthOfStayFilterPT } from './LengthOfStayFilter.pt';
import { LengthOfStayFilterRO } from './LengthOfStayFilter.ro';
import { CategoryFilterEN } from './CategoryFilter.en';
import { CategoryFilterES } from './CategoryFilter.es';
import { CategoryFilterPT } from './CategoryFilter.pt';
import { CategoryFilterRO } from './CategoryFilter.ro';
import { useTranslation } from '@/hooks/useTranslation';
import { FilterState } from '@/components/filters/FilterTypes';

interface SecondaryFilterPanelProps {
  activeFilters: FilterState;
  handleFilterChange: (key: keyof FilterState, value: any) => void;
  handleArrayFilterChange: (key: keyof FilterState, value: string, isSelected: boolean) => void;
  onResetAllFilters: () => void;
}

export function SecondaryFilterPanel({
  activeFilters,
  handleFilterChange,
  handleArrayFilterChange,
  onResetAllFilters
}: SecondaryFilterPanelProps) {
  const { language } = useTranslation();

  const handleLengthChange = (value: string | null) => {
    handleFilterChange('stayLengths', value);
  };

  const handleCategoryChange = (value: string | null) => {
    handleFilterChange('atmosphere', value);
  };

  const renderLengthOfStayFilter = () => {
    switch (language) {
      case 'es':
        return (
          <LengthOfStayFilterES
            activeLength={activeFilters.stayLengths}
            onChange={handleLengthChange}
          />
        );
      case 'pt':
        return (
          <LengthOfStayFilterPT
            activeLength={activeFilters.stayLengths}
            onChange={handleLengthChange}
          />
        );
      case 'ro':
        return (
          <LengthOfStayFilterRO
            activeLength={activeFilters.stayLengths}
            onChange={handleLengthChange}
          />
        );
      default:
        return (
          <LengthOfStayFilterEN
            activeLength={activeFilters.stayLengths}
            onChange={handleLengthChange}
          />
        );
    }
  };

  const renderCategoryFilter = () => {
    switch (language) {
      case 'es':
        return (
          <CategoryFilterES
            activeCategory={activeFilters.atmosphere}
            onChange={handleCategoryChange}
          />
        );
      case 'pt':
        return (
          <CategoryFilterPT
            activeCategory={activeFilters.atmosphere}
            onChange={handleCategoryChange}
          />
        );
      case 'ro':
        return (
          <CategoryFilterRO
            activeCategory={activeFilters.atmosphere}
            onChange={handleCategoryChange}
          />
        );
      default:
        return (
          <CategoryFilterEN
            activeCategory={activeFilters.atmosphere}
            onChange={handleCategoryChange}
          />
        );
    }
  };

  return (
    <div className="space-y-2">
      {renderLengthOfStayFilter()}
      {renderCategoryFilter()}
    </div>
  );
}
