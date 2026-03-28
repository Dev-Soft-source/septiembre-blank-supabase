import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { AlertTriangle, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface ProfileCompletionWarningProps {
  onDismiss?: () => void;
}

export const ProfileCompletionWarning: React.FC<ProfileCompletionWarningProps> = ({ onDismiss }) => {
  const { profile } = useAuth();
  const { t } = useTranslation();

  // Check what fields are missing
  const missingFields = [];
  
  if (!profile?.first_name) missingFields.push('firstName');
  if (!profile?.last_name) missingFields.push('lastName');
  
  // Only show if there are missing fields
  if (missingFields.length === 0) {
    return null;
  }

  const getMessage = () => {
    const lang = t('', { returnObjects: false }).includes('firstName') ? 'en' : 
                 window.location.pathname.includes('/es') || localStorage.getItem('user-language-preference') === 'es' ? 'es' :
                 window.location.pathname.includes('/pt') || localStorage.getItem('user-language-preference') === 'pt' ? 'pt' :
                 window.location.pathname.includes('/ro') || localStorage.getItem('user-language-preference') === 'ro' ? 'ro' : 'en';

    const messages = {
      en: 'Complete your profile data to avoid automatic account deletion.',
      es: 'Completa tus datos para evitar el borrado automático de cuenta.',
      pt: 'Complete seus dados para evitar a exclusão automática da conta.',
      ro: 'Completează datele profilului pentru a evita ștergerea automată a contului.'
    };

    return messages[lang as keyof typeof messages] || messages.en;
  };

  const getMissingFieldsText = () => {
    const lang = window.location.pathname.includes('/es') || localStorage.getItem('user-language-preference') === 'es' ? 'es' :
                 window.location.pathname.includes('/pt') || localStorage.getItem('user-language-preference') === 'pt' ? 'pt' :
                 window.location.pathname.includes('/ro') || localStorage.getItem('user-language-preference') === 'ro' ? 'ro' : 'en';

    const fieldLabels = {
      en: { firstName: 'First Name', lastName: 'Last Name' },
      es: { firstName: 'Nombre', lastName: 'Apellido' },
      pt: { firstName: 'Nome', lastName: 'Sobrenome' },
      ro: { firstName: 'Prenume', lastName: 'Nume' }
    };

    const labels = fieldLabels[lang as keyof typeof fieldLabels] || fieldLabels.en;
    
    return missingFields.map(field => labels[field as keyof typeof labels]).join(', ');
  };

  return (
    <Alert className="bg-red-50 border-red-200 text-red-800 mb-4">
      <AlertTriangle className="h-4 w-4 text-red-600" />
      <AlertDescription className="flex items-center justify-between">
        <div>
          <div className="font-medium">{getMessage()}</div>
          <div className="text-sm mt-1">
            Missing: {getMissingFieldsText()}
          </div>
        </div>
        {onDismiss && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className="text-red-600 hover:text-red-700 hover:bg-red-100"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
};