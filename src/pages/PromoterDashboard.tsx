import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HotelStarfield } from "@/components/hotels/HotelStarfield";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { LogOut, User, Building, DollarSign, CreditCard, Calculator } from "lucide-react";
import { validateDashboardAccess, enforceProductionSecurity, isLovableDevelopmentMode } from "@/utils/dashboardSecurity";
import { cn } from "@/lib/utils";
import { DashboardTab } from "@/types/dashboard";
import { useTranslation } from "@/hooks/useTranslation";
import { TopRightReferralCode } from "@/components/dashboard/shared/TopRightReferralCode";

// Import dashboard components
import ReferredHotelsContent from "@/components/promoter/tabs/ReferredHotelsContent";
import CommissionsContent from "@/components/promoter/tabs/CommissionsContent";
import PaymentHistoryContent from "@/components/promoter/tabs/PaymentHistoryContent";
import CalculatorContent from "@/components/promoter/tabs/CalculatorContent";
export default function PromoterDashboard() {
  const {
    signOut,
    user,
    session,
    profile,
    isLoading
  } = useAuth();
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const {
    t,
    language
  } = useTranslation();
  const [activeTab, setActiveTab] = useState<string>("profile");

  // Check authentication and promoter dashboard access with improved persistence
  useEffect(() => {
    const checkAccess = async () => {
      // Developer override: Skip all authentication in Lovable environment
      if (isLovableDevelopmentMode()) {
        console.log('PromoterDashboard: Lovable development mode - bypassing all authentication checks');
        return; // Skip all authentication checks
      }

      // Only check if auth is complete and avoid race conditions
      if (!isLoading) {
        // Add small delay to prevent tab switching issues
        await new Promise(resolve => setTimeout(resolve, 50));

        // First check authentication
        if (!user || !session) {
          console.log("No authenticated user detected in promoter dashboard, redirecting to promoter login");
          // Use setTimeout to prevent race conditions
          setTimeout(() => navigate("/login/promoter"), 100);
          return;
        }

        // Apply universal security safeguard for production
        await enforceProductionSecurity(profile, 'promoter', user.email);

        // Additional promoter-specific validation
        const hasAccess = await validateDashboardAccess(profile, 'promoter', user.email);
        if (!hasAccess && profile) {
          console.log("User does not have promoter access, redirecting based on role:", profile.role);
          // Redirect to appropriate dashboard based on user's actual role
          switch (profile.role) {
            case 'user':
              navigate("/user-dashboard");
              break;
            case 'hotel':
            case 'hotel_owner':
              if (profile.is_hotel_owner) {
                navigate("/hotel-dashboard");
              } else {
                navigate("/user-dashboard");
              }
              break;
            case 'association':
              navigate("/association-dashboard");
              break;
            case 'admin':
              navigate("/admin");
              break;
            default:
              navigate("/user-dashboard");
          }
        }
      }
    };
    checkAccess();
  }, [user, session, profile, isLoading]);

  // Handle logout using centralized method from AuthContext
  const handleLogout = async () => {
    try {
      console.log("Promoter dashboard logout button clicked");
      await signOut(); // AuthContext handles redirect to '/'
      console.log("Logout successful, AuthContext will redirect to main page");
    } catch (error) {
      console.error("Error during logout from promoter dashboard:", error);
      toast({
        title: "Error",
        description: "There was an error logging out. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Critical: Monitor auth state and redirect immediately on logout
  useEffect(() => {
    if (!isLovableDevelopmentMode() && !isLoading && (!session || !user)) {
      console.log("Auth state cleared, redirecting to home");
      window.location.href = '/';
    }
  }, [user, session, isLoading]);

  // Show loading state while checking authentication
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>;
  }

  // Don't render if not authenticated (security handled in useEffect), unless in Lovable dev mode
  if (!isLovableDevelopmentMode() && (!user || !session)) {
    return null;
  }

  // Create tabs with language-specific labels
  const getTabLabel = (key: string) => {
    const translations = {
      profile: {
        en: "Profile",
        es: "Perfil",
        pt: "Perfil",
        ro: "Profil"
      },
      referredHotels: {
        en: "Referred Hotels",
        es: "Hoteles Referidos",
        pt: "Hotéis Referidos",
        ro: "Hoteluri Recomandate"
      },
      commissions: {
        en: "Commissions",
        es: "Comisiones",
        pt: "Comissões",
        ro: "Comisioane"
      },
      paymentHistory: {
        en: "Payment History",
        es: "Historial de Pagos",
        pt: "Histórico de Pagamentos",
        ro: "Istoric Plăți"
      },
      calculator: {
        en: "Calculator",
        es: "Calculadora",
        pt: "Calculadora",
        ro: "Calculator"
      }
    };
    return translations[key]?.[language] || translations[key]?.en || key;
  };
  const dashboardTitle = {
    en: "PROMOTER DASHBOARD",
    es: "PANEL DE PROMOTOR",
    pt: "PAINEL DO PROMOTOR",
    ro: "TABLOU DE BORD PROMOTOR"
  }[language] || "PROMOTER DASHBOARD";
  const tabs: DashboardTab[] = [{
    id: "profile",
    label: getTabLabel("profile"),
    icon: <User className="w-5 h-5" />
  }, {
    id: "referredHotels",
    label: getTabLabel("referredHotels"),
    icon: <Building className="w-5 h-5" />
  }, {
    id: "commissions",
    label: getTabLabel("commissions"),
    icon: <DollarSign className="w-5 h-5" />
  }, {
    id: "calculator",
    label: getTabLabel("calculator"),
    icon: <Calculator className="w-5 h-5" />
  }, {
    id: "paymentHistory",
    label: getTabLabel("paymentHistory"),
    icon: <CreditCard className="w-5 h-5" />
  }];
  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        const PromoterProfileContentUpdated = React.lazy(() => import("@/components/promoter/tabs/PromoterProfileContentUpdated"));
        return <React.Suspense fallback={<div className="p-6 text-center text-white">Loading...</div>}>
            <PromoterProfileContentUpdated />
          </React.Suspense>;
      case "referredHotels":
        return <ReferredHotelsContent />;
      case "commissions":
        return <CommissionsContent />;
      case "calculator":
        return <CalculatorContent />;
      case "paymentHistory":
        return <PaymentHistoryContent />;
      default:
        const PromoterProfileContentUpdatedDefault = React.lazy(() => import("@/components/promoter/tabs/PromoterProfileContentUpdated"));
        return <React.Suspense fallback={<div className="p-6 text-center text-white">Loading...</div>}>
            <PromoterProfileContentUpdatedDefault />
          </React.Suspense>;
    }
  };
  return <div className="min-h-screen flex flex-col animate-fade-in">
      <HotelStarfield />
      <Navbar />
      
      <main className="flex-1 pt-16 animate-fade-in" style={{
      animationDelay: '0.2s',
      animationFillMode: 'both'
    }}>
        <div className="container max-w-6xl mx-auto px-4 py-8">
          <div className="bg-[#630297]/90 backdrop-blur-sm rounded-lg p-8 text-white shadow-[0_0_60px_rgba(0,200,255,0.8),0_0_120px_rgba(0,200,255,0.4),0_0_180px_rgba(0,200,255,0.2)] transition-all duration-300 hover:shadow-[0_0_70px_rgba(0,200,255,0.9),0_0_140px_rgba(0,200,255,0.5),0_0_200px_rgba(0,200,255,0.3)]">
            {/* Referral Code Banner */}
            <div className="mb-6">
              
            </div>
            
            <div className="mb-8 flex justify-between items-start">
              <h1 className="text-3xl font-bold glow">{dashboardTitle}</h1>
              <div className="flex flex-col gap-4 items-end">
                <TopRightReferralCode />
                <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all duration-300 hover:scale-105 shadow-[0_0_15px_rgba(0,200,255,0.4)] hover:shadow-[0_0_20px_rgba(0,200,255,0.6)]">
                  <LogOut className="w-4 h-4" />
                  {language === 'pt' ? 'Sair' : language === 'ro' ? 'Deconectare' : language === 'es' ? 'Cerrar Sesión' : 'Log Out'}
                </button>
              </div>
            </div>

            {/* Business Card Generator Button */}
            <div className="mb-6">
              <button onClick={() => navigate('/promoter/card-generator')} className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl text-lg">
                {t('dashboard.business_card_button', {
                ns: 'promotor-local'
              })}
              </button>
            </div>

            {/* Modus Operandi Section */}
            <div className="mb-8 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <h2 className="text-xl font-bold mb-6 text-white">
                {t('dashboard.quick_guide_title', {
                ns: 'promotor-local'
              })}
              </h2>
              <div className="text-white/90 text-base leading-relaxed space-y-4">
                {t('dashboard.modus_operandi', {
                ns: 'promotor-local'
              }).split('\\n\\n').map((paragraph, index) => <p key={index} className="mb-4 last:mb-0">
                    {paragraph}
                  </p>)}
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Sidebar */}
              <aside className="lg:col-span-1">
                <div className="bg-[#630297]/60 backdrop-blur-sm rounded-2xl overflow-hidden mb-8 shadow-[0_0_30px_rgba(0,200,255,0.4)]">
                  <nav className="p-2">
                    {tabs.map(tab => <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={cn("w-full flex items-center justify-start gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-300 text-left hover:scale-105", activeTab === tab.id ? "bg-white/20 text-white shadow-[0_0_15px_rgba(0,200,255,0.6)]" : "hover:bg-white/10 text-white/80")}>
                        {tab.icon}
                        <span className="text-left">{tab.label}</span>
                      </button>)}
                  </nav>
                </div>
              </aside>
              
              {/* Main Content */}
              <div className="lg:col-span-3">
                {renderContent()}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>;
}