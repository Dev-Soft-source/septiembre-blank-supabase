import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { useIsMobile } from "@/hooks/use-mobile";
import { FaqItem, FaqCategory } from "../types";
interface FaqTabContentProps {
  category: FaqCategory;
  filteredFaqs: FaqItem[];
  startIndex: number;
  numbered: boolean;
  textSizeClass: string;
  answerTextSizeClass: string;
}
export function FaqTabContent({
  category,
  filteredFaqs,
  startIndex,
  numbered,
  textSizeClass,
  answerTextSizeClass
}: FaqTabContentProps) {
  const isMobile = useIsMobile();
  return <TabsContent key={category.id} value={category.id} className={`customer-text animate-fade-in ${isMobile ? "mt-6" : "mt-4"}`}>
      {filteredFaqs.length > 0 ? <Accordion type="multiple" className="faq-questions-list w-full space-y-5 my-0">
          {filteredFaqs.map((faq, index) => {
        const questionNumber = startIndex + index;
        return <AccordionItem key={index} value={`${category.id}-${index}`} className="overflow-hidden border-none shadow-2xl hover:shadow-purple-500/30 transition-all duration-500 group">
                <AccordionTrigger className="text-left hover:no-underline bg-gradient-to-r from-violet-800 via-purple-800 to-sky-400 rounded-xl border border-[#9861FF] hover:border-violet-200/70 hover:from-violet-700 hover:to-sky-300 transition-all duration-300 font-bold shadow-lg hover:shadow-violet-400/40 hover:scale-[1.02] glow-effect py-4 px-[10px] my-0 mx-0">
                  <div className={`text-white font-normal text-[14.56px] drop-shadow-sm`}>
                    {numbered ? `${questionNumber}. ` : ''}{faq.question}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 py-5 bg-[#6804A3] backdrop-blur-sm rounded-b-xl border border-[#9861FF] shadow-inner glow-effect">
                  <p className={`text-purple-50 ${answerTextSizeClass} leading-relaxed drop-shadow-sm`}>
                    {faq.answer}
                  </p>
                </AccordionContent>
              </AccordionItem>;
      })}
        </Accordion> : null}
    </TabsContent>;
}