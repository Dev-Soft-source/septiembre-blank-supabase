import { describe, it, expect } from 'vitest';
import { createClient } from '@supabase/supabase-js';

// Test configuration - ISOLATED AUDIT ENVIRONMENT
const SUPABASE_URL = 'https://daumzjohbruhpsimfydx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhdW16am9oYnJ1aHBzaW1meWR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU5MTU2MzMsImV4cCI6MjA3MTQ5MTYzM30.n_O7hkAuxEaPEBMbgkDbuhfCwefppDJO0_jWpgxJBr8';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const REQUIRED_LANGUAGES = ['english_value', 'spanish_value', 'portuguese_value', 'romanian_value'];
const REQUIRED_CATEGORIES = ['hotel_features', 'room_features', 'property_styles', 'meal_plans', 'room_types'];

describe('🌐 Database Translation Completeness', () => {
  it('should have complete translations for all filter categories', async () => {
    const { data: filterMappings, error } = await supabase
      .from('filter_value_mappings')
      .select('*')
      .eq('is_active', true);

    expect(error).toBeNull();
    expect(filterMappings).toBeDefined();

    for (const category of REQUIRED_CATEGORIES) {
      const categoryMappings = filterMappings!.filter(m => m.category === category);
      
      expect(categoryMappings.length).toBeGreaterThan(0);

      const missingTranslations: string[] = [];
      
      categoryMappings.forEach(mapping => {
        REQUIRED_LANGUAGES.forEach(lang => {
          if (!mapping[lang] || mapping[lang].trim() === '') {
            missingTranslations.push(`${category}: ${mapping.english_value} missing ${lang}`);
          }
        });
      });

      expect(missingTranslations).toEqual([]);
    }
  });

  it('CRITICAL: No deployment should proceed with incomplete translations', async () => {
    const { data: incompleteTranslations, error } = await supabase
      .from('filter_value_mappings')
      .select('category, english_value')
      .eq('is_active', true)
      .or('spanish_value.is.null,portuguese_value.is.null,romanian_value.is.null');

    expect(error).toBeNull();
    expect(incompleteTranslations?.length || 0).toBe(0);
  });

  it('should not have any raw translation keys in user-facing content', async () => {
    const { data: mappings, error } = await supabase
      .from('filter_value_mappings')
      .select('*')
      .eq('is_active', true);

    expect(error).toBeNull();
    
    const suspiciousKeys: string[] = [];
    
    mappings?.forEach(mapping => {
      REQUIRED_LANGUAGES.forEach(lang => {
        const value = mapping[lang];
        if (value && /^[a-z][a-zA-Z]*\./.test(value)) {
          suspiciousKeys.push(`${mapping.category}: ${lang} = "${value}"`);
        }
      });
    });

    expect(suspiciousKeys).toEqual([]);
  });
});