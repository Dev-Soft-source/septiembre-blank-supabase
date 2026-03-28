import { Link } from "react-router-dom";
import { Menu, X, LogOut, User } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuth } from "@/context/AuthContext";
import { isDevelopmentOrAdmin, getRedirectUrlForRole } from "@/utils/dashboardSecurity";
import { CustomerServicePhone } from "./header/CustomerServicePhone";
import { ScrollingMessage } from "./header/ScrollingMessage";
import { useIsMobile } from "@/hooks/use-mobile";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isGrowWithUsOpen, setIsGrowWithUsOpen] = useState(false);
  const [isVideosOpen, setIsVideosOpen] = useState(false);
  const [isMobileUserMenuOpen, setIsMobileUserMenuOpen] = useState(false);
  const [isSignInExpanded, setIsSignInExpanded] = useState(false);
  const [isSignUpExpanded, setIsSignUpExpanded] = useState(false);
  const [isAboutUsExpanded, setIsAboutUsExpanded] = useState(false);
  const [isLegalExpanded, setIsLegalExpanded] = useState(false);
  const { t } = useTranslation('navigation');
  const { user, profile, signOut } = useAuth();
  const mobileUserMenuRef = useRef<HTMLDivElement>(null);
  
  // Properly call the hook and handle potential undefined state
  const isMobile = useIsMobile();

  // Close mobile user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (mobileUserMenuRef.current && !mobileUserMenuRef.current.contains(event.target as Node)) {
        setIsMobileUserMenuOpen(false);
        setIsSignInExpanded(false);
        setIsSignUpExpanded(false);
      }
    }

    if (isMobileUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isMobileUserMenuOpen]);

  const handleLogout = async () => {
    try {
      console.log("🚪 Navbar logout button clicked");
      console.log("User:", user);
      console.log("Profile:", profile);
      
      // Use the enhanced logout method for better compatibility
      console.log("🔧 Importing performEnhancedLogout...");
      const { performEnhancedLogout } = await import('@/utils/browserCache');
      console.log("🔧 Starting enhanced logout...");
      await performEnhancedLogout(signOut);
      
      console.log("✅ Enhanced logout completed");
    } catch (error) {
      console.error('❌ Error during enhanced logout:', error);
      
      // Fallback to basic signOut
      try {
        console.log("🔄 Attempting fallback basic logout");
        await signOut();
        console.log("✅ Basic logout completed");
      } catch (fallbackError) {
        console.error("❌ Fallback logout also failed:", fallbackError);
        console.log("🚨 Force redirecting to homepage");
        // Last resort - force redirect
        window.location.href = "/";
      }
    }
  };

  const getDashboardUrl = () => {
    if (!profile) return '/';
    return getDashboardRoute();
  };

  const getDashboardLabel = () => {
    if (!profile) return '';
    
    // Priority check for hotel owners - ensure hotel users never see admin label
    if (profile.is_hotel_owner || profile.role === 'hotel' || profile.role === 'hotel_owner') {
      return t('navigation.dashboards.hotel');
    }
    
    switch (profile.role) {
      case 'admin':
        return t('navigation.dashboards.admin');
      case 'association':
        return t('navigation.dashboards.association');
      case 'promoter':
        return t('navigation.dashboards.promoter');
      case 'agent':
        return t('navigation.dashboards.agent');
      case 'user':
      default:
        return t('navigation.dashboards.user');
    }
  };

  const getDashboardRoute = () => {
    if (!profile) return '/';
    
    // Priority check for hotel owners - ensure hotel users never go to admin panel
    if (profile.is_hotel_owner || profile.role === 'hotel' || profile.role === 'hotel_owner') {
      return '/hotel-dashboard';
    }
    
    switch (profile.role) {
      case 'admin':
        return '/panel-admin';
      case 'association':
        return '/association-dashboard';
      case 'promoter':
        return '/promoter/dashboard';
      case 'agent':
        return '/panel-agente';
      case 'user':
      default:
        return '/user-dashboard';
    }
  };

  return (
    <>
    <header className="shadow-md animate-fade-in" style={{ backgroundColor: "#996515" }}>
      <div className="flex items-center justify-between">
        {/* Desktop Logo */}
        <div className="hidden md:block flex-shrink-0 px-2 sm:px-3 py-2 animate-fade-in" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
          <Logo />
        </div>

        <div className="hidden md:flex items-center space-x-6 animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
          {/* 1. UN MUNDO DE VENTAJAS → /clientes (using existing route) */}
          <Link to="/clientes" className="text-white hover:text-white/80 transition-all duration-300 font-bold text-[10.5px] leading-tight hover:scale-105">
            <div className="text-center">
              <div>{t('mainNavigationContent.faq.line1')}</div>
              <div>{t('mainNavigationContent.faq.line2')}</div>
            </div>
          </Link>

          {/* 2. ¿AFINIDADES HOTEL-LIVING™? → /affinity-stays (using existing route) */}
          <Link to="/affinity-stays" className="text-white hover:text-white/80 transition-all duration-300 font-bold text-[10.5px] leading-tight hover:scale-105">
            <div className="text-center">
              <div>{t('mainNavigationContent.affinityStays.line1')}</div>
              <div>{t('mainNavigationContent.affinityStays.line2')}</div>
            </div>
          </Link>

          {/* 3. PREGUNTAS FRECUENTES → /faq (using existing route) */}
          <Link to="/faq" className="text-white hover:text-white/80 transition-all duration-300 font-bold text-[10.5px] leading-tight hover:scale-105">
            <div className="text-center">
              <div>{t('mainNavigationContent.frequentQuestions.line1')}</div>
              <div>{t('mainNavigationContent.frequentQuestions.line2')}</div>
            </div>
          </Link>

          {/* 4. ¡CRECE CON NOSOTROS!▼ → parent menu (dropdown) */}
          <div className="relative group">
            <div className="text-white hover:text-white/80 transition-all duration-300 font-bold text-[10.5px] leading-tight cursor-pointer py-2 hover:scale-105">
              <div className="text-center">
                <div>{t('mainNavigationContent.ambassador.line1')}</div>
                <div>{t('mainNavigationContent.ambassador.line2')}</div>
              </div>
            </div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 bg-[#7801AA] shadow-lg rounded-lg z-[100] min-w-max hover:shadow-xl">
              <Link to="/lider-living" className="block text-white hover:bg-[#5D0080] px-4 py-2 transition-all duration-300 text-[10.5px] hover:scale-105 hover:text-white/90 rounded-t-lg">
                {t('navigation.dashboards.groupLeader', 'Líder de Grupo')}
              </Link>
              <Link to="/leaders" className="block text-white hover:bg-[#5D0080] px-4 py-2 transition-all duration-300 text-[10.5px] hover:scale-105 hover:text-white/90">
                {t('navigation.ourLeaders', 'Nuestros líderes')}
              </Link>
              <Link to="/promotor-local" className="block text-white hover:bg-[#5D0080] px-4 py-2 transition-all duration-300 text-[10.5px] hover:scale-105 hover:text-white/90">
                {t('mainNavigationContent.growWithUs.localPromoter')}
              </Link>
              <Link to="/ambassador" className="block text-white hover:bg-[#5D0080] px-4 py-2 transition-all duration-300 text-[10.5px] hover:scale-105 hover:text-white/90 rounded-b-lg">
                {t('mainNavigationContent.growWithUs.ambassador')}
              </Link>
            </div>
          </div>

          {/* 5. VIDEOS Y PRENSA▼ → parent menu (dropdown) */}
          <div className="relative group">
            <div className="text-white hover:text-white/80 transition-all duration-300 font-bold text-[10.5px] leading-tight cursor-pointer py-2 hover:scale-105">
              <div className="text-center">
                <div>{t('mainNavigationContent.videos.line1')}</div>
                <div>{t('mainNavigationContent.videos.line2')}</div>
              </div>
            </div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 bg-[#7801AA] shadow-lg rounded-lg z-[100] min-w-max hover:shadow-xl">
              <Link to="/videos" className="block text-white hover:bg-[#5D0080] px-4 py-2 rounded-t-lg transition-all duration-300 text-[10.5px] hover:scale-105 hover:text-white/90">
                {t('mainNavigationContent.videosAndPress.videos')}
              </Link>
              <Link to="/press" className="block text-white hover:bg-[#5D0080] px-4 py-2 rounded-b-lg transition-all duration-300 text-[10.5px] hover:scale-105 hover:text-white/90">
                {t('mainNavigationContent.videosAndPress.press')}
              </Link>
            </div>
          </div>

          {/* 6. ¿HOTEL? → /hotels (using existing route) */}
          <Link to="/hotels" className="text-white hover:text-white/80 transition-all duration-300 font-bold text-[10.5px] leading-tight hover:scale-105">
            <div className="text-center">
              <div>{t('mainNavigationContent.hotel.line1')}</div>
              <div>{t('mainNavigationContent.hotel.line2')}</div>
            </div>
          </Link>

          {/* 7. GRUPOS HOTELEROS → /grupos-hoteleros */}
          <Link to="/grupos-hoteleros" className="text-white hover:text-white/80 transition-all duration-300 font-bold text-[10.5px] leading-tight hover:scale-105">
            <div className="text-center whitespace-pre-line">
              {t('navigation.hotelGroups')}
            </div>
          </Link>
          
          
          {/* Universal Dashboard Access - ALWAYS VISIBLE for logged-in users */}
          {user && profile ? (
            <div className="flex items-center gap-2">
              {/* Dashboard Link - Prominent and always visible */}
              <Link
                to={getDashboardUrl()}
                className="bg-[#4A90E2] hover:bg-[#357ABD] text-white font-bold text-xs px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 hover:scale-105 hover:shadow-lg border border-white/20"
              >
                <span className="hidden sm:inline">{getDashboardLabel()}</span>
                <span className="sm:hidden">Dashboard</span>
              </Link>
              
              {/* Logout Button */}
              <button 
                onClick={handleLogout}
                className="bg-[#7E26A6] hover:bg-[#5D0080] text-white font-bold text-xs px-3 py-2 rounded transition-all duration-300 flex items-center gap-2 hover:scale-105 hover:shadow-lg"
              >
                <span className="hidden sm:inline">{t('navigation.logout')}</span>
              </button>
            </div>
          ) : (
            <>
              <div className="relative group">
                <button className="bg-[#7E26A6] hover:bg-[#5D0080] text-white font-bold text-xs px-2 py-1.5 rounded transition-all duration-300 hover:scale-105 hover:shadow-lg whitespace-pre-line text-center min-h-[44px] flex items-center justify-center">
                  {t('mainNavigationContent.signup.line1')}
                </button>
                 <div className="absolute top-full right-0 mt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 bg-white shadow-lg rounded-lg z-[100] min-w-max border">
                   <Link to="/registerUser" className="block text-[#68178D] hover:bg-gray-100 px-4 py-2 rounded-t-lg transition-colors text-xs">
                     {t('navigation.menuRoles.user', 'User')}
                   </Link>
                   <Link to="/registerHotel" className="block text-[#68178D] hover:bg-gray-100 px-4 py-2 transition-colors text-xs">
                     {t('navigation.menuRoles.hotel', 'Hotel')}
                   </Link>
                   <Link to="/registerLeaderLiving" className="block text-[#68178D] hover:bg-gray-100 px-4 py-2 transition-colors text-xs">
                     {t('navigation.menuRoles.groupLeader', 'Group Leader')}
                   </Link>
                   <Link to="/registerPromotor" className="block text-[#68178D] hover:bg-gray-100 px-4 py-2 transition-colors text-xs">
                     {t('navigation.menuRoles.promoterLocal', 'Local Promoter')}
                   </Link>
                   <Link to="/registerAssociation" className="block text-[#68178D] hover:bg-gray-100 px-4 py-2 rounded-b-lg transition-colors text-xs">
                     {t('navigation.menuRoles.association', 'Association')}
                   </Link>
                 </div>
              </div>
              
              <div className="relative group">
                <button className="bg-[#7E26A6] hover:bg-[#5D0080] text-white font-bold text-xs px-2 py-1.5 rounded transition-all duration-300 hover:scale-105 hover:shadow-lg whitespace-pre-line text-center min-h-[44px] flex items-center justify-center">
                  {t('mainNavigationContent.login.line1')}
                </button>
                 <div className="absolute top-full right-0 mt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 bg-white shadow-lg rounded-lg z-[100] min-w-max border">
                   <Link to="/login/user" className="block text-[#68178D] hover:bg-gray-100 px-4 py-2 rounded-t-lg transition-colors text-xs">
                     {t('navigation.menuRoles.user', 'User')}
                   </Link>
                   <Link to="/login/hotel" className="block text-[#68178D] hover:bg-gray-100 px-4 py-2 transition-colors text-xs">
                     {t('navigation.menuRoles.hotel', 'Hotel')}
                   </Link>
                   <Link to="/login/leaderliving" className="block text-[#68178D] hover:bg-gray-100 px-4 py-2 transition-colors text-xs">
                     {t('navigation.menuRoles.groupLeader', 'Group Leader')}
                   </Link>
                   <Link to="/login/promoter" className="block text-[#68178D] hover:bg-gray-100 px-4 py-2 transition-colors text-xs">
                     {t('navigation.menuRoles.promoterLocal', 'Local Promoter')}
                   </Link>
                   <Link to="/login/association" className="block text-[#68178D] hover:bg-gray-100 px-4 py-2 rounded-b-lg transition-colors text-xs">
                     {t('navigation.menuRoles.association', 'Association')}
                   </Link>
                 </div>
              </div>
            </>
          )}
          
          <LanguageSwitcher />
        </div>

        {/* Mobile/Tablet Layout */}
        <div className="lg:hidden w-full">
          {/* Top row: User Icon | Centered Logo | Language + Menu */}
          <div className="flex items-center w-full px-1 py-0.25 animate-fade-in" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
            
            {/* Left: User Icon with Dropdown */}
            <div className="flex items-center relative" ref={mobileUserMenuRef}>
              {!user ? (
                <>
                  <button 
                    onClick={() => {
                      console.log('Mobile user menu clicked:', !isMobileUserMenuOpen);
                      setIsMobileUserMenuOpen(!isMobileUserMenuOpen);
                    }}
                    className="flex items-center text-white hover:text-white/80 transition-colors p-2"
                    aria-label="User menu"
                  >
                    <img 
                      src="/lovable-uploads/1576c6c9-fe19-499a-9d4f-e9a1924dbabe.png" 
                      alt="User"
                      className="w-6 h-6"
                    />
                  </button>
                  
                  {isMobileUserMenuOpen && (
                    <div className="absolute top-full left-0 mt-2 min-w-[200px] bg-[#7E26A6] shadow-xl rounded-lg z-[60] border border-white/20 backdrop-blur-sm">
                      {/* Sign In Section */}
                      <div className="border-b border-white/20">
                        <button
                          onClick={() => {
                            console.log('Sign In expanded:', !isSignInExpanded);
                            setIsSignInExpanded(!isSignInExpanded);
                          }}
                          className="w-full text-left text-white hover:bg-[#5D0080] px-4 py-3 transition-all duration-300 text-sm min-h-[48px] flex items-center justify-between rounded-t-lg"
                        >
                          {t('navigation.login', 'Sign In')}
                          <span className={`transform transition-transform duration-300 ${isSignInExpanded ? 'rotate-180' : ''}`}>
                            ▼
                          </span>
                        </button>
                        
                        {isSignInExpanded && (
                          <div className="bg-[#6D1B96] border-t border-white/10">
                            <Link 
                              to="/login/user" 
                              onClick={() => {
                                setIsMobileUserMenuOpen(false);
                                setIsSignInExpanded(false);
                              }}
                              className="block text-white hover:bg-[#5D0080] px-5 py-2 transition-all duration-300 text-sm min-h-[40px] flex items-center"
                            >
                              {t('navigation.menuRoles.user', 'User')}
                            </Link>
                            <Link 
                              to="/login/hotel" 
                              onClick={() => {
                                setIsMobileUserMenuOpen(false);
                                setIsSignInExpanded(false);
                              }}
                              className="block text-white hover:bg-[#5D0080] px-5 py-2 transition-all duration-300 text-sm min-h-[40px] flex items-center"
                            >
                              {t('navigation.menuRoles.hotel', 'Hotel')}
                            </Link>
                            <Link 
                              to="/login/leaderliving" 
                              onClick={() => {
                                setIsMobileUserMenuOpen(false);
                                setIsSignInExpanded(false);
                              }}
                              className="block text-white hover:bg-[#5D0080] px-5 py-2 transition-all duration-300 text-sm min-h-[40px] flex items-center"
                            >
                              {t('navigation.menuRoles.groupLeader', 'Group Leader')}
                            </Link>
                            <Link 
                              to="/login/promoter" 
                              onClick={() => {
                                setIsMobileUserMenuOpen(false);
                                setIsSignInExpanded(false);
                              }}
                              className="block text-white hover:bg-[#5D0080] px-5 py-2 transition-all duration-300 text-sm min-h-[40px] flex items-center"
                            >
                              {t('navigation.menuRoles.promoterLocal', 'Local Promoter')}
                            </Link>
                            <Link 
                              to="/login/association" 
                              onClick={() => {
                                setIsMobileUserMenuOpen(false);
                                setIsSignInExpanded(false);
                              }}
                              className="block text-white hover:bg-[#5D0080] px-5 py-2 transition-all duration-300 text-sm min-h-[40px] flex items-center"
                            >
                              {t('navigation.menuRoles.association', 'Association')}
                            </Link>
                          </div>
                        )}
                      </div>

                      {/* Sign Up Section */}
                      <div>
                        <button
                          onClick={() => {
                            console.log('Create Account expanded:', !isSignUpExpanded);
                            setIsSignUpExpanded(!isSignUpExpanded);
                          }}
                          className="w-full text-left text-white hover:bg-[#5D0080] px-4 py-3 transition-all duration-300 text-sm min-h-[48px] flex items-center justify-between rounded-b-lg"
                        >
                          {t('navigation.signup', 'Create Account')}
                          <span className={`transform transition-transform duration-300 ${isSignUpExpanded ? 'rotate-180' : ''}`}>
                            ▼
                          </span>
                        </button>
                        
                        {isSignUpExpanded && (
                          <div className="bg-[#6D1B96] border-t border-white/10">
                            <Link 
                              to="/registerUser" 
                              onClick={() => {
                                setIsMobileUserMenuOpen(false);
                                setIsSignUpExpanded(false);
                              }}
                              className="block text-white hover:bg-[#5D0080] px-5 py-2 transition-all duration-300 text-sm min-h-[40px] flex items-center"
                            >
                              {t('navigation.menuRoles.user', 'User')}
                            </Link>
                            <Link 
                              to="/registerHotel" 
                              onClick={() => {
                                setIsMobileUserMenuOpen(false);
                                setIsSignUpExpanded(false);
                              }}
                              className="block text-white hover:bg-[#5D0080] px-5 py-2 transition-all duration-300 text-sm min-h-[40px] flex items-center"
                            >
                              {t('navigation.menuRoles.hotel', 'Hotel')}
                            </Link>
                            <Link 
                              to="/registerLeaderLiving" 
                              onClick={() => {
                                setIsMobileUserMenuOpen(false);
                                setIsSignUpExpanded(false);
                              }}
                              className="block text-white hover:bg-[#5D0080] px-5 py-2 transition-all duration-300 text-sm min-h-[40px] flex items-center"
                            >
                              {t('navigation.menuRoles.groupLeader', 'Group Leader')}
                            </Link>
                            <Link 
                              to="/registerPromotor" 
                              onClick={() => {
                                setIsMobileUserMenuOpen(false);
                                setIsSignUpExpanded(false);
                              }}
                              className="block text-white hover:bg-[#5D0080] px-5 py-2 transition-all duration-300 text-sm min-h-[40px] flex items-center"
                            >
                              {t('navigation.menuRoles.promoterLocal', 'Local Promoter')}
                            </Link>
                            <Link 
                              to="/registerAssociation" 
                              onClick={() => {
                                setIsMobileUserMenuOpen(false);
                                setIsSignUpExpanded(false);
                              }}
                              className="block text-white hover:bg-[#5D0080] px-5 py-2 transition-all duration-300 text-sm min-h-[40px] flex items-center"
                            >
                              {t('navigation.menuRoles.association', 'Association')}
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <img 
                  src="/lovable-uploads/1576c6c9-fe19-499a-9d4f-e9a1924dbabe.png" 
                  alt="User"
                  className="w-6 h-6"
                />
              )}
            </div>

            {/* Center: Logo (30% smaller) */}
            <div className="flex-1 flex justify-center">
              <div className="transform scale-[0.7] origin-center">
                <Logo />
              </div>
            </div>

            {/* Right: Language Selector + Hamburger Menu */}
            <div className="flex items-center gap-1">
              <LanguageSwitcher />
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white hover:text-white/80 transition-colors p-1"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Bottom row: Three-row navigation menu */}
          <div className="w-full py-0.25" style={{ backgroundColor: "#996515" }}>
            <div className="space-y-0.25">
              {/* Row 1 */}
              <div className="grid grid-cols-3 text-center">
                <Link to="/clientes" className="block text-white text-[0.9rem] font-bold hover:text-white/80 transition-colors py-0.25">
                  {t('mainNavigationContent.mobileSimple.customers')}
                </Link>
                <Link to="/affinity-stays" className="block text-white text-[0.9rem] font-bold hover:text-white/80 transition-colors py-0.25">
                  {t('mainNavigationContent.mobileSimple.affinities')}
                </Link>
                <Link to="/faq" className="block text-white text-[0.9rem] font-bold hover:text-white/80 transition-colors py-0.25">
                  FAQ
                </Link>
              </div>
              
              {/* Row 2 */}
              <div className="grid grid-cols-3 text-center">
                <Link to="/lider-living" className="block text-white text-[0.9rem] font-bold hover:text-white/80 transition-colors py-0.25">
                  {t('mainNavigationContent.mobileSimple.groupLeader')}
                </Link>
                <Link to="/promotor-local" className="block text-white text-[0.9rem] font-bold hover:text-white/80 transition-colors py-0.25">
                  {t('mainNavigationContent.mobileSimple.promoter')}
                </Link>
                <Link to="/ambassador" className="block text-white text-[0.9rem] font-bold hover:text-white/80 transition-colors py-0.25">
                  {t('mainNavigationContent.mobileSimple.ambassador')}
                </Link>
              </div>
              
              {/* Row 3 */}
              <div className="grid grid-cols-3 text-center">
                <Link to="/press" className="block text-white text-[0.9rem] font-bold hover:text-white/80 transition-colors py-0.25">
                  {t('mainNavigationContent.mobileSimple.press')}
                </Link>
                <Link to="/videos" className="block text-white text-[0.9rem] font-bold hover:text-white/80 transition-colors py-0.25">
                  {t('mainNavigationContent.mobileSimple.videos')}
                </Link>
                <Link to="/hotels" className="block text-white text-[0.9rem] font-bold hover:text-white/80 transition-colors py-0.25">
                  {t('mainNavigationContent.mobileSimple.hotel')}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile/Tablet Menu Overlay */}
        {isMenuOpen && (
          <div className="lg:hidden fixed inset-0 bg-black/50 z-50" onClick={() => setIsMenuOpen(false)}>
            <div className="absolute top-0 right-0 w-80 max-w-[90vw] h-full shadow-lg" style={{ backgroundColor: '#7E26A6' }} onClick={(e) => e.stopPropagation()}>
              <div className="p-6">
                <div className="flex justify-end mb-6">
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="text-white hover:text-white/80 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="space-y-4 text-right">
                  {/* About Us Section */}
                  <div>
                    <button
                      onClick={() => setIsAboutUsExpanded(!isAboutUsExpanded)}
                      className="w-full text-right text-lg font-bold text-white hover:text-white/80 transition-colors py-3 uppercase"
                    >
                      {t('mainNavigationContent.mobileMenu.aboutUs')}
                    </button>
                    {isAboutUsExpanded && (
                      <div className="mt-2 space-y-2 text-right pl-4">
                        <Link
                          to="/our-team"
                          className="block text-white hover:text-white/80 hover:underline py-2 text-sm uppercase"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {t('mainNavigationContent.mobileMenu.ourTeam')}
                        </Link>
                        <Link
                          to="/our-values"
                          className="block text-white hover:text-white/80 hover:underline py-2 text-sm uppercase"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {t('mainNavigationContent.mobileMenu.ourValues')}
                        </Link>
                        <Link
                          to="/our-services"
                          className="block text-white hover:text-white/80 hover:underline py-2 text-sm uppercase"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {t('mainNavigationContent.mobileMenu.ourServices')}
                        </Link>
                        <Link
                          to="/customer-service"
                          className="block text-white hover:text-white/80 hover:underline py-2 text-sm uppercase"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {t('mainNavigationContent.mobileMenu.customerService')}
                        </Link>
                        <Link
                          to="/contact"
                          className="block text-white hover:text-white/80 hover:underline py-2 text-sm uppercase"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {t('mainNavigationContent.mobileMenu.contact')}
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Legal Section */}
                  <div>
                    <button
                      onClick={() => setIsLegalExpanded(!isLegalExpanded)}
                      className="w-full text-right text-lg font-bold text-white hover:text-white/80 transition-colors py-3 uppercase"
                    >
                      {t('mainNavigationContent.mobileMenu.legal')}
                    </button>
                    {isLegalExpanded && (
                      <div className="mt-2 space-y-2 text-right pl-4">
                        <Link
                          to="/intellectual-property"
                          className="block text-white hover:text-white/80 hover:underline py-2 text-sm uppercase"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {t('mainNavigationContent.mobileMenu.intellectualProperty')}
                        </Link>
                        <Link
                          to="/terms-and-conditions"
                          className="block text-white hover:text-white/80 hover:underline py-2 text-sm uppercase"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {t('mainNavigationContent.mobileMenu.termsAndConditions')}
                        </Link>
                        <Link
                          to="/privacy-and-cookies"
                          className="block text-white hover:text-white/80 hover:underline py-2 text-sm uppercase"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {t('mainNavigationContent.mobileMenu.privacyAndCookies')}
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </header>
    
    {/* Customer Service Phone - Fixed Position Top-Right */}
    <div className="fixed top-20 right-4 z-[100] hidden md:block">
      <CustomerServicePhone />
      {/* Scrolling Message directly below */}
      <div className="mt-1">
        <ScrollingMessage />
      </div>
    </div>
    
    {/* Customer Service Phone - Mobile Version - Non-fixed with timed visibility */}
    {isMobile === true && (
      <div className="absolute top-24 right-2 z-[100]">
        <CustomerServicePhone />
      </div>
    )}
    
    {/* Scrolling Message - Mobile Version - Full width at top */}
    {isMobile === true && (
      <div className="fixed top-0 left-0 right-0 z-[150]">
        <ScrollingMessage />
      </div>
    )}
    </>
  );
}
