
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useIsMobile } from "@/hooks/use-mobile";
import { BenefitsTravelersList } from "@/components/faq/BenefitsTravelersList";
import { FaqTabs } from "@/components/faq/FaqTabs";
import { FaqSearch } from "@/components/faq/FaqSearch";
import { useFaqData } from "@/components/faq/faqData";
import { benefitsTravelersList } from "@/components/faq/faqTravelersData";
import { useTranslation } from "@/hooks/useTranslation";

export default function FAQTravelers() {
  const [activeTab, setActiveTab] = useState("general");
  const [searchQuery, setSearchQuery] = useState("");
  const isMobile = useIsMobile();
  const { t } = useTranslation();
  const { translatedCategories, translatedFaqsByCategory } = useFaqData();
  
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col faq-page">
      <Navbar />
      
      <main className="flex-1 pt-16">
        <div className="container max-w-4xl mx-auto px-4 py-6"> {/* Reduced padding */}
          <div className="mb-32">
            <BenefitsTravelersList benefits={benefitsTravelersList} />
          </div>

          <div className="text-center mb-32 pt-32"> {/* Added substantial top padding for double distance */}
            <h1 className={`
              ${isMobile ? "text-4xl" : "text-3xl md:text-4xl"} 
              font-bold mb-4 text-gradient text-[#eedbf7] glow 
              animate-text-slow tracking-tight leading-tight
            `}> {/* Reduced heading size */}
              {t('faq.title')}
            </h1>
            <p className={`${isMobile ? "text-xl" : "text-base"} font-medium text-[#e3d6e9] mb-6`}> {/* Reduced text size */}
              {t('faq.subtitle')}
            </p>
            
            <FaqSearch 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              placeholder={t('faq.search')}
            />
          </div>

          <div className="w-3/5 mx-auto relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/30 via-fuchsia-400/30 to-purple-500/30 rounded-3xl blur-xl"></div>
            <div className="relative bg-gradient-to-br from-purple-900/40 via-purple-800/30 to-fuchsia-900/40 backdrop-blur-xl rounded-3xl border border-purple-300/40 p-8 shadow-2xl shadow-purple-400/30 glow-effect">
              <FaqTabs 
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                faqCategories={translatedCategories}
                faqsByCategory={translatedFaqsByCategory}
                numbered={true}
                searchQuery={searchQuery}
                accentTextColor="#4db74d"
                headerBgColor="#71037c"
                marginBottom=""
                textSizeClass="text-sm md:text-base" // Reduced text size
                answerTextSizeClass="text-xs md:text-sm" // Reduced answer text size
              />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
