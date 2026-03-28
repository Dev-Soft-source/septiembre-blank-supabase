import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';

interface NoResultsFallbackProps {
  searchQuery: string;
  suggestions?: string[];
  onSuggestionClick?: (suggestion: string) => void;
  onClearSearch?: () => void;
}

// Function to clean search query of any tokens or system parameters
function cleanSearchQuery(query: string): string {
  if (!query || query.trim() === '') return '';
  
  // Remove any tokens or system parameters
  if (query.includes('__lovable_token=') || 
      query.includes('_lovable') || 
      query.includes('token=') ||
      query.match(/^[a-zA-Z0-9\+\/=\._%\-]+$/)) {
    return '';
  }
  
  try {
    const urlParams = new URLSearchParams(query);
    const cleanParams = new URLSearchParams();
    
    // Only keep valid search parameters
    const validParamKeys = ['country', 'month', 'theme', 'price', 'priceRange', 'location', 'propertyType', 'activities', 'search', 'q', 'city'];
    
    for (const [key, value] of urlParams.entries()) {
      if (validParamKeys.includes(key) && 
          !key.includes('token') && 
          !key.includes('_lovable') && 
          !key.includes('__') &&
          value && 
          value.trim() !== '' && 
          value !== 'null') {
        cleanParams.set(key, value);
      }
    }
    
    return cleanParams.toString();
  } catch (e) {
    return '';
  }
}

// Function to extract search parameters from URL or query string
function getSearchParams(query: string) {
  try {
    // Always check the current URL first
    const currentUrlParams = new URLSearchParams(window.location.search);
    
    return {
      country: currentUrlParams.get('country'),
      theme: currentUrlParams.get('theme'),
      search: currentUrlParams.get('search') || currentUrlParams.get('q'),
      propertyType: currentUrlParams.get('propertyType'),
      activities: currentUrlParams.get('activities')
    };
  } catch (e) {
    return {};
  }
}

