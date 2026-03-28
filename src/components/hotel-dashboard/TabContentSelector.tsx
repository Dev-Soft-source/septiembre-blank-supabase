
import React from "react";
import { SuspenseWrapper } from "@/components/modern/SuspenseWrapper";
import { AlertTriangle, RefreshCcw } from "lucide-react";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import PropertiesContent from "@/components/dashboard/PropertiesContent";
import { BookingsContent } from "@/components/dashboard/BookingsContent";
import { GuestsContent } from "@/components/dashboard/GuestsContent";
import { AdminMessagesContent } from "@/components/dashboard/hotel-messages/AdminMessagesContent";
import { FinancesContent } from "@/components/dashboard/FinancesContent";
import { ReviewsContent } from "@/components/dashboard/ReviewsContent";
import AdvertisingContent from "@/components/dashboard/AdvertisingContent";
import { AnalyticsContent } from "@/components/dashboard/AnalyticsContent";
import SettingsContent from "@/components/dashboard/SettingsContent";
import { RatesCalculatorContent } from "@/components/dashboard/RatesCalculatorContent";
import { WelcomeOverviewContent } from "@/components/dashboard/WelcomeOverviewContent";
import { TermsConditionsContent } from "@/components/dashboard/TermsConditionsContent";
// AddProperty2Content removed with JotForm removal
import { HotelReferralsContent } from "@/components/dashboard/HotelReferralsContent";
import { AvailabilityPackagesContent } from "@/components/dashboard/AvailabilityPackagesContent";
import { NewHotelRegistrationContent } from "@/components/dashboard/NewHotelRegistrationContent";
import { QuickGuideContent } from "@/components/dashboard/QuickGuideContent";
import GroupDealResponsesContent from "@/components/dashboard/hotel/GroupDealResponsesContent";

// Error fallback for individual tab content
const TabErrorFallback = ({ tabName }: { tabName: string }) => (
  <div className="p-6 text-center">
    <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-yellow-400" />
    <h3 className="text-lg font-semibold mb-2 text-white">
      Error Loading {tabName}
    </h3>
    <p className="text-white/70 mb-4">
      This section failed to load. This might be caused by ad blockers or browser extensions.
    </p>
    <button 
      onClick={() => window.location.reload()} 
      className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors text-white"
    >
      <RefreshCcw className="w-4 h-4" />
      Reload Page
    </button>
  </div>
);

interface TabContentSelectorProps {
  activeTab: string;
  setActiveTab?: (tab: string) => void;
}

export default function TabContentSelector({ activeTab, setActiveTab }: TabContentSelectorProps) {
  const renderTabContent = () => {
    switch (activeTab) {
      case "welcome-overview":
        return (
          <SuspenseWrapper errorFallback={<TabErrorFallback tabName="Welcome Overview" />}>
            <WelcomeOverviewContent />
          </SuspenseWrapper>
        );
      case "rates-calculator":
        return (
          <SuspenseWrapper errorFallback={<TabErrorFallback tabName="Rates Calculator" />}>
            <RatesCalculatorContent />
          </SuspenseWrapper>
        );
      case "quick-guide":
        return (
          <SuspenseWrapper errorFallback={<TabErrorFallback tabName="Quick Guide" />}>
            <QuickGuideContent />
          </SuspenseWrapper>
        );
      case "dashboard":
        return (
          <SuspenseWrapper errorFallback={<TabErrorFallback tabName="Dashboard" />}>
            <DashboardContent setActiveTab={setActiveTab} />
          </SuspenseWrapper>
        );
      case "packages":
        return (
          <SuspenseWrapper errorFallback={<TabErrorFallback tabName="Packages" />}>
            <AvailabilityPackagesContent />
          </SuspenseWrapper>
        );
      case "properties":
        return (
          <SuspenseWrapper errorFallback={<TabErrorFallback tabName="Properties" />}>
            <PropertiesContent />
          </SuspenseWrapper>
        );
      case "bookings":
        return (
          <SuspenseWrapper errorFallback={<TabErrorFallback tabName="Bookings" />}>
            <BookingsContent />
          </SuspenseWrapper>
        );
      case "guests":
        return (
          <SuspenseWrapper errorFallback={<TabErrorFallback tabName="Guests" />}>
            <GuestsContent />
          </SuspenseWrapper>
        );
      case "messages":
        return (
          <SuspenseWrapper errorFallback={<TabErrorFallback tabName="Messages" />}>
            <AdminMessagesContent />
          </SuspenseWrapper>
        );
      case "finances":
        return (
          <SuspenseWrapper errorFallback={<TabErrorFallback tabName="Finances" />}>
            <FinancesContent />
          </SuspenseWrapper>
        );
      case "reviews":
        return (
          <SuspenseWrapper errorFallback={<TabErrorFallback tabName="Reviews" />}>
            <ReviewsContent />
          </SuspenseWrapper>
        );
      case "advertising":
        return (
          <SuspenseWrapper errorFallback={<TabErrorFallback tabName="Advertising" />}>
            <AdvertisingContent />
          </SuspenseWrapper>
        );
      case "analytics":
        return (
          <SuspenseWrapper errorFallback={<TabErrorFallback tabName="Analytics" />}>
            <AnalyticsContent />
          </SuspenseWrapper>
        );
      case "referrals":
        return (
          <SuspenseWrapper errorFallback={<TabErrorFallback tabName="Referrals" />}>
            <HotelReferralsContent />
          </SuspenseWrapper>
        );
      case "settings":
        return (
          <SuspenseWrapper errorFallback={<TabErrorFallback tabName="Settings" />}>
            <SettingsContent />
          </SuspenseWrapper>
        );
      case "terms-conditions":
        return (
          <SuspenseWrapper errorFallback={<TabErrorFallback tabName="Terms & Conditions" />}>
            <TermsConditionsContent />
          </SuspenseWrapper>
        );
      case "add-property-2":
        return <div className="p-6 text-center text-white">JotForm integration removed. Use the 16-step form instead.</div>;
      case "add-property-new":
        return (
          <SuspenseWrapper errorFallback={<TabErrorFallback tabName="Add Property" />}>
            <NewHotelRegistrationContent />
          </SuspenseWrapper>
        );
      case "request-group-leader":
        const RequestGroupLeaderContent = React.lazy(() => import("@/components/hotel-dashboard/RequestGroupLeaderContent").then(m => ({ default: m.RequestGroupLeaderContent })));
        return (
          <SuspenseWrapper errorFallback={<TabErrorFallback tabName="Request Group Leader" />}>
            <RequestGroupLeaderContent />
          </SuspenseWrapper>
        );
      case "profile":
        const HotelProfileTabbed = React.lazy(() => import("@/components/dashboard/hotel/tabs/HotelProfileTabbed"));
        return (
          <SuspenseWrapper errorFallback={<TabErrorFallback tabName="Profile" />}>
            <HotelProfileTabbed />
          </SuspenseWrapper>
        );
      case "group-deal-responses":
        return (
          <SuspenseWrapper errorFallback={<TabErrorFallback tabName="Group Deal Responses" />}>
            <GroupDealResponsesContent />
          </SuspenseWrapper>
        );
      default:
        return (
          <SuspenseWrapper errorFallback={<TabErrorFallback tabName="Dashboard" />}>
            <DashboardContent setActiveTab={setActiveTab} />
          </SuspenseWrapper>
        );
    }
  };

  return renderTabContent();
}
