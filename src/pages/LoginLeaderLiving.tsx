import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, Eye, EyeOff, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from '@/hooks/useTranslation';
import { SEOMetadata } from '@/components/SEOMetadata';
import { isLovableDevelopmentMode } from '@/utils/dashboardSecurity';

export default function LoginLeaderLiving() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { t } = useTranslation('auth');

  useEffect(() => {
    // Developer bypass: Allow direct access in Lovable environment
    if (isLovableDevelopmentMode()) {
      console.log('LoginLeaderLiving: Developer override active - automatically redirecting to dashboard');
      navigate('/dashboard/leaderliving');
      return;
    }

    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        navigate('/dashboard/leaderliving');
      }
    };
    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setUser(session.user);
          navigate('/dashboard/leaderliving');
        } else {
          setUser(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        if (error.message.includes('Invalid login credentials')) {
          toast.error(t('errors.invalidCredentials') || 'Invalid email or password');
        } else if (error.message.includes('Email not confirmed')) {
          toast.error(t('errors.emailNotConfirmed') || 'Please confirm your email before signing in');
        } else {
          toast.error(error.message);
        }
        return;
      }

      if (data.user) {
        // Check if user has leaderliving role
        const { data: userRoles } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', data.user.id)
          .eq('role', 'leaderliving');

        if (!userRoles || userRoles.length === 0) {
          await supabase.auth.signOut();
          toast.error('This account is not registered as a Líder Living');
          return;
        }

        toast.success(t('success.loginSuccess') || 'Successfully logged in!');
        navigate('/dashboard/leaderliving');
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error(t('errors.unexpected') || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // If user is logged in, show loading state
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <SEOMetadata 
        title="Líder Living Login | Hotel-Living"
        description="Access your Líder Living account. Sign in to manage your groups and track your commissions."
        url={typeof window !== 'undefined' ? window.location.href : "https://hotel-living.com/login/leaderliving"}
      />
      
      <div className="max-w-md w-full space-y-8">
        <div>
          <Link
            to="/"
            className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-8"
          >
            <Home className="h-5 w-5 mr-2" />
            Back to Home
          </Link>
          
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Líder Living Sign In
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Access your Líder Living dashboard
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-purple-500 focus:outline-none focus:ring-purple-500"
              />
            </div>
            
            <div className="relative">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 pr-10 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-purple-500 focus:outline-none focus:ring-purple-500"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              disabled={isLoading}
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-purple-600 py-2 px-4 text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Sign In'
              )}
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have a Líder Living account?{' '}
              <Link
                to="/registerLeaderLiving"
                className="font-medium text-purple-600 hover:text-purple-500"
              >
                Register here
              </Link>
            </p>
            
          </div>
        </form>
      </div>
    </div>
  );
}