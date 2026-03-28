
import React from "react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { FaqItem, FaqCategory } from "../types";

interface SearchResultsProps {
  searchResults: Record<string, FaqItem[]>;
  faqCategories: FaqCategory[];
  categoryStartIndices: Record<string, number>;
  numbered: boolean;
  textSizeClass: string;
  answerTextSizeClass: string;
}

export function SearchResults({ 
  searchResults, 
  faqCategories, 
  categoryStartIndices, 
  numbered, 
  textSizeClass, 
  answerTextSizeClass 
}: SearchResultsProps) {
  return (
    <div className="animate-fade-in">
      {Object.entries(searchResults).map(([categoryId, faqs]) => {
        const category = faqCategories.find(cat => cat.id === categoryId);
        if (!faqs.length) return null;
        
        return (
          <div key={categoryId} className="mb-6">
            <div className="mb-2">
              <h3 className="text-[#FFF9B0] text-sm font-medium border-b border-[#FFF9B0]/30 pb-1">
                Results in {category?.name || categoryId}
              </h3>
            </div>
            <Accordion type="single" collapsible className="w-full space-y-3">
              {faqs.map((faq, index) => {
                const startIndex = categoryStartIndices[categoryId] || 1;
                const questionNumber = startIndex + index;
                return (
                  <AccordionItem key={index} value={`search-${categoryId}-${index}`} className="overflow-hidden border-none shadow-xl">
                    <AccordionTrigger className="px-6 py-4 text-left hover:no-underline bg-[#996515] rounded-t-xl border-l-6 border-[#FFF9B0] hover:bg-[#996515]/80 transition-all duration-300">
                      <div className={`text-[#FFF9B0] font-bold ${textSizeClass}`}>
                        {numbered ? `${questionNumber}. ` : ''}{faq.question}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 py-4 bg-[#560365]/90 backdrop-blur-md rounded-b-xl border-l-6 border-[#FFF9B0]/50">
                      <p className={`text-[#FFF9B0] ${answerTextSizeClass} leading-relaxed`}>
                        {faq.answer}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>
        );
      })}
    </div>
  );
}
