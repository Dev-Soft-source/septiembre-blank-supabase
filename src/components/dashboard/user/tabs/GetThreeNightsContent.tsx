
import React from 'react';
import { Gift } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import ProgramDescription from './get-three-nights/ProgramDescription';
import ReferralForm from './get-three-nights/ReferralForm';

export default function GetThreeNightsContent() {
  const { t } = useTranslation('dashboard/user');
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">{t('userDashboard.getThreeNights.title')}</h2>
        <p className="text-gray-500 dark:text-gray-400">
          {t('userDashboard.getThreeNights.subtitle')}
        </p>
      </div>
      
      <div className="space-y-6">
        <ProgramDescription />
        <ReferralForm />
      </div>
    </div>
  );
}
