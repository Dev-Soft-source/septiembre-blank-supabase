import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

export const PublicPageTab: React.FC = () => {
  const { t } = useTranslation('dashboard/leaderliving');

  return (
    <div className="space-y-8">
      <div className="bg-white/10 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6">{t('publicPage.title')}</h2>
        
        <div className="text-center py-12">
          <Button 
            variant="outline" 
            className="bg-white/20 border-white/30 text-white hover:bg-white/30 p-6 h-auto"
          >
            <div className="text-center">
              <ExternalLink className="w-6 h-6 mx-auto mb-2" />
              <div className="font-semibold">{t('publicPage.link')}</div>
              <div className="text-sm text-white/70 mt-2">
                {t('publicPage.description')}
              </div>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};