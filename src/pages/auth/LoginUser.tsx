import React from 'react';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { LoginForm } from '@/components/auth/LoginForm';
import { useTranslation } from '@/hooks/useTranslation';

export default function LoginUser() {
  const { t } = useTranslation('auth');
  
  return (
    <AuthLayout 
      title={t('userLogin')} 
      subtitle={t('userLoginSubtitle')}
    >
      <LoginForm role="user" />
    </AuthLayout>
  );
}