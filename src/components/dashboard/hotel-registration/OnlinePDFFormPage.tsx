import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, X } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { Starfield } from '@/components/Starfield';
import { OnlinePDFForm } from './OnlinePDFForm';

export const OnlinePDFFormPage = () => {
  const { t } = useTranslation('dashboard/hotel-registration');

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.close();
    }
  };

  const handleCloseTab = () => {
    window.close();
  };

  return (
    <div className="min-h-screen relative">
      <Starfield />
      <div className="relative z-10 w-[90%] max-w-none mx-auto p-4">
        {/* Header with navigation */}
        <div className="mb-6 flex items-center justify-between">
          <Button
            onClick={handleBack}
            variant="outline"
            className="bg-[#70009E] hover:bg-[#70009E]/80 text-white border-[#70009E] hover:border-[#70009E]/80"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('pdfForm.backButton', 'Back')}
          </Button>

          <Button
            onClick={handleCloseTab}
            variant="outline"
            className="bg-[#70009E] hover:bg-[#70009E]/80 text-white border-[#70009E] hover:border-[#70009E]/80"
          >
            <X className="w-4 h-4 mr-2" />
            {t('pdfForm.closeTab', 'Close Tab')}
          </Button>
        </div>

        {/* Full screen form with Ambassador page styling */}
        <OnlinePDFForm />
      </div>
    </div>
  );
};