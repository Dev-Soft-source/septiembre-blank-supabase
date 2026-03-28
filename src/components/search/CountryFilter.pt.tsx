
import React from "react";
import { Search } from "lucide-react";
import { FilterItem } from "./FilterItem";

interface CountryFilterPTProps {
  activeCountry: string | null;
  onChange: (value: string | null) => void;
}

export function CountryFilterPT({ activeCountry, onChange }: CountryFilterPTProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);
  
  // Country mapping: Portuguese display names -> English database names
  const countryMapping: Record<string, string> = {
    'Alemanha': 'Germany',
    'Argentina': 'Argentina',
    'Austrália': 'Australia',
    'Áustria': 'Austria',
    'Bélgica': 'Belgium',
    'Brasil': 'Brazil',
    'Bulgária': 'Bulgaria',
    'Canadá': 'Canada',
    'Colômbia': 'Colombia',
    'Coreia do Sul': 'South Korea',
    'Costa Rica': 'Costa Rica',
    'Croácia': 'Croatia',
    'Dinamarca': 'Denmark',
    'Equador': 'Ecuador',
    'Egito': 'Egypt',
    'Emirados Árabes Unidos': 'United Arab Emirates',
    'Eslováquia': 'Slovakia',
    'Espanha': 'Spain',
    'Estados Unidos': 'United States',
    'Estónia': 'Estonia',
    'Filipinas': 'Philippines',
    'Finlândia': 'Finland',
    'França': 'France',
    'Geórgia': 'Georgia',
    'Grécia': 'Greece',
    'Hungria': 'Hungary',
    'Indonésia': 'Indonesia',
    'Irlanda': 'Ireland',
    'Islândia': 'Iceland',
    'Itália': 'Italy',
    'Japão': 'Japan',
    'Cazaquistão': 'Kazakhstan',
    'Letónia': 'Latvia',
    'Lituânia': 'Lithuania',
    'Luxemburgo': 'Luxembourg',
    'Malásia': 'Malaysia',
    'Malta': 'Malta',
    'Marrocos': 'Morocco',
    'México': 'Mexico',
    'Noruega': 'Norway',
    'Nova Zelândia': 'New Zealand',
    'Panamá': 'Panama',
    'Paraguai': 'Paraguay',
    'Países Baixos': 'Netherlands',
    'Peru': 'Peru',
    'Polónia': 'Poland',
    'Portugal': 'Portugal',
    'Reino Unido': 'United Kingdom',
    'República Checa': 'Czech Republic',
    'República Dominicana': 'Dominican Republic',
    'Roménia': 'Romania',
    'Singapura': 'Singapore',
    'Sri Lanka': 'Sri Lanka',
    'Suécia': 'Sweden',
    'Suíça': 'Switzerland',
    'Taiwan': 'Taiwan',
    'Tailândia': 'Thailand',
    'Turquia': 'Turkey',
    'Uruguai': 'Uruguay',
    'Vietname': 'Vietnam'
  };
  
  // Get Portuguese country names from mapping keys
  const countries = Object.keys(countryMapping).map(portugueseName => ({
    portugueseName,
    englishName: countryMapping[portugueseName]
  }));

  // Sort alphabetically by Portuguese name
  const sortedCountries = countries.sort((a, b) => a.portugueseName.localeCompare(b.portugueseName));
  
  // Filter countries based on search query
  const filteredCountries = sortedCountries.filter(country =>
    country.portugueseName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Get reverse mapping to find Portuguese name for display from English name
  const reverseMapping: Record<string, string> = {};
  Object.entries(countryMapping).forEach(([portuguese, english]) => {
    reverseMapping[english] = portuguese;
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
  
  const selectedCountryName = activeCountry ? reverseMapping[activeCountry] : null;
  
  return (
    <FilterItem 
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
            <input
              type="text"
              placeholder="Pesquisar"
              value={searchQuery}
              onChange={handleSearchChange}
              onClick={handleSearchClick}
              className="w-full pl-8 pr-3 py-1.5 bg-fuchsia-900/30 border border-fuchsia-700/50 rounded-md text-sm text-white placeholder:text-fuchsia-300/70 focus:outline-none focus:border-fuchsia-500"
            />
          </div>
        </div>

        {/* Countries List */}
        <div className="p-2 space-y-1">
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
                  {country.portugueseName}
                </span>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-fuchsia-300">
              {searchQuery ? "Nenhum país encontrado" : "Nenhum país disponível"}
            </div>
          )}
        </div>
      </div>
    </FilterItem>
  );
}
