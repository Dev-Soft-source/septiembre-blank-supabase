
import React from "react";
import { Building } from "lucide-react";
import { useTranslation } from '@/hooks/useTranslation';

export default function NoSavedHotels() {
  const { t } = useTranslation('dashboard/user');
  
  return (
    <div className="text-center py-8">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
        <Building className="w-8 h-8 text-primary" />
      </div>
      <h3 className="text-lg font-bold mb-2">{t('userDashboard.savedHotels.noSavedHotels')}</h3>
      <p className="text-muted-foreground mb-6">{t('userDashboard.savedHotels.noSavedHotelsDesc')}</p>
      <a href="/" className="inline-block py-2 px-4 rounded-lg bg-primary/20 hover:bg-primary/30 text-primary-foreground text-sm font-medium transition-colors">
        {t('userDashboard.savedHotels.browseHotels')}
      </a>
    </div>
  );
}
