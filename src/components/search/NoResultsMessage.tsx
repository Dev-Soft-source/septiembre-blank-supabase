import React from "react";
import { useTranslation } from "@/hooks/useTranslation";

interface NoResultsMessageProps {
  searchTerm?: string;
  filterType?: string;
  filters?: any;
}

export function NoResultsMessage({ searchTerm, filterType, filters }: NoResultsMessageProps) {
  const { t, isReady } = useTranslation('search');
  
  console.log("🎯 NoResultsMessage received filters:", filters);
  
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
    (filters.stayLengths && filters.stayLengths !== null && filters.stayLengths !== '') ||
    filters.atmosphere ||
    (filters.searchTerm && filters.searchTerm.trim().length > 0)
  );

  // Get country from filters or URL
  let country = null;
  if (filters?.country) {
    country = filters.country;
  } else {
    const urlParams = new URLSearchParams(window.location.search);
    country = urlParams.get('country');
  }

  console.log("🔍 NoResultsMessage analysis:", { 
    country, 
    hasOtherFilters, 
    stayLengths: filters?.stayLengths,
    affinities: filters?.affinities,
    filters
  });
  
  const getLocationText = () => {
    if (searchTerm) {
      return searchTerm;
    }
    if (filterType) {
      return filterType;
    }
    return "your search";
  };

  const getMessage = () => {
    if (hasOtherFilters) {
      // Show criteria-based message when any filters other than country are applied
      return isReady ? t('noResults.byCriteria') :
        '¡Gran oportunidad!<br><br>Aunque no encontramos hoteles que cumplan con este criterio de búsqueda, si lo deseas puedes ser parte de nuestra expansión.<br><br>¿Conoces algún hotel con estas características? ¿En cualquier país?<br><br>💵 <a href="/promotor-local" target="_blank">Házte Promotor Hotel-Living</a> (¡Obtén excelentes beneficios mensuales pasivos!)<br>🚀 <a href="/lider-living" target="_blank">Házte Líder de Grupos, gana y multiplica tu vida</a><br>🏆 <a href="https://www.hotel-living.com/ambassador" target="_blank">Conviértete en Embajador Hotel-Living</a>';
    } else if (country) {
      // Show optimistic country message only when ONLY country is selected
      return isReady ? t('noResults.withCountry', { country }) :
        `¡Gran oportunidad!<br><br>Tenemos alta demanda para ${country} y... ¡ahora estamos sumando nuestros hoteles colaboradores allí! Porque... ¡el próximo 5 de septiembre es nuestro lanzamiento internacional!<br><br>Si lo deseas, ¡aún puedes ser parte de nuestra expansión!<br><br>¡Los hoteles de tu ciudad o región te lo agradecerán!<br><br>💵 <a href="/promotor-local" target="_blank">Házte Promotor Hotel-Living</a> (¡Obtén excelentes beneficios mensuales pasivos!)<br>🚀 <a href="/lider-living" target="_blank">Házte Líder de Grupos, gana y multiplica tu vida</a><br>🏆 <a href="https://www.hotel-living.com/ambassador" target="_blank">Conviértete en Embajador Hotel-Living</a>`;
    } else {
      // Default generic message
      return isReady ? t('noResults.generic') :
        '¡Gran oportunidad!<br><br>Tenemos alta demanda para su criterio de búsqueda y... ¡ahora estamos sumando nuestros hoteles colaboradores allí! Porque... ¡el próximo 5 de septiembre es nuestro lanzamiento internacional!<br><br>Si lo deseas, ¡aún puedes ser parte de nuestra expansión!<br><br>¡Los hoteles de tu ciudad o región te lo agradecerán!<br><br>💵 <a href="/promotor-local" target="_blank">Házte Promotor Hotel-Living</a> (¡Obtén excelentes beneficios mensuales pasivos!)<br>🚀 <a href="/lider-living" target="_blank">Házte Líder de Grupos, gana y multiplica tu vida</a><br>🏆 <a href="https://www.hotel-living.com/ambassador" target="_blank">Conviértete en Embajador Hotel-Living</a>';
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[240px] px-4">
      <div className="bg-gradient-to-br from-[#7E00B3] to-[#A020B0] backdrop-blur-md rounded-xl p-5 border border-white/20 shadow-xl max-w-xl mx-auto text-center" style={{
        boxShadow: '0 0 80px rgba(0,200,255,1), 0 0 160px rgba(0,200,255,0.8), 0 0 240px rgba(0,200,255,0.6)'
      }}>
        <div 
          className="text-white text-base leading-relaxed space-y-3"
          dangerouslySetInnerHTML={{ __html: getMessage() }}
        />
      </div>
    </div>
  );
}