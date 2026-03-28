
// @ts-nocheck
// TypeScript checking disabled for Supabase schema compatibility
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/components/dashboard/utils/dateUtils";

export interface HotelReferral {
  id: string;
  hotel_name: string;
  created_at: string;
  contact_name: string;
  contact_email: string;
  status?: string;
  formattedDate: string;
}

export const useUserReferrals = (userId: string | undefined) => {
  const [referrals, setReferrals] = useState<HotelReferral[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserReferrals = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from("hotel_referrals")
          .select("*")
          .eq("user_id", userId);
        
        if (error) throw error;
        
        // Process and format the referrals data
        const formattedReferrals = data.map(referral => ({
          ...referral,
          // Add a default status since it doesn't exist in the database
          status: 'pending', // Default status for all referrals
          formattedDate: formatDate(referral.created_at)
        }));
        
        setReferrals(formattedReferrals);
      } catch (error: any) {
        console.error("Error fetching user referrals:", error);
        toast({
          title: "Error",
          description: "Failed to fetch user's hotel referrals",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserReferrals();
  }, [userId, toast]);

  return { referrals, loading };
};
