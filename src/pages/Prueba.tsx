
import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { LogOut, HelpCircle, Building, ClipboardList, CreditCard, BarChart3, MessageCircle, Megaphone, Users, Filter, Languages, UserCog, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Footer } from "@/components/Footer";
import { HotelStarfield } from "@/components/hotels/HotelStarfield";
import { supabase } from "@/integrations/supabase/client";

// Import components with error boundary handling
import PruebaHotels from "@/components/prueba/PruebaHotels";
import PruebaUsers from "@/components/prueba/PruebaUsers";
import PruebaBookings from "@/components/prueba/PruebaBookings";
import PruebaPayments from "@/components/prueba/PruebaPayments";
import PruebaAffinities from "@/components/prueba/PruebaAffinities";
import PruebaFilters from "@/components/prueba/PruebaFilters";
import PruebaTranslations from "@/components/prueba/PruebaTranslations";
import PruebaCommunications from "@/components/prueba/PruebaCommunications";
import PruebaAdvertising from "@/components/prueba/PruebaAdvertising";
import PruebaStatistics from "@/components/prueba/PruebaStatistics";
import PruebaRoles from "@/components/prueba/PruebaRoles";

// Error boundary component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('Prueba component error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

const pruebaTabs = [
  {
    id: "hotels",
    label: "Hotels",
    icon: <Building className="w-5 h-5" />,
    component: PruebaHotels
  },
  {
    id: "users", 
    label: "Users",
    icon: <Users className="w-5 h-5" />,
    component: PruebaUsers
  },
  {
    id: "bookings",
    label: "Bookings",
    icon: <ClipboardList className="w-5 h-5" />,
    component: PruebaBookings
  },
  {
    id: "payments",
    label: "Payments", 
    icon: <CreditCard className="w-5 h-5" />,
    component: PruebaPayments
  },
  {
    id: "affinities",
    label: "Affinities",
    icon: <Calendar className="w-5 h-5" />,
    component: PruebaAffinities
  },
  {
    id: "filters",
    label: "Filters",
    icon: <Filter className="w-5 h-5" />,
    component: PruebaFilters
  },
  {
    id: "translations",
    label: "Translations",
    icon: <Languages className="w-5 h-5" />,
    component: PruebaTranslations
  },
  {
    id: "communications",
    label: "Communications",
    icon: <MessageCircle className="w-5 h-5" />,
    component: PruebaCommunications
  },
  {
    id: "advertising",
    label: "Advertising",
    icon: <Megaphone className="w-5 h-5" />,
    component: PruebaAdvertising
  },
  {
    id: "statistics",
    label: "Statistics",
    icon: <BarChart3 className="w-5 h-5" />,
    component: PruebaStatistics
  },
  {
    id: "roles",
    label: "Roles",
    icon: <UserCog className="w-5 h-5" />,
    component: PruebaRoles
  }
];

export default function Prueba() {
  const [activeTab, setActiveTab] = useState("hotels");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  console.log('Prueba component loaded, user:', user);

  useEffect(() => {
    const checkAdminAccess = async () => {
      console.log('Checking admin access for Prueba page...');
      
      if (!user) {
        console.log('No user found, redirecting to login');
        navigate('/login');
        return;
      }

      try {
        // Check if user has admin role through profiles table
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
          .single();
        
        console.log('Admin check result:', { data: profile?.role === 'admin', error });
        
        if (error) {
          console.error('Error checking admin status:', error);
          toast({ 
            title: "Error", 
            description: "Could not verify admin status", 
            variant: "destructive" 
          });
          navigate('/');
          return;
        }

        if (!profile || profile.role !== 'admin') {
          console.log('User is not admin, redirecting');
          toast({ 
            title: "Access Denied", 
            description: "You do not have admin privileges", 
            variant: "destructive" 
          });
          navigate('/');
          return;
        }

        console.log('Admin access granted for Prueba page');
        setIsAdmin(true);
      } catch (error) {
        console.error('Unexpected error in admin check:', error);
        toast({ 
          title: "Error", 
          description: "An unexpected error occurred", 
          variant: "destructive" 
        });
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminAccess();
  }, [user, navigate, toast]);

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        description: "Redirecting to login page..."
      });
      navigate('/login');
    } catch (error) {
      toast({
        description: "Could not log out. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
          <p className="text-gray-600">You do not have admin privileges.</p>
        </div>
      </div>
    );
  }

  const ActiveComponent = pruebaTabs.find(tab => tab.id === activeTab)?.component || PruebaHotels;

  console.log('Rendering Prueba page with active tab:', activeTab);

  return (
    <div className="min-h-screen flex flex-col">
      <HotelStarfield />
      <Navbar />
      
      <main className="flex-1 pt-16">
        <div className="container max-w-6xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">ADMIN PANEL - PRUEBA</h1>
              <p className="text-white/60">Comprehensive Admin Management System</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <aside className="lg:col-span-1">
              <div className="rounded-2xl overflow-hidden mb-8 sticky top-24 bg-[#7a0486]">
                <nav className="p-2">
                  {pruebaTabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        console.log('Switching to tab:', tab.id);
                        setActiveTab(tab.id);
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors text-white",
                        activeTab === tab.id
                          ? "bg-[#5A1876]/50"
                          : "hover:bg-[#5A1876]/30"
                      )}
                    >
                      {tab.icon}
                      {tab.label}
                    </button>
                  ))}
                  
                  <div className="px-4 py-3">
                    <div className="h-px bg-fuchsia-900/20 my-2"></div>
                  </div>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-white hover:bg-[#5A1876]/30 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    Log Out
                  </button>
                </nav>
              </div>
              
              <div className="rounded-2xl p-5 bg-[#7a0486]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#5A1876]/20 flex items-center justify-center">
                    <HelpCircle className="w-5 h-5 text-fuchsia-300" />
                  </div>
                  <h3 className="font-bold text-white">Admin Support</h3>
                </div>
                <p className="text-sm text-white/80 mb-4">
                  Comprehensive admin tools for platform management and control.
                </p>
                <button className="w-full py-2 rounded-lg text-sm font-medium transition-colors text-white bg-[#5A1876] hover:bg-[#6B1F8A]">
                  Documentation
                </button>
              </div>
            </aside>
            
            <div className="lg:col-span-3">
              <ErrorBoundary 
                fallback={
                  <div className="p-6 bg-red-100 border border-red-400 rounded-lg">
                    <h3 className="text-red-800 font-bold">Component Error</h3>
                    <p className="text-red-600">There was an error loading the {activeTab} component.</p>
                  </div>
                }
              >
                <ActiveComponent />
              </ErrorBoundary>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
