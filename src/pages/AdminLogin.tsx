import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, User, AlertCircle } from 'lucide-react';

import { HotelStarfield } from '@/components/hotels/HotelStarfield';
import { toast } from '@/hooks/use-toast';
import { isLovableDevelopmentMode } from '@/utils/dashboardSecurity';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if already authenticated as admin
    checkExistingAuth();
    
    // Clear any error when component mounts
    setError('');
  }, []);

  const checkExistingAuth = async () => {
    try {
      console.log('AdminLogin: Checking existing auth');
      
      // Developer override: Always redirect to admin panel in Lovable environment
      if (isLovableDevelopmentMode()) {
        console.log('AdminLogin: Lovable development mode - bypassing authentication and redirecting to admin panel');
        navigate('/panel-admin');
        return;
      }
      
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('AdminLogin: Session error:', sessionError);
        return;
      }
      
      if (session?.user) {
        console.log('AdminLogin: Found existing session for user:', session.user.id);
        
        // Check if user is admin using multiple sources
        const [roleResult, adminResult] = await Promise.all([
          supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', session.user.id)
            .eq('role', 'admin')
            .maybeSingle(),
          supabase
            .from('admin_users')
            .select('id')
            .eq('id', session.user.id)
            .maybeSingle()
        ]);

        const hasAdminRole = !!roleResult.data;
        const isInAdminUsers = !!adminResult.data;

        if (hasAdminRole || isInAdminUsers) {
          console.log('AdminLogin: User has admin privileges, redirecting');
          window.location.href = '/panel-admin';
        } else {
          console.log('AdminLogin: User does not have admin privileges');
          // Sign out non-admin user to prevent confusion
          await supabase.auth.signOut();
        }
      }
    } catch (error) {
      console.error('AdminLogin: Auth check error:', error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Attempting admin login for:', email);
      
      // Don't clear session if we're in development mode
      if (!isLovableDevelopmentMode()) {
        // Clear any existing session first to prevent conflicts
        await supabase.auth.signOut();
        // Small delay to ensure session is cleared
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (authError) {
        console.error('Authentication error:', authError);
        
        // Provide more specific error messages
        if (authError.message.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please check your credentials.');
        } else if (authError.message.includes('Email not confirmed')) {
          setError('Please confirm your email address before logging in.');
        } else if (authError.message.includes('Too many requests')) {
          setError('Too many login attempts. Please wait a few minutes and try again.');
        } else {
          setError(`Login failed: ${authError.message}`);
        }
        
        toast({
          title: "Login Failed",
          description: error || authError.message,
          variant: "destructive"
        });
        return;
      }

      if (data.user) {
        console.log('User authenticated successfully:', data.user.id);
        
        // Wait for session to be properly established
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Verify admin privileges using parallel queries for efficiency
        const [roleResult, adminResult] = await Promise.all([
          supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', data.user.id)
            .eq('role', 'admin')
            .maybeSingle(),
          supabase
            .from('admin_users')
            .select('id')
            .eq('id', data.user.id)
            .maybeSingle()
        ]);

        const hasAdminRole = !!roleResult.data;
        const isInAdminUsers = !!adminResult.data;
        
        console.log('Admin verification:', { 
          hasAdminRole, 
          isInAdminUsers, 
          roleError: roleResult.error, 
          adminError: adminResult.error 
        });

        if (hasAdminRole || isInAdminUsers) {
          console.log('Admin privileges confirmed, redirecting to panel');
          toast({
            title: "Welcome Admin",
            description: "Login successful. Redirecting to admin panel...",
            variant: "default"
          });
          
          // Use window.location for a complete page refresh to ensure proper state
          window.location.href = '/panel-admin';
        } else {
          console.log('Admin privileges not found for user:', data.user.email);
          setError('Access denied: This account does not have admin privileges.');
          toast({
            title: "Access Denied",
            description: "This account does not have admin privileges.",
            variant: "destructive"
          });
          // Sign out non-admin user
          await supabase.auth.signOut();
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Authentication system error. Please try again.');
      toast({
        title: "System Error",
        description: "Authentication system error. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      <HotelStarfield />
      
      <Card className="w-full max-w-md mx-4 bg-white/95 backdrop-blur-sm shadow-2xl border-0">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-purple-100 rounded-full">
              <Lock className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Admin Access
          </CardTitle>
          <p className="text-gray-600 text-sm">
            Authorized personnel only
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Admin Email
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter admin email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11"
                  required
                  disabled={loading}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-11"
                  required
                  disabled={loading}
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-11 bg-purple-600 hover:bg-purple-700 text-white font-medium"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Authenticating...
                </div>
              ) : (
                'Access Admin Panel'
              )}
            </Button>
          </form>
          
          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              This page is restricted to authorized administrators only.
              <br />
              Unauthorized access attempts are logged and monitored.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}