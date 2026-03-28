
import React, { useState, useEffect } from "react";
import { LucideIcon } from "lucide-react";
import { Section } from "./Section";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface ListGroup {
  title: string;
  items: string[];
}

interface MultiListSectionProps {
  icon: LucideIcon;
  title: string;
  listGroups: ListGroup[];
}

export function MultiListSection({ icon, title, listGroups }: MultiListSectionProps) {
  const [openItems, setOpenItems] = useState<string[]>([]);
  
  const toggleAccordionItem = (value: string) => {
    setOpenItems(prev => 
      prev.includes(value)
        ? prev.filter(item => item !== value)
        : [value]  // Now only keeps one item open at a time
    );
  };

  const formatText = (text: string, itemIndex: number) => {
    // Check if this paragraph is in all caps (or mostly caps)
    const isCapsParagraph = text.toUpperCase() === text && text.length > 2;
    
    // Apply bold formatting to CAPS text
    if (isCapsParagraph) {
      return <p key={itemIndex} className="text-white font-bold text-base">{text}</p>;
    }
    
    // Apply larger text size for all content in WHAT WE OFFER section
    return <p key={itemIndex} className="text-white text-base">{text}</p>;
  };

  return (
    <Section icon={icon} title={title}>
      <div className="space-y-6">
        <Accordion 
          type="single" 
          value={openItems.length > 0 ? openItems[0] : undefined}
          className="space-y-4"
          collapsible
        >
          {listGroups.map((group, index) => (
            <AccordionItem 
              key={index} 
              value={`group-${index}`}
              className="border-none bg-[#560365]/40 rounded-lg overflow-hidden"
            >
              <AccordionTrigger 
                className="px-4 py-3 text-white hover:no-underline"
                onClick={() => toggleAccordionItem(`group-${index}`)}
              >
                <span className="font-bold text-[#FFF9B0]">{group.title}</span>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 pt-2 text-white">
                <div className="space-y-3">
                  {group.items.map((item, itemIndex) => formatText(item, itemIndex))}
                </div>
                {/* Add extra space at the end */}
                <div className="h-2"></div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </Section>
  );
}
