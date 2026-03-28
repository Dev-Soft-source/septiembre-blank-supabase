
import React, { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import DashboardContent from "./DashboardContent";
import BookingsContent from "./BookingsContent";
import SavedContent from "./SavedContent";
import HistoryContent from "./HistoryContent";
import PaymentsContent from "./PaymentsContent";
import ProfileContent from "./ProfileContent";
import GetThreeNightsContent from "./GetThreeNightsContent";

export const UserDashboardLayout = () => {
  const { user, session, profile, isLoading } = useAuth();
  
  // For development purposes - allow access to the dashboard without authentication
  const isDevelopment = process.env.NODE_ENV === 'development';

  // Check if user is authenticated AND has correct user role
  useEffect(() => {
    // Skip the auth check in development mode
    if (isDevelopment) return;
    
    // Only check if auth is complete
    if (!isLoading) {
      // First check authentication
      if (!user || !session) {
        console.log("No authenticated user detected in user dashboard layout, redirecting to home");
        window.location.href = "/";
        return;
      }
      
      // Then check user role
      if (profile && profile.role !== 'user') {
        console.log("User does not have user role, redirecting based on role:", profile.role);
        // Redirect to appropriate dashboard based on user's actual role
        switch(profile.role) {
          case 'hotel':
            if (profile.is_hotel_owner) {
              window.location.href = "/hotel-dashboard";
            } else {
              window.location.href = "/user-dashboard";
            }
            break;
          case 'association':
            window.location.href = "/association-dashboard";
            break;
          case 'promoter':
            window.location.href = "/promoter/dashboard";
            break;
          case 'admin':
            window.location.href = "/admin";
            break;
          default:
            console.log("Unknown role, staying in user dashboard");
        }
        return;
      }
    }
  }, [user, session, profile, isDevelopment, isLoading]);

  // If not authenticated and not in development mode, don't render anything
  if (!user && !session && !isDevelopment) {
    return null;
  }

  // If authenticated but not a user (and not in dev mode), don't render
  if (!isDevelopment && profile && profile.role !== 'user') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1A1F2C] to-[#2D1B69] pt-20">
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid grid-cols-4 lg:grid-cols-7 w-full mb-8 bg-purple-900/30 p-1 rounded-xl backdrop-blur-sm">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-fuchsia-600 text-xs lg:text-sm">Dashboard</TabsTrigger>
            <TabsTrigger value="bookings" className="data-[state=active]:bg-fuchsia-600 text-xs lg:text-sm">Bookings</TabsTrigger>
            <TabsTrigger value="saved" className="data-[state=active]:bg-fuchsia-600 text-xs lg:text-sm">Saved</TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-fuchsia-600 text-xs lg:text-sm">History</TabsTrigger>
            <TabsTrigger value="payments" className="data-[state=active]:bg-fuchsia-600 text-xs lg:text-sm">Payments</TabsTrigger>
            <TabsTrigger value="get-three-nights" className="data-[state=active]:bg-fuchsia-600 text-xs lg:text-sm">3 Nights</TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-fuchsia-600 text-xs lg:text-sm">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <DashboardContent />
          </TabsContent>

          <TabsContent value="bookings">
            <BookingsContent />
          </TabsContent>

          <TabsContent value="saved">
            <SavedContent />
          </TabsContent>

          <TabsContent value="history">
            <HistoryContent />
          </TabsContent>

          <TabsContent value="payments">
            <PaymentsContent />
          </TabsContent>

          <TabsContent value="get-three-nights">
            <GetThreeNightsContent />
          </TabsContent>

          <TabsContent value="profile">
            <ProfileContent />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
