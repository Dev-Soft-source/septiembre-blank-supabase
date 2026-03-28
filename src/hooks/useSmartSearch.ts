import { useState, useEffect, useMemo } from 'react';

interface SearchMemory {
  query: string;
  timestamp: number;
  resultsCount: number;
}

interface SearchSuggestion {
  text: string;
  type: 'recent' | 'popular' | 'completion';
}

export function useSmartSearch() {
  const [recentSearches, setRecentSearches] = useState<SearchMemory[]>([]);
  const [searchSuggestions, setSearchSuggestions] = useState<SearchSuggestion[]>([]);

  // Load recent searches from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('recent-searches');
      if (stored) {
        const searches = JSON.parse(stored);
        // Filter out searches older than 30 days
        const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
        const validSearches = searches.filter((s: SearchMemory) => s.timestamp > thirtyDaysAgo);
        setRecentSearches(validSearches);
      }
    } catch (error) {
      console.warn('[Smart Search] Failed to load recent searches:', error);
    }
  }, []);

  const addRecentSearch = (query: string, resultsCount: number) => {
    if (!query.trim() || query.length < 2) return;

    const newSearch: SearchMemory = {
      query: query.trim(),
      timestamp: Date.now(),
      resultsCount
    };

    setRecentSearches(prev => {
      // Remove existing search with same query
      const filtered = prev.filter(s => s.query.toLowerCase() !== query.toLowerCase());
      // Add new search at the beginning
      const updated = [newSearch, ...filtered].slice(0, 10); // Keep only last 10

      // Save to localStorage
      try {
        localStorage.setItem('recent-searches', JSON.stringify(updated));
      } catch (error) {
        console.warn('[Smart Search] Failed to save recent searches:', error);
      }

      return updated;
    });
  };

  const generateSuggestions = (currentQuery: string): SearchSuggestion[] => {
    if (!currentQuery || currentQuery.length < 1) return [];

    const suggestions: SearchSuggestion[] = [];
    const query = currentQuery.toLowerCase();

    // Recent searches that match
    const recentMatches = recentSearches
      .filter(s => s.query.toLowerCase().includes(query) && s.query.toLowerCase() !== query)
      .slice(0, 3)
      .map(s => ({
        text: s.query,
        type: 'recent' as const
      }));

    suggestions.push(...recentMatches);

    // Popular/suggested completions based on common hotel search terms
    const popularTerms = [
      'spa', 'pool', 'beach', 'mountain', 'city center', 'airport', 'luxury',
      'family', 'business', 'romantic', 'pet friendly', 'wifi', 'parking',
      'breakfast', 'dinner', 'restaurant', 'gym', 'conference', 'wedding'
    ];

    const completions = popularTerms
      .filter(term => term.toLowerCase().includes(query) && term.toLowerCase() !== query)
      .slice(0, 3)
      .map(term => ({
        text: currentQuery + term.slice(query.length),
        type: 'completion' as const
      }));

    suggestions.push(...completions);

    return suggestions.slice(0, 5); // Limit to 5 total suggestions
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem('recent-searches');
    } catch (error) {
      console.warn('[Smart Search] Failed to clear recent searches:', error);
    }
  };

  const getNoResultsFallback = (query: string) => {
    const suggestions = [];
    
    // Suggest removing parts of the query
    if (query.includes(' ')) {
      const words = query.split(' ');
      if (words.length > 1) {
        suggestions.push(`Try "${words[0]}" instead`);
      }
    }
    
    // Suggest recent searches if available
    if (recentSearches.length > 0) {
      suggestions.push(`Try one of your recent searches`);
    }
    
    // Suggest popular terms
    suggestions.push('Try searching for "spa", "beach", or "city center"');
    
    return suggestions.slice(0, 3);
  };

  return {
    recentSearches,
    searchSuggestions,
    addRecentSearch,
    generateSuggestions,
    clearRecentSearches,
    getNoResultsFallback
  };
}