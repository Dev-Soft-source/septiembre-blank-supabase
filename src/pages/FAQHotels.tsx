
import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Building, Mail } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { FaqSearch } from "@/components/faq/FaqSearch";
import { FaqTabs } from "@/components/faq/FaqTabs";
import { HotelVideoPlayer } from "@/components/hotels/HotelVideoPlayer";
import { useHotelFaqCategories, useHotelFaqsByCategory } from "@/components/faq/hotelFaqData";
import { useTranslation } from "@/hooks/useTranslation";

const HotelSignupButtons = ({ isMobile }: { isMobile: boolean }) => (
  <div className="mt-6 border-t-2 border-fuchsia-400/30 pt-4">
    <h3 className={`text-[#f9d3f6] ${isMobile ? "text-lg" : "text-base"} font-semibold mb-3 text-center`}>
      ¿Listo para unirse a Hotel-Living?
    </h3>
    <div className="flex flex-col sm:flex-row gap-3 justify-center">
      <Link to="/hotel-signup" className={`bg-[#981DA1] hover:bg-[#460F54] text-white font-bold py-1.5 px-4 rounded-lg transition-colors flex items-center justify-center ${isMobile ? "text-base" : "text-sm"}`}>
        <Building className="mr-2 h-4 w-4" />
        Registre su hotel
      </Link>
      <Link to="/login?tab=hotel" className={`bg-fuchsia-700 hover:bg-fuchsia-800 text-white font-bold py-1.5 px-4 rounded-lg transition-colors flex items-center justify-center ${isMobile ? "text-base" : "text-sm"}`}>
        <Mail className="mr-2 h-4 w-4" />
        Acceso para socios
      </Link>
    </div>
  </div>
);

const orderedCategoryIds = [
  "video", "benefits", "models", "revenue", "guests", "seniors", 
  "affinities", "operation", "integration", "marketing", "payment", 
  "steps", "rental"
];

export default function FAQHotels() {
  const [activeTab, setActiveTab] = useState("video");
  const [searchQuery, setSearchQuery] = useState("");
  const isMobile = useIsMobile();
  const { t } = useTranslation();
  
  const hotelFaqCategories = useHotelFaqCategories();
  const hotelFaqsByCategory = useHotelFaqsByCategory();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const orderedFaqCategories = useMemo(() => 
    orderedCategoryIds.map(id => 
      hotelFaqCategories.find(cat => cat.id === id)
    ).filter(Boolean) as typeof hotelFaqCategories,
  [hotelFaqCategories]);
  
  const contentFaqCategories = useMemo(() => 
    orderedFaqCategories.filter(cat => cat.id !== "video"), 
    [orderedFaqCategories]
  );

  const contentFaqsByCategory = useMemo(() => {
    // Simply return the original object since it doesn't contain video
    return hotelFaqsByCategory;
  }, [hotelFaqsByCategory]);
  
  const firstRowCategories = useMemo(() => 
    orderedFaqCategories.slice(0, 7),
    [orderedFaqCategories]
  );
  
  const secondRowCategories = useMemo(() => 
    orderedFaqCategories.slice(7),
    [orderedFaqCategories]
  );
  
  return (
    <div className="min-h-screen flex flex-col faq-page">
      <Navbar />
      
      <main className="flex-1 pt-16">
        <div className="container max-w-4xl mx-auto px-4 py-3">
          <div className="text-center mb-4">
            <h1 className={`
              ${isMobile ? "text-4xl" : "text-3xl md:text-4xl"} 
              font-bold mb-2 text-gradient text-[#eedbf7] glow 
              animate-text-slow tracking-tight leading-tight
            `}>
              Preguntas Frecuentes para Hoteles
            </h1>
            <p className={`${isMobile ? "text-xl" : "text-base"} font-medium text-[#e3d6e9] mb-6`}>
              Encuentre respuestas a las preguntas más comunes sobre unirse a Hotel-Living como socio hotelero
            </p>
            
            <FaqSearch 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              placeholder="Buscar preguntas frecuentes de socios..."
            />
          </div>
          
          <div className="flex flex-col gap-1 mb-4">
            <div className="flex justify-center">
              <div className="flex flex-wrap justify-center gap-1 p-1 bg-[#460F54]/50 rounded-xl border border-fuchsia-500/30 backdrop-blur-md">
                {firstRowCategories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setActiveTab(category.id)}
                    className={`px-2 py-0.5 rounded-lg uppercase whitespace-nowrap text-[0.65rem] font-bold ${activeTab === category.id ? 'bg-[#981DA1]' : 'bg-gradient-to-r from-[#730483] to-[#570366]'} text-white shadow-md hover:shadow-fuchsia-500/20 hover:scale-105 transition-all duration-200 border border-fuchsia-600/20 w-auto`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex justify-center">
              <div className="flex flex-wrap justify-center gap-1 p-1 bg-[#460F54]/50 rounded-xl border border-fuchsia-500/30 backdrop-blur-md">
                {secondRowCategories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setActiveTab(category.id)}
                    className={`px-2 py-0.5 rounded-lg uppercase whitespace-nowrap text-[0.65rem] font-bold ${activeTab === category.id ? 'bg-[#981DA1]' : 'bg-gradient-to-r from-[#730483] to-[#570366]'} text-white shadow-md hover:shadow-fuchsia-500/20 hover:scale-105 transition-all duration-200 border border-fuchsia-600/20 w-auto`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {activeTab === "video" && (
            <div className="glass-card rounded-lg overflow-hidden border-none p-4">
              <div className="max-w-md mx-auto">
                <HotelVideoPlayer />
              </div>
              
              <HotelSignupButtons isMobile={isMobile} />
            </div>
          )}
          
          <FaqTabs 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            faqCategories={orderedFaqCategories}
            faqsByCategory={{
              ...contentFaqsByCategory,
              video: [] // Add empty video array to handle tab switching
            }}
            numbered={true}
            searchQuery={searchQuery}
            accentTextColor="#4db74d"
            headerBgColor="#71037c"
            marginBottom=""
            textSizeClass="text-sm md:text-base"
            answerTextSizeClass="text-xs md:text-sm"
            hideTabsList={true} // Add a new prop to hide the TabsList
          />
          
          {activeTab !== "video" && <HotelSignupButtons isMobile={isMobile} />}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
