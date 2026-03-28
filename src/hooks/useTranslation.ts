
import { useTranslation as useI18nTranslation } from 'react-i18next';
import { useEffect } from 'react';

export const useTranslation = (namespace?: string) => {
  const { t, i18n } = useI18nTranslation(namespace);
  
  // Persistent language selection
  useEffect(() => {
    // Load saved language on mount
    const savedLanguage = localStorage.getItem('user-language-preference');
    if (savedLanguage && savedLanguage !== i18n.language) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  const changeLanguage = (language: string) => {
    // Save to localStorage for persistence
    localStorage.setItem('user-language-preference', language);
    return i18n.changeLanguage(language);
  };
  
  return {
    t,
    i18n,
    changeLanguage,
    language: i18n.language,
    isReady: i18n.isInitialized
  };
};

export default useTranslation;
