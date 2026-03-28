import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createQueryClient } from "@/lib/query-client";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AccessibilityProvider } from "@/components/accessibility/AccessibilityProvider";
import { MonitoringProvider } from "@/components/monitoring/MonitoringProvider";
import { ConnectionBanner } from "@/components/ui/connection-banner";
import { BackToTopButton } from "@/components/ui/back-to-top";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { useBatchScrollReveal } from "@/hooks/useScrollReveal";
import { AvatarManagerProvider } from "@/contexts/AvatarManager";
import { VideoTestimonialProvider } from "@/contexts/VideoTestimonialContext";
import { VideoProvider } from "@/contexts/VideoContext";
import { VideoSessionManager } from "@/components/video/VideoSessionManager";
import { AuthProvider } from "@/context/AuthContext";
import { GlobalAvatarSystem } from "@/components/avatars/GlobalAvatarSystem";
import { GlobalTestimonials } from "@/components/testimonials/GlobalTestimonials";
import { SEOMetadata } from "@/components/SEOMetadata";
import { ScrollToTop } from "@/components/ScrollToTop";
import { DashboardAccess } from "@/components/DashboardAccess";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { ScrollingMarquee } from "@/components/marquee/ScrollingMarquee";
import { SplashScreenWrapper } from "@/components/SplashScreenWrapper";
import { useUITranslation } from "@/hooks/useUITranslation";

import OurTeam from "@/pages/OurTeam";
import PanelAdminSafe from "./pages/panel-admin-safe";
import IntroTest from "@/pages/IntroTest";
import IntroTest1 from "@/pages/IntroTest1";
import IntroTest2 from "@/pages/IntroTest2";
import IntroTest3 from "@/pages/IntroTest3";
import IntroTest4 from "@/pages/IntroTest4";
import IntroTest5 from "@/pages/IntroTest5";
import IntroTest6 from "@/pages/IntroTest6";
import IntroTest7 from "@/pages/IntroTest7";
import IntroTest8 from "@/pages/IntroTest8";
import IntroTest9 from "@/pages/IntroTest9";

// Initialize i18n
import "./i18n/config";
import "./styles/micro-enhancements.css";
import "./styles/slogan-text-fix.css";
import "./styles/mobile-avatar-faq.css";
import "./scripts/directSqlRead"; // Direct SQL content reading

import Home from "@/pages/Index";
import Hotels from "@/pages/Hotels";
import HotelDetail from "@/pages/HotelDetail";
import DemoHotelDetail from "@/pages/DemoHotelDetail";
import DemoAgostoHotel from "@/pages/DemoAgostoHotel";
import HotelComparisonPage from "@/pages/HotelComparisonPage";

import UserDashboard from "@/pages/UserDashboard";
import HotelDashboard from "@/pages/HotelDashboard";

import AdminLogin from "@/pages/AdminLogin";
import PanelFernando from "@/pages/PanelFernando";
import Terms from "@/pages/Terms";
import Privacy from "@/pages/Privacy";
import FeaturedHotels from "@/pages/FeaturedHotels";
import Videos from "@/pages/Videos";
import AffinityStays from "@/pages/AffinityStays";
import FAQ from "@/pages/FAQ";
import TestAvatars from "@/pages/TestAvatars";
import Search from "@/pages/Search";
import JoinUs from "@/pages/JoinUs";
import OurServices from "@/pages/OurServices";
import OurValues from "@/pages/OurValues";
import CustomerService from "@/pages/CustomerService";
import Contact from "@/pages/Contact";
import IntellectualProperty from "@/pages/IntellectualProperty";
import Ayuda from "@/pages/Ayuda";
import ExcelGenerator from "@/pages/ExcelGenerator";
import ProfessionalStudy from "@/pages/ProfessionalStudy";
import Ambassador from "@/pages/Ambassador";
import Agents from "@/pages/Agents";
import LiderLiving from "@/pages/LiderLiving";
import Leaders from "@/pages/Leaders";
import LeaderProfile from "@/pages/LeaderProfile";
import LoginLeaderLiving from "@/pages/LoginLeaderLiving";
import RegisterLeaderLiving from "@/pages/RegisterLeaderLiving";
import DashboardLeaderLiving from "@/pages/DashboardLeaderLiving";
import DashboardLeaderLivingNew from "@/pages/DashboardLeaderLivingNew";

