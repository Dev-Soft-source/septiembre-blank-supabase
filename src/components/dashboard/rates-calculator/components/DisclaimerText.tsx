
import React from "react";
import { useTranslation } from "@/hooks/useTranslation";

export const DisclaimerText: React.FC = () => {
  const { t } = useTranslation("dashboard");
  
  return (
    <p className="text-xs text-white/60 italic mb-4">
      {t('ratesCalculator.disclaimer')}
    </p>
  );
};
