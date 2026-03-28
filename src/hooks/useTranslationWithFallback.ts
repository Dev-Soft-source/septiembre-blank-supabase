import { useTranslation } from '@/hooks/useTranslation';
import { CRITICAL_UI_FALLBACKS } from '@/i18n/common';

/**
 * Enhanced translation hook with automatic fallbacks for critical UI elements
 * Ensures no hardcoded strings appear in production
 */
export function useTranslationWithFallback(namespace?: string) {
  const { t, i18n, changeLanguage, language, isReady } = useTranslation(namespace);

  /**
   * Translation function with intelligent fallback system
   * 1. Try namespace-specific translation
   * 2. Try common translation
   * 3. Use critical UI fallback
   * 4. Return key as last resort
   */
  const tWithFallback = (key: string, options?: any): string => {
    try {
      // First, try the namespaced translation
      const translation = String(t(key, options));
      
      // If translation exists and is not the key itself, return it
      if (translation && translation !== key) {
        return translation;
      }
      
      // Try common namespace
      const commonTranslation = String(t(`common.${key}`, options));
      if (commonTranslation && commonTranslation !== `common.${key}`) {
        return commonTranslation;
      }
      
      // Check critical UI fallbacks
      const currentLang = language as keyof typeof CRITICAL_UI_FALLBACKS;
      const fallbacks = CRITICAL_UI_FALLBACKS[currentLang];
      
      if (fallbacks && fallbacks[key as keyof typeof fallbacks]) {
        return fallbacks[key as keyof typeof fallbacks];
      }
      
      // Default to English fallback if current language not found
      const englishFallbacks = CRITICAL_UI_FALLBACKS.en;
      if (englishFallbacks[key as keyof typeof englishFallbacks]) {
        return englishFallbacks[key as keyof typeof englishFallbacks];
      }
      
      // Last resort: return the key (development mode indicator)
      if (process.env.NODE_ENV === 'development') {
        console.warn(`🌐 Missing translation for key: "${key}" in language: "${language}"`);
      }
      
      return key;
    } catch (error) {
      console.error('Translation error for key:', key, error);
      return key;
    }
  };

  /**
   * Safe translation for aria-labels and accessibility strings
   */
  const tAriaLabel = (key: string, options?: any): string => {
    const translation = tWithFallback(key, options);
    // Ensure aria-labels are never empty or just the key
    return translation === key ? '' : translation;
  };

  return {
    t: tWithFallback,
    tAriaLabel,
    i18n,
    changeLanguage,
    language,
    isReady
  };
}