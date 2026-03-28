
import React from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { FaqTabsListEN } from "./FaqTabsList.en";
import { FaqTabsListES } from "./FaqTabsList.es";
import { FaqTabsListPT } from "./FaqTabsList.pt";
import { FaqTabsListRO } from "./FaqTabsList.ro";
import { FaqCategory } from "../types";

interface FaqTabsListProps {
  faqCategories: FaqCategory[];
}

export function FaqTabsList({ faqCategories }: FaqTabsListProps) {
  const { language } = useTranslation();
  
  if (language === 'en') return <FaqTabsListEN faqCategories={faqCategories} />;
  if (language === 'es') return <FaqTabsListES faqCategories={faqCategories} />;
  if (language === 'pt') return <FaqTabsListPT faqCategories={faqCategories} />;
  if (language === 'ro') return <FaqTabsListRO faqCategories={faqCategories} />;
  
  // Default fallback to English
  return <FaqTabsListEN faqCategories={faqCategories} />;
}
