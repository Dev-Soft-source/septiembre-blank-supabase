import { supabase } from "@/integrations/supabase/client";

// Define compatible Profile type that matches the actual usage
export interface ProfileCompat {
  id: string;
  role?: string;
  is_hotel_owner?: boolean;
}

/**
 * Checks if current user is in Lovable development environment
 */
export const isLovableDevelopmentMode = (): boolean => {
  const hostname = window.location.hostname;
    
  // Always grant development bypass in Lovable environment  
  const isLovableEnv = import.meta.env.DEV || 
                       hostname.includes('lovable.app') || 
                       hostname.includes('lovable.dev') ||
                       hostname.includes('lovableproject.com') ||
                       hostname === 'localhost' ||
                       hostname === '127.0.0.1';
  
  // IMPORTANT: Do NOT grant development bypass for production domain
  const isProductionDomain = hostname === 'hotel-living.com' || 
                            hostname === 'www.hotel-living.com';
  
  if (isProductionDomain) {
    return false;
  }
  
  if (isLovableEnv) {
    return true;
  }
  
  return false;
};

/**
 * Checks if current user is a developer account in Lovable environment
 */
export const isDeveloperAccount = (userEmail: string | null): boolean => {
  return isLovableDevelopmentMode();
};

/**
 * Checks if current environment is development or user has admin privileges
 * This allows unrestricted access for administrators and during development
 */
export const isDevelopmentOrAdmin = async (userEmail?: string): Promise<boolean> => {
  // Check for Lovable development environment first (no authentication needed)
  if (isLovableDevelopmentMode()) {
    return true;
  }
  
  // Always allow access in development
  if (import.meta.env.DEV) {
    return true;
  }
  
  try {
    // Check if current user has admin role through profiles table
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .single();
    
    if (error) {
      console.error('isDevelopmentOrAdmin: Error checking admin role:', error);
      console.error('isDevelopmentOrAdmin: Error details:', { 
        message: error.message, 
        details: error.details,
        hint: error.hint,
        code: error.code 
      });
      return false;
    }
    
    if (profile?.role === 'admin') {
      return true;
    }
    
    return profile?.role === 'admin';
  } catch (error) {
    console.error('isDevelopmentOrAdmin: Unexpected error:', error);
    return false;
  }
};

/**
 * Dashboard type to role mapping for access control
 */
export type DashboardType = 'user' | 'hotel' | 'association' | 'promoter' | 'admin';

export const DASHBOARD_ROLE_MAP: Record<DashboardType, string[]> = {
  user: ['user'],
  hotel: ['hotel', 'hotel_owner'],
  association: ['association'],
  promoter: ['promoter'],
  admin: ['admin']
};

/**
 * Validates if a user has access to a specific dashboard type
 */
export const validateDashboardAccess = async (
  profile: ProfileCompat | null,
  dashboardType: DashboardType,
  userEmail?: string
): Promise<boolean> => {
  const isDevOrAdmin = await isDevelopmentOrAdmin(userEmail);
  if (isDevOrAdmin) {
    return true;
  }
  
  if (!profile) {
    return false;
  }
  
  const allowedRoles = DASHBOARD_ROLE_MAP[dashboardType];
  
  if (dashboardType === 'hotel') {
    const hasAccess = (
      allowedRoles.includes(profile.role || '') || 
      profile.is_hotel_owner === true
    );
    return hasAccess;
  }

  const hasAccess = allowedRoles.includes(profile.role || '');
  return hasAccess;
};

/**
 * Gets the appropriate redirect URL based on user's actual role
 */
export const getRedirectUrlForRole = (profile: ProfileCompat | null): string => {
  if (!profile) return '/';
  
  switch (profile.role) {
    case 'admin':
      return '/panel-admin';
    case 'hotel_owner':
    case 'hotel':
      return '/hotel-dashboard';
    case 'association':
      return '/association-dashboard';
    case 'promoter':
      return '/promoter/dashboard';
    case 'user':
    default:
      return '/user-dashboard';
  }
};

/**
 * Universal security safeguard that redirects unauthorized users to homepage
 * Use this for production security when manual access attempts are made
 */
export const enforceProductionSecurity = async (
  profile: ProfileCompat | null,
  dashboardType: DashboardType,
  userEmail?: string
): Promise<void> => {
  const hasAccess = await validateDashboardAccess(profile, dashboardType, userEmail);
  
  if (!hasAccess) {
    // Only redirect in production - allow development to continue
    if (!isLovableDevelopmentMode()) {
      window.location.href = '/';
    }
  }
};
