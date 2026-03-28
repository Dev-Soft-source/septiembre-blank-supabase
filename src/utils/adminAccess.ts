import { supabase } from '@/integrations/supabase/client';
import { isLovableDevelopmentMode } from '@/utils/dashboardSecurity';

export interface AdminCheckResult {
  isAdmin: boolean;
  source: 'development' | 'admin_users' | 'user_roles' | 'none';
  userId?: string;
  error?: string;
}

/**
 * Comprehensive admin access validator
 * Checks multiple sources and provides fallback mechanisms
 */
export async function validateAdminAccess(userId?: string): Promise<AdminCheckResult> {
  try {
    // Developer override: Always grant admin access in Lovable environment
    if (isLovableDevelopmentMode()) {
      console.log('AdminAccess: Lovable development mode - granting unrestricted admin access');
      return { isAdmin: true, source: 'development' };
    }

    // If no userId provided, get from current session
    let targetUserId = userId;
    if (!targetUserId) {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session?.user) {
        return { isAdmin: false, source: 'none', error: 'No authenticated session' };
      }
      targetUserId = session.user.id;
    }

    // Parallel check both admin sources for efficiency
    const [roleResult, adminResult] = await Promise.all([
      supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', targetUserId)
        .eq('role', 'admin')
        .maybeSingle(),
      supabase
        .from('admin_users')
        .select('id')
        .eq('id', targetUserId)
        .maybeSingle()
    ]);

    // Check for admin role in user_roles table
    if (roleResult.data && !roleResult.error) {
      console.log('AdminAccess: Admin access granted via user_roles table');
      return { isAdmin: true, source: 'user_roles', userId: targetUserId };
    }

    // Check for admin entry in admin_users table
    if (adminResult.data && !adminResult.error) {
      console.log('AdminAccess: Admin access granted via admin_users table');
      return { isAdmin: true, source: 'admin_users', userId: targetUserId };
    }

    // Log any errors for debugging
    if (roleResult.error) {
      console.error('AdminAccess: Error checking user_roles:', roleResult.error);
    }
    if (adminResult.error) {
      console.error('AdminAccess: Error checking admin_users:', adminResult.error);
    }

    console.log('AdminAccess: No admin privileges found');
    return { isAdmin: false, source: 'none', userId: targetUserId };

  } catch (error) {
    console.error('AdminAccess: Validation error:', error);
    return { 
      isAdmin: false, 
      source: 'none', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Quick boolean check for admin access
 */
export async function isUserAdmin(userId?: string): Promise<boolean> {
  const result = await validateAdminAccess(userId);
  return result.isAdmin;
}

/**
 * Admin session validator with automatic redirect
 */
export async function requireAdminAccess(redirectPath = '/entrada-admin'): Promise<boolean> {
  const result = await validateAdminAccess();
  
  if (!result.isAdmin) {
    console.log('AdminAccess: Access denied, redirecting to:', redirectPath);
    window.location.href = redirectPath;
    return false;
  }
  
  return true;
}

/**
 * Middleware for protecting admin routes
 */
export function withAdminGuard<T extends (...args: any[]) => any>(
  fn: T,
  onUnauthorized?: () => void
): T {
  return (async (...args: any[]) => {
    const isAdmin = await isUserAdmin();
    
    if (!isAdmin) {
      console.log('AdminAccess: Unauthorized access attempt blocked');
      if (onUnauthorized) {
        onUnauthorized();
      } else {
        window.location.href = '/entrada-admin';
      }
      return;
    }
    
    return fn(...args);
  }) as T;
}