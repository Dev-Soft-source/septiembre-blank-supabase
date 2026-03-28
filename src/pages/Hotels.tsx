import React from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HotelSlogans, HotelTitle } from "@/components/hotels/HotelSlogans";
import { HotelNewAccordionMenu } from "@/components/hotels/HotelNewAccordionMenu";
import { FaqTabs } from "@/components/faq/FaqTabs";
import { useHotelFaqCategories, useHotelFaqsByCategory } from "@/components/faq/hotelFaqData";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link, useNavigate } from "react-router-dom";
import { Building, Mail } from "lucide-react";
import { HotelStarfield } from "@/components/hotels/HotelStarfield";
import { HotelCards } from "@/components/hotels/HotelCards";
import { HotelFeatures } from "@/components/hotels/HotelFeatures";
import { HotelVideoPlayer } from "@/components/hotels/HotelVideoPlayer";
import { useTranslation } from "@/hooks/useTranslation";

import { PageTransitionBar } from "@/components/layout/PageTransitionBar";
import { ConnectionIndicator } from "@/components/ui/connection-indicator";
import { HotelRevenueCalculator } from "@/components/hotels/HotelRevenueCalculator";
import { HotelBanner } from "@/components/hotels/HotelBanner";
import { HotelDiagram } from "@/components/hotels/HotelDiagram";
import { HotelInfographics } from "@/components/hotels/HotelInfographics";
const orderedCategoryIds = ["benefits", "models", "revenue", "guests", "seniors", "affinities", "operation", "integration", "marketing", "payment"];
const HotelSignupButtons = ({
  isMobile
}: {
  isMobile: boolean;
}) => {
  const {
    t
  } = useTranslation();
  return <div className="mt-6 border-t-2 border-fuchsia-400/30 pt-4">
      
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        
        
      </div>
    </div>;
};
export default function Hotels() {
  const [activeTab, setActiveTab] = React.useState("benefits");
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const {
    t,
    language
  } = useTranslation('faq');
  const hotelFaqCategories = useHotelFaqCategories();
  const hotelFaqsByCategory = useHotelFaqsByCategory();
  const orderedFaqCategories = React.useMemo(() => orderedCategoryIds.map(id => hotelFaqCategories.find(cat => cat.id === id)).filter(Boolean) as typeof hotelFaqCategories, [hotelFaqCategories]);
  return <div className="min-h-screen flex flex-col relative overflow-hidden">
      <PageTransitionBar />
      <HotelStarfield />
      <Navbar />
      
      <main className="flex-1 pt-8 relative z-10">
        <div className="container mx-auto px-2 sm:px-4 py-3 flex flex-col items-center">
          {/* Hotel Banner - positioned below navbar and above title */}
          <HotelBanner />
          
          {/* Hotel Title */}
          <div className="animate-fade-in w-full">
            <HotelTitle />
          </div>
          
          {/* Hotel Diagram - positioned right after title */}
          <div className="animate-fade-in w-full" style={{
            animationDelay: '0.05s',
            animationFillMode: 'both'
          }}>
            <HotelDiagram />
          </div>
          
          {/* Hotel Revenue Calculator - positioned after diagram */}
          <div className="animate-fade-in mt-6" style={{
          animationDelay: '0.1s',
          animationFillMode: 'both'
        }}>
            <HotelRevenueCalculator />
          </div>
          
          {/* Hotel Slogans - positioned after calculator */}
          <div className="animate-fade-in w-full mt-6" style={{
          animationDelay: '0.2s',
          animationFillMode: 'both'
        }}>
            <HotelSlogans />
          </div>
          
          {/* Professional Study Text Link */}
          <div className="my-8 flex justify-center px-4">
            <Link to="/professional-study" className="text-white text-lg font-medium text-center hover:text-fuchsia-300 transition-all duration-300 animate-fade-in hover:scale-105 cursor-pointer whitespace-pre-line">
              {t('hotels:professionalStudy')}
            </Link>
          </div>
          
          {/* Hotel Infographics - positioned after Professional Study */}
          <div className="animate-fade-in" style={{
            animationDelay: '0.3s',
            animationFillMode: 'both'
          }}>
            <HotelInfographics />
          </div>
          
          {/* New accordion menu */}
          <div style={{
          animationDelay: '0.4s',
          animationFillMode: 'both'
        }} className="animate-fade-in mx-0 px-0">
            <HotelNewAccordionMenu />
          </div>
          
          <div className="w-full max-w-4xl mt-10 animate-fade-in px-2 sm:px-0" style={{
          animationDelay: '0.6s',
          animationFillMode: 'both'
        }}>
            <div className="glass-card rounded-lg overflow-hidden border-none p-2 sm:p-4 mb-10 bg-[#5f0276] transition-all duration-300 hover:shadow-lg hover:shadow-fuchsia-500/20">
              {/* Blue glow wrapper for FAQ title */}
              <div className="relative group w-fit mx-auto mb-4 sm:mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-2xl blur-xl opacity-85 group-hover:opacity-100 transition-opacity duration-300"></div>
                <h2 className="relative text-lg sm:text-2xl md:text-3xl font-bold text-center text-[#f9d3f6] px-2 sm:px-4 py-2">{t('title')}</h2>
              </div>
              
              {/* Blue glow wrapper for FAQ tabs */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-2xl blur-xl opacity-85 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <FaqTabs activeTab={activeTab} setActiveTab={setActiveTab} faqCategories={orderedFaqCategories} faqsByCategory={hotelFaqsByCategory} numbered={true} searchQuery="" accentTextColor="#4db74d" headerBgColor="#71037c" marginBottom="" textSizeClass="text-sm sm:text-base md:text-lg" answerTextSizeClass="text-xs sm:text-sm md:text-base" hideTabsList={false} />
                </div>
              </div>
              
              {/* Portrait of the Hotel Crisis Link */}
              <div className="mt-6 flex justify-center">
                <Link to="/hotel-crisis" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white font-medium rounded-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-fuchsia-500/30">
                  📊 {t('hotels:linkText')}
                </Link>
              </div>
              
              <HotelSignupButtons isMobile={isMobile} />
            </div>
          </div>
          
          <div className="animate-fade-in" style={{
          animationDelay: '0.8s',
          animationFillMode: 'both'
        }}>
            <HotelCards />
          </div>
          
          <div className="animate-fade-in" style={{
          animationDelay: '1s',
          animationFillMode: 'both'
        }}>
            <HotelFeatures />
          </div>
          
          <div className="w-full max-w-2xl mt-16 mb-12 animate-fade-in" style={{
          animationDelay: '1.2s',
          animationFillMode: 'both'
        }}>
            <HotelVideoPlayer />
          </div>
        </div>
      </main>
      
      <Footer />
      
      
      {/* Connection Status Indicator */}
      <ConnectionIndicator />
    </div>;
}