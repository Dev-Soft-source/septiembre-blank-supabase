import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useTranslation } from "react-i18next";

export function AssociationAccordion() {
  const { t } = useTranslation("association");

  const advantagesItems = t("accordion.advantages.items", { returnObjects: true }) as string[];
  const clientsItems = t("accordion.clients.items", { returnObjects: true }) as string[];
  const clientsConclusion = t("accordion.clients.conclusion", { returnObjects: true }) as string[];

  return (
    <div className="bg-[#7802A9] backdrop-blur-md rounded-2xl p-8 md:p-12 border border-blue-400/30 shadow-[0_0_60px_rgba(59,130,246,0.4)] max-w-4xl mx-auto">
      <div className="mx-auto">
        <Accordion type="single" collapsible className="space-y-4">
          
          <AccordionItem value="advantages">
            <AccordionTrigger className="text-left text-2xl font-bold text-yellow-300 uppercase hover:text-yellow-200">
              {t("accordion.advantages.title")}
            </AccordionTrigger>
            <AccordionContent className="text-white text-lg leading-relaxed pt-4 text-left">
              <div className="space-y-2">
                {advantagesItems.map((item, index) => (
                  <div key={index}>✅ {item}</div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="clients">
            <AccordionTrigger className="text-left text-2xl font-bold text-yellow-300 uppercase hover:text-yellow-200">
              {t("accordion.clients.title")}
            </AccordionTrigger>
            <AccordionContent className="text-white text-lg leading-relaxed pt-4 text-left">
              <div className="space-y-2">
                {clientsItems.map((item, index) => (
                  <div key={index}>✅ {item}</div>
                ))}
                <div className="mt-4 space-y-1">
                  {clientsConclusion.map((text, index) => (
                    <div key={index}>{text}</div>
                  ))}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

        </Accordion>
      </div>
    </div>
  );
}