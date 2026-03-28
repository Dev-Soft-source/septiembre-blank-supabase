
import React from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { CategoryFilterEN } from "./CategoryFilter.en";
import { CategoryFilterES } from "./CategoryFilter.es";
import { CategoryFilterPT } from "./CategoryFilter.pt";
import { CategoryFilterRO } from "./CategoryFilter.ro";

interface CategoryFilterProps {
  activeCategory: string | null;
  onChange: (value: string | null) => void;
}

export function CategoryFilter({ activeCategory, onChange }: CategoryFilterProps) {
  const { language } = useTranslation();
  
  if (language === 'en') return <CategoryFilterEN activeCategory={activeCategory} onChange={onChange} />;
  if (language === 'es') return <CategoryFilterES activeCategory={activeCategory} onChange={onChange} />;
  if (language === 'pt') return <CategoryFilterPT activeCategory={activeCategory} onChange={onChange} />;
  if (language === 'ro') return <CategoryFilterRO activeCategory={activeCategory} onChange={onChange} />;
  
  // Default fallback to English
  return <CategoryFilterEN activeCategory={activeCategory} onChange={onChange} />;
}
