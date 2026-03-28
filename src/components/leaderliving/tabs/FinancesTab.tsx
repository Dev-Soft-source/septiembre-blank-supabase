import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';

export const FinancesTab: React.FC = () => {
  const { t } = useTranslation('dashboard/leaderliving');

  return (
    <div className="space-y-8">
      <div className="bg-white/10 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6">{t('finances.title')}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/10 rounded-lg p-4">
            <h3 className="font-semibold mb-2 text-sm">{t('finances.totalEarned')}</h3>
            <div className="text-2xl font-bold text-green-400">USD $0.00</div>
          </div>
          
          <div className="bg-white/10 rounded-lg p-4">
            <h3 className="font-semibold mb-2 text-sm">{t('finances.pendingPayment')}</h3>
            <div className="text-2xl font-bold text-yellow-400">USD $0.00</div>
          </div>
          
          <div className="bg-white/10 rounded-lg p-4">
            <h3 className="font-semibold mb-2 text-sm">{t('finances.totalPaid')}</h3>
            <div className="text-2xl font-bold text-blue-400">USD $0.00</div>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">{t('finances.paymentHistory')}</h3>
          <div className="text-center text-white/60 py-8">
            <p>{t('finances.noPayments')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};