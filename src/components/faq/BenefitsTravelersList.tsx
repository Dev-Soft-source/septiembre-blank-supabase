
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

interface BenefitsTravelersListProps {
  benefits: string[];
}

export function BenefitsTravelersList({ benefits }: BenefitsTravelersListProps) {
  const isMobile = useIsMobile();

  return (
    <div className="glass-card backdrop-blur-lg bg-fuchsia-950/30 border border-fuchsia-500/20 rounded-xl p-8 mb-16 shadow-lg">
      <h2 className={`${isMobile ? "text-3xl mb-8" : "text-2xl md:text-3xl mb-10"} font-bold text-center text-gradient animate-text-slow`}>
        Why Choose Hotel-Living?
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Accordion type="single" collapsible className="w-full">
          {benefits.slice(0, Math.ceil(benefits.length/2)).map((benefit, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="border-b border-fuchsia-400/20 hover:bg-fuchsia-900/20 transition-colors duration-300"
            >
              <AccordionTrigger 
                className="py-3 group"
                titleClassName={`${isMobile ? "text-base font-semibold" : "text-sm md:text-base"} text-left text-[#FFF600] group-hover:text-[#FFC500] transition-colors duration-300`}
              >
                {benefit}
              </AccordionTrigger>
              <AccordionContent className="text-[#e3d6e9] text-sm py-3">
                Discover how Hotel-Living can transform your lifestyle and provide unparalleled convenience and experiences.
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        
        <Accordion type="single" collapsible className="w-full">
          {benefits.slice(Math.ceil(benefits.length/2)).map((benefit, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index + Math.ceil(benefits.length/2)}`}
              className="border-b border-fuchsia-400/20 hover:bg-fuchsia-900/20 transition-colors duration-300"
            >
              <AccordionTrigger 
                className="py-3 group"
                titleClassName={`${isMobile ? "text-base font-semibold" : "text-sm md:text-base"} text-left text-[#FFF600] group-hover:text-[#FFC500] transition-colors duration-300`}
              >
                {benefit}
              </AccordionTrigger>
              <AccordionContent className="text-[#e3d6e9] text-sm py-3">
                Explore how our innovative approach can redefine your living experience.
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
