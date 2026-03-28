
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { BarChart3, Building, Calendar, CreditCard, MessageCircle, Settings, Star, Users, Calculator, FileText, UserPlus, Hotel, Megaphone, TrendingUp, Plus } from "lucide-react";
import { DashboardTab, DashboardGroup } from "@/types/dashboard";
import { useTranslation } from "@/hooks/useTranslation";

// Import refactored components
import GroupedDashboardLayout from "@/components/dashboard/GroupedDashboardLayout";
import TabContentSelector from "@/components/hotel-dashboard/TabContentSelector";
import { Footer } from "@/components/Footer";
import { EnhancedAvatarAssistant } from "@/components/avatars/EnhancedAvatarAssistant";
import { ProfileCompletionWarning } from "@/components/auth/ProfileCompletionWarning";

export default function HotelDashboardEN() {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const { profile } = useAuth();
  const { t } = useTranslation("dashboard");
  
  // Create dashboard tabs configuration with English labels - FINAL ORDER
  const tabs: DashboardTab[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <BarChart3 className="w-5 h-5 text-blue-400" />
    },
    {
      id: "quick-guide",
      label: t('guide.tabTitle'),
      icon: <FileText className="w-5 h-5 text-amber-500" />
    },
    {
      id: "rates-calculator",
      label: "Calculate Your Rates and Earnings Model",
      icon: <Calculator className="w-5 h-5 text-green-400" />
    },
    {
      id: "add-property-new",
      label: "Add Property",
      icon: <Plus className="w-5 h-5 text-emerald-400" />
    },
    {
      id: "request-group-leader",
      label: "Request Group Leader",
      icon: <Users className="w-5 h-5 text-cyan-400" />
    },
    {
      id: "referrals",
      label: "Refer Hotels to Us and Earn Commissions",
      icon: <UserPlus className="w-5 h-5 text-yellow-400" />,
      group: "promotional"
    },
    {
      id: "advertising",
      label: "Get Free Advertising",
      icon: <Megaphone className="w-5 h-5 text-fuchsia-400" />,
      group: "promotional"
    },
    {
      id: "properties",
      label: "My Hotels",
      icon: <Building className="w-5 h-5 text-blue-600" />,
      group: "management"
    },
    {
      id: "bookings",
      label: "Bookings",
      icon: <Calendar className="w-5 h-5 text-purple-400" />,
      group: "management"
    },
    {
      id: "guests",
      label: "Guests",
      icon: <Users className="w-5 h-5 text-violet-400" />,
      group: "management"
    },
    {
      id: "finances",
      label: "Finances",
      icon: <CreditCard className="w-5 h-5 text-green-600" />,
      group: "management"
    },
    {
      id: "reviews",
      label: "Reviews",
      icon: <Star className="w-5 h-5 text-orange-300" />,
      group: "management"
    },
    {
      id: "group-deal-responses", 
      label: "Group Deal Responses",
      icon: <MessageCircle className="w-5 h-5 text-indigo-400" />,
      group: "management"
    },
    {
      id: "profile",
      label: "Profile",
      icon: <Users className="w-5 h-5 text-pink-400" />,
      group: "account"
    },
    {
      id: "settings",
      label: "Settings",
      icon: <Settings className="w-5 h-5 text-slate-400" />,
      group: "account"
    },
    {
      id: "messages",
      label: "Admin Messages",
      icon: <MessageCircle className="w-5 h-5 text-red-400" />,
      group: "account"
    },
    {
      id: "terms-conditions",
      label: "Terms and Conditions",
      icon: <FileText className="w-5 h-5 text-amber-600" />,
      group: "legal"
    }
  ];

  // Create groups for sidebar organization
  const groups: DashboardGroup[] = [
    {
      id: "promotional",
      label: "Promotional Tools",
      items: tabs.filter(tab => tab.group === "promotional"),
      defaultExpanded: false
    },
    {
      id: "management",
      label: "Management",
      items: tabs.filter(tab => tab.group === "management"),
      defaultExpanded: false
    },
    {
      id: "account",
      label: "Account",
      items: tabs.filter(tab => tab.group === "account"),
      defaultExpanded: false
    },
    {
      id: "legal",
      label: "Legal",
      items: tabs.filter(tab => tab.group === "legal"),
      defaultExpanded: false
    }
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      <GroupedDashboardLayout 
        activeTab={activeTab}
        tabs={tabs}
        groups={groups}
        setActiveTab={setActiveTab}
      >
        <div className="space-y-4">
          <ProfileCompletionWarning />
          <TabContentSelector activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      </GroupedDashboardLayout>
      <Footer />
      
    </div>
  );
}
