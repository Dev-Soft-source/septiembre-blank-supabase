
import React from "react";
import { Save, Clock, AlertCircle } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

interface AutoSaveIndicatorProps {
  isSaving: boolean;
  lastSaved: Date | null;
  error?: boolean;
}

export function AutoSaveIndicator({ isSaving, lastSaved, error }: AutoSaveIndicatorProps) {
  const { t } = useTranslation();

  const formatLastSaved = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) {
      return t('dashboard.justNow');
    } else if (diffMins < 60) {
      return t('dashboard.minutesAgo', { minutes: diffMins });
    } else {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };

  if (error) {
    return (
      <div className="flex items-center gap-2 text-red-400 text-sm">
        <AlertCircle size={16} />
        <span>{t('dashboard.autoSaveError')}</span>
      </div>
    );
  }

  if (isSaving) {
    return (
      <div className="flex items-center gap-2 text-blue-400 text-sm">
        <Save size={16} className="animate-pulse" />
        <span>{t('dashboard.saving')}</span>
      </div>
    );
  }

  if (lastSaved) {
    return (
      <div className="flex items-center gap-2 text-green-400 text-sm">
        <Clock size={16} />
        <span>{t('dashboard.savedAt', { time: formatLastSaved(lastSaved) })}</span>
      </div>
    );
  }

  return null;
}
