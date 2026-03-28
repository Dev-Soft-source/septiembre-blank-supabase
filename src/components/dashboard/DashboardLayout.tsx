import React, { ReactNode, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { LogOut, HelpCircle, Building } from "lucide-react";
import { cn } from "@/lib/utils";
import { DashboardTab } from "@/types/dashboard";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { HotelStarfield } from "@/components/hotels/HotelStarfield";
import { useTranslation } from "@/hooks/useTranslation";
import { PageTransitionBar } from "@/components/layout/PageTransitionBar";
import { ConnectionIndicator } from "@/components/ui/connection-indicator";
import { isDeveloperAccount, isLovableDevelopmentMode } from "@/utils/dashboardSecurity";
import { TopRightReferralCode } from "@/components/dashboard/shared/TopRightReferralCode";

interface DashboardLayoutProps {
  children: ReactNode;
  activeTab: string;
  tabs: DashboardTab[];
  setActiveTab: (tab: string) => void;
}

export default function DashboardLayout({
  children,
  activeTab,
  tabs,
  setActiveTab
}: DashboardLayoutProps) {
  const {
    profile,
    signOut,
    user,
    session,
    isLoading
  } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useTranslation("dashboard");

  // Check authentication with developer override for Lovable environment
  useEffect(() => {
    const checkAccess = async () => {
      // Developer override: Skip all authentication in Lovable environment
      if (isLovableDevelopmentMode()) {
        console.log('HotelDashboard: Lovable development mode - bypassing all authentication checks');
        return; // Skip all authentication checks
      }
      
      // Only check if auth is complete for non-Lovable environments
      if (!isLoading) {        
        if (!user || !session) {
          console.log("No authenticated user detected in hotel dashboard layout, redirecting to login");
          navigate("/login/hotel", { replace: true });
        }
      }
    };
    
    checkAccess();
  }, [user, session, isLoading, navigate]);

  // Use profile data or fallback to defaults
  const partnerName = profile?.first_name && profile?.last_name ? `${profile.first_name} ${profile.last_name}` : profile?.first_name || 'Hotel Partner';
  
  // Handle logout using centralized method from AuthContext
  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      console.log("Hotel dashboard logout button clicked");
      
      // Import enhanced logout for Edge compatibility
      const { performEnhancedLogout } = await import('@/utils/browserCache');
      await performEnhancedLogout(signOut);
      
      console.log("Enhanced logout completed");
    } catch (error) {
      console.error("Error during logout from hotel dashboard:", error);
      toast({
        title: "Error",
        description: "There was an error logging out. Please try again.",
        variant: "destructive",
      });
      
      // Fallback: try basic signOut
      try {
        await signOut();
      } catch (fallbackError) {
        console.error("Fallback logout also failed:", fallbackError);
      }
    }
  };

  // If still loading auth state, show loading or wait
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>;
  }

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // Don't render if not authenticated (security handled in useEffect), unless in Lovable dev mode
  if (!isLovableDevelopmentMode() && (!user || !session)) {
    return null;
  }
  
  return (
    <div className="min-h-screen flex flex-col animate-fade-in">
      <PageTransitionBar />
      <HotelStarfield />
      <Navbar />
      
      <main className="flex-1 pt-16 animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
        <div className="container max-w-6xl mx-auto px-4 py-8">
          <div className="bg-[#630297]/90 backdrop-blur-sm rounded-lg p-8 text-white shadow-[0_0_60px_rgba(0,200,255,0.8),0_0_120px_rgba(0,200,255,0.4),0_0_180px_rgba(0,200,255,0.2)] transition-all duration-300 hover:shadow-[0_0_70px_rgba(0,200,255,0.9),0_0_140px_rgba(0,200,255,0.5),0_0_200px_rgba(0,200,255,0.3)]">
            <div className="flex justify-between items-start mb-8">
              <h1 className="text-3xl font-bold glow">
                {t('general.hotelManagement')}
              </h1>
              <div className="flex-shrink-0">
                <TopRightReferralCode />
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Sidebar */}
              <aside className="lg:col-span-1">
                <div className="bg-[#630297]/60 backdrop-blur-sm rounded-2xl overflow-hidden mb-8 shadow-[0_0_30px_rgba(0,200,255,0.4)]">
                  <nav className="p-2">
                    {tabs.map(tab => <button key={tab.id} data-tab={tab.id} onClick={() => setActiveTab(tab.id)} className={cn("w-full flex items-center justify-start gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-300 text-left hover:scale-105", activeTab === tab.id ? "bg-white/20 text-white shadow-[0_0_15px_rgba(0,200,255,0.6)]" : "hover:bg-white/10 text-white/80")}>
                        {tab.icon}
                        <span className="text-left">{tab.label}</span>
                      </button>)}
                    
                    <div className="px-4 py-3">
                      <div className="h-px bg-white/20 my-2"></div>
                    </div>
                    
                    <button 
                      onClick={handleLogout} 
                      type="button"
                      className="w-full flex items-center justify-start gap-3 rounded-lg px-4 py-3 text-sm font-medium text-white/80 hover:bg-white/10 transition-all duration-300 text-left hover:scale-105"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="text-left">{t('general.logOut')}</span>
                    </button>
                  </nav>
                </div>
                
                <div className="bg-[#630297]/60 backdrop-blur-sm rounded-2xl p-5 shadow-[0_0_30px_rgba(0,200,255,0.4)]">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                      <HelpCircle className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xs font-bold text-white">
                      {t('general.needHelp')}
                    </h3>
                  </div>
                  <p className="text-sm text-white/80 mb-4">
                    {t('general.supportDescription')}
                  </p>
                  <button className="w-full py-2 rounded-lg text-sm font-medium transition-all duration-300 text-white bg-white/20 hover:bg-white/30 shadow-[0_0_15px_rgba(0,200,255,0.4)] hover:scale-105 hover:shadow-[0_0_20px_rgba(0,200,255,0.6)]">
                    {t('general.contactSupport')}
                  </button>
                </div>
              </aside>
              
              {/* Main Content */}
              <div className="lg:col-span-3 relative">
                {children}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Connection Status Indicator */}
      <ConnectionIndicator />
    </div>
  );
}
