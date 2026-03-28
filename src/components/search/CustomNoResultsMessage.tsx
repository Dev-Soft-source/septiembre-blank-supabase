import React from "react";
import { useTranslation } from "react-i18next";

interface CustomNoResultsMessageProps {
  filters?: any;
}

// Country code to localized name mapping
const getCountryName = (countryCode: string, language: string): string => {
  const countryMappings: { [key: string]: { [key: string]: string } } = {
    en: {
      'DE': 'Germany', 'AR': 'Argentina', 'AU': 'Australia', 'AT': 'Austria', 'BE': 'Belgium',
      'BR': 'Brazil', 'BG': 'Bulgaria', 'CA': 'Canada', 'CO': 'Colombia', 'KR': 'South Korea',
      'CR': 'Costa Rica', 'HR': 'Croatia', 'DK': 'Denmark', 'EC': 'Ecuador', 'EG': 'Egypt',
      'AE': 'United Arab Emirates', 'SK': 'Slovakia', 'ES': 'Spain', 'US': 'United States',
      'EE': 'Estonia', 'PH': 'Philippines', 'FI': 'Finland', 'FR': 'France', 'GE': 'Georgia',
      'GR': 'Greece', 'HU': 'Hungary', 'ID': 'Indonesia', 'IE': 'Ireland', 'IS': 'Iceland',
      'IT': 'Italy', 'JP': 'Japan', 'KZ': 'Kazakhstan', 'LV': 'Latvia', 'LT': 'Lithuania',
      'LU': 'Luxembourg', 'MY': 'Malaysia', 'MT': 'Malta', 'MA': 'Morocco', 'MX': 'Mexico',
      'NO': 'Norway', 'NZ': 'New Zealand', 'PA': 'Panama', 'PY': 'Paraguay', 'NL': 'Netherlands',
      'PE': 'Peru', 'PL': 'Poland', 'PT': 'Portugal', 'GB': 'United Kingdom', 'CZ': 'Czech Republic',
      'DO': 'Dominican Republic', 'RO': 'Romania', 'SG': 'Singapore', 'LK': 'Sri Lanka',
      'SE': 'Sweden', 'CH': 'Switzerland', 'TW': 'Taiwan', 'TH': 'Thailand', 'TR': 'Turkey',
      'UY': 'Uruguay', 'VN': 'Vietnam'
    },
    es: {
      'DE': 'Alemania', 'AR': 'Argentina', 'AU': 'Australia', 'AT': 'Austria', 'BE': 'Bélgica',
      'BR': 'Brasil', 'BG': 'Bulgaria', 'CA': 'Canadá', 'CO': 'Colombia', 'KR': 'Corea del Sur',
      'CR': 'Costa Rica', 'HR': 'Croacia', 'DK': 'Dinamarca', 'EC': 'Ecuador', 'EG': 'Egipto',
      'AE': 'Emiratos Árabes Unidos', 'SK': 'Eslovaquia', 'ES': 'España', 'US': 'Estados Unidos',
      'EE': 'Estonia', 'PH': 'Filipinas', 'FI': 'Finlandia', 'FR': 'Francia', 'GE': 'Georgia',
      'GR': 'Grecia', 'HU': 'Hungría', 'ID': 'Indonesia', 'IE': 'Irlanda', 'IS': 'Islandia',
      'IT': 'Italia', 'JP': 'Japón', 'KZ': 'Kazajistán', 'LV': 'Letonia', 'LT': 'Lituania',
      'LU': 'Luxemburgo', 'MY': 'Malasia', 'MT': 'Malta', 'MA': 'Marruecos', 'MX': 'México',
      'NO': 'Noruega', 'NZ': 'Nueva Zelanda', 'PA': 'Panamá', 'PY': 'Paraguay', 'NL': 'Países Bajos',
      'PE': 'Perú', 'PL': 'Polonia', 'PT': 'Portugal', 'GB': 'Reino Unido', 'CZ': 'República Checa',
      'DO': 'República Dominicana', 'RO': 'Rumanía', 'SG': 'Singapur', 'LK': 'Sri Lanka',
      'SE': 'Suecia', 'CH': 'Suiza', 'TW': 'Taiwán', 'TH': 'Tailandia', 'TR': 'Turquía',
      'UY': 'Uruguay', 'VN': 'Vietnam'
    },
    pt: {
      'DE': 'Alemanha', 'AR': 'Argentina', 'AU': 'Austrália', 'AT': 'Áustria', 'BE': 'Bélgica',
      'BR': 'Brasil', 'BG': 'Bulgária', 'CA': 'Canadá', 'CO': 'Colômbia', 'KR': 'Coreia do Sul',
      'CR': 'Costa Rica', 'HR': 'Croácia', 'DK': 'Dinamarca', 'EC': 'Equador', 'EG': 'Egito',
      'AE': 'Emirados Árabes Unidos', 'SK': 'Eslováquia', 'ES': 'Espanha', 'US': 'Estados Unidos',
      'EE': 'Estónia', 'PH': 'Filipinas', 'FI': 'Finlândia', 'FR': 'França', 'GE': 'Geórgia',
      'GR': 'Grécia', 'HU': 'Hungria', 'ID': 'Indonésia', 'IE': 'Irlanda', 'IS': 'Islândia',
      'IT': 'Itália', 'JP': 'Japão', 'KZ': 'Cazaquistão', 'LV': 'Letónia', 'LT': 'Lituânia',
      'LU': 'Luxemburgo', 'MY': 'Malásia', 'MT': 'Malta', 'MA': 'Marrocos', 'MX': 'México',
      'NO': 'Noruega', 'NZ': 'Nova Zelândia', 'PA': 'Panamá', 'PY': 'Paraguai', 'NL': 'Países Baixos',
      'PE': 'Peru', 'PL': 'Polónia', 'PT': 'Portugal', 'GB': 'Reino Unido', 'CZ': 'República Checa',
      'DO': 'República Dominicana', 'RO': 'Roménia', 'SG': 'Singapura', 'LK': 'Sri Lanka',
      'SE': 'Suécia', 'CH': 'Suíça', 'TW': 'Taiwan', 'TH': 'Tailândia', 'TR': 'Turquia',
      'UY': 'Uruguai', 'VN': 'Vietname'
    },
    ro: {
      'DE': 'Germania', 'AR': 'Argentina', 'AU': 'Australia', 'AT': 'Austria', 'BE': 'Belgia',
      'BR': 'Brazilia', 'BG': 'Bulgaria', 'CA': 'Canada', 'CO': 'Columbia', 'KR': 'Coreea de Sud',
      'CR': 'Costa Rica', 'HR': 'Croația', 'DK': 'Danemarca', 'EC': 'Ecuador', 'EG': 'Egipt',
      'AE': 'Emiratele Arabe Unite', 'SK': 'Slovacia', 'ES': 'Spania', 'US': 'Statele Unite',
      'EE': 'Estonia', 'PH': 'Filipine', 'FI': 'Finlanda', 'FR': 'Franța', 'GE': 'Georgia',
      'GR': 'Grecia', 'HU': 'Ungaria', 'ID': 'Indonezia', 'IE': 'Irlanda', 'IS': 'Islanda',
      'IT': 'Italia', 'JP': 'Japonia', 'KZ': 'Kazahstan', 'LV': 'Letonia', 'LT': 'Lituania',
      'LU': 'Luxemburg', 'MY': 'Malaezia', 'MT': 'Malta', 'MA': 'Maroc', 'MX': 'Mexic',
      'NO': 'Norvegia', 'NZ': 'Noua Zeelandă', 'PA': 'Panama', 'PY': 'Paraguay', 'NL': 'Țările de Jos',
      'PE': 'Peru', 'PL': 'Polonia', 'PT': 'Portugalia', 'GB': 'Regatul Unit', 'CZ': 'Republica Cehă',
      'DO': 'Republica Dominicană', 'RO': 'România', 'SG': 'Singapore', 'LK': 'Sri Lanka',
      'SE': 'Suedia', 'CH': 'Elveția', 'TW': 'Taiwan', 'TH': 'Thailanda', 'TR': 'Turcia',
      'UY': 'Uruguay', 'VN': 'Vietnam'
    }
  };

  return countryMappings[language]?.[countryCode] || countryCode;
};

