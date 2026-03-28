
// @ts-nocheck
// TypeScript checking disabled for Supabase schema compatibility
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency } from "@/components/dashboard/property-view/utils/formatters";

export const useUserTotalSpent = (userId: string | undefined) => {
  const [totalSpent, setTotalSpent] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [formattedTotal, setFormattedTotal] = useState<string>('$0');

  useEffect(() => {
    const fetchUserTotalSpent = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const { data: bookings, error } = await supabase
          .from("bookings")
          .select("total_price")
          .eq("user_id", userId)
          .eq("status", "confirmed");

        if (error) {
          console.error("Error fetching user total spent:", error);
          setTotalSpent(0);
        } else {
          const total = bookings?.reduce((sum, booking) => sum + (booking.total_price || 0), 0) || 0;
          setTotalSpent(total);
          setFormattedTotal(formatCurrency(total));
        }
      } catch (error) {
        console.error("Exception fetching user total spent:", error);
        setTotalSpent(0);
      } finally {
        setLoading(false);
      }
    };

    fetchUserTotalSpent();
  }, [userId]);

  return { totalSpent, formattedTotal, loading };
};