import AgentDashboard from "@/pages/AgentDashboard";
import HotelAssociation from "@/pages/HotelAssociation";
import AssociationRegistration from "@/pages/AssociationRegistration";
import AssociationSlug from "@/pages/AssociationSlug";
import { AssociationDashboard } from "@/components/association/AssociationDashboard";
import { OnlinePDFFormPage } from '@/components/dashboard/hotel-registration/OnlinePDFFormPage';
import AmbassadorsList from "@/pages/AmbassadorsList";
import AmbassadorsUSA from "@/pages/AmbassadorsUSA";
import Press from "@/pages/Press";
import PromoterDashboard from "@/pages/PromoterDashboard";
import PromoterCardGenerator from "@/pages/PromoterCardGenerator";
import Compare from "@/pages/Compare";
import HotelModelPage from "@/pages/HotelModelPage";
import BookingSuccess from "@/pages/BookingSuccess";
import BookingFailed from "@/pages/BookingFailed";
import EmergencyAdminReset from "@/pages/EmergencyAdminReset";
import { TestPage } from "@/pages/TestPage";
import IsolationTests from "@/pages/IsolationTests";
import StabilityTests from "@/pages/admin/StabilityTests";
import { TestRunner } from "@/pages/TestRunner";
import SystemVerificationPage from "@/pages/SystemVerification";
import { AdminAuthGuard } from "@/components/auth/AdminAuthGuard";
import TestBackend from "@/pages/TestBackend";

const GruposHoteleros = React.lazy(() => import("@/pages/GruposHoteleros"));

// Authentication Components - ISOLATED
import LoginUser from "@/pages/auth/LoginUser";
import LoginHotel from "@/pages/auth/LoginHotel";
import LoginAssociation from "@/pages/auth/LoginAssociation";
import LoginPromoter from "@/pages/auth/LoginPromoter";
import AuthCallback from "@/pages/auth/AuthCallback";
import SigningCallback from "@/pages/auth/SigningCallback";
import RegisterUser from "@/pages/registerUser";
import RegisterHotel from "@/pages/registerHotel";
import RegisterAssociation from "@/pages/registerAssociation";
import RegisterPromotor from "@/pages/registerPromotor";
import SplashPage from "@/pages/SplashPage";
import WorkflowTest from "@/pages/WorkflowTest";

const queryClient = createQueryClient();

