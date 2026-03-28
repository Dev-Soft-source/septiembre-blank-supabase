
import React from "react";
import { useTranslation } from "@/hooks/useTranslation";

interface NoResultsViewProps {
  isLoading: boolean;
  error: Error | null;
  hasResults: boolean;
  filters?: any;
}

export const NoResultsView: React.FC<NoResultsViewProps> = ({
  isLoading,
  error,
  hasResults,
  filters
}) => {
  const { t, isReady } = useTranslation('search');

  // Don't show anything if we're loading or if we have results
  if (isLoading || hasResults) {
    return null;
  }

  // Show error state
  if (error) {
    console.error("❌ NoResultsView showing error:", error);
    return (
      <div className="text-center py-12 space-y-4">
        <div className="text-red-500 text-lg font-semibold">
          Error Loading Hotels
        </div>
        <div className="text-gray-400">
          {error.message}
        </div>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white px-6 py-2 rounded-lg"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Show no results message
  const countryName = filters?.country;
  
  // Check if any filters other than country are applied
  const hasOtherFilters = filters && (
    (filters.theme && filters.theme.length > 0) ||
    (filters.affinities && filters.affinities.length > 0) ||
    filters.location ||
    (filters.minPrice && filters.minPrice > 0) ||
    (filters.maxPrice !== null && filters.maxPrice !== undefined) ||
    (filters.stars && filters.stars.length > 0) ||
    filters.propertyType ||
    filters.propertyStyle ||
    (filters.activities && filters.activities.length > 0) ||
    (filters.roomTypes && filters.roomTypes.length > 0) ||
    (filters.hotelFeatures && filters.hotelFeatures.length > 0) ||
    (filters.roomFeatures && filters.roomFeatures.length > 0) ||
    (filters.mealPlans && filters.mealPlans.length > 0) ||
    filters.stayLengths ||
    filters.atmosphere ||
    (filters.searchTerm && filters.searchTerm.trim().length > 0)
  );

  return (
    <div className="text-center py-12 space-y-6 ">
      <div className="text-2xl font-bold text-orange-500 mb-4">
        {countryName ? `No Hotels Found in ${countryName}` : 'No Hotels Found'}
      </div>
      
      <div className="text-gray-400 max-w-2xl mx-auto ">
        {hasOtherFilters ? (
          // Show criteria-based message when any filters other than country are applied
          <div 
            dangerouslySetInnerHTML={{
              __html: isReady ? t('noResults.byCriteria') : 
                'We didn\'t find hotels that meet this search criteria. You can help us expand the network by recommending hotels from your city or region. They can also benefit from Hotel-Living!<br><br>If you want, you can still be part of our expansion!<br><br>The hotels in your city or region will thank you!<br><br>💵 <a href="/promotor-local" target="_blank">Become a Hotel-Living Promoter</a> (Get excellent passive monthly benefits!)<br>🚀 <a href="/lider-living" target="_blank">Become a Group Leader, earn and multiply your life</a><br>🏆 <a href="https://www.hotel-living.com/ambassador" target="_blank">Become a Hotel-Living Ambassador</a>'
            }}
          />
        ) : countryName ? (
          // Show optimistic country message only when ONLY country is selected
          <div 
            dangerouslySetInnerHTML={{
              __html: isReady ? t('noResults.withCountry', { country: countryName }) : 
                `Great opportunity!<br><br>We have high demand for ${countryName} and... we are now adding our partner hotels there! Because... September 8th is our international launch!<br><br>If you want, you can still be part of our expansion!<br><br>The hotels in your city or region will thank you!<br><br>💵 <a href="/promotor-local" target="_blank">Become a Hotel-Living Promoter</a> (Get excellent passive monthly benefits!)<br>🚀 <a href="/lider-living" target="_blank">Become a Group Leader, earn and multiply your life</a><br>🏆 <a href="https://www.hotel-living.com/ambassador" target="_blank">Become a Hotel-Living Ambassador</a>`
            }}
          />
        ) : (
          // Default generic message
          <div 
            dangerouslySetInnerHTML={{
              __html: isReady ? t('noResults.generic') : 
                'Great opportunity!<br><br>We have high demand for your search criteria and... we are now adding our partner hotels there! Because... September 8th is our international launch!<br><br>If you want, you can still be part of our expansion!<br><br>The hotels in your city or region will thank you!<br><br>💵 <a href="/promotor-local" target="_blank">Become a Hotel-Living Promoter</a> (Get excellent passive monthly benefits!)<br>🚀 <a href="/lider-living" target="_blank">Become a Group Leader, earn and multiply your life</a><br>🏆 <a href="https://www.hotel-living.com/ambassador" target="_blank">Become a Hotel-Living Ambassador</a>'
            }}
          />
        )}
      </div>
    </div>
  );
};
