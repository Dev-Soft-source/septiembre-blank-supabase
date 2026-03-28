import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';

export const MyDataTab: React.FC = () => {
  const { t } = useTranslation('dashboard/leaderliving');

  return (
    <div className="space-y-8">
      <div className="bg-white/10 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6">{t('myData.title')}</h2>
        
        <div className="text-center text-white/60 py-12">
          <p className="text-lg mb-4">{t('myData.updateProfile')}</p>
          <p className="text-sm">{t('myData.comingSoon')}</p>
        </div>
      </div>
    </div>
  );
};