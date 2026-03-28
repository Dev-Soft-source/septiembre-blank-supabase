import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileText, Edit3 } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { downloadHotelRegistrationPDF } from '@/utils/pdfGenerator';
export const PDFDownloadOption = () => {
  const { t, language } = useTranslation('dashboard/hotel-registration');

  const handleDownloadPDF = () => {
    try {
      // Use Spanish for Spanish dashboard, English for all others
      const pdfLanguage = language === 'es' ? 'es' : 'en';
      downloadHotelRegistrationPDF(pdfLanguage);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const handleOpenOnlineForm = () => {
    window.open('/hotel-registration-form', '_blank');
  };

  return (
    <div className="mb-8 p-6 bg-gradient-to-r from-white/5 to-white/10 border border-white/20 rounded-xl backdrop-blur-sm">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-fuchsia-500 rounded-lg flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-2">
            {t('pdfDownload.title', 'Alternative Registration Method')}
          </h3>
          
          <p className="text-white/80 text-sm mb-4">
            {t('pdfDownload.description', 'Choose your preferred registration method:')}
          </p>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-white text-xs font-bold">
                1
              </div>
              <span className="text-white/90 text-sm">
                {t('pdfDownload.option1', 'Download the PDF form and send it back by email after completion')}
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-white text-xs font-bold">
                2
              </div>
              <span className="text-white/90 text-sm">
                {t('pdfDownload.option2', 'Or, fill out the online form you\'ll find below')}
              </span>
            </div>
          </div>
          
          <div className="mt-4 flex gap-3">
            <Button
              onClick={handleDownloadPDF}
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 transition-all duration-200"
            >
              <Download className="w-4 h-4 mr-2" />
              {t('pdfDownload.downloadButton', 'Download PDF Form')}
            </Button>
            
            <Button
              onClick={handleOpenOnlineForm}
              className="bg-fuchsia-500 hover:bg-fuchsia-600 text-white"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              {t('pdfDownload.fillOnlineButton', 'Fill Online Form')}
            </Button>
          </div>
          
          <div className="mt-3 text-xs text-white/60">
            {t('pdfDownload.note', 'Send completed PDF to: support@hotel-living.com')}
          </div>
        </div>
      </div>
    </div>
  );
};