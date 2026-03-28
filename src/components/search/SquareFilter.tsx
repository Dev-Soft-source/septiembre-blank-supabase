import React from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { FilterItem } from "./FilterItem";

interface SquareFilterOption {
  value: string;
  label: string;
}

interface SquareFilterProps {
  title: string;
  options: SquareFilterOption[];
  selectedOptions: string[];
  onChange: (value: string, isChecked: boolean) => void;
  loading?: boolean;
  singleSelect?: boolean; // New prop for single-select behavior
}

export function SquareFilter({ 
  title, 
  options, 
  selectedOptions, 
  onChange, 
  loading = false,
  singleSelect = false
}: SquareFilterProps) {

  const [searchQuery, setSearchQuery] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);

  // Filter options based on search query
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOptionClick = (optionValue: string) => {
    const isCurrentlySelected = selectedOptions.includes(optionValue);
    
    if (singleSelect) {
      // Single select: clear others and toggle this one
      if (isCurrentlySelected) {
        onChange(optionValue, false); // Deselect
      } else {
        // Deselect any currently selected options first
        selectedOptions.forEach(selected => {
          if (selected !== optionValue) {
            onChange(selected, false);
          }
        });
        onChange(optionValue, true); // Select this one
      }
    } else {
      // Multi-select: normal toggle behavior
      onChange(optionValue, !isCurrentlySelected);
    }
    
    // Auto-collapse after selection if single select
    if (singleSelect) {
      setIsOpen(false);
    }
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
  
  if (loading) {
    return (
      <FilterItem 
        title={title}
        isOpen={isOpen} 
        onOpenChange={setIsOpen}
      >
        <div className="text-center text-sm text-fuchsia-300/60 py-2">
          Loading options...
        </div>
      </FilterItem>
    );
  }

  if (options.length === 0) {
    return (
      <FilterItem 
        title={title}
        isOpen={isOpen} 
        onOpenChange={setIsOpen}
      >
        <div className="text-center text-sm text-fuchsia-300/60 py-2">
          No options available
        </div>
      </FilterItem>
    );
  }

  // Get selected value for display
  const selectedDisplayValue = singleSelect && selectedOptions.length > 0 
    ? options.find(opt => opt.value === selectedOptions[0])?.label 
    : selectedOptions.length > 1 
      ? `${selectedOptions.length} selected`
      : selectedOptions.length === 1 
        ? options.find(opt => opt.value === selectedOptions[0])?.label
        : null;

  return (
    <FilterItem 
      title={title}
      isOpen={isOpen} 
      onOpenChange={setIsOpen}
      selectedValue={selectedDisplayValue}
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

        {/* Options List */}
        <div className="p-2 space-y-1">
          {filteredOptions.length > 0 ? (
            filteredOptions.map(option => {
              const isSelected = selectedOptions.includes(option.value);
              
              return (
                <div
                  key={option.value}
                  className="flex items-center space-x-2 p-1 hover:bg-fuchsia-900/20 rounded cursor-pointer"
                  onClick={(e) => {
                    console.log(`🖱️ SquareFilter "${title}" DIV clicked for:`, option.value);
                    e.preventDefault();
                    handleOptionClick(option.value);
                  }}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => {
                      console.log(`☑️ SquareFilter "${title}" CHECKBOX changed for:`, option.value);
                      e.preventDefault();
                      e.stopPropagation();
                      handleOptionClick(option.value);
                    }}
                    className="h-3 w-3 text-fuchsia-600 focus:ring-0"
                  />
                  <span className="text-sm text-white">{option.label}</span>
                </div>
              );
            })
          ) : (
            <div className="text-center py-4 text-fuchsia-300">
              {searchQuery ? "No results found" : "No options available"}
            </div>
          )}
        </div>
      </div>
    </FilterItem>
  );
}