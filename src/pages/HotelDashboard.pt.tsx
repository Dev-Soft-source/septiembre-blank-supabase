
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

export default function HotelDashboardPT() {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const { profile } = useAuth();
  const { t } = useTranslation("dashboard");
  
  // Create dashboard tabs configuration with Portuguese labels - FINAL ORDER
  const tabs: DashboardTab[] = [
    {
      id: "dashboard",
      label: "Painel de Controle",
      icon: <BarChart3 className="w-5 h-5 text-blue-400" />
    },
    {
      id: "quick-guide",
      label: t('guide.tabTitle'),
      icon: <FileText className="w-5 h-5 text-amber-500" />
    },
    {
      id: "rates-calculator",
      label: "Calcule seu Modelo de Tarifas e Ganhos",
      icon: <Calculator className="w-5 h-5 text-green-400" />
    },
    {
      id: "add-property-new",
      label: "Adicionar Propriedade",
      icon: <Plus className="w-5 h-5 text-emerald-400" />
    },
    {
      id: "request-group-leader",
      label: "Solicitar Líder de Grupo",
      icon: <Users className="w-5 h-5 text-cyan-400" />
    },
    {
      id: "referrals",
      label: "Indique Hotéis e Ganhe Comissões",
      icon: <UserPlus className="w-5 h-5 text-yellow-400" />,
      group: "promotional"
    },
    {
      id: "advertising",
      label: "Obtenha Publicidade Gratuita",
      icon: <Megaphone className="w-5 h-5 text-fuchsia-400" />,
      group: "promotional"
    },
    {
      id: "properties",
      label: "Meus Hotéis",
      icon: <Building className="w-5 h-5 text-blue-600" />,
      group: "management"
    },
    {
      id: "bookings",
      label: "Reservas",
      icon: <Calendar className="w-5 h-5 text-teal-400" />,
      group: "management"
    },
    {
      id: "guests",
      label: "Hóspedes",
      icon: <Users className="w-5 h-5 text-violet-400" />,
      group: "management"
    },
    {
      id: "finances",
      label: "Finanças",
      icon: <CreditCard className="w-5 h-5 text-green-600" />,
      group: "management"
    },
    {
      id: "reviews",
      label: "Avaliações",
      icon: <Star className="w-5 h-5 text-orange-300" />,
      group: "management"
    },
    {
      id: "analytics",
      label: "Análises",
      icon: <TrendingUp className="w-5 h-5 text-cyan-300" />,
      group: "management"
    },
    {
      id: "profile",
      label: "Perfil",
      icon: <Users className="w-5 h-5 text-pink-400" />,
      group: "account"
    },
    {
      id: "settings",
      label: "Configurações",
      icon: <Settings className="w-5 h-5 text-slate-400" />,
      group: "account"
    },
    {
      id: "messages",
      label: "Mensagens do Admin",
      icon: <MessageCircle className="w-5 h-5 text-red-400" />,
      group: "account"
    },
    {
      id: "terms-conditions",
      label: "Termos e Condições",
      icon: <FileText className="w-5 h-5 text-amber-600" />,
      group: "legal"
    }
  ];

  // Create groups for sidebar organization
  const groups: DashboardGroup[] = [
    {
      id: "promotional",
      label: "Ferramentas Publicitárias",
      items: tabs.filter(tab => tab.group === "promotional"),
      defaultExpanded: false
    },
    {
      id: "management",
      label: "Gestão",
      items: tabs.filter(tab => tab.group === "management"),
      defaultExpanded: false
    },
    {
      id: "account",
      label: "Conta",
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
