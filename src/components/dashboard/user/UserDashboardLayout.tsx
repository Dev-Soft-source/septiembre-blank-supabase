import React, { ReactNode } from "react";
import { Navbar } from "@/components/Navbar";
import { HelpCircle, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { DashboardTab } from "@/types/dashboard";
import { useAuth } from "@/context/auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { HotelStarfield } from "@/components/hotels/HotelStarfield";
import { useTranslation } from "@/hooks/useTranslation";
import { useEffect } from "react";
import { enforceProductionSecurity, isLovableDevelopmentMode } from "@/utils/dashboardSecurity";
import { TopRightReferralCode } from "@/components/dashboard/shared/TopRightReferralCode";

interface UserDashboardLayoutProps {
  children: ReactNode;
  activeTab: string;
  tabs: DashboardTab[];
  setActiveTab: (tab: string) => void;
}

export default function UserDashboardLayout({
  children,
  activeTab,
  tabs,
  setActiveTab
}: UserDashboardLayoutProps) {
  const { signOut, user, session, profile, isLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useTranslation('dashboard/user');

  // Check authentication and user dashboard access
  useEffect(() => {
    const checkAccess = async () => {
      // Developer override: Skip all authentication in Lovable environment
      if (isLovableDevelopmentMode()) {
        console.log('UserDashboard: Lovable development mode - bypassing all authentication checks');
        return; // Skip all authentication checks
      }
      
      // Only check if auth is complete
      if (!isLoading) {
        // First check authentication
        if (!user || !session) {
          console.log("No authenticated user detected in user dashboard layout, redirecting to home");
          window.location.href = "/";
          return;
        }
        
        // Apply universal security safeguard for production
        await enforceProductionSecurity(profile, 'user', user.email);
      }
    };
    
    checkAccess();
  }, [user, session, profile, isLoading]);
  
  // Handle logout using centralized method from AuthContext
  const handleLogout = async () => {
    try {
      console.log("User dashboard logout button clicked");
      await signOut();
      console.log("Logout successful, user should be redirected to main page");
      navigate('/');
    } catch (error) {
      console.error("Error during logout from user dashboard:", error);
      toast({
        title: "Error",
        description: "There was an error logging out. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const dashboardTitle = t('userDashboard.title');
  const needHelpTitle = t('userDashboard.help.needHelp');
  const supportDescription = t('userDashboard.help.supportDescription');
  const contactSupport = t('userDashboard.help.contactSupport');
  const logOut = t('userDashboard.actions.logOut');
  
  return (
    <div className="min-h-screen flex flex-col animate-fade-in">
      <HotelStarfield />
      <Navbar />
      
      <main className="flex-1 pt-16 animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
        <div className="container max-w-6xl mx-auto px-4 py-8">
          <div className="bg-[#630297]/90 backdrop-blur-sm rounded-lg p-8 text-white shadow-[0_0_60px_rgba(0,200,255,0.8),0_0_120px_rgba(0,200,255,0.4),0_0_180px_rgba(0,200,255,0.2)] transition-all duration-300 hover:shadow-[0_0_70px_rgba(0,200,255,0.9),0_0_140px_rgba(0,200,255,0.5),0_0_200px_rgba(0,200,255,0.3)]">
            <div className="flex justify-between items-start mb-8">
              <h1 className="text-3xl font-bold glow">{dashboardTitle}</h1>
              <div className="flex-shrink-0">
                <TopRightReferralCode />
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Sidebar */}
              <aside className="lg:col-span-1">
                <div className="bg-[#630297]/60 backdrop-blur-sm rounded-2xl overflow-hidden mb-8 shadow-[0_0_30px_rgba(0,200,255,0.4)]">
                  <nav className="p-2">
                    {tabs.map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                          "w-full flex items-center justify-start gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-300 text-left hover:scale-105",
                          activeTab === tab.id
                            ? "bg-white/20 text-white shadow-[0_0_15px_rgba(0,200,255,0.6)]"
                            : "hover:bg-white/10 text-white/80"
                        )}
                      >
                        {tab.icon}
                        <span className="text-left">{tab.label}</span>
                      </button>
                    ))}
                    
                    <div className="px-4 py-3">
                      <div className="h-px bg-white/20 my-2"></div>
                    </div>
                    
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-start gap-3 rounded-lg px-4 py-3 text-sm font-medium text-white/80 hover:bg-white/10 transition-all duration-300 text-left hover:scale-105"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="text-left">{logOut}</span>
                    </button>
                  </nav>
                </div>
                
                <div className="bg-[#630297]/60 backdrop-blur-sm rounded-2xl p-5 shadow-[0_0_30px_rgba(0,200,255,0.4)]">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                      <HelpCircle className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-sm font-semibold text-white">{needHelpTitle}</h3>
                  </div>
                  <p className="text-sm text-white/80 mb-4">
                    {supportDescription}
                  </p>
                  <button className="w-full py-2 rounded-lg text-sm font-medium transition-all duration-300 text-white bg-white/20 hover:bg-white/30 shadow-[0_0_15px_rgba(0,200,255,0.4)] hover:scale-105 hover:shadow-[0_0_20px_rgba(0,200,255,0.6)]">
                    {contactSupport}
                  </button>
                </div>
              </aside>
              
              {/* Main Content */}
              <div className="lg:col-span-3">
                {children}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}