export function NoResultsFallback({ 
  searchQuery, 
  suggestions = [],
  onSuggestionClick,
  onClearSearch 
}: NoResultsFallbackProps) {
  const { t } = useTranslation('common');
  const [hasHotelsInCountry, setHasHotelsInCountry] = useState<boolean | null>(null);
  
  // Clean the search query to remove tokens
  const cleanQuery = cleanSearchQuery(searchQuery);
  const searchParams = getSearchParams(searchQuery);
  const { country, theme, search, propertyType, activities } = searchParams;
  
  console.log('🔍 NoResultsFallback - searchQuery:', searchQuery);
  console.log('🔍 NoResultsFallback - searchParams:', searchParams);
  console.log('🔍 NoResultsFallback - country detected:', country);
  console.log('🔍 NoResultsFallback - window.location.search:', window.location.search);
  
  // Check if there are any hotels in this country
  useEffect(() => {
    async function checkHotelsInCountry() {
      if (!country || country.trim() === '') {
        setHasHotelsInCountry(null);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('hotels')
          .select('id')
          .ilike('country', `%${country}%`)
          .limit(1);
        
        if (error) {
          console.error('Error checking hotels in country:', error);
          setHasHotelsInCountry(null);
          return;
        }
        
        setHasHotelsInCountry(data && data.length > 0);
      } catch (error) {
        console.error('Error checking hotels in country:', error);
        setHasHotelsInCountry(null);
      }
    }
    
    checkHotelsInCountry();
  }, [country]);
  
  // Determine search criteria for Case B
  const getSearchCriteria = () => {
    const criteria = [];
    if (theme) criteria.push(theme);
    if (search) criteria.push(search);
    if (propertyType) criteria.push(propertyType);
    if (activities) criteria.push(activities);
    return criteria.join(', ') || 'búsqueda específica';
  };
  
  // Determine which case to show based on the logic:
  // Case A: filters.country exists and there are zero hotels
  // Case B: filters.country doesn't exist or there are other filters without results
  const shouldShowCaseA = country && country.trim() !== '' && !theme && !search && !propertyType && !activities;
  const shouldShowCaseB = !shouldShowCaseA && (theme || search || propertyType || activities || country);
  
  // If we have a country filter, show the appropriate case
  if (country && country.trim() !== '') {
    const isLoading = hasHotelsInCountry === null;
    
    if (isLoading) {
      return (
        <div className="text-center py-8 px-4 max-w-2xl mx-auto">
          <div className="animate-pulse">
            <div className="h-4 bg-white/10 rounded w-3/4 mx-auto mb-2"></div>
            <div className="h-4 bg-white/10 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      );
    }
    
    const searchCriteria = getSearchCriteria();
    
    return (
      <div className="text-center py-8 px-4 max-w-2xl mx-auto">
        <div className="mb-6 p-6 bg-gradient-to-br from-purple-900/40 via-fuchsia-900/40 to-purple-800/40 backdrop-blur-sm border border-fuchsia-400/30 rounded-xl">
          <div className="text-fuchsia-100 mb-4 text-base leading-relaxed">
            {shouldShowCaseA && t('noHotelsAvailable.caseA')}
            {shouldShowCaseB && t('noHotelsAvailable.caseB', { criterio: searchCriteria })}
          </div>
          <div className="text-fuchsia-100 text-base leading-relaxed">
            <a 
              href="https://www.hotel-living.com/promoters" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-fuchsia-300 hover:text-fuchsia-200 underline hover:no-underline transition-colors font-medium"
            >
              {t('noHotelsAvailable.promoterLink')}
            </a>
            <span className="mx-1 text-fuchsia-200"> {t('noHotelsAvailable.promoterBenefit')} </span>
            <span className="text-fuchsia-200">{t('noHotelsAvailable.or')} </span>
            <a 
              href="https://www.hotel-living.com/ambassador" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-fuchsia-300 hover:text-fuchsia-200 underline hover:no-underline transition-colors font-medium"
            >
              {t('noHotelsAvailable.ambassadorLink')}
            </a>
            <span className="text-fuchsia-200">.</span>
          </div>
        </div>
        
        <div className="flex gap-3 justify-center">
          <button
            onClick={onClearSearch}
            className="px-4 py-2 text-sm border border-fuchsia-400/30 rounded-md hover:bg-fuchsia-500/10 transition-colors text-fuchsia-200"
          >
            {t('common.clear')} {t('common.search')}
          </button>
        </div>
      </div>
    );
  }
  
  // Case B: Global search without country filter
  if (shouldShowCaseB) {
    const searchCriteria = getSearchCriteria();
    
    return (
      <div className="text-center py-8 px-4 max-w-2xl mx-auto">
        <div className="mb-6 p-6 bg-gradient-to-br from-purple-900/40 via-fuchsia-900/40 to-purple-800/40 backdrop-blur-sm border border-fuchsia-400/30 rounded-xl">
          <div className="text-fuchsia-100 mb-4 text-base leading-relaxed">
            {t('noHotelsAvailable.caseB', { criterio: searchCriteria })}
          </div>
          <div className="text-fuchsia-100 text-base leading-relaxed">
            <a 
              href="https://www.hotel-living.com/promoters" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-fuchsia-300 hover:text-fuchsia-200 underline hover:no-underline transition-colors font-medium"
            >
              {t('noHotelsAvailable.promoterLink')}
            </a>
            <span className="mx-1 text-fuchsia-200"> {t('noHotelsAvailable.promoterBenefit')} </span>
            <span className="text-fuchsia-200">{t('noHotelsAvailable.or')} </span>
            <a 
              href="https://www.hotel-living.com/ambassador" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-fuchsia-300 hover:text-fuchsia-200 underline hover:no-underline transition-colors font-medium"
            >
              {t('noHotelsAvailable.ambassadorLink')}
            </a>
            <span className="text-fuchsia-200">.</span>
          </div>
        </div>
        
        <div className="flex gap-3 justify-center">
          <button
            onClick={onClearSearch}
            className="px-4 py-2 text-sm border border-fuchsia-400/30 rounded-md hover:bg-fuchsia-500/10 transition-colors text-fuchsia-200"
          >
            {t('common.clear')} {t('common.search')}
          </button>
        </div>
      </div>
    );
  }
  
  // Fallback for other types of searches (if cleanQuery is empty, show generic message)
  const displayQuery = cleanQuery || 'your search';
  
  return (
    <div className="text-center py-8 px-4">
      <div className="mb-4">
        <h3 className="text-lg font-medium text-foreground mb-2">
          No results found{displayQuery !== 'your search' ? ` for "${displayQuery}"` : ''}
        </h3>
        <p className="text-muted-foreground">
          Try adjusting your search terms or browse our suggestions below.
        </p>
      </div>

      {suggestions.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-foreground mb-3">
            Try these instead:
          </h4>
          <div className="flex flex-wrap gap-2 justify-center">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => onSuggestionClick?.(suggestion)}
                className="px-3 py-1 text-sm bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground rounded-md transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3 justify-center">
        <button
          onClick={onClearSearch}
          className="px-4 py-2 text-sm border border-border rounded-md hover:bg-muted/50 transition-colors"
        >
          Clear search
        </button>
      </div>
    </div>
  );
}