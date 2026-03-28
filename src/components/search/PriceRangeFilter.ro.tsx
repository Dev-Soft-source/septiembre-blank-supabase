
import React from "react";
import { FilterItem } from "./FilterItem";

interface PriceRangeFilterROProps {
  activePrice: number | null;
  onChange: (value: number | null) => void;
}

export function PriceRangeFilterRO({ activePrice, onChange }: PriceRangeFilterROProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  
  const priceRanges = [
    { value: 1000, label: "Până la $1,000", maxPrice: 1000 },
    { value: 1500, label: "$1,000 la $1,500", minPrice: 1000, maxPrice: 1500 },
    { value: 2000, label: "$1,500 la $2,000", minPrice: 1500, maxPrice: 2000 },
    { value: 3000, label: "Mai mult de $2,000", minPrice: 2000 }
  ];
  
  const handlePriceClick = (priceValue: number) => {
    const newValue = activePrice === priceValue ? null : priceValue;
    console.log("PriceRangeFilter - Price toggled:", priceValue, "->", newValue);
    onChange(newValue);
    setIsOpen(false);
  };

  const selectedPriceLabel = activePrice ? priceRanges.find(p => p.value === activePrice)?.label : null;

  return (
    <FilterItem 
      title="PREȚ PE LUNĂ" 
      isOpen={isOpen} 
      onOpenChange={setIsOpen}
      selectedValue={selectedPriceLabel}
    >
      <div className="space-y-1">
        {priceRanges.map(option => (
          <div key={option.value} className="flex items-center space-x-2 p-1 hover:bg-fuchsia-900/20 rounded cursor-pointer" onClick={() => handlePriceClick(option.value)}>
            <input 
              type="checkbox" 
              checked={activePrice === option.value}
              onChange={() => handlePriceClick(option.value)}
              className="h-3 w-3 text-fuchsia-600 focus:ring-0"
            />
            <span className="text-sm font-bold text-white">{option.label}</span>
          </div>
        ))}
      </div>
    </FilterItem>
  );
}
