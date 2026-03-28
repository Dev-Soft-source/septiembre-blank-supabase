
import React from "react";
import { FilterItem } from "./FilterItem";

interface MonthFilterENProps {
  activeMonth: string | null;
  onChange: (value: string | null) => void;
}

export function MonthFilterEN({ activeMonth, onChange }: MonthFilterENProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  
  const months = [
    { value: "january", label: "January" },
    { value: "february", label: "February" },
    { value: "march", label: "March" },
    { value: "april", label: "April" },
    { value: "may", label: "May" },
    { value: "june", label: "June" },
    { value: "july", label: "July" },
    { value: "august", label: "August" },
    { value: "september", label: "September" },
    { value: "october", label: "October" },
    { value: "november", label: "November" },
    { value: "december", label: "December" }
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
      title="MONTH" 
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
