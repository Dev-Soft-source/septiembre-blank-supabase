import { useState, useTransition, useMemo } from 'react';
import { useStableCallback, useStableMemo } from './useStableCallback';

interface UseAdvancedSearchProps<T> {
  data: T[];
  searchFields: (keyof T)[];
  filterFunctions?: ((item: T, query: string) => boolean)[];
  debounceMs?: number;
}

export function useAdvancedSearch<T>({
  data,
  searchFields,
  filterFunctions = [],
  debounceMs = 300
}: UseAdvancedSearchProps<T>) {
  const [query, setQuery] = useState('');
  const [isPending, startTransition] = useTransition();
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounced query update
  const updateQuery = useStableCallback((newQuery: string) => {
    setQuery(newQuery);
    
    const timeoutId = setTimeout(() => {
      startTransition(() => {
        setDebouncedQuery(newQuery);
      });
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  });

  // Optimized filtering with memoization
  const filteredData = useStableMemo(() => {
    if (!debouncedQuery.trim()) return data;

    const lowercaseQuery = debouncedQuery.toLowerCase();
    
    return data.filter(item => {
      // Standard field matching
      const fieldMatch = searchFields.some(field => {
        const value = item[field];
        return String(value || '').toLowerCase().includes(lowercaseQuery);
      });

      // Custom filter functions
      const customMatch = filterFunctions.some(filterFn => 
        filterFn(item, debouncedQuery)
      );

      return fieldMatch || customMatch;
    });
  }, [data, debouncedQuery, searchFields, filterFunctions]);

  return {
    query,
    debouncedQuery,
    isPending,
    filteredData,
    updateQuery,
    resultCount: filteredData.length,
    hasResults: filteredData.length > 0,
    isSearching: query.trim().length > 0
  };
}