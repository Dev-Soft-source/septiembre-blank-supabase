
import React from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { MonthFilterEN } from "./MonthFilter.en";
import { MonthFilterES } from "./MonthFilter.es";
import { MonthFilterPT } from "./MonthFilter.pt";
import { MonthFilterRO } from "./MonthFilter.ro";

interface MonthFilterProps {
  activeMonth: string | null;
  onChange: (value: string | null) => void;
}

export function MonthFilter({ activeMonth, onChange }: MonthFilterProps) {
  const { language } = useTranslation();
  
  if (language === 'en') return <MonthFilterEN activeMonth={activeMonth} onChange={onChange} />;
  if (language === 'es') return <MonthFilterES activeMonth={activeMonth} onChange={onChange} />;
  if (language === 'pt') return <MonthFilterPT activeMonth={activeMonth} onChange={onChange} />;
  if (language === 'ro') return <MonthFilterRO activeMonth={activeMonth} onChange={onChange} />;
  
  // Default fallback to English
  return <MonthFilterEN activeMonth={activeMonth} onChange={onChange} />;
}
