import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { isLovableDevelopmentMode } from '@/utils/dashboardSecurity';

interface Profile {
  id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  role?: string;
  is_hotel_owner?: boolean;
  created_at?: string;
  updated_at?: string;
  avatar_url?: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  isLoading: boolean;
  isAuthComplete: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cache profile data to prevent redundant fetches
  const getCachedProfile = (userId: string): Profile | null => {
    try {
      const cached = sessionStorage.getItem(`profile_${userId}`);
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  };

  const setCachedProfile = (userId: string, profileData: Profile) => {
    try {
      sessionStorage.setItem(`profile_${userId}`, JSON.stringify(profileData));
    } catch {
      // Ignore cache errors
    }
  };


  useEffect(() => {
    // Get initial session with enhanced error handling, fallback logic and retry mechanism
    const getInitialSession = async (retryCount = 0) => {
      const maxRetries = 2;

      try {
        // Progressive timeout based on retry attempts and environment
        const isProduction = window.location.hostname.includes('hotel-living.com');
        const baseTimeout = isProduction ? 20000 : 15000; // Increased base timeout
        const timeout = baseTimeout + (retryCount * 5000); // Add 5s per retry


        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error(`Session fetch timeout after ${timeout}ms`)), timeout)
        );

        const { data: { session }, error } = await Promise.race([
          sessionPromise,
          timeoutPromise
        ]) as any;

        if (error) {
          console.error(`AuthContext Debug - Session fetch error (attempt ${retryCount + 1}):`, error);

          // Retry logic for session fetch failures
          if (retryCount < maxRetries && !error.message?.includes('timeout')) {
            await new Promise(resolve => setTimeout(resolve, 2000));
            return await getInitialSession(retryCount + 1);
          }

          // Final fallback: try to get user from localStorage or clear state
          console.error('AuthContext Debug - All session fetch attempts failed, checking fallback options');
          await handleSessionFallback();
          return;
        }

        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          // Enhanced profile fetch with retry logic
          try {
            await Promise.race([
              fetchProfileWithRetry(session.user.id),
              new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Profile fetch timeout')), 10000)
              )
            ]);
          } catch (profileError) {
            console.error('Profile fetch failed or timed out:', profileError);
            // Continue with user authentication even if profile fails
            // This prevents the loading screen from being stuck
          }
        }

        setIsLoading(false);

      } catch (error) {
        console.error(`Error in getInitialSession (attempt ${retryCount + 1}):`, error);

        // Retry logic for unexpected errors
        if (retryCount < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 3000));
          return await getInitialSession(retryCount + 1);
        }

        // Final fallback after all retries
        console.error('AuthContext Debug - All getInitialSession attempts failed, using fallback');
        await handleSessionFallback();
      }
    };

    // Fallback handler for when session fetch completely fails
    const handleSessionFallback = async () => {
      try {
        // Clear any potentially corrupted session data
        await supabase.auth.signOut({ scope: 'local' });

        // Reset state to ensure clean slate
        setSession(null);
        setUser(null);
        setProfile(null);
        setIsLoading(false);

        // If we're on admin route, redirect to login after delay
        if (window.location.pathname.includes('admin') || window.location.pathname.includes('entrada-admin')) {
          setTimeout(() => {
            if (!user) { // Only redirect if still no user after timeout
              window.location.href = '/entrada-admin';
            }
          }, 2000);
        }

      } catch (fallbackError) {
        console.error('AuthContext Debug - Error in session fallback:', fallbackError);
        setIsLoading(false);
      }
    };

    // Enhanced profile fetch with retry logic
    const fetchProfileWithRetry = async (userId: string, retryCount = 0) => {
      const maxRetries = 2;

      try {
        // Check for cached profile first
        const cachedProfile = getCachedProfile(userId);
        if (cachedProfile && retryCount === 0) {
          setProfile(cachedProfile);
          return;
        }

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error(`Profile fetch error (attempt ${retryCount + 1}):`, error);

          if (retryCount < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            return await fetchProfileWithRetry(userId, retryCount + 1);
          }

          // Use cached profile as final fallback
          if (cachedProfile) {
            setProfile(cachedProfile);
          }
          return;
        }

        setProfile(data);

        // Cache the profile data
        if (data) {
          setCachedProfile(userId, data);
        }
      } catch (error) {
        console.error(`Profile fetch error (attempt ${retryCount + 1}):`, error);

        if (retryCount < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          return await fetchProfileWithRetry(userId, retryCount + 1);
        }

        // Final fallback to cached data
        const cachedProfile = getCachedProfile(userId);
        if (cachedProfile) {
          setProfile(cachedProfile);
        }
      }
    };

    getInitialSession();

    // Set up auth state listener with improved persistence handling
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // Handle different auth events with better state management
        if (event === 'SIGNED_IN' && session?.user) {
          // Check if we already have valid session and profile to prevent redundant fetch
          const hasValidSession = !!session;
          const hasProfile = !!profile;
          const isSameUser = profile?.id === session.user.id;

          if (hasValidSession && hasProfile && isSameUser) {
            setSession(session);
            setUser(session.user);
            setIsLoading(false);
            return;
          }

          // Keep loading true while fetching profile to prevent premature redirects
          setIsLoading(true);
          setSession(session);
          setUser(session.user);

          // Fetch profile data after sign in with timeout and graceful error handling
          try {
            await Promise.race([
              fetchProfileWithRetry(session.user.id),
              new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Profile fetch timeout during auth change')), 8000)
              )
            ]);
          } catch (profileError) {
            console.error('Profile fetch failed during auth change:', profileError);
            // Load dashboard with cached data if available, don't block indefinitely
            const cachedProfile = getCachedProfile(session.user.id);
            if (cachedProfile) {
              setProfile(cachedProfile);
            }
          }
          setIsLoading(false);
        } else if (event === 'SIGNED_OUT') {
          setSession(null);
          setUser(null);
          setProfile(null);
          setIsLoading(false);
        } else if (event === 'TOKEN_REFRESHED' && session) {
          // Handle token refresh without disrupting UI
          setSession(session);
          setUser(session.user);
          // Don't change loading state or refetch profile
        } else {
          // Handle other events gracefully
          setSession(session);
          setUser(session?.user ?? null);
          if (!session) {
            setProfile(null);
          }
          setIsLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      setIsLoading(true);

      // Clear profile and user state immediately
      setProfile(null);
      setUser(null);
      setSession(null);

      // Clear all cached profile data
      try {
        Object.keys(sessionStorage).forEach(key => {
          if (key.startsWith('profile_')) {
            sessionStorage.removeItem(key);
          }
        });
      } catch (e) {
        console.warn('Failed to clear profile cache:', e);
      }

      // Sign out from Supabase with all scopes
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      if (error) {
        console.error('Error signing out:', error);
        throw error;
      } else {
        // Clear browser cache and redirect to signing page
        try {
          localStorage.clear();
          sessionStorage.clear();
        } catch (e) {
          console.warn('Failed to clear browser storage:', e);
        }
        // Redirect to Index page after successful logout
        window.location.href = "/";
      }
    } catch (error) {
      console.error('Error signing out:', error);
      // Even if there's an error, clear storage and redirect to signing page
      try {
        localStorage.clear();
        sessionStorage.clear();
      } catch (e) {
        console.warn('Failed to clear browser storage:', e);
      }
      window.location.href = "/";
    } finally {
      setIsLoading(false);
    }
  };

  const isAuthComplete = !isLoading && !!user;

  const value: AuthContextType = {
    user,
    profile,
    session,
    isLoading,
    isAuthComplete,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;