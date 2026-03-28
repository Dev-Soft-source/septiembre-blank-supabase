
// @ts-nocheck
// TypeScript checking disabled for Supabase schema compatibility

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

import { PasswordField } from '@/components/auth/PasswordField';
import { validatePassword } from '@/utils/passwordValidation';
import { useTranslation } from '@/hooks/useTranslation';

export const AssociationRegistration = () => {
  const { t, language } = useTranslation('associationRegistration');
  
  const [formData, setFormData] = useState({
    name: '',
    responsibleName: '',
    email: '',
    password: '',
    confirmPassword: '',
    country: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Validate required fields
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword || !formData.country || !formData.responsibleName) {
        toast.error(t('validation.requiredFields'));
        return;
      }

      // Validate password strength
      const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.isValid) {
        toast.error(t('validation.passwordSecurity'));
        return;
      }

      // Validate password confirmation
      if (formData.password !== formData.confirmPassword) {
        toast.error(t('validation.passwordMismatch'));
        return;
      }

      // Set up email redirect URL for proper email verification
      const redirectUrl = `https://hotel-living.com/signing/callback?role=association`;

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: formData.responsibleName,
            is_hotel_owner: false,
            association_name: formData.name,
            country: formData.country,
            preferred_language: language,
            role: "association"
          }
        }
      });

      if (authError) {
        console.error('Auth signup error:', authError);
        if (authError.message.includes('already registered')) {
          toast.error(t('validation.emailExists'));
        } else {
          toast.error(`${t('validation.registrationError')}: ${authError.message}`);
        }
        return;
      }

      if (!authData.user) {
        toast.error(t('validation.userCreationError'));
        return;
      }

      console.log('User created successfully:', authData.user.id);

      // The handle_new_user trigger should automatically create the associations record
      // Let's verify it was created
      console.log('User metadata sent:', authData.user.user_metadata);
      
      // Wait a moment for the trigger to complete
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Verify the association record was created by the trigger
      const { data: associationData, error: associationError } = await supabase
        .from('associations')
        .select('*')
        .eq('user_id', authData.user.id)
        .maybeSingle();

      if (associationError) {
        console.error('Error checking association creation:', associationError);
      } else if (!associationData) {
        console.warn('Association record not created by trigger, creating manually...');
        
        // Fallback: create association record manually if trigger failed
        const { data: manualAssociation, error: manualError } = await supabase
          .from('associations')
          .insert({
            user_id: authData.user.id,
            association_name: formData.name,
            responsible_person: formData.responsibleName,
            email: formData.email,
            country: formData.country,
            status: 'pending'
          })
          .select()
          .single();
          
        if (manualError) {
          console.error('Manual association creation failed:', manualError);
        } else {
          console.log('Association created manually:', manualAssociation);
        }
      } else {
        console.log('Association created by trigger:', associationData);
      }

      // Success - show email confirmation message
      toast.success(t('success.emailSent'));

      // Reset form
      setFormData({
        name: '',
        responsibleName: '',
        email: '',
        password: '',
        confirmPassword: '',
        country: ''
      });

      // Show success message with next steps
      toast.success(t('success.completed'), {
        duration: 6000
      });

    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(t('validation.generalError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="bg-[#7E00B3]/90 backdrop-blur-sm border-none shadow-[0_0_60px_rgba(0,200,255,0.8),0_0_120px_rgba(0,200,255,0.4),0_0_180px_rgba(0,200,255,0.2)]">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-white mb-2">
          {t('title')}
        </CardTitle>
        <p className="text-slate-300 text-sm">
          {t('subtitle')}
        </p>
      </CardHeader>
      
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white">
              {t('form.associationName')}
            </Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder={t('form.associationNamePlaceholder')}
              className="bg-white/10 border-white/20 text-white placeholder-white/60 focus:border-blue-400 focus:ring-blue-400/50"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="responsibleName" className="text-white">
              {t('form.responsiblePersonName')}
            </Label>
            <Input
              id="responsibleName"
              type="text"
              value={formData.responsibleName}
              onChange={(e) => handleInputChange('responsibleName', e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder-white/60 focus:border-blue-400 focus:ring-blue-400/50"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">
              {t('form.email')}
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder={t('form.emailPlaceholder')}
              className="bg-white/10 border-white/20 text-white placeholder-white/60 focus:border-blue-400 focus:ring-blue-400/50"
              required
            />
          </div>

          <PasswordField
            id="password"
            label={t('form.password')}
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            placeholder={t('form.passwordPlaceholder')}
            showPassword={showPassword}
            toggleShowPassword={() => setShowPassword(!showPassword)}
            showValidation={true}
          />

          <PasswordField
            id="confirmPassword"
            label={t('form.confirmPassword')}
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            placeholder={t('form.confirmPasswordPlaceholder')}
            showPassword={showConfirmPassword}
            toggleShowPassword={() => setShowConfirmPassword(!showConfirmPassword)}
          />

          <div className="space-y-2">
            <Label htmlFor="country" className="text-white">
              {t('form.country')} *
            </Label>
            <Select value={formData.country} onValueChange={(value) => handleInputChange('country', value)}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white focus:border-blue-400 focus:ring-blue-400/50">
                <SelectValue placeholder={t('form.countryPlaceholder')} />
              </SelectTrigger>
               <SelectContent className="bg-white border-gray-200">
                 <SelectItem value="Argentina" className="hover:bg-[#7E26A6] hover:text-white focus:bg-[#7E26A6] focus:text-white data-[highlighted]:bg-[#7E26A6] data-[highlighted]:text-white">{t('countries.Argentina')}</SelectItem>
                 <SelectItem value="Brasil" className="hover:bg-[#7E26A6] hover:text-white focus:bg-[#7E26A6] focus:text-white data-[highlighted]:bg-[#7E26A6] data-[highlighted]:text-white">{t('countries.Brasil')}</SelectItem>
                 <SelectItem value="Chile" className="hover:bg-[#7E26A6] hover:text-white focus:bg-[#7E26A6] focus:text-white data-[highlighted]:bg-[#7E26A6] data-[highlighted]:text-white">{t('countries.Chile')}</SelectItem>
                 <SelectItem value="Colombia" className="hover:bg-[#7E26A6] hover:text-white focus:bg-[#7E26A6] focus:text-white data-[highlighted]:bg-[#7E26A6] data-[highlighted]:text-white">{t('countries.Colombia')}</SelectItem>
                 <SelectItem value="España" className="hover:bg-[#7E26A6] hover:text-white focus:bg-[#7E26A6] focus:text-white data-[highlighted]:bg-[#7E26A6] data-[highlighted]:text-white">{t('countries.España')}</SelectItem>
                 <SelectItem value="México" className="hover:bg-[#7E26A6] hover:text-white focus:bg-[#7E26A6] focus:text-white data-[highlighted]:bg-[#7E26A6] data-[highlighted]:text-white">{t('countries.México')}</SelectItem>
                 <SelectItem value="Perú" className="hover:bg-[#7E26A6] hover:text-white focus:bg-[#7E26A6] focus:text-white data-[highlighted]:bg-[#7E26A6] data-[highlighted]:text-white">{t('countries.Perú')}</SelectItem>
                 <SelectItem value="Uruguay" className="hover:bg-[#7E26A6] hover:text-white focus:bg-[#7E26A6] focus:text-white data-[highlighted]:bg-[#7E26A6] data-[highlighted]:text-white">{t('countries.Uruguay')}</SelectItem>
                 <SelectItem value="Otro" className="hover:bg-[#7E26A6] hover:text-white focus:bg-[#7E26A6] focus:text-white data-[highlighted]:bg-[#7E26A6] data-[highlighted]:text-white">{t('countries.Otro')}</SelectItem>
               </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 rounded-lg transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
          >
            {isLoading ? t('form.submittingButton') : t('form.submitButton')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
