
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Hotel, Calendar, CreditCard, BarChart3, MessageSquare, Megaphone, Heart, Filter, Users, TrendingUp, ImageIcon, FileText, Clock, Plus, Camera, Languages, Package, TestTube, DollarSign, Shield } from "lucide-react";
import { HotelStarfield } from "@/components/hotels/HotelStarfield";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const adminTabs = [{
  id: "32-day-hotels",
  name: "32-Day Hotels Creation",
  icon: Calendar,
  path: "/panel-admin/32-day-hotels",
  description: "Create 69 hotels for 32-day stays"
}, {
  id: "hotels",
  name: "Hotels",
  icon: Hotel,
  path: "/panel-admin/hotels",
  description: "Manage hotel listings"
}, {
  id: "bookings",
  name: "Bookings",
  icon: Calendar,
  path: "/panel-admin/bookings",
  description: "View and manage bookings"
}, {
  id: "payments",
  name: "Payments",
  icon: CreditCard,
  path: "/panel-admin/payments",
  description: "Payment management"
}, {
  id: "statistics",
  name: "Statistics",
  icon: BarChart3,
  path: "/panel-admin/statistics",
  description: "View platform statistics"
}, {
  id: "communications",
  name: "Communications",
  icon: MessageSquare,
  path: "/panel-admin/communications",
  description: "Manage communications"
}, {
  id: "advertising",
  name: "Advertising",
  icon: Megaphone,
  path: "/panel-admin/advertising",
  description: "Advertising management"
}, {
  id: "affinities",
  name: "Affinities",
  icon: Heart,
  path: "/panel-admin/affinities",
  description: "Manage affinities and themes"
}, {
  id: "filters",
  name: "Filters",
  icon: Filter,
  path: "/panel-admin/filters",
  description: "Manage search filters"
}, {
  id: "user-roles",
  name: "User Roles",
  icon: Users,
  path: "/panel-admin/user-roles",
  description: "Manage user roles"
}, {
  id: "analytics",
  name: "Analytics",
  icon: TrendingUp,
  path: "/panel-admin/analytics",
  description: "Advanced analytics"
}, {
  id: "translations",
  name: "Translations",
  icon: Languages,
  path: "/panel-admin/translations",
  description: "Manage hotel translations"
}, {
  id: "integrity-tests",
  name: "Integrity Tests",
  icon: TestTube,
  path: "/panel-admin/integrity-tests",
  description: "System integrity and business logic validation"
}, {
  id: "batches",
  name: "Batches",
  icon: Package,
  path: "/panel-admin/batches",
  description: "Batch operations and tools"
}, {
  id: "notification-logs",
  name: "Notification Logs",
  icon: FileText,
  path: "/panel-admin/notification-logs",
  description: "Admin notification events"
}, {
  id: "leader-requests",
  name: "Leader Requests",
  icon: Users,
  path: "/panel-admin/leader-requests",
  description: "Manage group leader requests from hotels"
}, {
  id: "pdf-submissions",
  name: "PDF Submissions",
  icon: FileText,
  path: "/panel-admin/pdf-submissions",
  description: "Process PDF hotel registration forms"
}, {
  id: "price-corrector",
  name: "Price Corrector",
  icon: DollarSign,
  path: "/panel-admin/price-corrector",
  description: "Global hotel package price correction tool"
}, {
  id: "package-creator",
  name: "Package Creator",
  icon: Plus,
  path: "/panel-admin/package-creator",
  description: "Create missing availability packages for hotels"
}, {
  id: "stability-tests",
  name: "Stability Tests",
  icon: Shield,
  path: "/panel-admin/stability-tests",
  description: "P0 validation for circuit breakers, caching, and monitoring"
}];

export default function PanelFernandoLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const location = useLocation();
  return <div className="min-h-screen relative flex flex-col">
      <HotelStarfield />
      <Navbar />
      <div className="flex flex-1 pt-16">
        {/* Sidebar */}
        <div className="w-64 shadow-lg border-r border-white/20 bg-[#630297]/90 backdrop-blur-sm shadow-[0_0_60px_rgba(0,200,255,0.8),0_0_120px_rgba(0,200,255,0.4),0_0_180px_rgba(0,200,255,0.2)]">
          <div className="p-6 border-b border-white/20">
            <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-sm text-white">Management Panel</p>
          </div>
          
          <nav className="mt-6">
            <div className="px-3">
              {adminTabs.map(tab => {
              const Icon = tab.icon;
              const isActive = location.pathname === tab.path;
              return <Link key={tab.id} to={tab.path} className={`
                      flex items-center px-3 py-2 mb-1 rounded-lg text-sm font-medium transition-colors
                      ${isActive ? 'bg-white/20 text-white border-r-2 border-white/50' : 'text-white hover:bg-white/10'}
                    `}>
                    <Icon className="w-5 h-5 mr-3 text-white" />
                    <div className="flex-1">
                      <div className="font-medium text-white">{tab.name}</div>
                      <div className="text-xs text-white opacity-90">{tab.description}</div>
                    </div>
                  </Link>;
            })}
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-[#630297]/90 backdrop-blur-sm shadow-[0_0_60px_rgba(0,200,255,0.8),0_0_120px_rgba(0,200,255,0.4),0_0_180px_rgba(0,200,255,0.2)]">
          <div className="p-8 text-white">
            {children}
          </div>
        </div>
      </div>
      <Footer />
    </div>;
}
