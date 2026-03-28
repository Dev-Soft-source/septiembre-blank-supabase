
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { isLovableDevelopmentMode } from "@/utils/dashboardSecurity";

export function useMyRoles() {
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchMyRoles = async () => {
      // Developer bypass: Allow unrestricted access in Lovable environment
      if (isLovableDevelopmentMode()) {
        console.log('useMyRoles: Developer override active, granting all roles');
        setRoles(['admin', 'hotel_owner', 'association', 'promoter', 'leaderliving', 'user']);
        setLoading(false);
        return;
      }

      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('user_id', user.id)
          .single();
        
        if (error) {
          setError(error.message);
          console.error("Error fetching user roles:", error);
        } else {
          setRoles(data ? [data.role] : []);
        }
      } catch (err) {
        setError("Failed to fetch roles");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyRoles();
  }, [user?.id]);

  return { roles, loading, error };
}
