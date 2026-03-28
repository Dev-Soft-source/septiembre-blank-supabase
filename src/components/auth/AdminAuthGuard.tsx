import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { validateAdminAccess } from '@/utils/adminAccess';
import { isLovableDevelopmentMode } from '@/utils/dashboardSecurity';

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

export function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Developer bypass: Allow unrestricted access in Lovable environment
    if (isLovableDevelopmentMode()) {
      console.log('AdminAuthGuard: Developer override active, granting admin access');
      setUser({ id: 'dev-admin', email: 'admin@lovable.app' } as User);
      setIsAdmin(true);
      setLoading(false);
      return;
    }

    console.log('AdminAuthGuard: Starting auth check');
    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('AdminAuthGuard: Auth state changed', { event, session: !!session });
      
      if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsAdmin(false);
        setLoading(false);
        return;
      }
      
      if (session?.user) {
        setUser(session.user);
        await checkAdminAccessWithRetry(session.user.id);
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAuth = async (retryCount = 0) => {
    const maxRetries = 3;
    
    try {
      console.log(`AdminAuthGuard: Checking auth state (attempt ${retryCount + 1}/${maxRetries + 1})`);
      
      // Progressive timeout for admin auth check
      const timeout = 15000 + (retryCount * 5000); // 15s, 20s, 25s, 30s
      
      const sessionPromise = supabase.auth.getSession();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error(`Admin session check timeout after ${timeout}ms`)), timeout)
      );
      
      const { data: { session }, error: sessionError } = await Promise.race([
        sessionPromise,
        timeoutPromise
      ]) as any;
      
      console.log(`AdminAuthGuard: Session check result (attempt ${retryCount + 1}):`, { 
        session: !!session, 
        error: sessionError,
        userId: session?.user?.id,
        endpoint: 'https://pgdzrvdwgoomjnnegkcn.supabase.co'
      });
      
      if (sessionError) {
        console.error(`AdminAuthGuard: Session error (attempt ${retryCount + 1}):`, {
          error: sessionError,
          message: sessionError.message,
          code: sessionError.status || 'unknown',
          endpoint: 'https://pgdzrvdwgoomjnnegkcn.supabase.co/auth/v1/token'
        });
        
        // Retry logic for session errors
        if (retryCount < maxRetries && !sessionError.message?.includes('timeout')) {
          console.log(`AdminAuthGuard: Retrying session check in 2 seconds...`);
          await new Promise(resolve => setTimeout(resolve, 2000));
          return await checkAuth(retryCount + 1);
        }
        
        // Final fallback: redirect to login
        console.error('AdminAuthGuard: All session check attempts failed, redirecting to login');
        setUser(null);
        setIsAdmin(false);
        setLoading(false);
        return;
      }
      
      if (session?.user) {
        console.log('AdminAuthGuard: User found in session:', session.user.id);
        setUser(session.user);
        await checkAdminAccessWithRetry(session.user.id);
      } else {
        console.log('AdminAuthGuard: No user in session - redirecting to login');
        setUser(null);
        setIsAdmin(false);
      }
    } catch (error) {
      console.error(`AdminAuthGuard: Auth check error (attempt ${retryCount + 1}):`, {
        error: error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        endpoint: 'https://pgdzrvdwgoomjnnegkcn.supabase.co/auth/v1/token',
        userAgent: navigator.userAgent
      });
      
      // Retry logic for unexpected errors
      if (retryCount < maxRetries) {
        console.log(`AdminAuthGuard: Retrying auth check due to error in 3 seconds...`);
        await new Promise(resolve => setTimeout(resolve, 3000));
        return await checkAuth(retryCount + 1);
      }
      
      // Final fallback
      console.error('AdminAuthGuard: All auth check attempts failed');
      setUser(null);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  const checkAdminAccessWithRetry = async (userId: string, retryCount = 0) => {
    const maxRetries = 2;
    
    try {
      console.log(`AdminAuthGuard: Validating admin access (attempt ${retryCount + 1}/${maxRetries + 1}) for user:`, userId);
      
      const result = await validateAdminAccess(userId);
      
      console.log(`AdminAuthGuard: Admin validation result (attempt ${retryCount + 1}):`, result);
      
      setIsAdmin(result.isAdmin);
      
      if (result.error) {
        console.error(`AdminAuthGuard: Admin validation error (attempt ${retryCount + 1}):`, result.error);
        
        // Retry for certain types of errors
        if (retryCount < maxRetries && result.error.includes('timeout')) {
          console.log('AdminAuthGuard: Retrying admin validation in 1 second...');
          await new Promise(resolve => setTimeout(resolve, 1000));
          return await checkAdminAccessWithRetry(userId, retryCount + 1);
        }
      }
    } catch (error) {
      console.error(`AdminAuthGuard: Admin access check error (attempt ${retryCount + 1}):`, error);
      
      if (retryCount < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return await checkAdminAccessWithRetry(userId, retryCount + 1);
      }
      
      setIsAdmin(false);
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <LoadingSpinner />
          <p className="text-gray-600">Checking admin privileges...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log("AdminAuthGuard: No user found, redirecting to admin login");
    return <Navigate to="/entrada-admin" replace />;
  }

  if (!isAdmin) {
    console.log("AdminAuthGuard: User is not admin, showing access denied");
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">You don't have admin privileges to access this panel.</p>
          <p className="text-sm text-gray-500">User ID: {user.id}</p>
          <p className="text-sm text-gray-500">Email: {user.email}</p>
          <button 
            onClick={() => window.location.href = '/entrada-admin'} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Admin Login
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}