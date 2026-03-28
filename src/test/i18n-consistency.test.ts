import { describe, it, expect } from 'vitest';

// Import existing Spanish dashboard translation files
import esDashboardHotel from '../i18n/locales/es/dashboard/hotel.json';
import esDashboardRatesCalculator from '../i18n/locales/es/dashboard/rates-calculator.json';

/**
 * Recursively flattens a nested object into dot-notation keys
 * Example: { a: { b: "value" } } becomes { "a.b": "value" }
 */
function flattenTranslationObject(obj: any, prefix = ''): Record<string, string> {
  return Object.keys(obj).reduce((acc: Record<string, string>, key: string) => {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      Object.assign(acc, flattenTranslationObject(obj[key], path));
    } else {
      acc[path] = obj[key];
    }
    return acc;
  }, {});
}

/**
 * Extracts keys from a flattened translation object
 */
function extractKeys(obj: any): string[] {
  return Object.keys(flattenTranslationObject(obj)).sort();
}

/**
 * Checks if any translation values contain hardcoded keys (starting with lowercase letter followed by dot)
 */
function checkForHardcodedKeys(obj: any, language: string): string[] {
  const flattened = flattenTranslationObject(obj);
  const hardcodedKeys: string[] = [];
  
  Object.entries(flattened).forEach(([key, value]) => {
    if (typeof value === 'string' && /^[a-z][a-zA-Z]*\./.test(value)) {
      hardcodedKeys.push(`${language}: ${key} = "${value}"`);
    }
  });
  
  return hardcodedKeys;
}

describe('i18n Spanish Translation Tests', () => {
  describe('Spanish Dashboard Hotel translations', () => {
    it('should have proper structure and content', () => {
      const keys = extractKeys(esDashboardHotel);
      expect(keys.length).toBeGreaterThan(0);
      expect(esDashboardHotel.title).toBeDefined();
      expect(esDashboardHotel.description).toBeDefined();
    });

    it('should not contain hardcoded translation keys', () => {
      const hardcoded = checkForHardcodedKeys(esDashboardHotel, 'ES-Hotel');
      expect(hardcoded).toEqual([]);
    });
  });

  describe('Spanish Dashboard Rates Calculator translations', () => {
    it('should have proper structure and content', () => {
      const keys = extractKeys(esDashboardRatesCalculator);
      expect(keys.length).toBeGreaterThan(0);
      expect(esDashboardRatesCalculator.utilities).toBeDefined();
    });

    it('should not contain hardcoded translation keys', () => {
      const hardcoded = checkForHardcodedKeys(esDashboardRatesCalculator, 'ES-RatesCalc');
      expect(hardcoded).toEqual([]);
    });
  });

  describe('Overall Spanish translation integrity', () => {
    it('should not have empty translation values', () => {
      const checkEmptyValues = (obj: any, language: string): string[] => {
        const flattened = flattenTranslationObject(obj);
        const emptyKeys: string[] = [];
        
        Object.entries(flattened).forEach(([key, value]) => {
          if (!value || (typeof value === 'string' && value.trim() === '')) {
            emptyKeys.push(`${language}: ${key}`);
          }
        });
        
        return emptyKeys;
      };

      const allEmptyKeys = [
        ...checkEmptyValues(esDashboardHotel, 'ES-Hotel'),
        ...checkEmptyValues(esDashboardRatesCalculator, 'ES-RatesCalc')
      ];

      expect(allEmptyKeys).toEqual([]);
    });
  });
});