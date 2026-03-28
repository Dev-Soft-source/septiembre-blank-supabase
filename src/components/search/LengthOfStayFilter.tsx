
import React from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { LengthOfStayFilterEN } from "./LengthOfStayFilter.en";
import { LengthOfStayFilterES } from "./LengthOfStayFilter.es";
import { LengthOfStayFilterPT } from "./LengthOfStayFilter.pt";
import { LengthOfStayFilterRO } from "./LengthOfStayFilter.ro";

interface LengthOfStayFilterProps {
  activeLength: string | null;
  onChange: (value: string | null) => void; // Updated to match the actual usage
}

export function LengthOfStayFilter({ activeLength, onChange }: LengthOfStayFilterProps) {
  const { language } = useTranslation();
  
  if (language === 'en') return <LengthOfStayFilterEN activeLength={activeLength} onChange={onChange} />;
  if (language === 'es') return <LengthOfStayFilterES activeLength={activeLength} onChange={onChange} />;
  if (language === 'pt') return <LengthOfStayFilterPT activeLength={activeLength} onChange={onChange} />;
  if (language === 'ro') return <LengthOfStayFilterRO activeLength={activeLength} onChange={onChange} />;
  
  // Default fallback to English
  return <LengthOfStayFilterEN activeLength={activeLength} onChange={onChange} />;
}
