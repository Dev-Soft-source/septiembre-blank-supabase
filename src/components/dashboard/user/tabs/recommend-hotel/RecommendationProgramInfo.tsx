
import React from "react";
import { useTranslation } from "@/hooks/useTranslation";

const RecommendationProgramInfo = () => {
  const { t } = useTranslation('dashboard/general');
  
  return (
    <div className="glass-card rounded-2xl p-6 bg-[#7a0486]">
      <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <span>{t('referrals.icon')}</span>
        <span>{t('referrals.title')}</span>
      </h3>
      
      <div className="space-y-4 leading-relaxed">
        <p className="flex items-start gap-3">
          <span className="text-lg mt-0.5">{t('referrals.eligibilityIcon')}</span>
          <span>{t('referrals.eligibilityText')}</span>
        </p>
        
        <p className="flex items-start gap-3">
          <span className="text-lg mt-0.5">{t('referrals.processIcon')}</span>
          <span>{t('referrals.processText')}</span>
        </p>
        
        <p className="flex items-start gap-3">
          <span className="text-lg mt-0.5">{t('referrals.rewardsIcon')}</span>
          <span>{t('referrals.rewardsText')}</span>
        </p>
        
        <p className="flex items-start gap-3">
          <span className="text-lg mt-0.5">{t('referrals.confidentialityIcon')}</span>
          <span>{t('referrals.confidentialityText')}</span>
        </p>
      </div>
    </div>
  );
};

export default RecommendationProgramInfo;
