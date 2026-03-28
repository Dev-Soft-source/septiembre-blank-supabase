import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';

export const MyGroupsTab: React.FC = () => {
  const { t } = useTranslation('dashboard/leaderliving');

  return (
    <div className="space-y-8">
      <div className="bg-white/10 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6">{t('myGroups.title')}</h2>
        
        <div className="text-center text-white/60 py-12">
          <p className="text-lg mb-4">{t('myGroups.noGroups')}</p>
          <p className="text-sm">{t('myGroups.createFirstGroup')}</p>
        </div>
      </div>
    </div>
  );
};