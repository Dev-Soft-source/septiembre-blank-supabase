
import React from "react";
import { Search } from "lucide-react";
import { FilterItem } from "./FilterItem";

interface CountryFilterROProps {
  activeCountry: string | null;
  onChange: (value: string | null) => void;
}

export function CountryFilterRO({ activeCountry, onChange }: CountryFilterROProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);
  
  // Country mapping: Romanian display names -> English database names
  const countryMapping: Record<string, string> = {
    'Germania': 'Germany',
    'Argentina': 'Argentina',
    'Australia': 'Australia',
    'Austria': 'Austria',
    'Belgia': 'Belgium',
    'Brazilia': 'Brazil',
    'Bulgaria': 'Bulgaria',
    'Canada': 'Canada',
    'Columbia': 'Colombia',
    'Coreea de Sud': 'South Korea',
    'Costa Rica': 'Costa Rica',
    'Croația': 'Croatia',
    'Danemarca': 'Denmark',
    'Ecuador': 'Ecuador',
    'Egipt': 'Egypt',
    'Emiratele Arabe Unite': 'United Arab Emirates',
    'Slovacia': 'Slovakia',
    'Spania': 'Spain',
    'Statele Unite': 'United States',
    'Estonia': 'Estonia',
    'Filipine': 'Philippines',
    'Finlanda': 'Finland',
    'Franța': 'France',
    'Georgia': 'Georgia',
    'Grecia': 'Greece',
    'Ungaria': 'Hungary',
    'Indonezia': 'Indonesia',
    'Irlanda': 'Ireland',
    'Islanda': 'Iceland',
    'Italia': 'Italy',
    'Japonia': 'Japan',
    'Kazahstan': 'Kazakhstan',
    'Letonia': 'Latvia',
    'Lituania': 'Lithuania',
    'Luxemburg': 'Luxembourg',
    'Malaezia': 'Malaysia',
    'Malta': 'Malta',
    'Maroc': 'Morocco',
    'Mexic': 'Mexico',
    'Norvegia': 'Norway',
    'Noua Zeelandă': 'New Zealand',
    'Panama': 'Panama',
    'Paraguay': 'Paraguay',
    'Țările de Jos': 'Netherlands',
    'Peru': 'Peru',
    'Polonia': 'Poland',
    'Portugalia': 'Portugal',
    'Regatul Unit': 'United Kingdom',
    'Republica Cehă': 'Czech Republic',
    'Republica Dominicană': 'Dominican Republic',
    'România': 'Romania',
    'Singapore': 'Singapore',
    'Sri Lanka': 'Sri Lanka',
    'Suedia': 'Sweden',
    'Elveția': 'Switzerland',
    'Taiwan': 'Taiwan',
    'Thailanda': 'Thailand',
    'Turcia': 'Turkey',
    'Uruguay': 'Uruguay',
    'Vietnam': 'Vietnam'
  };
  
  // Get Romanian country names from mapping keys
  const countries = Object.keys(countryMapping).map(romanianName => ({
    romanianName,
    englishName: countryMapping[romanianName]
  }));

  // Sort alphabetically by Romanian name
  const sortedCountries = countries.sort((a, b) => a.romanianName.localeCompare(b.romanianName));
  
  // Filter countries based on search query
  const filteredCountries = sortedCountries.filter(country =>
    country.romanianName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Get reverse mapping to find Romanian name for display from English name
  const reverseMapping: Record<string, string> = {};
  Object.entries(countryMapping).forEach(([romanian, english]) => {
    reverseMapping[english] = romanian;
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
      title="ȚARĂ" 
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
              placeholder="Căutare"
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
                  {country.romanianName}
                </span>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-fuchsia-300">
              {searchQuery ? "Nu s-au găsit țări" : "Nu sunt țări disponibile"}
            </div>
          )}
        </div>
      </div>
    </FilterItem>
  );
}