export const CustomNoResultsMessage: React.FC<CustomNoResultsMessageProps> = ({ filters }) => {
  const { t, i18n } = useTranslation('search');
  const currentLanguage = i18n.language || 'es';

  console.log("🎯 CustomNoResultsMessage filters:", filters);

  // Enhanced country extraction with error handling to prevent truncation
  let country = null;
  
  try {
    if (filters?.country) {
      // Handle array format: filters.country = ["Germany"]
      if (Array.isArray(filters.country) && filters.country.length > 0) {
        const countryValue = String(filters.country[0]).trim();
        // Check if it's a country code, if so convert it to localized name
        country = getCountryName(countryValue, currentLanguage);
      }
      // Handle string format: filters.country = "Germany" 
      else if (typeof filters.country === 'string' && filters.country.trim() !== '') {
        const countryValue = filters.country.trim();
        // Check if it's a country code, if so convert it to localized name
        country = getCountryName(countryValue, currentLanguage);
      }
      // Handle object format: filters.country = { name: "Germany", value: "Germany" }
      else if (typeof filters.country === 'object' && filters.country.name) {
        const countryValue = String(filters.country.name).trim();
        country = getCountryName(countryValue, currentLanguage);
      }
      else if (typeof filters.country === 'object' && filters.country.value) {
        const countryValue = String(filters.country.value).trim();
        country = getCountryName(countryValue, currentLanguage);
      }
    }
    
    // Also check URL parameters for country
    if (!country) {
      const urlParams = new URLSearchParams(window.location.search);
      const urlCountry = urlParams.get('country');
      if (urlCountry && urlCountry.trim() !== '') {
        country = getCountryName(urlCountry.trim(), currentLanguage);
      }
    }
  } catch (error) {
    console.error("Error extracting country filter:", error);
    country = null;
  }

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

  console.log("🔍 CustomNoResultsMessage analysis:", { 
    country, 
    hasOtherFilters, 
    stayLengths: filters?.stayLengths,
    stayLengthsCheck: (filters?.stayLengths && filters?.stayLengths !== null && filters?.stayLengths !== ''),
    affinities: filters?.affinities,
    affinitiesLength: filters?.affinities?.length,
    theme: filters?.theme,
    allFilters: filters 
  });

  // Use complete message with error fallback
  let message;
  try {
    if (hasOtherFilters) {
      // Show criteria-based message when any filters other than country are applied
      message = t("noResults.byCriteria");
    } else if (country && country !== '') {
      // Show optimistic country message only when ONLY country is selected
      message = t("noResults.withCountry", { country });
    } else {
      // Default generic message
      message = t("noResults.generic");
    }
  } catch (error) {
    console.error("Translation error:", error);
    // Fallback messages in case of translation errors
    if (hasOtherFilters) {
      message = "We didn't find hotels that meet this search criteria. You can help us expand the network by recommending hotels from your city or region. They can also benefit from Hotel-Living!";
    } else if (country && country !== '') {
      message = `High demand for ${country}, but we don't have available hotels yet. Become a local Hotel-Living Promoter and earn passive monthly benefits, or become a Hotel-Living Ambassador.`;
    } else {
      message = "High demand for this search, but we don't have available hotels yet. Become a local Hotel-Living Promoter and earn passive monthly benefits, or become a Hotel-Living Ambassador.";
    }
  }

  return (
    <div className="flex justify-center items-center min-h-[400px] px-4">
      <div 
        className="p-6 rounded-xl max-w-lg mx-auto"
        style={{
          backgroundColor: '#7E26A6',
          boxShadow: '0 0 80px rgba(0,200,255,1), 0 0 160px rgba(0,200,255,0.8), 0 0 240px rgba(0,200,255,0.6)'
        }}
      >
        <div className="text-white leading-relaxed text-left" style={{ fontSize: '0.85rem' }}>
          <div 
            dangerouslySetInnerHTML={{ __html: message }}
            style={{
              lineHeight: '1.6'
            }}
            className="[&_a]:text-white [&_a]:hover:text-purple-200 [&_a]:transition-colors [&_a]:duration-200 [&_a]:underline"
          />
        </div>
      </div>
    </div>
  );
};