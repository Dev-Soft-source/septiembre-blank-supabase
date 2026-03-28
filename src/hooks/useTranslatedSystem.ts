/**
 * COMPLETE LINGUISTIC DECOUPLING UTILITY
 * Systematic replacement of ALL hardcoded strings
 */

import { useTranslationWithFallback } from '@/hooks/useTranslationWithFallback';

/**
 * Console logging with automatic translation
 */
export const useTranslatedConsole = () => {
  const { t } = useTranslationWithFallback();
  
  return {
    log: (key: string, ...params: any[]) => {
      console.log(t(`system:console.${key}`), ...params);
    },
    error: (key: string, ...params: any[]) => {
      console.error(t(`system:console.${key}`), ...params);
    },
    warn: (key: string, ...params: any[]) => {
      console.warn(t(`system:console.${key}`), ...params);
    }
  };
};

/**
 * Form validation with automatic translation
 */
export const useTranslatedValidation = () => {
  const { t } = useTranslationWithFallback();
  
  return {
    required: (field: string) => t('system:validation.fieldRequired', { field }),
    invalid: (field: string) => t('system:validation.invalid', { field }),
    error: (message: string) => t('system:validation.error') + ': ' + message
  };
};

/**
 * Pricing display with automatic translation
 */
export const useTranslatedPricing = () => {
  const { t } = useTranslationWithFallback();
  
  return {
    formatPrice: (price: number, currency: string = 'EUR') => {
      return `${t('system:pricing.from')} ${new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency
      }).format(price)} ${t('system:pricing.perMonth')}`;
    },
    priceOnRequest: () => t('system:pricing.onRequest'),
    currency: () => t('system:pricing.currency')
  };
};

/**
 * Location display with automatic translation  
 */
export const useTranslatedLocation = () => {
  const { t } = useTranslationWithFallback();
  
  return {
    formatLocation: (city?: string, country?: string) => {
      if (city && country) {
        return t('system:location.cityCountry', { city, country });
      }
      return city || country || t('system:location.notSpecified');
    }
  };
};

/**
 * UI state messages with automatic translation
 */
export const useTranslatedState = () => {
  const { t } = useTranslationWithFallback();
  
  return {
    loading: () => t('system:state.loading'),
    noItems: () => t('system:state.noItems'),
    noOptions: () => t('system:state.noOptions'),
    noResults: () => t('system:state.noResults'),
    tryAgain: () => t('system:state.tryAgain')
  };
};