import { useState, useEffect } from "react";

type FileStats = {
  path: string;
  lineCount: number;
  sizeInBytes: number;
};

export function useCodeStats() {
  const [totalLines, setTotalLines] = useState<number>(0);
  const [totalSizeInBytes, setTotalSizeInBytes] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [fileStats, setFileStats] = useState<FileStats[]>([]);

  useEffect(() => {
    // This is a simplified implementation that would actually
    // run on the client side. In a real scenario, this would
    // be a server-side operation.
    const fetchCodeStats = async () => {
      try {
        setIsLoading(true);
        
        // In a real app, this would be an API call to the backend
        // Simulating a response with hardcoded data based on manual analysis
        // of the project structure
        
        // This is an approximation based on the files we have seen
        const estimatedFiles: FileStats[] = [
          // Core files
          { path: "src/main.tsx", lineCount: 6, sizeInBytes: 320 },
          { path: "src/App.tsx", lineCount: 58, sizeInBytes: 2480 },
          { path: "src/lib/utils.ts", lineCount: 8, sizeInBytes: 290 },
          
          // Types
          { path: "src/types/hotel.ts", lineCount: 72, sizeInBytes: 1820 },
          { path: "src/integrations/supabase/types-custom.ts", lineCount: 112, sizeInBytes: 3450 },
          
          // Components - Hotel Detail
          { path: "src/components/hotel-detail/HotelReviews.tsx", lineCount: 196, sizeInBytes: 7850 },
          { path: "src/components/hotel-detail/HotelDetailContent.tsx", lineCount: 88, sizeInBytes: 3240 },
          { path: "src/components/hotel-detail/HotelHeader.tsx", lineCount: 85, sizeInBytes: 3120 },
          { path: "src/components/hotel-detail/HotelGallery.tsx", lineCount: 70, sizeInBytes: 2760 },
          { path: "src/components/hotel-detail/HotelDescription.tsx", lineCount: 40, sizeInBytes: 1450 },
          { path: "src/components/hotel-detail/HotelAmenities.tsx", lineCount: 55, sizeInBytes: 2180 },
          { path: "src/components/hotel-detail/HotelAvailableMonths.tsx", lineCount: 60, sizeInBytes: 2340 },
          { path: "src/components/hotel-detail/HotelNotFound.tsx", lineCount: 25, sizeInBytes: 980 },
          
          // Home components
          { path: "src/components/home/HeroSection.tsx", lineCount: 80, sizeInBytes: 3150 },
          { path: "src/components/home/FeaturedHotelsSection.tsx", lineCount: 65, sizeInBytes: 2560 },
          { path: "src/components/home/FilterSectionWrapper.tsx", lineCount: 40, sizeInBytes: 1680 },
          
          // Search components
          { path: "src/components/search/SearchResultsList.tsx", lineCount: 85, sizeInBytes: 3320 },
          { path: "src/components/search/FilterSidebar.tsx", lineCount: 110, sizeInBytes: 4280 },
          { path: "src/components/search/FilterItem.tsx", lineCount: 30, sizeInBytes: 1240 },
          { path: "src/components/search/CategoryFilter.tsx", lineCount: 45, sizeInBytes: 1850 },
          { path: "src/components/search/CountryFilter.tsx", lineCount: 50, sizeInBytes: 2050 },
          { path: "src/components/search/MonthFilter.tsx", lineCount: 55, sizeInBytes: 2240 },
          { path: "src/components/search/ThemeFilter.tsx", lineCount: 65, sizeInBytes: 2580 },
          { path: "src/components/search/PriceRangeFilter.tsx", lineCount: 75, sizeInBytes: 2980 },
          { path: "src/components/search/LocationFilter.tsx", lineCount: 45, sizeInBytes: 1860 },
          { path: "src/components/search/LengthOfStayFilter.tsx", lineCount: 50, sizeInBytes: 2040 },
          { path: "src/components/search/PropertyTypeFilter.tsx", lineCount: 40, sizeInBytes: 1680 },
          { path: "src/components/search/PropertyStyleFilter.tsx", lineCount: 40, sizeInBytes: 1690 },
          { path: "src/components/search/CheckboxFilter.tsx", lineCount: 35, sizeInBytes: 1440 },
          
          // Dashboard components
          { path: "src/components/dashboard/DashboardLayout.tsx", lineCount: 90, sizeInBytes: 3620 },
          { path: "src/components/dashboard/DashboardContent.tsx", lineCount: 75, sizeInBytes: 2980 },
          { path: "src/components/dashboard/ActionCard.tsx", lineCount: 40, sizeInBytes: 1650 },
          { path: "src/components/dashboard/AddProperty.tsx", lineCount: 120, sizeInBytes: 4850 },
          { path: "src/components/dashboard/AnalyticsContent.tsx", lineCount: 85, sizeInBytes: 3380 },
          { path: "src/components/dashboard/BookingItem.tsx", lineCount: 70, sizeInBytes: 2790 },
          { path: "src/components/dashboard/BookingsContent.tsx", lineCount: 90, sizeInBytes: 3540 },
          { path: "src/components/dashboard/Calculator.tsx", lineCount: 65, sizeInBytes: 2580 },
          { path: "src/components/dashboard/EmptyState.tsx", lineCount: 30, sizeInBytes: 1240 },
          { path: "src/components/dashboard/FinancesContent.tsx", lineCount: 80, sizeInBytes: 3180 },
          { path: "src/components/dashboard/GuestsContent.tsx", lineCount: 85, sizeInBytes: 3320 },
          { path: "src/components/dashboard/PropertiesContent.tsx", lineCount: 95, sizeInBytes: 3780 },
          { path: "src/components/dashboard/ReviewItem.tsx", lineCount: 60, sizeInBytes: 2380 },
          { path: "src/components/dashboard/ReviewsContent.tsx", lineCount: 85, sizeInBytes: 3350 },
          { path: "src/components/dashboard/SettingsContent.tsx", lineCount: 90, sizeInBytes: 3580 },
          { path: "src/components/dashboard/StatCard.tsx", lineCount: 40, sizeInBytes: 1640 },
          
          // Property Steps
          { path: "src/components/dashboard/PropertySteps/BasicInfoStep.tsx", lineCount: 130, sizeInBytes: 5240 },
          { path: "src/components/dashboard/PropertySteps/LocationStep.tsx", lineCount: 110, sizeInBytes: 4380 },
          { path: "src/components/dashboard/PropertySteps/PicturesStep.tsx", lineCount: 120, sizeInBytes: 4820 },
          { path: "src/components/dashboard/PropertySteps/RoomsAndPricingStep.tsx", lineCount: 115, sizeInBytes: 4650 },
          { path: "src/components/dashboard/PropertySteps/ThemesAndActivitiesStep.tsx", lineCount: 125, sizeInBytes: 5080 },
          
          // Other components
          { path: "src/components/BookingForm.tsx", lineCount: 180, sizeInBytes: 7240 },
          { path: "src/components/FilterSection.tsx", lineCount: 95, sizeInBytes: 3780 },
          { path: "src/components/Footer.tsx", lineCount: 70, sizeInBytes: 2790 },
          { path: "src/components/HotelCard.tsx", lineCount: 85, sizeInBytes: 3420 },
          { path: "src/components/HotelThemes.tsx", lineCount: 30, sizeInBytes: 1240 },
          { path: "src/components/Logo.tsx", lineCount: 15, sizeInBytes: 640 },
          { path: "src/components/Navbar.tsx", lineCount: 130, sizeInBytes: 5180 },
          { path: "src/components/Starfield.tsx", lineCount: 55, sizeInBytes: 2190 },
          { path: "src/components/ThemeTag.tsx", lineCount: 25, sizeInBytes: 980 },
          
          // Pages
          { path: "src/pages/Index.tsx", lineCount: 60, sizeInBytes: 2380 },
          { path: "src/pages/Search.tsx", lineCount: 90, sizeInBytes: 3540 },
          { path: "src/pages/HotelDetail.tsx", lineCount: 85, sizeInBytes: 3320 },
          { path: "src/pages/UserDashboard.tsx", lineCount: 70, sizeInBytes: 2780 },
          { path: "src/pages/HotelDashboard.tsx", lineCount: 85, sizeInBytes: 3350 },
          
          { path: "src/pages/SignUp.tsx", lineCount: 150, sizeInBytes: 6050 },
          { path: "src/pages/FAQ.tsx", lineCount: 70, sizeInBytes: 2780 },
          { path: "src/pages/OurValues.tsx", lineCount: 60, sizeInBytes: 2390 },
          { path: "src/pages/OurServices.tsx", lineCount: 65, sizeInBytes: 2580 },
          { path: "src/pages/Privacy.tsx", lineCount: 90, sizeInBytes: 3580 },
          { path: "src/pages/Terms.tsx", lineCount: 120, sizeInBytes: 4850 },
          { path: "src/pages/CustomerService.tsx", lineCount: 70, sizeInBytes: 2780 },
          { path: "src/pages/NotFound.tsx", lineCount: 30, sizeInBytes: 1240 },
          
          // Utils and data
          { path: "src/utils/data.ts", lineCount: 234, sizeInBytes: 9320 },
          
          // Hooks
          { path: "src/hooks/useToast.ts", lineCount: 10, sizeInBytes: 420 },
          { path: "src/hooks/useHotelDetail.ts", lineCount: 45, sizeInBytes: 1840 },
          { path: "src/hooks/useHotels.ts", lineCount: 55, sizeInBytes: 2240 },
          { path: "src/hooks/useThemes.ts", lineCount: 40, sizeInBytes: 1680 },
          { path: "src/hooks/use-mobile.tsx", lineCount: 25, sizeInBytes: 980 },
          
          // Context
          { path: "src/context/AuthContext.tsx", lineCount: 110, sizeInBytes: 4380 },
          
          // Integrations
          { path: "src/integrations/supabase/client.ts", lineCount: 15, sizeInBytes: 620 },
          { path: "src/integrations/supabase/types.ts", lineCount: 70, sizeInBytes: 2780 },
          
          // UI components (shadcn)
          { path: "src/components/ui", lineCount: 2500, sizeInBytes: 98500 },
        ];
        
        // Calculate totals
        const totalLinesCount = estimatedFiles.reduce((sum, file) => sum + file.lineCount, 0);
        const totalSize = estimatedFiles.reduce((sum, file) => sum + file.sizeInBytes, 0);
        
        setFileStats(estimatedFiles);
        setTotalLines(totalLinesCount);
        setTotalSizeInBytes(totalSize);
      } catch (err) {
        console.error("Error fetching code stats:", err);
        setError("Failed to load code statistics");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCodeStats();
  }, []);

  return { totalLines, totalSizeInBytes, isLoading, error, fileStats };
}
