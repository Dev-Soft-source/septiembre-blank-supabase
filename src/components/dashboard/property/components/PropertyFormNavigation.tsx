
import React from 'react';
import { useTranslation } from "@/hooks/useTranslation";

interface PropertyFormNavigationProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

export default function PropertyFormNavigation({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onSubmit
}: PropertyFormNavigationProps) {
  const { t } = useTranslation();
  
  return (
    <div className="flex items-center justify-between mb-3">
      <button 
        onClick={onPrevious} 
        className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
          currentStep === 1 ? "invisible" : "bg-fuchsia-950/80 hover:bg-fuchsia-900/80 text-fuchsia-100"
        }`} 
        disabled={currentStep === 1}
      >
        {t('dashboard.navigation.previous')}
      </button>
      
      {currentStep === totalSteps ? (
        <button 
          onClick={onSubmit} 
          className="rounded-lg px-4 py-1.5 text-white text-sm font-medium transition-colors bg-[#a209ad]/80"
        >
          {t('dashboard.navigation.submit')}
        </button>
      ) : (
        <button 
          onClick={onNext} 
          className="rounded-lg px-4 py-1.5 bg-fuchsia-600/80 hover:bg-fuchsia-600 text-white text-sm font-medium transition-colors"
        >
          {t('dashboard.navigation.next')}
        </button>
      )}
    </div>
  );
}
