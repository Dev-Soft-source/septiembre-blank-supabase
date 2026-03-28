import React from 'react';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { LoginForm } from '@/components/auth/LoginForm';
import { useTranslation } from '@/hooks/useTranslation';

export default function LoginPromoter() {
  const { t } = useTranslation('auth');
  
  return (
    <AuthLayout 
      title={t('promoterLogin')} 
      subtitle={t('promoterLoginSubtitle')}
    >
      <LoginForm role="promoter" />
    </AuthLayout>
  );
}