// Main App Routes with ALL providers and global components
function MainAppRoutes() {
  const location = useLocation();
  const [isVideoVisible, setIsVideoVisible] = React.useState(false);
  const { loading } = useUITranslation();
  
  // Initialize smooth scroll behavior
  useSmoothScroll();
  
  // Initialize batch scroll reveal animations
  useBatchScrollReveal();
  
  return (
    <MonitoringProvider>
        <AccessibilityProvider>
          <VideoProvider>
            <VideoTestimonialProvider>
              <AvatarManagerProvider>
                <AuthProvider>
                <SEOMetadata />
                <ScrollToTop />
                <DashboardAccess />
                <GoogleAnalytics />
                <ConnectionBanner />
          
          <main id="main-content">
            <Routes>
  <Route path="/panel-admin-safe" element={<PanelAdminSafe />} />
              <Route path="/" element={<Home />} />
              <Route path="/splash" element={<SplashPage />} />
            <Route path="/hotels" element={<Hotels />} />
            <Route path="/grupos-hoteleros" element={<React.Suspense fallback={<div className="min-h-screen flex items-center justify-center">{loading}</div>}><GruposHoteleros /></React.Suspense>} />
            <Route path="/hotel/:id" element={<HotelDetail />} />
            <Route path="/search" element={<Search />} />
            <Route path="/demo/hotel-detail" element={<DemoHotelDetail />} />
            <Route path="/demo/agosto-hotel" element={<DemoAgostoHotel />} />
            <Route path="/demo/comparison" element={<HotelComparisonPage />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/join-us" element={<JoinUs />} />
            <Route path="/our-services" element={<OurServices />} />
            <Route path="/our-values" element={<OurValues />} />
            <Route path="/customer-service" element={<CustomerService />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/intellectual-property" element={<IntellectualProperty />} />
            {/* About Us routes for all languages */}
            <Route path="/sobre-nosotros" element={<OurTeam />} />
            <Route path="/about-us" element={<OurTeam />} />
            <Route path="/sobre-nos" element={<OurTeam />} />
            <Route path="/despre-noi" element={<OurTeam />} />
            {/* Legacy route redirect */}
            <Route path="/our-team" element={<Navigate to="/about-us" replace />} />
            <Route path="/excel-generator" element={<ExcelGenerator />} />
            <Route path="/professional-study" element={<ProfessionalStudy />} />
          <Route path="/lider-living" element={<LiderLiving />} />
          <Route path="/login/leaderliving" element={<LoginLeaderLiving />} />
          <Route path="/registerLeaderLiving" element={<RegisterLeaderLiving />} />
          <Route path="/dashboard/leaderliving/*" element={<DashboardLeaderLivingNew />} />
            <Route path="/ambassador" element={<Ambassador />} />
            <Route path="/promotor-local" element={<Agents />} />
            <Route path="/panel-agente" element={<AgentDashboard />} />
            <Route path="/asociacion" element={<HotelAssociation />} />
            <Route path="/asociacion/registro" element={<AssociationRegistration />} />
            <Route path="/association/:slug" element={<AssociationSlug />} />
            <Route path="/association-dashboard" element={<AssociationDashboard />} />
            <Route path="/ambassadors" element={<AmbassadorsList />} />
            <Route path="/ambassadors/usa" element={<AmbassadorsUSA />} />
            <Route path="/press" element={<Press />} />
            <Route path="/clientes" element={<FAQ />} />
            <Route path="/affinity-stays" element={<AffinityStays />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/featured-hotels" element={<FeaturedHotels />} />
            <Route path="/leaders" element={<Leaders />} />
            <Route path="/nuestros-lideres" element={<Leaders />} />
            <Route path="/leaders/:slug" element={<LeaderProfile />} />
            <Route path="/faq" element={<Ayuda />} />
            <Route path="/preguntas-frecuentes" element={<Ayuda />} />
            <Route path="/test-avatars" element={<TestAvatars />} />
            <Route path="/nosotros" element={<OurValues />} />
            <Route path="/entrada-admin" element={<AdminLogin />} />
            <Route path="/admin-restore" element={
              <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center">{loading}</div>}>
                <EmergencyAdminReset />
              </React.Suspense>
            } />
            <Route path="/user-dashboard" element={<UserDashboard />} />
            <Route path="/hotel-dashboard" element={<HotelDashboard />} />
            <Route path="/panel-hotel" element={<HotelDashboard />} />
            <Route path="/panel-admin/*" element={<PanelFernando />} />
            <Route path="/admin" element={<Navigate to="/panel-admin" replace />} />
            <Route path="/admin/*" element={<Navigate to="/panel-admin" replace />} />
            <Route path="/panel-fernando" element={<Navigate to="/panel-admin" replace />} />
            <Route path="/panel-fernando/*" element={<Navigate to="/panel-admin" replace />} />
            <Route path="/add-property" element={<HotelDashboard />} />
            <Route path="/promoter/dashboard" element={<PromoterDashboard />} />
            <Route path="/promoter/card-generator" element={<PromoterCardGenerator />} />
            <Route path="/promoter/*" element={<PromoterDashboard />} />
            <Route path="/promoter-dashboard" element={<Navigate to="/promoter/dashboard" replace />} />
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route path="/intro-test" element={<IntroTest />} />
            <Route path="/intro-test1" element={<IntroTest1 />} />
            <Route path="/intro-test2" element={<IntroTest2 />} />
            <Route path="/intro-test3" element={<IntroTest3 />} />
            <Route path="/intro-test4" element={<IntroTest4 />} />
            <Route path="/intro-test5" element={<IntroTest5 />} />
            <Route path="/intro-test6" element={<IntroTest6 />} />
            <Route path="/intro-test7" element={<IntroTest7 />} />
            <Route path="/intro-test8" element={<IntroTest8 />} />
            <Route path="/intro-test9" element={<IntroTest9 />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/hotel-model" element={<HotelModelPage />} />
            <Route path="/booking-success/:sessionId" element={<BookingSuccess />} />
            <Route path="/booking-failed" element={<BookingFailed />} />
            <Route path="/test-integration" element={
              <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center">{loading}</div>}>
                <TestPage />
              </React.Suspense>
            } />
            <Route path="/isolation-tests" element={
              <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center">{loading}</div>}>
                <IsolationTests />
              </React.Suspense>
            } />
            <Route path="/stability-tests" element={
              <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center">{loading}</div>}>
                <AdminAuthGuard><StabilityTests /></AdminAuthGuard>
              </React.Suspense>
            } />
            
            {/* Filter Test Suite Runner */}
            <Route path="/filter-tests" element={
              <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center">{loading}</div>}>
                <TestRunner />
              </React.Suspense>
            } />
            
            {/* System Verification Dashboard */}
            <Route path="/system-verification" element={
              <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center">{loading}</div>}>
                <SystemVerificationPage />
              </React.Suspense>
            } />
            
            {/* Backend Connection Test */}
            <Route path="/test-backend" element={
              <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center">{loading}</div>}>
                <TestBackend />
              </React.Suspense>
            } />
            
            {/* Hotel Registration Form - Full Screen */}
            <Route path="/hotel-registration-form" element={
              <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center">{loading}</div>}>
                <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
                  <OnlinePDFFormPage />
                </div>
              </React.Suspense>
            } />
            
            </Routes>
          </main>
          
          {/* Session Video Player - Enabled with navigation tracking */}
          <VideoSessionManager onVideoStateChange={setIsVideoVisible} />
          
          {/* Global Avatar System - DISABLED per user request */}
          {/* {!isVideoVisible && <GlobalAvatarSystem />} */}
          
          {/* Global Video Testimonials - appears on all pages except homepage */}
          <GlobalTestimonials />
          
          {/* Global UI Enhancements */}
          <BackToTopButton />
          
          {/* Scrolling Marquee - appears on all public pages */}
          <ScrollingMarquee />
          
              </AuthProvider>
            </AvatarManagerProvider>
          </VideoTestimonialProvider>
        </VideoProvider>
      </AccessibilityProvider>
    </MonitoringProvider>
  );
}

function App() {
  const { navigation } = useUITranslation();
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <MonitoringProvider>
          <Router>
          <nav id="main-navigation" className="sr-only">
            <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 z-50 bg-background p-2 border border-border rounded">
              {navigation.skipToMainContent}
            </a>
          </nav>
          <Routes>
            {/* Authentication Routes - ISOLATED from global components but with AuthProvider for login functionality */}
            <Route path="/login/user" element={<AuthProvider><LoginUser /></AuthProvider>} />
            <Route path="/login/hotel" element={<AuthProvider><LoginHotel /></AuthProvider>} />
            <Route path="/login/association" element={<AuthProvider><LoginAssociation /></AuthProvider>} />
            <Route path="/login/promoter" element={<AuthProvider><LoginPromoter /></AuthProvider>} />
            <Route path="/signing/callback" element={<AuthProvider><SigningCallback /></AuthProvider>} />
            <Route path="/auth/callback" element={<AuthProvider><AuthCallback /></AuthProvider>} />
            <Route path="/registerUser" element={<AuthProvider><RegisterUser /></AuthProvider>} />
            <Route path="/registerHotel" element={<AuthProvider><RegisterHotel /></AuthProvider>} />
            <Route path="/registerAssociation" element={<AuthProvider><RegisterAssociation /></AuthProvider>} />
            <Route path="/registerPromotor" element={<AuthProvider><RegisterPromotor /></AuthProvider>} />
            <Route path="/workflow-test" element={<WorkflowTest />} />
            
            
            {/* All other routes with full providers and global components */}
            <Route path="/*" element={<SplashScreenWrapper><MainAppRoutes /></SplashScreenWrapper>} />
          </Routes>
          
          <Toaster />
          </Router>
        </MonitoringProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
