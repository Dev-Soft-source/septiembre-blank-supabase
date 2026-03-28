
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RegisteredHotelsTab } from './tabs/RegisteredHotelsTab';
import { CommissionsTab } from './tabs/CommissionsTab';
import { AssociationProfileContent } from './tabs/AssociationProfileContent';
import { AnalyticsTab } from './tabs/AnalyticsTab';
import { SuggestedLetterTab } from './tabs/SuggestedLetterTab';
import { CalculadoraTab } from './tabs/CalculadoraTab';
import { FoundingAssociationTab } from './tabs/FoundingAssociationTab';
import { ReferralCodeBanner } from '@/components/dashboard/shared/ReferralCodeBanner';
import { TopRightReferralCode } from '@/components/dashboard/shared/TopRightReferralCode';
import { HotelStarfield } from '@/components/hotels/HotelStarfield';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { LogOut } from 'lucide-react';
import { useTranslatedConsole } from '@/hooks/useTranslatedSystem';
import { validateDashboardAccess, enforceProductionSecurity, isLovableDevelopmentMode } from '@/utils/dashboardSecurity';
import { useTranslation } from '@/hooks/useTranslation';

export const AssociationDashboard = () => {
  const { signOut, user, session, profile, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const consoleLog = useTranslatedConsole();
  const { t } = useTranslation('associationDashboard');

  // Check authentication and association dashboard access with improved persistence
  useEffect(() => {
    const checkAccess = async () => {
      // Developer override: Skip all authentication in Lovable environment
      if (isLovableDevelopmentMode()) {
        console.log('AssociationDashboard: Lovable development mode - bypassing all authentication checks');
        return; // Skip all authentication checks
      }
      
      // Only check if auth is complete and avoid race conditions
      if (!isLoading) {
        // Add small delay to prevent tab switching issues
        await new Promise(resolve => setTimeout(resolve, 50));
        
        // First check authentication
        if (!user || !session) {
          consoleLog.log("userNotDetected", "in association dashboard, redirecting to association login");
          // Use setTimeout to prevent race conditions
          setTimeout(() => {
            window.location.href = "/login/association";
          }, 100);
          return;
        }
        
        // Check if user has association role in auth metadata (fallback for missing profiles)
        const userRole = user.user_metadata?.role || user.app_metadata?.role;
        console.log('AssociationDashboard: User role from metadata:', userRole);
        
        // If user has association role in metadata but no profile, allow access
        if (userRole === 'association' && !profile) {
          console.log('AssociationDashboard: Association user with missing profile, allowing access');
          return; // Allow access - profile will be created later
        }
        
        // Apply universal security safeguard for production only if we have a profile
        if (profile) {
          try {
            await enforceProductionSecurity(profile, 'association', user.email);
          } catch (error) {
            console.error('Production security check failed:', error);
          }
          
          // Additional association-specific validation
          const hasAccess = await validateDashboardAccess(profile, 'association', user.email);
          if (!hasAccess) {
            console.log("User does not have association access, redirecting based on role:", profile.role);
            // Redirect to appropriate dashboard based on user's actual role
            switch(profile.role) {
              case 'user':
                window.location.href = "/user-dashboard";
                break;
              case 'hotel':
              case 'hotel_owner':
                if (profile.is_hotel_owner) {
                  window.location.href = "/hotel-dashboard";
                } else {
                  window.location.href = "/user-dashboard";
                }
                break;
              case 'promoter':
                window.location.href = "/promoter/dashboard";
                break;
              case 'admin':
                window.location.href = "/admin";
                break;
              default:
                // Only redirect if user explicitly doesn't have association role
                if (userRole !== 'association') {
                  window.location.href = "/user-dashboard";
                }
            }
          }
        }
      }
    };
    
    checkAccess();
  }, [user, session, profile, isLoading]);

  // Handle logout using centralized method from AuthContext
  const handleLogout = async () => {
    try {
      console.log("Association dashboard logout button clicked");
      await signOut();
      console.log("Logout successful, user should be redirected to main page");
      navigate('/');
    } catch (error) {
      console.error("Error during logout from association dashboard:", error);
      toast({
        title: "Error",
        description: "There was an error logging out. Please try again.",
        variant: "destructive"
      });
    }
  };

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
      <HotelStarfield />
      <Navbar />
      
      <main className="flex-1 pt-16 animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
        <div className="container max-w-6xl mx-auto px-4 py-8">
          <div className="bg-[#630297]/90 backdrop-blur-sm rounded-lg p-8 text-white shadow-[0_0_60px_rgba(0,200,255,0.8),0_0_120px_rgba(0,200,255,0.4),0_0_180px_rgba(0,200,255,0.2)] transition-all duration-300 hover:shadow-[0_0_70px_rgba(0,200,255,0.9),0_0_140px_rgba(0,200,255,0.5),0_0_200px_rgba(0,200,255,0.3)]">
            <div className="mb-8 flex justify-between items-start">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2 glow">{t('title')}</h1>
                <p className="text-white/80 text-lg">{t('subtitle')}</p>
              </div>
              <div className="flex flex-col gap-4 items-end">
                <TopRightReferralCode />
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all duration-300 hover:scale-105 shadow-[0_0_15px_rgba(0,200,255,0.4)] hover:shadow-[0_0_20px_rgba(0,200,255,0.6)]"
                >
                  <LogOut className="w-4 h-4" />
                  {t('logoutButton')}
                </button>
              </div>
            </div>

            {/* Referral Code Banner */}
            <ReferralCodeBanner variant="compact" className="mb-6" />
            
            <div className="bg-[#630297]/60 backdrop-blur-sm rounded-2xl p-6 shadow-[0_0_30px_rgba(0,200,255,0.4)] relative">
              <Tabs defaultValue="registered" className="w-full">
                <TabsList className="grid w-full grid-cols-7 bg-[#630297]/40 backdrop-blur-sm border border-white/20 shadow-[0_0_15px_rgba(0,200,255,0.3)]">
                  <TabsTrigger 
                    value="registered" 
                    className="data-[state=active]:bg-white/20 data-[state=active]:text-white data-[state=active]:shadow-[0_0_10px_rgba(0,200,255,0.5)] text-white/80 hover:text-white transition-all duration-300 hover:scale-105"
                  >
                    {t('tabs.registeredHotels')}
                  </TabsTrigger>
                  <TabsTrigger 
                    value="commissions" 
                    className="data-[state=active]:bg-white/20 data-[state=active]:text-white data-[state=active]:shadow-[0_0_10px_rgba(0,200,255,0.5)] text-white/80 hover:text-white transition-all duration-300 hover:scale-105"
                  >
                    {t('tabs.commissions')}
                  </TabsTrigger>
                  <TabsTrigger 
                    value="letter" 
                    className="data-[state=active]:bg-white/20 data-[state=active]:text-white data-[state=active]:shadow-[0_0_10px_rgba(0,200,255,0.5)] text-white/80 hover:text-white transition-all duration-300 hover:scale-105"
                  >
                    {t('tabs.suggestedLetter')}
                  </TabsTrigger>
                  <TabsTrigger 
                    value="analytics" 
                    className="data-[state=active]:bg-white/20 data-[state=active]:text-white data-[state=active]:shadow-[0_0_10px_rgba(0,200,255,0.5)] text-white/80 hover:text-white transition-all duration-300 hover:scale-105"
                  >
                    {t('tabs.analytics')}
                  </TabsTrigger>
                  <TabsTrigger 
                    value="calculadora" 
                    className="data-[state=active]:bg-white/20 data-[state=active]:text-white data-[state=active]:shadow-[0_0_10px_rgba(0,200,255,0.5)] text-white/80 hover:text-white transition-all duration-300 hover:scale-105"
                  >
                    {t('tabs.calculadora')}
                  </TabsTrigger>
                  <TabsTrigger 
                    value="founding" 
                    className="data-[state=active]:bg-white/20 data-[state=active]:text-white data-[state=active]:shadow-[0_0_10px_rgba(0,200,255,0.5)] text-white/80 hover:text-white transition-all duration-300 hover:scale-105"
                  >
                    {t('tabs.foundingAssociation')}
                  </TabsTrigger>
                  <TabsTrigger 
                    value="account" 
                    className="data-[state=active]:bg-white/20 data-[state=active]:text-white data-[state=active]:shadow-[0_0_10px_rgba(0,200,255,0.5)] text-white/80 hover:text-white transition-all duration-300 hover:scale-105"
                  >
                    {t('tabs.myData')}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="registered" className="mt-6">
                  <RegisteredHotelsTab />
                </TabsContent>

                <TabsContent value="commissions" className="mt-6">
                  <CommissionsTab />
                </TabsContent>

                <TabsContent value="letter" className="mt-6">
                  <SuggestedLetterTab />
                </TabsContent>

                <TabsContent value="analytics" className="mt-6">
                  <AnalyticsTab />
                </TabsContent>

                <TabsContent value="calculadora" className="mt-6">
                  <CalculadoraTab />
                </TabsContent>

                <TabsContent value="founding" className="mt-6">
                  <FoundingAssociationTab />
                </TabsContent>

                <TabsContent value="account" className="mt-6">
                  <AssociationProfileContent />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};
