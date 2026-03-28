import React from "react";
import { Tabs } from "@/components/ui/tabs";
import { useFaqSearch } from "./hooks/useFaqSearch";
import { SearchResults } from "./components/SearchResults";
import { NoResults } from "./components/NoResults";
import { FaqTabsList } from "./components/FaqTabsList";
import { FaqTabContent } from "./components/FaqTabContent";

export interface FaqItem {
  question: string;
  answer: string;
}
export interface FaqCategory {
  id: string;
  name: string;
}
interface FaqTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  faqCategories: FaqCategory[];
  faqsByCategory: Record<string, FaqItem[]>;
  numbered?: boolean;
  searchQuery?: string;
  className?: string;
  accentTextColor?: string;
  headerBgColor?: string;
  contentBgColor?: string;
  marginBottom?: string;
  textSizeClass?: string;
  answerTextSizeClass?: string;
  hideTabsList?: boolean;
}

export function FaqTabs({
  activeTab,
  setActiveTab,
  faqCategories,
  faqsByCategory,
  numbered = false,
  searchQuery = "",
  className = "",
  accentTextColor = "#56cc41",
  headerBgColor = "#6a037c",
  contentBgColor = "#5A0363",
  marginBottom = "mb-20",
  textSizeClass = "text-sm md:text-base",
  answerTextSizeClass = "text-sm md:text-base",
  hideTabsList = false
}: FaqTabsProps) {
  const {
    getFilteredFaqs,
    getAllSearchResults,
    hasSearchResults,
    categoryStartIndices
  } = useFaqSearch(searchQuery, faqCategories, faqsByCategory);

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className={`w-full ${marginBottom} ${className}`}>
      {!hideTabsList && !searchQuery && (
        <FaqTabsList faqCategories={faqCategories} />
      )}
      
      {!hasSearchResults && (
        <NoResults searchQuery={searchQuery} />
      )}
      
      {searchQuery ? (
        <SearchResults 
          searchResults={getAllSearchResults}
          faqCategories={faqCategories}
          categoryStartIndices={categoryStartIndices}
          numbered={numbered}
          textSizeClass={textSizeClass}
          answerTextSizeClass={answerTextSizeClass}
        />
      ) : (
        faqCategories.map(category => {
          const filteredFaqs = getFilteredFaqs(category.id);
          const startIndex = categoryStartIndices[category.id];
          return (
            <FaqTabContent
              key={category.id}
              category={category}
              filteredFaqs={filteredFaqs}
              startIndex={startIndex}
              numbered={numbered}
              textSizeClass={textSizeClass}
              answerTextSizeClass={answerTextSizeClass}
            />
          );
        })
      )}
    </Tabs>
  );
}
