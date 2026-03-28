import React from "react";
import { Search } from "lucide-react";
import { FilterItem } from "./FilterItem";

interface CountryFilterESProps {
  activeCountry: string | null;
  onChange: (value: string | null) => void;
}

export function CountryFilterES({
  activeCountry,
  onChange
}: CountryFilterESProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);

  // Country mapping: Spanish display names -> English database names
  const countryMapping: Record<string, string> = {
    'Alemania': 'Germany',
    'Argentina': 'Argentina',
    'Australia': 'Australia',
    'Austria': 'Austria',
    'Bélgica': 'Belgium',
    'Brasil': 'Brazil',
    'Bulgaria': 'Bulgaria',
    'Canadá': 'Canada',
    'Colombia': 'Colombia',
    'Corea del Sur': 'South Korea',
    'Costa Rica': 'Costa Rica',
    'Croacia': 'Croatia',
    'Dinamarca': 'Denmark',
    'Ecuador': 'Ecuador',
    'Egipto': 'Egypt',
    'Emiratos Árabes Unidos': 'United Arab Emirates',
    'Eslovaquia': 'Slovakia',
    'España': 'Spain',
    'Estados Unidos': 'United States',
    'Estonia': 'Estonia',
    'Filipinas': 'Philippines',
    'Finlandia': 'Finland',
    'Francia': 'France',
    'Georgia': 'Georgia',
    'Grecia': 'Greece',
    'Hungría': 'Hungary',
    'Indonesia': 'Indonesia',
    'Irlanda': 'Ireland',
    'Islandia': 'Iceland',
    'Italia': 'Italy',
    'Japón': 'Japan',
    'Kazajistán': 'Kazakhstan',
    'Letonia': 'Latvia',
    'Lituania': 'Lithuania',
    'Luxemburgo': 'Luxembourg',
    'Malasia': 'Malaysia',
    'Malta': 'Malta',
    'Marruecos': 'Morocco',
    'México': 'Mexico',
    'Noruega': 'Norway',
    'Nueva Zelanda': 'New Zealand',
    'Panamá': 'Panama',
    'Paraguay': 'Paraguay',
    'Países Bajos': 'Netherlands',
    'Perú': 'Peru',
    'Polonia': 'Poland',
    'Portugal': 'Portugal',
    'Reino Unido': 'United Kingdom',
    'República Checa': 'Czech Republic',
    'República Dominicana': 'Dominican Republic',
    'Rumanía': 'Romania',
    'Singapur': 'Singapore',
    'Sri Lanka': 'Sri Lanka',
    'Suecia': 'Sweden',
    'Suiza': 'Switzerland',
    'Taiwán': 'Taiwan',
    'Tailandia': 'Thailand',
    'Turquía': 'Turkey',
    'Uruguay': 'Uruguay',
    'Vietnam': 'Vietnam'
  };

  // Get Spanish country names from mapping keys
  const countries = Object.keys(countryMapping).map(spanishName => ({
    spanishName,
    englishName: countryMapping[spanishName]
  }));

  // Sort alphabetically by Spanish name
  const sortedCountries = countries.sort((a, b) => a.spanishName.localeCompare(b.spanishName));

  // Filter countries based on search query
  const filteredCountries = sortedCountries.filter(country => 
    country.spanishName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Get reverse mapping to find Spanish name for display from English name
  const reverseMapping: Record<string, string> = {};
  Object.entries(countryMapping).forEach(([spanish, english]) => {
    reverseMapping[english] = spanish;
  });

  const handleCountryClick = (englishName: string) => {
    const newValue = activeCountry === englishName ? null : englishName;
    console.log("🌍 CountryFilter - Country clicked:", reverseMapping[englishName]);
    console.log("🌍 CountryFilter - Previous value:", activeCountry);
    console.log("🌍 CountryFilter - New value:", newValue);
    console.log("🌍 CountryFilter - Calling onChange with:", newValue);
    onChange(newValue);
    setIsOpen(false);
  };
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setSearchQuery(e.target.value);
  };

  const handleSearchClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  // Get selected country name for display (show Spanish name)
  const selectedCountryName = activeCountry ? reverseMapping[activeCountry] : null;
  
  return <FilterItem 
    title="PAÍS" 
    isOpen={isOpen} 
    onOpenChange={setIsOpen}
    selectedValue={selectedCountryName}
  >
      <div className="bg-fuchsia-950/30 rounded-lg max-h-96 overflow-y-auto">
        {/* Search Input */}
        <div className="p-2 border-b border-fuchsia-800/30" onClick={handleSearchClick}>
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-fuchsia-300" />
            <input type="text" placeholder="Buscar" value={searchQuery} onChange={handleSearchChange} onClick={handleSearchClick} className="w-full pl-8 pr-3 py-1.5 bg-fuchsia-900/30 border border-fuchsia-700/50 rounded-md text-sm text-white placeholder:text-fuchsia-300/70 focus:outline-none focus:border-fuchsia-500" />
          </div>
        </div>

        {/* Countries List */}
        <div className="p-2 space-y-1 bg-[#3e0685]">
          {filteredCountries.length > 0 ? (
            filteredCountries.map(country => (
              <div key={country.englishName} className="flex items-center space-x-2 p-1 hover:bg-fuchsia-900/20 rounded cursor-pointer" onClick={() => handleCountryClick(country.englishName)}>
                <input 
                  type="checkbox" 
                  checked={activeCountry === country.englishName}
                  onChange={() => handleCountryClick(country.englishName)}
                  className="h-3 w-3 text-fuchsia-600 focus:ring-0"
                />
                <span className="text-sm text-white whitespace-nowrap">
                  {country.spanishName}
                </span>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-fuchsia-300">
              {searchQuery ? "No se encontraron países" : "No hay países disponibles"}
            </div>
          )}
        </div>
      </div>
    </FilterItem>;
}