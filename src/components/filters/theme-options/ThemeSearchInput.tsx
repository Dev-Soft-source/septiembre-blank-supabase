
import React from "react";
import { Search, X } from "lucide-react";

interface ThemeSearchInputProps {
  themeQuery: string;
  setThemeQuery: (query: string) => void;
}

export const ThemeSearchInput: React.FC<ThemeSearchInputProps> = ({
  themeQuery,
  setThemeQuery
}) => {
  const handleClearSearch = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setThemeQuery("");
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setThemeQuery(e.target.value);
  };
  
  const handleInputClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  return (
    <div className="mb-2 relative" onClick={(e) => {
      e.preventDefault();
      e.stopPropagation();
    }}>
      <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-[#3300B0]" />
      </div>
      
      <input
        type="text"
        placeholder="Search affinities..." // Changed from "Search themes..."
        value={themeQuery}
        onChange={handleInputChange}
        onClick={handleInputClick}
        className="w-full pl-8 pr-8 py-2 bg-[#AACAFE]/30 border border-[#3300B0]/20 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#3300B0]/50 text-[#3300B0]"
      />
      
      {themeQuery && (
        <button
          onClick={handleClearSearch}
          className="absolute inset-y-0 right-2 flex items-center text-[#3300B0] hover:text-[#3300B0]/80"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};
