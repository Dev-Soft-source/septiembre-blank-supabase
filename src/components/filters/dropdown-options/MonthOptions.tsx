
import React from "react";
import { FilterState } from "../FilterTypes";
import { months } from "../FilterUtils";
import { useTranslation } from "@/hooks/useTranslation";

interface MonthOptionsProps {
  type: keyof FilterState;
  fontSize: string;
}

export const MonthOptions: React.FC<MonthOptionsProps> = ({ type, fontSize }) => {
  const { t } = useTranslation('filters');
  
  return (
    <div className="grid grid-cols-2">
      {months.map((month) => (
        <button
          key={month.value}
          onClick={() => document.dispatchEvent(new CustomEvent('updateFilter', { 
            detail: { key: type, value: month.value } 
          }))}
          className={`text-left px-3 py-2 rounded-md ${fontSize} font-bold transition-colors capitalize hover:bg-[#460F54]`}
        >
          {t(month.translationKey)}
        </button>
      ))}
    </div>
  );
};
