import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FaqCategory } from "../types";
import { useIsMobile } from "@/hooks/use-mobile";

interface FaqTabsListROProps {
  faqCategories: FaqCategory[];
}

export function FaqTabsListRO({ faqCategories }: FaqTabsListROProps) {
  const isMobile = useIsMobile();
  
  if (isMobile) {
    return (
      <div className="flex justify-center mb-12 mt-8">
        <div className="w-[85%]">
          <TabsList className="faq-block bg-[#7E26A6] rounded-md flex flex-col p-0 h-auto gap-0">
            {/* Mobile: Row 1 - First 3 tabs */}
            <div className="faq-row flex w-full">
              <TabsTrigger 
                value="general" 
                className="faq-item flex-1 text-center py-3 px-2 text-white text-[110.5%] font-bold uppercase hover:bg-[#9A40C0] transition-colors duration-200 data-[state=active]:bg-[#9A40C0] rounded-none border-0"
                style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}
              >
                GENERAL
              </TabsTrigger>
              <div className="w-[1px] bg-white"></div>
              <TabsTrigger 
                value="booking" 
                className="faq-item flex-1 text-center py-3 px-2 text-white text-[110.5%] font-bold uppercase hover:bg-[#9A40C0] transition-colors duration-200 data-[state=active]:bg-[#9A40C0] rounded-none border-0"
                style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}
              >
                REZERVĂRI
              </TabsTrigger>
              <div className="w-[1px] bg-white"></div>
              <TabsTrigger 
                value="stay" 
                className="faq-item flex-1 text-center py-3 px-2 text-white text-[110.5%] font-bold uppercase hover:bg-[#9A40C0] transition-colors duration-200 data-[state=active]:bg-[#9A40C0] rounded-none border-0"
                style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}
              >
                ȘEDERE
              </TabsTrigger>
            </div>
            
            {/* Mobile: Row 2 - Next 3 tabs */}
            <div className="faq-row flex w-full">
              <TabsTrigger 
                value="payment" 
                className="faq-item flex-1 text-center py-3 px-2 text-white text-[110.5%] font-bold uppercase hover:bg-[#9A40C0] transition-colors duration-200 data-[state=active]:bg-[#9A40C0] rounded-none border-0"
                style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}
              >
                PLATĂ
              </TabsTrigger>
              <div className="w-[1px] bg-white"></div>
              <TabsTrigger 
                value="themes" 
                className="faq-item flex-1 text-center py-3 px-2 text-white text-[110.5%] font-bold uppercase hover:bg-[#9A40C0] transition-colors duration-200 data-[state=active]:bg-[#9A40C0] rounded-none border-0"
                style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}
              >
                AFINITĂȚI?
              </TabsTrigger>
              <div className="w-[1px] bg-white"></div>
              <TabsTrigger 
                value="lifestyle" 
                className="faq-item flex-1 text-center py-3 px-2 text-white text-[110.5%] font-bold uppercase hover:bg-[#9A40C0] transition-colors duration-200 data-[state=active]:bg-[#9A40C0] rounded-none border-0"
                style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}
              >
                NOMAZI
              </TabsTrigger>
            </div>
            
            {/* Mobile: Row 3 - Last 3 tabs */}
            <div className="faq-row flex w-full">
              <TabsTrigger 
                value="senior" 
                className="faq-item flex-1 text-center py-3 px-2 text-white text-[110.5%] font-bold uppercase hover:bg-[#9A40C0] transition-colors duration-200 data-[state=active]:bg-[#9A40C0] rounded-none border-0"
                style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}
              >
                SENIOR?
              </TabsTrigger>
              <div className="w-[1px] bg-white"></div>
              <TabsTrigger 
                value="community" 
                className="faq-item flex-1 text-center py-3 px-2 text-white text-[110.5%] font-bold uppercase hover:bg-[#9A40C0] transition-colors duration-200 data-[state=active]:bg-[#9A40C0] rounded-none border-0"
                style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}
              >
                COMUNITATE?
              </TabsTrigger>
              <div className="w-[1px] bg-white"></div>
              <TabsTrigger 
                value="practical" 
                className="faq-item flex-1 text-center py-3 px-2 text-white text-[110.5%] font-bold uppercase hover:bg-[#9A40C0] transition-colors duration-200 data-[state=active]:bg-[#9A40C0] rounded-none border-0"
                style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}
              >
                PRACTICE
              </TabsTrigger>
            </div>
          </TabsList>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center mb-12 mt-8">
      <div className="w-full max-w-5xl">
        <TabsList className="flex flex-col gap-2 mb-8 p-3 bg-transparent border-0 shadow-none">
          {/* Row 1: First 5 tabs */}
          <div className="flex justify-center gap-3 w-full">
            {faqCategories.slice(0, 5).map((category) => {
              // Add line breaks for long category names
              let displayName = category.name;
              if (category.name === "În timpul șederii") {
                displayName = "ÎN TIMPUL\nȘEDERII";
              } else if (category.name === "Nomazi Digitali?") {
                displayName = "NOMAZI\nDIGITALI";
              } else if (category.name === "Detalii Practice?") {
                displayName = "DETALII\nPRACTICE";
              }
              
              return (
                <TabsTrigger 
                  key={category.id}
                  value={category.id} 
                  className="flex-1 max-w-[180px] h-[40px] px-4 py-3 text-[13px] uppercase text-center bg-purple-800 data-[state=active]:bg-purple-900 data-[state=active]:text-white text-white hover:bg-purple-700 hover:text-white transition-all duration-200 rounded-xl font-bold tracking-wide backdrop-blur-sm border border-purple-600"
                  style={{ whiteSpace: 'normal', wordWrap: 'break-word', textAlign: 'center' }}
                >
                  {displayName}
                </TabsTrigger>
              );
            })}
          </div>
          
          {/* Row 2: Last 4 tabs */}
          <div className="flex justify-center gap-3 w-full">
            {faqCategories.slice(5).map((category) => {
              // Add line breaks for long category names
              let displayName = category.name;
              if (category.name === "În timpul șederii") {
                displayName = "ÎN TIMPUL\nȘEDERII";
              } else if (category.name === "Nomazi Digitali?") {
                displayName = "NOMAZI\nDIGITALI";
              } else if (category.name === "Detalii Practice?") {
                displayName = "DETALII\nPRACTICE";
              }
              
              return (
                <TabsTrigger 
                  key={category.id}
                  value={category.id} 
                  className="flex-1 max-w-[180px] h-[40px] px-4 py-3 text-[13px] uppercase text-center bg-purple-800 data-[state=active]:bg-purple-900 data-[state=active]:text-white text-white hover:bg-purple-700 hover:text-white transition-all duration-200 rounded-xl font-bold tracking-wide backdrop-blur-sm border border-purple-600"
                  style={{ whiteSpace: 'normal', wordWrap: 'break-word', textAlign: 'center' }}
                >
                  {displayName}
                </TabsTrigger>
              );
            })}
          </div>
        </TabsList>
      </div>
    </div>
  );
}