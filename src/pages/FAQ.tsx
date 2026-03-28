import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useIsMobile } from "@/hooks/use-mobile";
import { FaqTabs } from "@/components/faq/FaqTabs";
import { FaqSearch } from "@/components/faq/FaqSearch";
import { useFaqData } from "@/components/faq/faqData";
import { HotelStarfield } from "@/components/hotels/HotelStarfield";
import { WhyHotelLivingSection } from "@/components/faq/WhyHotelLivingSection";
import { useTranslation } from "@/hooks/useTranslation";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
export default function FAQ() {
  const [activeTab, setActiveTab] = useState("general");
  const [searchQuery, setSearchQuery] = useState("");
  const isMobile = useIsMobile();
  const {
    t,
    isReady
  } = useTranslation('faq');
  const {
    translatedCategories,
    translatedFaqsByCategory
  } = useFaqData();

  // Initialize smooth scroll behavior
  useSmoothScroll();

  // Show loading until i18n is ready
  if (!isReady) {
    return <div className="min-h-screen flex flex-col relative">
        <HotelStarfield />
        <Navbar />
        <main className="flex-1 pt-16 flex items-center justify-center">
          <div className="text-white text-lg">Loading translations...</div>
        </main>
        <Footer />
      </div>;
  }
  return <div className="min-h-screen flex flex-col relative">
      <HotelStarfield />
      <Navbar />
      
      <main className="flex-1 pt-16 bg-gradient-to-b from-[#570366]/40 to-transparent" role="main" aria-label="Frequently Asked Questions">
        <div className="container max-w-5xl mx-auto px-4 py-6">
          <WhyHotelLivingSection />
          
          {/* Second title - Frequently Asked Questions */}
          <div className="text-center mb-6 smooth-scroll-target" id="faq-section">
            <div className="flex justify-center">
              
            </div>
            
            
            <FaqSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} placeholder={t('search')} />
          </div>


          <FaqTabs activeTab={activeTab} setActiveTab={setActiveTab} faqCategories={translatedCategories} faqsByCategory={translatedFaqsByCategory} numbered={true} searchQuery={searchQuery} textSizeClass="text-base md:text-lg" answerTextSizeClass="text-sm md:text-base" marginBottom={isMobile ? "mb-10" : "mb-20"} />
        </div>
      </main>
      
      <Footer />
    </div>;
}