/**
 * Hotel-defined pricing utilities
 * Replaces Sacred Pricing Matrix with hotel-specific pricing from Supabase
 */

import { formatCurrency } from './dynamicPricing';

/**
 * Format price display for hotel packages
 */
export function formatHotelPrice(price: number | null | undefined, currency: string = 'USD'): string {
  if (!price || price <= 0) {
    return '';
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0
  }).format(price);
}

/**
 * Get fallback text for unavailable prices in multiple languages
 */
export function getPriceUnavailableText(language: string = 'en'): string {
  const translations = {
    en: 'Not available',
    es: 'No disponible', 
    pt: 'Não disponível',
    ro: 'Nu este disponibil'
  };

  return translations[language as keyof typeof translations] || translations.en;
}

/**
 * Calculate monthly price from available packages (hotel-defined only)
 */
export function calculateMonthlyFromPackages(packages: Array<{ duration_days: number; current_price_usd: number; occupancy_mode: string }>): number | null {
  if (!packages || packages.length === 0) {
    return null;
  }

  // Find double occupancy packages first (most common)
  const doublePackages = packages.filter(pkg => pkg.occupancy_mode === 'double');
  const targetPackages = doublePackages.length > 0 ? doublePackages : packages;

  // Look for 29-day package first (closest to monthly)
  const monthlyPackage = targetPackages.find(pkg => pkg.duration_days === 29);
  if (monthlyPackage) {
    return monthlyPackage.current_price_usd;
  }

  // Find the longest duration available and calculate proportionally
  const sortedPackages = targetPackages.sort((a, b) => b.duration_days - a.duration_days);
  const longestPackage = sortedPackages[0];
  
  if (longestPackage) {
    // Calculate proportional monthly rate: (price / duration) * 29
    return (longestPackage.current_price_usd / longestPackage.duration_days) * 29;
  }

  return null;
}

/**
 * Get meal plan label in multiple languages
 */
export function getMealPlanLabel(mealPlan: string | null | undefined, language: string = 'en'): string {
  const mealPlanTranslations = {
    room_only: {
      en: 'Room only',
      es: 'Solo alojamiento',
      pt: 'Apenas alojamento',
      ro: 'Doar cazare'
    },
    breakfast: {
      en: 'Breakfast included',
      es: 'Desayuno incluido',
      pt: 'Pequeno-almoço incluído',
      ro: 'Mic dejun inclus'
    },
    half_board: {
      en: 'Half board',
      es: 'Media pensión',
      pt: 'Meia pensão',  
      ro: 'Demipensiune'
    },
    full_board: {
      en: 'Full board',
      es: 'Pensión completa',
      pt: 'Pensão completa',
      ro: 'Pensiune completă'
    },
    all_inclusive: {
      en: 'All inclusive',
      es: 'Todo incluido',
      pt: 'Tudo incluído',
      ro: 'All inclusive'
    }
  };

  if (!mealPlan) {
    return mealPlanTranslations.half_board[language as keyof typeof mealPlanTranslations.half_board] || 'Half board';
  }

  const plan = mealPlanTranslations[mealPlan as keyof typeof mealPlanTranslations];
  return plan?.[language as keyof typeof plan] || mealPlan;
}

/**
 * Simple price validation - just ensure positive numbers
 */
export function validatePrice(price: number | null | undefined): boolean {
  return typeof price === 'number' && price > 0 && !isNaN(price);
}