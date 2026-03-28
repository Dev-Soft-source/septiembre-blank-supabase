import React, { ReactNode, useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { LogOut, HelpCircle, ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { DashboardTab, DashboardGroup } from "@/types/dashboard";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { HotelStarfield } from "@/components/hotels/HotelStarfield";
import { useTranslation } from "@/hooks/useTranslation";
import { PageTransitionBar } from "@/components/layout/PageTransitionBar";
import { ConnectionIndicator } from "@/components/ui/connection-indicator";
import { isDeveloperAccount, isLovableDevelopmentMode } from "@/utils/dashboardSecurity";
import { TopRightReferralCode } from "@/components/dashboard/shared/TopRightReferralCode";

interface GroupedDashboardLayoutProps {
  children: ReactNode;
  activeTab: string;
  tabs: DashboardTab[];
  groups: DashboardGroup[];
  setActiveTab: (tab: string) => void;
}

const managementTabs = ['bookings', 'guests', 'finances', 'reviews', 'analytics'];

export default function GroupedDashboardLayout({
  children,
  activeTab,
  tabs,
  groups,
  setActiveTab
}: GroupedDashboardLayoutProps) {
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
  
  // State for group expansion - management group expanded on desktop, collapsed on mobile
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(() => {
    const isDesktop = window.innerWidth >= 1024;
    return isDesktop ? new Set(['management']) : new Set();
  });

  // Check authentication with developer override for Lovable environment
  useEffect(() => {
    const checkAccess = async () => {
      if (isLovableDevelopmentMode()) {
        return;
      }
      
      if (!isLoading) {        
        if (!user || !session) {
          navigate("/login/hotel", { replace: true });
        }
      }
    };
    
    checkAccess();
  }, [user, session, isLoading, navigate]);

  const partnerName = profile?.first_name && profile?.last_name ? `${profile.first_name} ${profile.last_name}` : profile?.first_name || 'Hotel Partner';
  
  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const { performEnhancedLogout } = await import('@/utils/browserCache');
      await performEnhancedLogout(signOut);
      
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error logging out. Please try again.",
        variant: "destructive",
      });
      
      try {
        await signOut();
      } catch (fallbackError) {
        console.error("Fallback logout also failed:", fallbackError);
      }
    }
  };

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };

  // Check if current tab is in management group for special styling
  const isManagementTab = managementTabs.includes(activeTab);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>;
  }

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
                    {/* Ungrouped tabs */}
                    {tabs.filter(tab => !tab.group).map(tab => (
                      <button 
                        key={tab.id} 
                        data-tab={tab.id} 
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
                    
                    {/* Grouped tabs */}
                    {groups.map(group => (
                      <div key={group.id} className="mt-1">
                        <button
                          onClick={() => toggleGroup(group.id)}
                          className="w-full flex items-center justify-between gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-300 text-left hover:scale-105 hover:bg-white/10 text-white/90"
                        >
                          <span className="font-semibold">{group.label}</span>
                          {expandedGroups.has(group.id) ? (
                            <ChevronDown className="w-4 h-4 transition-transform duration-200" />
                          ) : (
                            <ChevronRight className="w-4 h-4 transition-transform duration-200" />
                          )}
                        </button>
                        
                        {expandedGroups.has(group.id) && (
                          <div className="ml-4 space-y-1 mt-1 animate-accordion-down">
                            {group.items.map(tab => (
                              <button 
                                key={tab.id} 
                                data-tab={tab.id} 
                                onClick={() => setActiveTab(tab.id)} 
                                className={cn(
                                  "w-full flex items-center justify-start gap-3 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300 text-left hover:scale-105", 
                                  activeTab === tab.id 
                                    ? "bg-white/20 text-white shadow-[0_0_15px_rgba(0,200,255,0.6)]" 
                                    : "hover:bg-white/10 text-white/80"
                                )}
                              >
                                {tab.icon}
                                <span className="text-left">{tab.label}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                    
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
                {/* Apply special styling for management tabs */}
                <div className={cn(
                  "transition-all duration-300 rounded-lg",
                  isManagementTab && "bg-[#4E2E90] p-6 shadow-[inset_4px_0_0_#ffffff44] text-white"
                )}>
                  {children}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <ConnectionIndicator />
    </div>
  );
}