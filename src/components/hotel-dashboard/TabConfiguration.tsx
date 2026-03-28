
import { BarChart3, Building, Calendar, CreditCard, MessageCircle, Settings, Star, Users, Calculator, Heart, UserPlus } from "lucide-react";
import { DashboardTab } from "@/types/dashboard";
import { useTranslation } from "@/hooks/useTranslation";

export const getDashboardTabs = (): DashboardTab[] => {
  const { t } = useTranslation();
  
  return [
    {
      id: "welcome-overview",
      label: t('dashboard.welcomeOverview'),
      icon: <Heart className="w-5 h-5" />
    },
    {
      id: "dashboard",
      label: t('dashboard.dashboard'),
      icon: <BarChart3 className="w-5 h-5" />
    },
    {
      id: "rates-calculator",
      label: (
        <>
          {t('dashboard.calculateModel')}
          <br />
          {t('dashboard.ratesAndProfits')}
        </>
      ),
      icon: <Calculator className="w-5 h-5" />
    },
    {
      id: "properties",
      label: t('dashboard.properties'),
      icon: <Building className="w-5 h-5" />
    },
    {
      id: "advertising",
      label: t('dashboard.advertising'),
      icon: <BarChart3 className="w-5 h-5" />
    },
    {
      id: "bookings",
      label: t('dashboard.bookings'),
      icon: <Calendar className="w-5 h-5" />
    },
    {
      id: "guests",
      label: t('dashboard.guests'),
      icon: <Users className="w-5 h-5" />
    },
    {
      id: "messages",
      label: t('dashboard.adminMessages'),
      icon: <MessageCircle className="w-5 h-5" />
    },
    {
      id: "finances",
      label: t('dashboard.finances'),
      icon: <CreditCard className="w-5 h-5" />
    },
    {
      id: "reviews",
      label: t('dashboard.reviews'),
      icon: <Star className="w-5 h-5" />
    },
    {
      id: "analytics",
      label: t('dashboard.analytics'),
      icon: <BarChart3 className="w-5 h-5" />
    },
    {
      id: "referrals",
      label: t('dashboard.referrals.title'),
      icon: <UserPlus className="w-5 h-5" />
    },
    {
      id: "settings",
      label: t('dashboard.settings'),
      icon: <Settings className="w-5 h-5" />
    }
  ];
};
