import { describe, it, expect, beforeAll } from 'vitest';
import i18n from '../i18n/config';

/**
 * Comprehensive i18n runtime validation test
 * This test ensures that critical i18n keys resolve properly at runtime
 * and prevents the issue where raw keys are displayed to users.
 */

describe('i18n Runtime Validation', () => {
  beforeAll(async () => {
    // Ensure i18n is properly initialized
    if (!i18n.isInitialized) {
      await i18n.init();
    }
  });

  const criticalNamespaces = {
    auth: [
      'travelerLogin',
      'hotelPartnerLogin', 
      'signInToAccount',
      'signInToPartnerAccount',
      'dontHaveAccount',
      'createTravelerAccountLink',
      'dontHavePartnerAccount',
      'registerAsHotelPartner'
    ],
    faq: [
      'title',
      'subtitle', 
      'search'
    ],
    dashboard: [
      'welcome',
      'stats',
      'general'
    ]
  };

  const languages = ['en', 'es', 'pt', 'ro'];

  languages.forEach(language => {
    describe(`Language: ${language}`, () => {
      beforeAll(async () => {
        await i18n.changeLanguage(language);
      });

      Object.entries(criticalNamespaces).forEach(([namespace, keys]) => {
        describe(`Namespace: ${namespace}`, () => {
          keys.forEach(key => {
            it(`should resolve key "${key}" to actual translation (not raw key)`, () => {
              const result = i18n.t(`${namespace}:${key}`);
              
              // The translation should not be the same as the key
              expect(result).not.toBe(key);
              expect(result).not.toBe(`${namespace}.${key}`);
              
              // The translation should be a non-empty string
              expect(typeof result).toBe('string');
              expect(result.length).toBeGreaterThan(0);
              
              // The translation should not contain raw key patterns
              expect(result).not.toMatch(/^[a-z]+\.[a-zA-Z]+$/);
              
              console.log(`✓ ${language}:${namespace}.${key} → "${result}"`);
            });
          });
        });
      });

      it('should have i18n properly initialized', () => {
        expect(i18n.isInitialized).toBe(true);
        expect(i18n.language).toBe(language);
      });

      it('should have all required resources loaded', () => {
        const resources = i18n.getResourceBundle(language, 'translation');
        expect(resources).toBeDefined();
        
        // Check that critical namespaces exist in the store
        expect(i18n.hasResourceBundle(language, 'auth')).toBe(true);
        expect(i18n.hasResourceBundle(language, 'faq')).toBe(true);
        expect(i18n.hasResourceBundle(language, 'dashboard')).toBe(true);
      });
    });
  });

  describe('Configuration Validation', () => {
    it('should have consistent namespace structure across all languages', () => {
      languages.forEach(language => {
        // All languages should have the same top-level namespaces
        const expectedNamespaces = ['auth', 'faq', 'dashboard', 'navigation', 'footer'];
        expectedNamespaces.forEach(namespace => {
          expect(i18n.hasResourceBundle(language, namespace)).toBe(true);
        });
      });
    });

    it('should not have any hardcoded fallback keys in configuration', () => {
      const config = i18n.options;
      expect(config.fallbackLng).toBe('en');
      expect(config.debug).toBe(true); // Debug should be enabled for now
    });
  });
});