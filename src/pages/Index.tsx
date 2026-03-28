
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { HeroSectionEnhanced as HeroSection } from '@/components/home/HeroSectionEnhanced';
import { FilterState } from '@/components/filters';
import { FilterSectionWrapper } from '@/components/home/FilterSectionWrapper';
import { useThemes } from '@/hooks/useThemes';
import { useHotels } from '@/hooks/useHotels';
import { HotelStarfield } from '@/components/hotels/HotelStarfield';
import { IntroStarAnimation } from '@/components/intro/IntroStarAnimation';
import BubbleCounter from '@/components/common/BubbleCounter';
import { IndexPageAvatars } from '@/components/avatars/IndexPageAvatars';
import { PageTransitionBar } from '@/components/layout/PageTransitionBar';
import { ConnectionIndicator } from '@/components/ui/connection-indicator';
import { CompleteAudioSystemAnalysis } from '@/components/debug/CompleteAudioSystemAnalysis';
import { VoiceChatTestComponent } from '@/components/debug/VoiceChatTestComponent';

export default function Index() {
  const navigate = useNavigate();
  const redirectTimer = useRef<NodeJS.Timeout | null>(null);
  
  const [showAudit, setShowAudit] = useState(false); // Disabled - normal homepage
  const { data: themes } = useThemes();
  const [showIntro, setShowIntro] = useState(false); // Temporarily disabled - was: useState(true)
  const [filters, setFilters] = useState<FilterState>({
    country: null,
    month: null,
    theme: null,
    priceRange: { min: 0, max: 1000 },
    searchTerm: null,
    minPrice: 0,
    maxPrice: 1000,
    stars: [],
    location: null,
    propertyType: null,
    propertyStyle: null,
    activities: [],
    roomTypes: [],
    hotelFeatures: [],
    roomFeatures: [],
    mealPlans: [],
    stayLengths: null, // Single string, not array
    atmosphere: null
  });

  // Don't initialize useHotels hook here since we're just navigating to search
  // const { updateFilters } = useHotels({ initialFilters: filters });

  const handleFilterChange = (newFilters: FilterState) => {
    console.log("🔄 Index page filter change:", newFilters);
    setFilters(newFilters);
    // Note: We don't need to update any hotel results here since the Index page doesn't show results
    // The FilterSectionWrapper handles navigation to /search with proper parameters
  };

  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  // Automatic redirect to /faq after 10 seconds of inactivity
  useEffect(() => {
    // Clear any existing timer
    if (redirectTimer.current) {
      clearTimeout(redirectTimer.current);
    }

    // Function to clear the redirect timer when user interacts
    const clearRedirectTimer = () => {
      if (redirectTimer.current) {
        clearTimeout(redirectTimer.current);
        redirectTimer.current = null;
      }
    };

    // Function to handle user interaction (clicks on links/navigation)
    const handleUserInteraction = (event: Event) => {
      const target = event.target as HTMLElement;
      
      // Check if the clicked element is a link, button, or navigation element
      if (target.tagName === 'A' || 
          target.tagName === 'BUTTON' || 
          target.closest('nav') || 
          target.closest('a') || 
          target.closest('button') ||
          target.closest('[role="button"]') ||
          target.closest('.navbar') ||
          target.closest('[data-navigation]')) {
        clearRedirectTimer();
      }
    };

    // Set up the 10-second redirect timer
    redirectTimer.current = setTimeout(() => {
      navigate('/faq');
    }, 10000);

    // Add event listeners for user interactions
    document.addEventListener('click', handleUserInteraction, true);
    document.addEventListener('keydown', clearRedirectTimer, true);
    document.addEventListener('mousemove', clearRedirectTimer, { once: true });
    document.addEventListener('scroll', clearRedirectTimer, { once: true });

    // Cleanup function
    return () => {
      clearRedirectTimer();
      document.removeEventListener('click', handleUserInteraction, true);
      document.removeEventListener('keydown', clearRedirectTimer, true);
      document.removeEventListener('mousemove', clearRedirectTimer);
      document.removeEventListener('scroll', clearRedirectTimer);
    };
  }, []); // Empty dependency array - only run on mount

  // Extract theme names for the filter dropdown
  const themeNames = themes ? themes.map(theme => theme.name) : [];

  if (showIntro) {
    return <IntroStarAnimation onComplete={handleIntroComplete} />;
  }

  // Show audit overlay for testing
  if (showAudit) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 space-y-6">
        <CompleteAudioSystemAnalysis />
        
        {/* Voice Chat Test Component - Remove after diagnostic */}
        <VoiceChatTestComponent avatarId="antonio" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden w-full">
      <PageTransitionBar />
      <HotelStarfield />
      <Navbar />
      <BubbleCounter />
      
      <main className="flex-1 w-full">
        <HeroSection />
        <FilterSectionWrapper onFilterChange={handleFilterChange} availableThemes={themeNames} />
      </main>
      
      <Footer />
      
      {/* Index Page Avatars - DISABLED per user request */}
      {/* <IndexPageAvatars /> */}
      
      {/* Connection Status Indicator */}
      <ConnectionIndicator />
      
    </div>
  );
}
