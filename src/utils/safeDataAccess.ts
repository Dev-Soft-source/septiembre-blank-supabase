// Safe data access utilities for hotel detail pages
// Provides consistent fallback behavior across all components

export interface SafeDataFallbacks {
  en: string;
  es: string;
  pt: string;
  ro: string;
}

// Localized fallback texts
export const FALLBACK_TEXTS: Record<string, SafeDataFallbacks> = {
  notAvailable: {
    en: "Not available",
    es: "No disponible", 
    pt: "Não disponível",
    ro: "Nu este disponibil"
  },
  noActivities: {
    en: "No activities listed",
    es: "Sin actividades disponibles",
    pt: "Nenhuma atividade listada", 
    ro: "Nu sunt activități listate"
  },
  noThemes: {
    en: "No themes available",
    es: "Sin temas disponibles",
    pt: "Nenhum tema disponível",
    ro: "Nu sunt teme disponibile"
  },
  noFeatures: {
    en: "No features listed",
    es: "Sin características disponibles", 
    pt: "Nenhuma característica listada",
    ro: "Nu sunt caracteristici listate"
  },
  noDescription: {
    en: "Description not available",
    es: "Descripción no disponible",
    pt: "Descrição não disponível", 
    ro: "Descrierea nu este disponibilă"
  }
};

// Safe string access with fallback
export function safeString(
  value: string | null | undefined, 
  fallbackKey: keyof typeof FALLBACK_TEXTS,
  language: string = 'en'
): string {
  if (value && typeof value === 'string' && value.trim().length > 0) {
    return value.trim();
  }
  
  const fallback = FALLBACK_TEXTS[fallbackKey];
  return fallback?.[language as keyof SafeDataFallbacks] || fallback?.en || '';
}

// Safe array access with fallback
export function safeArray<T>(
  value: T[] | null | undefined,
  fallbackKey: keyof typeof FALLBACK_TEXTS,
  language: string = 'en'
): T[] | string {
  if (Array.isArray(value) && value.length > 0) {
    return value;
  }
  
  const fallback = FALLBACK_TEXTS[fallbackKey];
  return fallback?.[language as keyof SafeDataFallbacks] || fallback?.en || '';
}

// Safe object access with fallback to empty object
export function safeObject<T extends Record<string, any>>(
  value: T | null | undefined,
  defaultValue: T = {} as T
): T {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value;
  }
  return defaultValue;
}

// Safe number access with fallback
export function safeNumber(
  value: number | null | undefined, 
  defaultValue: number = 0
): number {
  if (typeof value === 'number' && !isNaN(value) && isFinite(value)) {
    return value;
  }
  return defaultValue;
}

// Safe activities access - returns array or fallback text
export function safeActivities(
  activities: any[] | null | undefined,
  language: string = 'en'
): any[] | string {
  if (Array.isArray(activities) && activities.length > 0) {
    // Filter out any invalid activities
    const validActivities = activities.filter(activity => 
      activity && 
      (activity.name || (activity.activities && activity.activities.name))
    );
    
    if (validActivities.length > 0) {
      return validActivities;
    }
  }
  
  return safeArray([], 'noActivities', language) as string;
}

// Safe themes access - returns array or fallback text  
export function safeThemes(
  themes: any[] | null | undefined,
  language: string = 'en'
): any[] | string {
  if (Array.isArray(themes) && themes.length > 0) {
    // Filter out any invalid themes
    const validThemes = themes.filter(theme => 
      theme && 
      (theme.name || (theme.themes && theme.themes.name))
    );
    
    if (validThemes.length > 0) {
      return validThemes;
    }
  }
  
  return safeArray([], 'noThemes', language) as string;
}

// Safe features access - returns object keys as array or fallback text
export function safeFeatures(
  features: Record<string, boolean> | null | undefined,
  language: string = 'en'
): string[] | string {
  if (features && typeof features === 'object' && !Array.isArray(features)) {
    const featureKeys = Object.keys(features).filter(key => features[key] === true);
    if (featureKeys.length > 0) {
      return featureKeys;
    }
  }
  
  return safeArray([], 'noFeatures', language) as string;
}

// Safe price access with validation
export function safePrice(
  price: number | null | undefined,
  currency: string = 'USD'
): number | null {
  if (typeof price === 'number' && price > 0 && isFinite(price)) {
    return price;
  }
  return null;
}

// Safe banking info access
export function safeBankingInfo(
  bankingInfo: any | null | undefined
): Record<string, any> {
  return safeObject(bankingInfo, {
    bank_name: null,
    iban_account: null, 
    swift_bic: null,
    bank_country: null,
    account_holder: null
  });
}

// Check if a value is effectively empty (null, undefined, empty string, empty array, empty object)
export function isEmpty(value: any): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}