import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, Eye, EyeOff, Home, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from '@/hooks/useTranslation';
import { SEOMetadata } from '@/components/SEOMetadata';
import { Starfield } from '@/components/Starfield';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function RegisterLeaderLiving() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { t } = useTranslation('registerLeaderLiving');

  useEffect(() => {
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
      toast.error(t('register.validation.fillRequiredFields'));
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error(t('register.validation.passwordsDoNotMatch'));
      return false;
    }

    if (formData.password.length < 6) {
      toast.error(t('register.validation.passwordTooShort'));
      return false;
    }

    if (!acceptedTerms) {
      toast.error(t('register.validation.acceptTermsRequired'));
      return false;
    }

    return true;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Check if email already exists with any role
      const { data: existingRole } = await supabase
        .from('user_roles')
        .select('role')
        .eq('email', formData.email)
        .single();

      if (existingRole) {
        toast.error(t('register.validation.emailAlreadyExists'));
        setIsLoading(false);
        return;
      }

      const redirectUrl = `${window.location.origin}/dashboard/leaderliving`;
      
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            role: 'leader',
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: formData.phone,
          },
        },
      });

      if (error) {
        console.error('Registration error:', error);
        
        if (error.message.includes('already registered')) {
          toast.error(t('register.validation.emailAlreadyRegistered'));
        } else if (error.message.includes('Password')) {
          toast.error(t('register.validation.passwordRequirements'));
        } else {
          toast.error(error.message);
        }
        return;
      }

      if (data.user) {
        toast.success(
          t('register.success.registrationSuccessful'),
          { duration: 6000 }
        );
        
        // Send admin notification in background after successful signup
        console.log('🎯 Triggering admin notification processing');
        // Call the notification processor (fire and forget)
        supabase.functions.invoke('process-admin-notifications').catch(err => 
          console.log('Admin notification processing queued:', err.message)
        );
        
        // Clear form
        setFormData({
          email: '',
          password: '',
          confirmPassword: '',
          firstName: '',
          lastName: '',
          phone: '',
        });
        setAcceptedTerms(false);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred. Please try again.');
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
          <p className="text-gray-600">{t('register.success.redirecting')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <SEOMetadata 
        title={t('register.title') + " | Hotel-Living"}
        description={t('register.subtitle')}
        url={typeof window !== 'undefined' ? window.location.href : "https://hotel-living.com/registerLeaderLiving"}
      />
      <Starfield />
      <div className="relative z-10">
        <Navbar />
        <main className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" style={{ minHeight: 'calc(100vh - 120px)' }}>
          <div className="max-w-md w-full mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-[0_0_60px_rgba(139,69,19,0.4)]">
              <Link
                to="/"
                className="inline-flex items-center text-white hover:text-white/80 mb-8 transition-colors"
              >
                <Home className="h-5 w-5 mr-2" />
                {t('register.backToHome')}
              </Link>
              
              <h2 className="mt-6 text-center text-3xl font-extrabold text-white mb-2">
                {t('register.title')}
              </h2>
              <p className="text-center text-sm text-white/80 mb-8">
                {t('register.subtitle')}
              </p>
              
              <form className="space-y-6" onSubmit={handleRegister}>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Input
                        name="firstName"
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder={t('register.form.firstNamePlaceholder')}
                        className="w-full bg-white/10 border-white/30 text-white placeholder-white/60 focus:border-white/50 focus:ring-white/50"
                      />
                    </div>
                    <div>
                      <Input
                        name="lastName"
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder={t('register.form.lastNamePlaceholder')}
                        className="w-full bg-white/10 border-white/30 text-white placeholder-white/60 focus:border-white/50 focus:ring-white/50"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Input
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder={t('register.form.emailPlaceholder')}
                      className="w-full bg-white/10 border-white/30 text-white placeholder-white/60 focus:border-white/50 focus:ring-white/50"
                    />
                  </div>

                  <div>
                    <Input
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder={t('register.form.phonePlaceholder')}
                      className="w-full bg-white/10 border-white/30 text-white placeholder-white/60 focus:border-white/50 focus:ring-white/50"
                    />
                  </div>
                  
                  <div className="relative">
                    <Input
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder={t('register.form.passwordPlaceholder')}
                      className="w-full bg-white/10 border-white/30 text-white placeholder-white/60 focus:border-white/50 focus:ring-white/50 pr-10"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-white/60" />
                      ) : (
                        <Eye className="h-4 w-4 text-white/60" />
                      )}
                    </button>
                  </div>

                  <div className="relative">
                    <Input
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder={t('register.form.confirmPasswordPlaceholder')}
                      className="w-full bg-white/10 border-white/30 text-white placeholder-white/60 focus:border-white/50 focus:ring-white/50 pr-10"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-white/60" />
                      ) : (
                        <Eye className="h-4 w-4 text-white/60" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={acceptedTerms}
                    onCheckedChange={(checked) => setAcceptedTerms(!!checked)}
                    className="border-white/30 data-[state=checked]:bg-white/20 data-[state=checked]:border-white/50"
                  />
                  <label htmlFor="terms" className="text-sm text-white/80">
                    {t('register.form.acceptTerms')}{' '}
                    <Link to="/terms" className="text-white hover:text-white/80 underline">
                      {t('register.form.termsAndConditions')}
                    </Link>
                  </label>
                </div>

                <div>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm transition-all duration-200 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      t('register.form.createAccount')
                    )}
                  </Button>
                </div>

                <div className="text-center">
                  <p className="text-sm text-white/80">
                    {t('register.form.alreadyHaveAccount')}{' '}
                    <Link
                      to="/login/leaderliving"
                      className="font-medium text-white hover:text-white/80 underline"
                    >
                      {t('register.form.signInHere')}
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}