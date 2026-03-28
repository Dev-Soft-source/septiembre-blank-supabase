
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { isLovableDevelopmentMode } from "@/utils/dashboardSecurity";

export function useIsAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkRole = async () => {
      // Developer bypass: Allow unrestricted access in Lovable environment
      if (isLovableDevelopmentMode()) {
        console.log('useIsAdmin: Developer override active, granting admin access');
        setIsAdmin(true);
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setIsAdmin(false);
        return;
      }

      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);

      const roles = data?.map(r => r.role) || [];
      setIsAdmin(roles.includes("admin"));
    };

    checkRole();
  }, []);

  return isAdmin;
}
