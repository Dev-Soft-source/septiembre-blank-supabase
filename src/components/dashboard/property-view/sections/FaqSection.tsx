
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

interface FaqSectionProps {
  hotel: any;
}

export function FaqSection({ hotel }: FaqSectionProps) {
  const faqs = hotel.faqs || [];
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());
  
  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <Card className="p-6 bg-[#7204B8]">
      <h3 className="text-base font-semibold mb-4 border-b pb-2 border-purple-700">FAQ</h3>
      
      {faqs && faqs.length > 0 ? (
        <div className="space-y-4">
          {faqs.map((faq: any, index: number) => (
            <Collapsible 
              key={index} 
              open={openItems.has(index)} 
              onOpenChange={() => toggleItem(index)}
            >
              <div className="border border-purple-700/30 rounded-lg bg-purple-900/20">
                <CollapsibleTrigger className="w-full p-4 text-left flex items-center justify-between hover:bg-purple-800/20 transition-colors">
                  <h4 className="font-medium text-purple-300">{faq.question}</h4>
                  <ChevronDown 
                    className={`h-4 w-4 text-purple-300 transition-transform ${
                      openItems.has(index) ? 'rotate-180' : 'rotate-0'
                    }`} 
                  />
                </CollapsibleTrigger>
                <CollapsibleContent className="px-4 pb-4">
                  <p className="text-white">{faq.answer}</p>
                </CollapsibleContent>
              </div>
            </Collapsible>
          ))}
        </div>
      ) : (
        <p className="text-gray-400">No FAQ items specified for this hotel.</p>
      )}
    </Card>
  );
}
