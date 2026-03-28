import React from "react";
import { Search } from "lucide-react";
import { FilterItem } from "./FilterItem";
import { useFilterData } from "@/hooks/useFilterData";

interface CountryFilterENProps {
  activeCountry: string | null;
  onChange: (value: string | null) => void;
}

export function CountryFilterEN({ activeCountry, onChange }: CountryFilterENProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);
  const { countries, loading, error } = useFilterData();
  
  // Filter countries based on search query
  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleCountryClick = (countryName: string) => {
    // Toggle selection: if already selected, deselect; otherwise select
    const newValue = activeCountry === countryName ? null : countryName;
    console.log("🌍 CountryFilter - Country clicked:", countryName);
    console.log("🌍 CountryFilter - Previous value:", activeCountry);
    console.log("🌍 CountryFilter - New value:", newValue);
    console.log("🌍 CountryFilter - Calling onChange with:", newValue);
    onChange(newValue);
    // Auto-collapse after selection
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
  
  // Get selected country name for display
  const selectedCountryName = activeCountry;
  
  return (
    <FilterItem 
      title="COUNTRY" 
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
              placeholder="Search"
              value={searchQuery}
              onChange={handleSearchChange}
              onClick={handleSearchClick}
              className="w-full pl-8 pr-3 py-1.5 bg-fuchsia-900/30 border border-fuchsia-700/50 rounded-md text-sm text-white placeholder:text-fuchsia-300/70 focus:outline-none focus:border-fuchsia-500"
            />
          </div>
        </div>

        {/* Countries List */}
        <div className="p-2 space-y-1">
          {loading ? (
            <div className="text-center py-4 text-fuchsia-300">Loading...</div>
          ) : error ? (
            <div className="text-center py-4 text-fuchsia-300">Error loading countries</div>
          ) : filteredCountries.length > 0 ? (
            filteredCountries.map(country => (
              <div key={country.name} className="flex items-center space-x-2 p-1 hover:bg-fuchsia-900/20 rounded cursor-pointer" onClick={() => handleCountryClick(country.name)}>
                <input 
                  type="checkbox" 
                  checked={activeCountry === country.name}
                  onChange={() => handleCountryClick(country.name)}
                  className="h-3 w-3 text-fuchsia-600 focus:ring-0"
                />
                <span className="text-sm flex items-center text-white">
                  {country.name}
                  <span className="ml-2">{country.flag}</span>
                </span>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-fuchsia-300">
              {searchQuery ? "No countries found" : "No countries available"}
            </div>
          )}
        </div>
      </div>
    </FilterItem>
  );
}