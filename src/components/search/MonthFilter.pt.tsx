
import React from "react";
import { FilterItem } from "./FilterItem";

interface MonthFilterPTProps {
  activeMonth: string | null;
  onChange: (value: string) => void;
}

export function MonthFilterPT({ activeMonth, onChange }: MonthFilterPTProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  
  const months = [
    { value: "january", label: "Janeiro" },
    { value: "february", label: "Fevereiro" },
    { value: "march", label: "Março" },
    { value: "april", label: "Abril" },
    { value: "may", label: "Maio" },
    { value: "june", label: "Junho" },
    { value: "july", label: "Julho" },
    { value: "august", label: "Agosto" },
    { value: "september", label: "Setembro" },
    { value: "october", label: "Outubro" },
    { value: "november", label: "Novembro" },
    { value: "december", label: "Dezembro" }
  ];

  const handleMonthClick = (monthValue: string) => {
    const newValue = activeMonth === monthValue ? null : monthValue;
    console.log("MonthFilter - Month toggled:", monthValue, "->", newValue);
    onChange(newValue);
    setIsOpen(false);
  };

  const selectedMonthName = activeMonth ? months.find(m => m.value === activeMonth)?.label : null;

  return (
    <FilterItem 
      title="MÊS" 
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
              className="h-3 w-3 text-fuchsia-600 focus:ring-0 mr-2 mt-0.5" 
            />
            <span className="text-sm text-white">{month.label}</span>
          </label>
        ))}
      </div>
    </FilterItem>
  );
}
