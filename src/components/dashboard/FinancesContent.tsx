
import React from 'react';
import { CreditCard } from 'lucide-react';
import EmptyState from './EmptyState';
import { useTranslation } from '@/hooks/useTranslation';

export const FinancesContent = () => {
  const { t } = useTranslation('dashboard/content');
  
  return (
    <EmptyState 
      icon={<CreditCard className="w-8 h-8" />}
      title={t('financialOverview')}
      description={t('financialDataMessage')}
    />
  );
};

export default FinancesContent;
