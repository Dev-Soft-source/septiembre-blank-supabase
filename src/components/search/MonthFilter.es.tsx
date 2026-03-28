
import React from "react";
import { FilterItem } from "./FilterItem";

interface MonthFilterESProps {
  activeMonth: string | null;
  onChange: (value: string) => void;
}

export function MonthFilterES({ activeMonth, onChange }: MonthFilterESProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  
  const months = [
    { value: "january", label: "Enero" },
    { value: "february", label: "Febrero" },
    { value: "march", label: "Marzo" },
    { value: "april", label: "Abril" },
    { value: "may", label: "Mayo" },
    { value: "june", label: "Junio" },
    { value: "july", label: "Julio" },
    { value: "august", label: "Agosto" },
    { value: "september", label: "Septiembre" },
    { value: "october", label: "Octubre" },
    { value: "november", label: "Noviembre" },
    { value: "december", label: "Diciembre" }
  ];

  const handleMonthClick = (monthValue: string) => {
    // Toggle selection: if already selected, deselect; otherwise select
    const newValue = activeMonth === monthValue ? null : monthValue;
    console.log("MonthFilter - Month toggled:", monthValue, "->", newValue);
    onChange(newValue);
    // Auto-collapse after selection
    setIsOpen(false);
  };

  // Get selected month name for display
  const selectedMonthName = activeMonth ? months.find(m => m.value === activeMonth)?.label : null;

  return (
    <FilterItem 
      title="MES" 
      isOpen={isOpen} 
      onOpenChange={setIsOpen}
      selectedValue={selectedMonthName}
    >
      <div className="grid grid-cols-2 gap-2">
        {months.map((month) => (
          <label key={month.value} className="flex items-start cursor-pointer hover:bg-fuchsia-800/30 p-1 rounded">
            <input 
              type="checkbox" 
              checked={activeMonth === month.value}
              onChange={() => handleMonthClick(month.value)}
              className="rounded border-fuchsia-800/50 text-fuchsia-600 focus:ring-fuchsia-500/50 bg-fuchsia-950/50 h-4 w-4 mr-2 mt-0.5" 
            />
            <span className="text-sm text-white">{month.label}</span>
          </label>
        ))}
      </div>
    </FilterItem>
  );
}
