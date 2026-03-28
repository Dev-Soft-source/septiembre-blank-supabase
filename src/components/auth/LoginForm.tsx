// @ts-nocheck  
// TypeScript checking disabled for Supabase schema compatibility
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/hooks/useTranslation';

interface LoginFormProps {
  role: 'user' | 'hotel' | 'association' | 'promoter';
}

export function LoginForm({ role }: LoginFormProps) {
  const { t } = useTranslation('auth');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setMessage("❌ " + t('enterEmailPassword'));
      return;
    }
    
    try {
      setIsLoading(true);
      setMessage('');

      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      });

      if (error) {
        console.error('Login error:', error);
        if (error.message.includes('Email not confirmed')) {
          setMessage("❌ " + t('emailNotConfirmed', 'Please confirm your email before signing in. Check your inbox for the confirmation email.'));
        } else {
          setMessage("❌ " + error.message);
        }
        return;
      }

      // Check if email is confirmed
      if (data.user && !data.user.email_confirmed_at) {
        console.log('Email not confirmed for user:', data.user.email);
        setMessage("❌ " + t('emailNotConfirmed', 'Please confirm your email before signing in. Check your inbox for the confirmation email.'));
        await supabase.auth.signOut(); // Sign out the unconfirmed user
        return;
      }

      // Redirect based on actual profile role (fallback to page role)
      try {
        const { data: userData } = await supabase.auth.getUser();
        const authUser = userData?.user;
        let target = '/';

        if (authUser?.id) {
          const { data: prof } = await supabase
            .from('profiles')
            .select('role, is_hotel_owner')
            .eq('user_id', authUser.id)
            .single();

          if (prof?.role === 'hotel_owner') {
            target = '/hotel-dashboard';
          } else if (prof?.role === 'association') {
            target = '/association-dashboard';
          } else if (prof?.role === 'promoter') {
            target = '/promoter/dashboard';
          } else if (prof?.role === 'leader') {
            target = '/dashboard/leaderliving';
          } else {
            target = '/user-dashboard';
          }
        } else {
          // Fallback to the page role when user not yet resolved
          switch(role) {
            case 'user': target = '/user-dashboard'; break;
            case 'hotel': target = '/hotel-dashboard'; break;
            case 'association': target = '/association-dashboard'; break;
            case 'promoter': target = '/promoter/dashboard'; break;
            case 'leader': target = '/dashboard/leaderliving'; break;
            default: target = '/user-dashboard';
          }
        }

        window.location.href = target;
      } catch (e) {
        // On any error, fallback to page role
        switch(role) {
          case 'user': window.location.href = '/user-dashboard'; break;
          case 'hotel': window.location.href = '/hotel-dashboard'; break;
          case 'association': window.location.href = '/association-dashboard'; break;
          case 'promoter': window.location.href = '/promoter/dashboard'; break;
          case 'leader': window.location.href = '/dashboard/leaderliving'; break;
          default: window.location.href = '/user-dashboard';
        }
      }

    } catch (error: any) {
      setMessage("❌ " + (error.message || "An unexpected error occurred during login"));
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleDisplayName = () => {
    switch (role) {
      case 'user': return t('createUserAccount').replace('Create ', '').replace('Crear cuenta como ', '').replace('Creează Cont ca ', '').replace('Criar Conta de ', '');
      case 'hotel': return t('createHotelAccount').replace('Hotel Registration', 'Hotel Partner').replace('Registro de Hotel', 'Socio Hotelero').replace('Înregistrare Hotel', 'Partener Hotelier').replace('Registro de Hotel', 'Parceiro Hoteleiro');
      case 'association': return t('createAssociationAccount').replace('Association Registration', 'Association').replace('Registro de Asociación', 'Asociación').replace('Înregistrare Asociație', 'Asociație').replace('Registro de Associação', 'Associação');
      case 'promoter': return t('createPromoterAccount').replace('Promoter Registration', 'Promoter').replace('Registro de Promotor', 'Promotor').replace('Înregistrare Promotor', 'Promotor').replace('Registro de Promotor', 'Promotor');
      default: return t('createUserAccount').replace('Create ', '').replace('Crear cuenta como ', '').replace('Creează Cont ca ', '').replace('Criar Conta de ', '');
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="space-y-4 sm:space-y-6"
    >
      <div>
        <Label htmlFor="email" className="text-[#7E26A6] text-sm sm:text-base font-semibold">{t('email')}</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          value={formData.email}
          onChange={handleInputChange}
          className="bg-white text-[#7E26A6] border-gray-300 focus:border-[#7E26A6] focus:ring-[#7E26A6] placeholder:text-gray-400"
        />
      </div>
      
      <div>
        <Label htmlFor="password" className="text-[#7E26A6] text-sm sm:text-base font-semibold">{t('password')}</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          value={formData.password}
          onChange={handleInputChange}
          className="bg-white text-[#7E26A6] border-gray-300 focus:border-[#7E26A6] focus:ring-[#7E26A6] placeholder:text-gray-400"
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-[#7E26A6] hover:bg-[#5D0080] text-white font-bold py-2 sm:py-3 rounded-lg shadow-[0_0_15px_rgba(126,38,166,0.3)] transition-all duration-300 hover:shadow-[0_0_20px_rgba(126,38,166,0.5)] text-sm sm:text-base"
        disabled={isLoading}
      >
        {isLoading ? t('signingIn') : `${t('signInAs')} ${getRoleDisplayName()}`}
      </Button>
      
      {message && (
        <p className="text-center text-sm text-gray-600">{message}</p>
      )}

      <p className="text-center text-xs sm:text-sm text-gray-600">
        {t('dontHaveAccount')}{' '}
        <a 
          href={
            role === 'user' ? '/registerUser' :
            role === 'hotel' ? '/registerHotel' :
            role === 'association' ? '/registerAssociation' :
            role === 'promoter' ? '/registerPromotor' : '/registerUser'
          } 
          className="text-[#7E26A6] hover:underline"
        >
          {t('createOneHere')}
        </a>
      </p>
    </form>
  );
}