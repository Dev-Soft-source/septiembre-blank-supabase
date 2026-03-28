import React from "react";
import { Container } from "@/components/ui/container";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useTranslation } from "@/hooks/useTranslation";
export const QuickGuideContent = () => {
  const {
    t
  } = useTranslation("dashboard");
  const sections = [{
    id: "section1",
    number: "1️⃣",
    color: "blue"
  }, {
    id: "section2",
    number: "2️⃣",
    color: "green"
  }, {
    id: "section3",
    number: "3️⃣",
    color: "yellow"
  }, {
    id: "section4",
    number: "4️⃣",
    color: "purple"
  }, {
    id: "section5",
    number: "5️⃣",
    color: "red"
  }, {
    id: "section6",
    number: "6️⃣",
    color: "cyan"
  }, {
    id: "section7",
    number: "7️⃣",
    color: "orange"
  }];
  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: "bg-blue-500/20 text-blue-400",
      green: "bg-green-500/20 text-green-400",
      yellow: "bg-yellow-500/20 text-yellow-400",
      purple: "bg-purple-500/20 text-purple-400",
      red: "bg-red-500/20 text-red-400",
      cyan: "bg-cyan-500/20 text-cyan-400",
      orange: "bg-orange-500/20 text-orange-400"
    };
    return colorMap[color as keyof typeof colorMap] || "bg-gray-500/20 text-gray-400";
  };
  return <Container className="p-6">
      <div className="glass-card rounded-xl p-8 bg-white/5 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          
          
          <Accordion type="single" collapsible className="w-full space-y-3">
            {sections.map(section => <AccordionItem key={section.id} value={section.id} className="border border-white/10 rounded-lg bg-white/5 backdrop-blur-sm">
                <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-white/5 rounded-t-lg">
                  <div className="flex items-center text-white font-medium text-sm">
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${getColorClasses(section.color)} font-bold text-xs mr-3`}>
                      {section.number}
                    </span>
                    <span className="text-left text-sm">
                      {t(`guide.${section.id}.title`)}
                    </span>
                  </div>
                </AccordionTrigger>
                
                <AccordionContent className="px-6 pb-6">
                  <div className="pl-12">
                    <ul className="list-disc space-y-2 text-sm text-white/80 leading-relaxed">
                      {(() => {
                    // Get content for this section
                    const contentKey = `guide.${section.id}.content`;
                    const content = t(contentKey, {
                      returnObjects: true
                    });

                    // Handle both array and string content
                    let contentArray: string[] = [];
                    if (Array.isArray(content)) {
                      contentArray = content.filter((item): item is string => typeof item === 'string');
                    } else if (typeof content === 'string') {
                      contentArray = [content];
                    } else {
                      // Fallback if translation fails
                      contentArray = [`Translation missing for ${contentKey}`];
                    }
                    return contentArray.map((item: string, index: number) => <li key={index} className="ml-4 text-sm">
                            {item.startsWith("TIP:") ? <span>
                                <strong className="text-yellow-400">TIP:</strong>
                                <span className="ml-1">{item.substring(4)}</span>
                              </span> : item}
                          </li>);
                  })()}
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>)}
          </Accordion>
        </div>
      </div>
    </Container>;
};