import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { apiV2Client } from '@/api/v2/client';

export interface CodeValidationResult {
  isValid: boolean;
  error?: string;
  suggestion?: string;
}

export interface EntityCodeFormats {
  // Commission entities (7 chars: PREFIX + 5 digits + suffix letter)
  agent: { prefix: 'P'; length: 7; hasCommission: true };
  hotel: { prefix: 'H'; length: 7; hasCommission: true };
  association: { prefix: 'A'; length: 7; hasCommission: true };
  // Non-commission entities (6 chars: PREFIX + 5 digits)
  leader: { prefix: 'L'; length: 6; hasCommission: false };
  ambassador: { prefix: 'E'; length: 6; hasCommission: false };
}

export const ENTITY_FORMATS: EntityCodeFormats = {
  agent: { prefix: 'P', length: 7, hasCommission: true },
  hotel: { prefix: 'H', length: 7, hasCommission: true },
  association: { prefix: 'A', length: 7, hasCommission: true },
  leader: { prefix: 'L', length: 6, hasCommission: false },
  ambassador: { prefix: 'E', length: 6, hasCommission: false },
};

export function useIdentificationCodes() {
  const { toast } = useToast();
  const [isValidating, setIsValidating] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const validateCode = useCallback((
    code: string, 
    entityType: keyof EntityCodeFormats
  ): CodeValidationResult => {
    if (!code || code.trim() === '') {
      return { isValid: false, error: 'Code is required' };
    }

    const format = ENTITY_FORMATS[entityType];
    const upperCode = code.toUpperCase();

    // Check length
    if (upperCode.length !== format.length) {
      return { 
        isValid: false, 
        error: `Code must be exactly ${format.length} characters`,
        suggestion: `Expected format: ${format.prefix}${format.hasCommission ? '[5 digits][letter A-Z except O]' : '[5 digits]'}`
      };
    }

    // Check prefix
    if (!upperCode.startsWith(format.prefix)) {
      return { 
        isValid: false, 
        error: `Code must start with '${format.prefix}'`,
        suggestion: `Expected format: ${format.prefix}${format.hasCommission ? '[5 digits][letter A-Z except O]' : '[5 digits]'}`
      };
    }

    // Check for forbidden letter O
    if (upperCode.includes('O')) {
      return { 
        isValid: false, 
        error: 'Code cannot contain the letter O',
        suggestion: 'Please replace O with any other letter or digit'
      };
    }

    // Check digits (positions 2-6)
    const digits = upperCode.slice(1, 6);
    if (!/^\d{5}$/.test(digits)) {
      return { 
        isValid: false, 
        error: 'Characters 2-6 must be digits (0-9)',
        suggestion: `Expected format: ${format.prefix}[5 digits]${format.hasCommission ? '[letter A-Z except O]' : ''}`
      };
    }

    // Check suffix letter for commission entities
    if (format.hasCommission) {
      const suffix = upperCode.slice(6);
      if (!/^[A-Z]$/.test(suffix) || suffix === 'O') {
        return { 
          isValid: false, 
          error: 'Last character must be a letter A-Z (except O)',
          suggestion: `Expected format: ${format.prefix}[5 digits][letter A-Z except O]`
        };
      }
    }

    return { isValid: true };
  }, []);

  const validateCodeUniqueness = useCallback(async (
    code: string, 
    entityType: keyof EntityCodeFormats,
    excludeId?: string
  ): Promise<{ isUnique: boolean; error?: string }> => {
    setIsValidating(true);
    try {
      const response = await apiV2Client.validateCode(code, entityType, excludeId);
      
      if (!response.success) {
        return { isUnique: false, error: response.error || 'Failed to validate code uniqueness' };
      }

      return { 
        isUnique: response.data?.isUnique ?? false, 
        error: response.data?.error 
      };
    } catch (error) {
      console.error('Error validating code uniqueness:', error);
      return { isUnique: false, error: 'Failed to validate code uniqueness' };
    } finally {
      setIsValidating(false);
    }
  }, []);

  const generateCode = useCallback(async (
    entityType: keyof EntityCodeFormats
  ): Promise<{ code?: string; error?: string }> => {
    setIsGenerating(true);
    try {
      const response = await apiV2Client.generateCode(entityType);
      
      if (!response.success) {
        return { error: response.error || 'Failed to generate code' };
      }

      return { code: response.data?.code };
    } catch (error) {
      console.error('Error generating code:', error);
      return { error: 'Failed to generate code' };
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const formatCode = useCallback((code: string): string => {
    return code.toUpperCase().replace(/[O]/g, '');
  }, []);

  const getCodeExamples = useCallback((entityType: keyof EntityCodeFormats): string[] => {
    const format = ENTITY_FORMATS[entityType];
    if (format.hasCommission) {
      return [
        `${format.prefix}12345A`,
        `${format.prefix}67890B`,
        `${format.prefix}54321C`
      ];
    } else {
      return [
        `${format.prefix}12345`,
        `${format.prefix}67890`,
        `${format.prefix}54321`
      ];
    }
  }, []);

  const getEntityTypeName = useCallback((entityType: keyof EntityCodeFormats): string => {
    const names = {
      agent: 'Promoter',
      hotel: 'Hotel',
      association: 'Association', 
      leader: 'Group Leader',
      ambassador: 'Ambassador'
    };
    return names[entityType];
  }, []);

  return {
    validateCode,
    validateCodeUniqueness,
    generateCode,
    formatCode,
    getCodeExamples,
    getEntityTypeName,
    isValidating,
    isGenerating,
    ENTITY_FORMATS
  };
}