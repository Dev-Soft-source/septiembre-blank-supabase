
import React from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HotelSlogans } from "@/components/hotels/HotelSlogans";
import { HotelAccordionMenu } from "@/components/hotels/HotelAccordionMenu";
import { FaqTabs } from "@/components/faq/FaqTabs";
import { useHotelFaqCategories, useHotelFaqsByCategory } from "@/components/faq/hotelFaqData";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link } from "react-router-dom";
import { Building, Mail } from "lucide-react";
import { HotelStarfield } from "@/components/hotels/HotelStarfield";
import { HotelVideoPlayer } from "@/components/hotels/HotelVideoPlayer";
import { GlobalVideoTestimonials } from "@/components/testimonials/GlobalVideoTestimonials";

// Import refactored components
import { HotelFilters } from "@/components/hotels/HotelFilters";
import { HotelResultsGrid } from "@/components/hotels/HotelResultsGrid";
import { HotelsMap } from "@/components/hotels/HotelsMap";
import { PaginationControls } from "@/components/hotels/PaginationControls";
import { useHotelSearchLogic } from "@/components/hotels/hooks/useHotelSearchLogic";

const orderedCategoryIds = [
  "benefits", "models", "revenue", "guests", "seniors", 
  "affinities", "operation", "integration", "marketing", "payment"
];

const HotelSignupButtons = ({ isMobile }: { isMobile: boolean }) => (
  <div className="mt-6 border-t-2 border-fuchsia-400/30 pt-4">
    <h3 className={`text-[#f9d3f6] ${isMobile ? "text-lg" : "text-base"} font-semibold mb-3 text-center`}>
      Ready to join Hotel-Living?
    </h3>
    <div className="flex flex-col sm:flex-row gap-3 justify-center">
      <Link to="/hotel-signup" className={`bg-[#981DA1] hover:bg-[#460F54] text-white font-bold py-1.5 px-4 rounded-lg transition-colors flex items-center justify-center ${isMobile ? "text-base" : "text-sm"}`}>
        <Building className="mr-2 h-4 w-4" />
        Register Your Hotel
      </Link>
      <Link to="/login?tab=hotel" className={`bg-fuchsia-700 hover:bg-fuchsia-800 text-white font-bold py-1.5 px-4 rounded-lg transition-colors flex items-center justify-center ${isMobile ? "text-base" : "text-sm"}`}>
        <Mail className="mr-2 h-4 w-4" />
        Partner Login
      </Link>
    </div>
  </div>
);

export default function HotelsPage() {
  const [activeTab, setActiveTab] = React.useState("benefits");
  const isMobile = useIsMobile();
  
  const hotelFaqCategories = useHotelFaqCategories();
  const hotelFaqsByCategory = useHotelFaqsByCategory();
  
  const {
    hotels,
    allHotels,
    loading,
    error,
    filters,
    onFiltersChange,
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    onPageChange,
    selectedHotel,
    onHotelSelect,
  } = useHotelSearchLogic();
  
  const orderedFaqCategories = React.useMemo(() => 
    orderedCategoryIds.map(id => 
      hotelFaqCategories.find(cat => cat.id === id)
    ).filter(Boolean) as typeof hotelFaqCategories,
  [hotelFaqCategories]);
  
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <HotelStarfield />
      <Navbar />
      
      <main className="flex-1 pt-8 relative z-10">
        <div className="container mx-auto px-4 py-3 flex flex-col items-center">
          <HotelSlogans />
          
          {/* Professional Study Offer */}
          <div className="mb-16 flex justify-center px-4">
            <div 
              className="bg-gradient-to-br from-purple-900/20 via-fuchsia-900/20 to-purple-800/20 backdrop-blur-sm border border-fuchsia-400/30 rounded-2xl p-8 max-w-2xl cursor-pointer hover:border-fuchsia-400/50 hover:bg-gradient-to-br hover:from-purple-900/30 hover:via-fuchsia-900/30 hover:to-purple-800/30 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-fuchsia-500/10"
              onClick={() => {
                // TODO: Navigate to professional study page
                console.log("Navigate to professional study page");
              }}
            >
              <p className="text-white text-center text-lg leading-relaxed font-medium">
                Obtenga, sin coste alguno, un completo estudio profesional,<br />
                técnico y presencial, sobre su hotel y sus posibilidades de desarrollo.
              </p>
            </div>
          </div>
          
          <div className="max-w-4xl w-full backdrop-blur-sm rounded-xl border border-fuchsia-400/20 p-4 md:p-6 bg-gradient-to-b from-[#460F54]/40 to-[#300A38]/60 z-20">
            <HotelAccordionMenu />
          </div>
          
          {/* Hotel Search and Results Section */}
          <div className="w-full max-w-6xl mt-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <HotelFilters 
                  filters={filters}
                  onFiltersChange={onFiltersChange}
                />
                
                <HotelResultsGrid 
                  hotels={hotels}
                  loading={loading}
                  error={error}
                  filters={filters}
                />
                
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={onPageChange}
                  itemsPerPage={itemsPerPage}
                  totalItems={totalItems}
                />
              </div>
              
              <div className="lg:col-span-1">
                <HotelsMap 
                  hotels={allHotels}
                  selectedHotel={selectedHotel}
                  onHotelSelect={onHotelSelect}
                />
              </div>
            </div>
          </div>
          
          <div className="w-full max-w-4xl mt-10">
            <div className="glass-card rounded-lg overflow-hidden border-none p-4 mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-center text-[#f9d3f6] mb-6">Frequently Asked Questions</h2>
              
              <FaqTabs 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                faqCategories={orderedFaqCategories}
                faqsByCategory={hotelFaqsByCategory}
                numbered={true}
                searchQuery=""
                accentTextColor="#4db74d"
                headerBgColor="#71037c"
                marginBottom=""
                textSizeClass="text-base md:text-lg"
                answerTextSizeClass="text-sm md:text-base"
                hideTabsList={false}
              />
              
              <HotelSignupButtons isMobile={isMobile} />
            </div>
          </div>
          
          <div className="w-full max-w-2xl mt-16 mb-12">
            <HotelVideoPlayer />
          </div>
        </div>
      </main>
      
      <Footer />
      
      {/* Spanish Video Testimonials */}
      <GlobalVideoTestimonials />
    </div>
  );
}
