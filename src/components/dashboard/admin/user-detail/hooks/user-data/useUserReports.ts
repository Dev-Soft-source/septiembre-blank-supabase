
// @ts-nocheck
// TypeScript checking disabled for Supabase schema compatibility
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface UserReport {
  id: string;
  reported_user_id: string;
  hotel_id: string;
  reason: string;
  created_at: string;
  updated_at: string;
  status: string;
  hotel?: {
    id: string;
    name: string;
  };
}

export const useUserReports = (userId: string | undefined) => {
  const [reports, setReports] = useState<UserReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserReports = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("user_reports")
          .select("id, reported_user_id, reason, created_at, updated_at, status, hotel_id, hotel:hotels(id, name)")
          .eq("reported_user_id", userId);

        if (error) {
          console.error("Error fetching user reports:", error);
          setReports([]);
        } else {
          setReports(data || []);
        }
      } catch (error) {
        console.error("Exception fetching user reports:", error);
        setReports([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserReports();
  }, [userId]);

  return { reports, loading };
};
