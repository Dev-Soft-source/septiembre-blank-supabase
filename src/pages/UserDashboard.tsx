
import { useState, useEffect } from "react";
import { 
  Calendar, 
  CreditCard, 
  History, 
  LayoutDashboard, 
  Settings, 
  User, 
  Building,
  Gift,
  Heart,
  Star,
  Bell,
  Crown,
  Users
} from "lucide-react";
import { Footer } from "@/components/Footer";
import UserDashboardLayout from "@/components/dashboard/user/UserDashboardLayout";
import DashboardContent from "@/components/dashboard/user/tabs/DashboardContent";
import BookingsContent from "@/components/dashboard/user/tabs/BookingsContent";
import HistoryContent from "@/components/dashboard/user/tabs/HistoryContent";
import SavedContent from "@/components/dashboard/user/tabs/SavedContent";
import PaymentsContent from "@/components/dashboard/user/tabs/PaymentsContent";
import ProfileContent from "@/components/dashboard/user/tabs/ProfileContent";
import GetThreeNightsContent from "@/components/dashboard/user/tabs/GetThreeNightsContent";
import BecomeAmbassadorContent from "@/components/dashboard/user/tabs/BecomeAmbassadorContent";
import { DashboardTab } from "@/types/dashboard";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "@/hooks/useTranslation";
import { enforceProductionSecurity } from "@/utils/dashboardSecurity";

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation('dashboard/user');
  
  // Critical: Monitor auth state and redirect immediately on logout
  useEffect(() => {
    const isLovableEnv = import.meta.env.DEV || 
                        window.location.hostname.includes('lovable.app') || 
                        window.location.hostname.includes('lovable.dev') ||
                        window.location.hostname.includes('lovableproject.com');
    
    if (isLovableEnv) {
      console.log("Developer override: Lovable environment detected, allowing User Dashboard access");
      return; // Skip all authentication checks in development
    }
    
    // Immediate redirect on logout - no dashboard should remain visible after signOut
    if (!user) {
      console.log("No user found, redirecting to home");
      window.location.href = '/';
      return;
    }
    
    console.log("User dashboard initialized for:", user.email);
  }, [user]);
  
  // Create tabs with language-specific labels
  const getTabLabel = (key: string) => {
    return t(`userDashboard.navigation.${key}`);
  };
  
  const tabs: DashboardTab[] = [
    { id: "dashboard", label: getTabLabel("dashboard"), icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: "bookings", label: getTabLabel("bookings"), icon: <Calendar className="w-5 h-5" /> },
    { id: "getThreeNights", label: getTabLabel("threeNights"), icon: <Gift className="w-5 h-5" /> },
    { id: "becomeAmbassador", label: getTabLabel("becomeAmbassador"), icon: <Crown className="w-5 h-5" /> },
    { id: "history", label: getTabLabel("history"), icon: <History className="w-5 h-5" /> },
    { id: "payments", label: getTabLabel("payments"), icon: <CreditCard className="w-5 h-5" /> },
    { id: "profile", label: getTabLabel("profile"), icon: <User className="w-5 h-5" /> },
  ];
  
  const renderContent = () => {
    switch(activeTab) {
      case "dashboard": return <DashboardContent />;
      case "bookings": return <BookingsContent />;
      case "getThreeNights": return <GetThreeNightsContent />;
      case "becomeAmbassador": return <BecomeAmbassadorContent />;
      case "history": return <HistoryContent />;
      case "payments": return <PaymentsContent />;
      case "profile": return <ProfileContent />;
      default: return <DashboardContent />;
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <UserDashboardLayout
        activeTab={activeTab}
        tabs={tabs}
        setActiveTab={setActiveTab}
      >
        {renderContent()}
      </UserDashboardLayout>
      <Footer />
    </div>
  );
}
