
import React from "react";
import { Link } from "react-router-dom";
import { Building, Shield, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HotelStarfield } from "@/components/hotels/HotelStarfield";

export default function DashboardSelection() {
  const { profile } = useAuth();
  const isAdmin = useIsAdmin();

  return (
    <div className="min-h-screen flex flex-col">
      <HotelStarfield />
      <Navbar />
      
      <main className="flex-1 pt-16">
        <div className="container max-w-4xl mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">Choose Your Dashboard</h1>
            <p className="text-white/80 text-lg">Select the dashboard you want to access</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* User Dashboard - Always available */}
            <Link
              to="/user-dashboard"
              className="group glass-card rounded-2xl p-8 bg-gradient-to-br from-purple-900/20 to-fuchsia-900/20 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-purple-600/20 flex items-center justify-center mb-4 group-hover:bg-purple-600/30 transition-colors">
                  <User className="w-8 h-8 text-purple-300" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">User Dashboard</h3>
                <p className="text-white/70">Manage your bookings, preferences, and profile</p>
              </div>
            </Link>

            {/* Hotel Dashboard - Only for hotel owners */}
            {profile?.is_hotel_owner && (
              <Link
                to="/hotel-dashboard"
                className="group glass-card rounded-2xl p-8 bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-blue-600/20 flex items-center justify-center mb-4 group-hover:bg-blue-600/30 transition-colors">
                    <Building className="w-8 h-8 text-blue-300" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Hotel Dashboard</h3>
                  <p className="text-white/70">Manage your properties, bookings, and guests</p>
                </div>
              </Link>
            )}

            {/* Admin Dashboard - Only for admins */}
            {isAdmin && (
              <Link
                to="/admin"
                className="group glass-card rounded-2xl p-8 bg-gradient-to-br from-red-900/20 to-pink-900/20 border border-red-500/20 hover:border-red-400/40 transition-all duration-300"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-red-600/20 flex items-center justify-center mb-4 group-hover:bg-red-600/30 transition-colors">
                    <Shield className="w-8 h-8 text-red-300" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Admin Dashboard</h3>
                  <p className="text-white/70">Manage system settings, users, and content</p>
                </div>
              </Link>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
