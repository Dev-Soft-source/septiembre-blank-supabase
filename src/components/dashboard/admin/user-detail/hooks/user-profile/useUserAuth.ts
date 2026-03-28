
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useUserAuth = (id: string | undefined) => {
  const [authData, setAuthData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    const fetchUserAuth = async () => {
      if (!id) return;
      
      try {
        // Use the get-user-email function to fetch email and auth data
        const { data, error } = await supabase.functions.invoke("get-user-email", {
          body: { userId: id }
        });

        if (error) throw error;
        
        setAuthData(data);
      } catch (error: unknown) {
        console.error("Error fetching user auth data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAuth();
  }, [id]);

  return { authData, loading };
};
