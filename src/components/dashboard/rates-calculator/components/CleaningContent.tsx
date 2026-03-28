
import React from "react";
import { useTranslation } from "@/hooks/useTranslation";

export const CleaningContent: React.FC = () => {
  const { t } = useTranslation("dashboard");
  
  return (
    <div className="space-y-4 text-white/90">
      <h3 className="text-lg font-bold text-center mb-6">{t('ratesCalculator.cleaningModelTitle')}</h3>
      
      <div className="space-y-4">
        <div>
          <p className="font-semibold text-fuchsia-300">{t('ratesCalculator.cleaningHotelLivingStandard')}</p>
          <p className="font-semibold text-fuchsia-300">{t('ratesCalculator.cleaningFeelsLikeHome')}</p>
        </div>
        
        <p className="text-sm">{t('ratesCalculator.cleaningDescription1')}</p>
        <p className="text-sm">{t('ratesCalculator.cleaningDescription2')}</p>
        
        <div className="border-t border-white/20 pt-4">
          <p className="font-semibold text-fuchsia-300">{t('ratesCalculator.cleaningCompleteTitle')}</p>
          <p className="text-sm">{t('ratesCalculator.cleaningCompleteDescription')}</p>
        </div>
        
        <div className="border-t border-white/20 pt-4">
          <p className="font-semibold text-fuchsia-300">{t('ratesCalculator.cleaningLightRefresh')}</p>
          <p className="text-sm">{t('ratesCalculator.cleaningLightRefreshDescription')}</p>
        </div>
        
        <div className="border-t border-white/20 pt-4">
          <p className="font-semibold text-fuchsia-300">{t('ratesCalculator.cleaningBedChange')}</p>
          <p className="text-sm">{t('ratesCalculator.cleaningBedChangeDescription')}</p>
        </div>
        
        <div className="border-t border-white/20 pt-4">
          <p className="font-semibold text-fuchsia-300">{t('ratesCalculator.cleaningOperationalBenefits')}</p>
          <p className="text-sm">{t('ratesCalculator.cleaningOperationalDescription')}</p>
        </div>
      </div>
    </div>
  );
};
