
import React from "react";
import { ProgramHeader } from "./components/ProgramHeader";
import { DescriptionParagraph } from "./components/DescriptionParagraph";
import { StepsList } from "./components/StepsList";
import { BenefitsList } from "./components/BenefitsList";
import { useTranslation } from '@/hooks/useTranslation';

const ProgramDescription = () => {
  const { t } = useTranslation('dashboard/user');
  
  const howItWorksSteps = [
    t('userDashboard.getThreeNights.step1'),
    t('userDashboard.getThreeNights.step2'),
    t('userDashboard.getThreeNights.step3'),
    t('userDashboard.getThreeNights.step4')
  ];

  const benefitsList = [
    t('userDashboard.getThreeNights.benefit1'),
    t('userDashboard.getThreeNights.benefit2'),
    t('userDashboard.getThreeNights.benefit3'),
    t('userDashboard.getThreeNights.benefit4')
  ];

  return (
    <div className="glass-card rounded-2xl p-6 bg-primary/20">
      <ProgramHeader title={t('userDashboard.getThreeNights.programTitle')} />
      
      <div className="space-y-4">
        <DescriptionParagraph>
          {t('userDashboard.getThreeNights.programDescription')}
        </DescriptionParagraph>
        
        <StepsList items={howItWorksSteps} />
        
        <DescriptionParagraph className="text-sm">
          {t('userDashboard.getThreeNights.additionalInfo')}
        </DescriptionParagraph>
        
        <BenefitsList items={benefitsList} />
      </div>
    </div>
  );
};

export default ProgramDescription;
