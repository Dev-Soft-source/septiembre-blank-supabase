import { describe, it, expect, beforeAll } from 'vitest';
import i18n from '@/i18n/config';

describe('i18n Critical Translation Validation', () => {
  const supportedLanguages = ['en', 'es', 'pt', 'ro'];
  const criticalNamespaces = {
    auth: ['travelerLogin', 'hotelPartnerLogin', 'email', 'password', 'signInAsTraveler', 'signInAsHotelPartner', 'enterEmail', 'enterPassword', 'signingIn'],
    faq: ['title', 'subtitle', 'search'],
  };

  beforeAll(async () => {
    await i18n.init();
    console.log('✅ i18n initialized for critical validation tests');
  });

  supportedLanguages.forEach(language => {
    describe(`Language: ${language}`, () => {
      beforeAll(async () => {
        await i18n.changeLanguage(language);
        console.log(`🌐 Switched to language: ${language}`);
      });

      Object.entries(criticalNamespaces).forEach(([namespace, keys]) => {
        describe(`Namespace: ${namespace}`, () => {
          keys.forEach(key => {
            it(`should resolve key "${key}" without raw display`, () => {
              const translation = i18n.t(key, { ns: namespace });
              
              // Critical validation: never show raw keys
              expect(translation).not.toBe(key);
              expect(translation).not.toBe(`${namespace}.${key}`);
              expect(translation).not.toMatch(/^[a-zA-Z]+\.[a-zA-Z]+/);
              expect(typeof translation).toBe('string');
              expect(translation.length).toBeGreaterThan(0);
              
              console.log(`✓ ${language}.${namespace}.${key}: "${translation}"`);
            });
          });
        });
      });

      it('should have all auth translations loaded', () => {
        const hasAuth = i18n.hasResourceBundle(language, 'auth');
        expect(hasAuth).toBe(true);
        
        const authBundle = i18n.getResourceBundle(language, 'auth');
        expect(authBundle).toBeDefined();
        expect(authBundle.auth).toBeDefined();
      });

      it('should have all faq translations loaded', () => {
        const hasFaq = i18n.hasResourceBundle(language, 'faq');
        expect(hasFaq).toBe(true);
        
        const faqBundle = i18n.getResourceBundle(language, 'faq');
        expect(faqBundle).toBeDefined();
        expect(faqBundle.faq).toBeDefined();
      });
    });
  });

  describe('Runtime Translation Validation', () => {
    it('should prevent raw key display in production-like conditions', async () => {
      // Test critical login page keys
      await i18n.changeLanguage('en');
      
      const travelerLogin = i18n.t('travelerLogin', { ns: 'auth' });
      const email = i18n.t('email', { ns: 'auth' });
      const password = i18n.t('password', { ns: 'auth' });
      
      expect(travelerLogin).toBe('Traveler Login');
      expect(email).toBe('Email');
      expect(password).toBe('Password');
      
      // Test critical FAQ page keys
      const faqTitle = i18n.t('title', { ns: 'faq' });
      const faqSubtitle = i18n.t('subtitle', { ns: 'faq' });
      
      expect(faqTitle).toBe('Frequently Asked Questions');
      expect(faqSubtitle).toBe('Find answers to the most common questions about Hotel-Living');
    });

    it('should handle namespace switching correctly', async () => {
      // Switch between namespaces to verify correct resolution
      await i18n.changeLanguage('en');
      
      const authEmail = i18n.t('email', { ns: 'auth' });
      const faqTitle = i18n.t('title', { ns: 'faq' });
      
      expect(authEmail).not.toMatch(/^(email|auth\.email)$/);
      expect(faqTitle).not.toMatch(/^(title|faq\.title)$/);
      
      expect(authEmail).toBe('Email');
      expect(faqTitle).toBe('Frequently Asked Questions');
    });
  });
});