
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useBookingsCount } from "./useBookingsCount";
import { useCompletedStays } from "./useCompletedStays";
import { useSavedHotelsCount } from "./useSavedHotelsCount";
import { useUpcomingStay } from "./useUpcomingStay";
import { useRecentActivities } from "./useRecentActivities";
import { RecentActivity, UpcomingStay } from "../types/dashboard";

export function useDashboardData() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Use individual hooks
  const { bookingsCount } = useBookingsCount();
  const { completedStaysCount } = useCompletedStays();
  const { savedHotelsCount } = useSavedHotelsCount();
  const { upcomingStay } = useUpcomingStay();
  const { recentActivities } = useRecentActivities();
  
  // Combine loading states
  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    
    // This is now simplified as the individual hooks handle their own loading states
    setIsLoading(false);
  }, [user]);
  
  return {
    upcomingStay,
    bookingsCount,
    completedStaysCount,
    savedHotelsCount,
    recentActivities,
    isLoading
  };
}
