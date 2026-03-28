import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthLayout } from '@/components/auth/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/hooks/useTranslation';

export default function RegisterHotel() {
  const { t } = useTranslation('auth');
  const [nombreHotel, setNombreHotel] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async () => {
    if (!nombreHotel || !email || !password || !confirmPassword) {
      setMessage(t('allFieldsRequired'));
      return;
    }

    if (password !== confirmPassword) {
      setMessage(t('passwordsDontMatch'));
      return;
    }

    // Validate referral code if provided
    if (referralCode && !['A', 'P', 'H'].some(prefix => referralCode.toUpperCase().startsWith(prefix))) {
      setMessage(t('invalidReferralCode'));
      return;
    }

    try {
      const redirectUrl = `${window.location.origin}/auth/callback?role=hotel_owner`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            nombreHotel,
            role: 'hotel_owner'
          }
        }
      });

      if (error) {
        setMessage(t('errorPrefix') + error.message);
      } else {
        setMessage(t('registerSuccess'));
        
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
      setMessage(t('unexpectedError') + error.message);
    }
  };

  return (
    <AuthLayout 
      title={t('createHotelAccount')} 
      subtitle={t('createHotelAccountSubtitle')}
    >
      <form onSubmit={(e) => { e.preventDefault(); handleRegister(); }} className="space-y-6">
        <div>
          <Label htmlFor="nombreHotel" className="text-[#7E26A6] font-semibold">{t('hotelName')}</Label>
          <Input
            id="nombreHotel"
            type="text"
            placeholder={t('hotelName')}
            value={nombreHotel}
            onChange={(e) => setNombreHotel(e.target.value)}
            className="bg-white text-[#7E26A6] border-gray-300 focus:border-[#7E26A6] focus:ring-[#7E26A6] placeholder:text-gray-400"
          />
        </div>
        
        <div>
          <Label htmlFor="email" className="text-[#7E26A6] font-semibold">{t('email')}</Label>
          <Input
            id="email"
            type="email"
            placeholder={t('email')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white text-[#7E26A6] border-gray-300 focus:border-[#7E26A6] focus:ring-[#7E26A6] placeholder:text-gray-400"
          />
        </div>
        
        <div>
          <Label htmlFor="password" className="text-[#7E26A6] font-semibold">{t('password')}</Label>
          <Input
            id="password"
            type="password"
            placeholder={t('password')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-white text-[#7E26A6] border-gray-300 focus:border-[#7E26A6] focus:ring-[#7E26A6] placeholder:text-gray-400"
          />
        </div>
        
        <div>
          <Label htmlFor="confirmPassword" className="text-[#7E26A6] font-semibold">{t('confirmPassword')}</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder={t('confirmPassword')}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="bg-white text-[#7E26A6] border-gray-300 focus:border-[#7E26A6] focus:ring-[#7E26A6] placeholder:text-gray-400"
          />
        </div>
        
        <div>
          <Label htmlFor="referralCode" className="text-[#7E26A6] font-semibold">{t('referralCode')}</Label>
          <p className="text-xs text-[#7E26A6] mb-2">{t('referralCodeImportant')}</p>
          <Input
            id="referralCode"
            type="text"
            placeholder={t('referralCode')}
            value={referralCode}
            onChange={(e) => setReferralCode(e.target.value)}
            className="bg-white text-[#7E26A6] border-gray-300 focus:border-[#7E26A6] focus:ring-[#7E26A6] placeholder:text-gray-400"
          />
        </div>
        
        <Button
          type="submit" 
          className="w-full bg-[#7E26A6] hover:bg-[#5D0080] text-white font-bold py-3 rounded-lg shadow-[0_0_15px_rgba(126,38,166,0.3)] transition-all duration-300 hover:shadow-[0_0_20px_rgba(126,38,166,0.5)]"
        >
          {t('register')}
        </Button>
        
        {message && (
          <p className="text-center text-sm text-gray-600">{message}</p>
        )}
      </form>
    </AuthLayout>
  );
}

