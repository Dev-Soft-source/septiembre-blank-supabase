import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { validateAdminAccess } from "@/utils/adminAccess";
import { isLovableDevelopmentMode } from "@/utils/dashboardSecurity";

export const useAdminAccess = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);

  const checkAdminAccess = async () => {
    // Developer bypass: Allow unrestricted access in Lovable environment
    if (isLovableDevelopmentMode()) {
      console.log('useAdminAccess: Developer override active, granting admin access');
      setIsAdmin(true);
      return true;
    }

    if (!user) {
      navigate('/entrada-admin');
      return false;
    }

    try {
      console.log(`useAdminAccess: Checking admin access for user: ${user.email}`);
      
      const result = await validateAdminAccess(user.id);
      
      console.log('useAdminAccess: Validation result:', result);
      
      if (result.error) {
        console.error('useAdminAccess: Error during validation:', result.error);
        toast({ 
          title: "Error", 
          description: "Could not verify admin status", 
          variant: "destructive" 
        });
        navigate('/');
        return false;
      }

      if (!result.isAdmin) {
        toast({ 
          title: "Access Denied", 
          description: "You do not have admin privileges", 
          variant: "destructive" 
        });
        navigate('/');
        return false;
      }

      setIsAdmin(true);
      console.log('useAdminAccess: Admin access granted via:', result.source);
      return true;
    } catch (error) {
      console.error('useAdminAccess: Unexpected error during admin check:', error);
      toast({ 
        title: "Error", 
        description: "An unexpected error occurred", 
        variant: "destructive" 
      });
      navigate('/');
      return false;
    }
  };

  return {
    isAdmin,
    checkAdminAccess
  };
};