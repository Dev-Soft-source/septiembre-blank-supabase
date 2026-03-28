
import { useMemo } from "react";
import { FaqItem, FaqCategory } from "../types";

export function useFaqSearch(
  searchQuery: string,
  faqCategories: FaqCategory[],
  faqsByCategory: Record<string, FaqItem[]>
) {
  const getFilteredFaqs = (categoryId: string) => {
    if (!searchQuery) return faqsByCategory[categoryId as keyof typeof faqsByCategory] || [];
    return (faqsByCategory[categoryId as keyof typeof faqsByCategory] || []).filter(faq => 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const getAllSearchResults = useMemo(() => {
    if (!searchQuery) return {};
    const results: Record<string, FaqItem[]> = {};
    faqCategories.forEach(category => {
      const filteredFaqs = getFilteredFaqs(category.id);
      if (filteredFaqs.length > 0) {
        results[category.id] = filteredFaqs;
      }
    });
    return results;
  }, [faqCategories, faqsByCategory, searchQuery]);

  const hasSearchResults = searchQuery ? Object.values(getAllSearchResults).some(results => results.length > 0) : true;

  const categoryStartIndices = useMemo(() => {
    const indices: Record<string, number> = {};
    let currentIndex = 1;
    for (const category of faqCategories) {
      indices[category.id] = currentIndex;
      if (!searchQuery) {
        currentIndex += (faqsByCategory[category.id] || []).length;
      }
    }
    return indices;
  }, [faqCategories, faqsByCategory, searchQuery]);

  return {
    getFilteredFaqs,
    getAllSearchResults,
    hasSearchResults,
    categoryStartIndices
  };
}
