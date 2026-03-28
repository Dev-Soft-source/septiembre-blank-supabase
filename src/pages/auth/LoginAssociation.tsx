import React from 'react';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { LoginForm } from '@/components/auth/LoginForm';
import { useTranslation } from '@/hooks/useTranslation';

export default function LoginAssociation() {
  const { t } = useTranslation('auth');
  
  return (
    <AuthLayout 
      title={t('associationLogin')} 
      subtitle={t('associationLoginSubtitle')}
    >
      <LoginForm role="association" />
    </AuthLayout>
  );
}