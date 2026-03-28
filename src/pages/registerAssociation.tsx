import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthLayout } from '@/components/auth/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/hooks/useTranslation';

export default function RegisterAssociation() {
  const { t } = useTranslation('associationRegistration');
  const [nombreAsociacion, setNombreAsociacion] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [country, setCountry] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async () => {
    if (!nombreAsociacion || !email || !password || !confirmPassword || !country) {
      setMessage(t('validation.requiredFields'));
      return;
    }

    if (password !== confirmPassword) {
      setMessage(t('validation.passwordMismatch'));
      return;
    }

    try {
      const redirectUrl = `${window.location.origin}/auth/callback?role=association`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            association_name: nombreAsociacion,
            full_name: nombreAsociacion,
            country: country,
            role: "association"
          }
        }
      });

      if (error) {
        if (error.message.includes('already registered')) {
          setMessage(t('validation.emailExists'));
        } else {
          setMessage(t('validation.registrationError') + ': ' + error.message);
        }
      } else {
        setMessage(t('success.emailSent'));
        
        // Send admin notification in background after successful signup
        if (data?.user) {
          console.log('🎯 Triggering admin notification processing');
          // Call the notification processor (fire and forget)
          supabase.functions.invoke('process-admin-notifications').catch(err => 
            console.log('Admin notification processing queued:', err.message)
          );
        }
      }
    } catch (error: any) {
      setMessage(t('validation.generalError'));
    }
  };

  return (
    <AuthLayout 
      title={t('title')} 
      subtitle={t('subtitle')}
    >
      <form onSubmit={(e) => { e.preventDefault(); handleRegister(); }} className="space-y-6">
        <div>
          <Label htmlFor="nombreAsociacion" className="text-[#7E26A6] font-semibold">{t('form.associationName')}</Label>
          <Input
            id="nombreAsociacion"
            type="text"
            placeholder={t('form.associationNamePlaceholder')}
            value={nombreAsociacion}
            onChange={(e) => setNombreAsociacion(e.target.value)}
            className="bg-white text-[#7E26A6] border-gray-300 focus:border-[#7E26A6] focus:ring-[#7E26A6] placeholder:text-gray-400"
          />
        </div>
        
        <div>
          <Label htmlFor="email" className="text-[#7E26A6] font-semibold">{t('form.email')}</Label>
          <Input
            id="email"
            type="email"
            placeholder={t('form.emailPlaceholder')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white text-[#7E26A6] border-gray-300 focus:border-[#7E26A6] focus:ring-[#7E26A6] placeholder:text-gray-400"
          />
        </div>
        
        <div>
          <Label htmlFor="password" className="text-[#7E26A6] font-semibold">{t('form.password')}</Label>
          <Input
            id="password"
            type="password"
            placeholder={t('form.passwordPlaceholder')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-white text-[#7E26A6] border-gray-300 focus:border-[#7E26A6] focus:ring-[#7E26A6] placeholder:text-gray-400"
          />
        </div>
        
        <div>
          <Label htmlFor="confirmPassword" className="text-[#7E26A6] font-semibold">{t('form.confirmPassword')}</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder={t('form.confirmPasswordPlaceholder')}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="bg-white text-[#7E26A6] border-gray-300 focus:border-[#7E26A6] focus:ring-[#7E26A6] placeholder:text-gray-400"
          />
        </div>
        
        <div>
          <Label htmlFor="country" className="text-[#7E26A6] font-semibold">{t('form.country')}</Label>
          <Input
            id="country"
            type="text"
            placeholder={t('form.countryPlaceholder')}
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="bg-white text-[#7E26A6] border-gray-300 focus:border-[#7E26A6] focus:ring-[#7E26A6] placeholder:text-gray-400"
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-[#7E26A6] hover:bg-[#5D0080] text-white font-bold py-3 rounded-lg shadow-[0_0_15px_rgba(126,38,166,0.3)] transition-all duration-300 hover:shadow-[0_0_20px_rgba(126,38,166,0.5)]"
        >
          {t('form.submitButton')}
        </Button>
        
        {message && (
          <p className="text-center text-sm text-gray-600">{message}</p>
        )}
      </form>
    </AuthLayout>
  );
}

