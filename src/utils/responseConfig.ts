/**
 * Response trimming configuration for conversational avatars
 * Controls text output length before TTS processing
 */

export interface ResponseConfig {
  maxCharacters: number;
  trimAtWordBoundary: boolean;
  enabled: boolean;
}

// Default configuration - disabled to allow full responses
export const DEFAULT_RESPONSE_CONFIG: ResponseConfig = {
  maxCharacters: 500,
  trimAtWordBoundary: true,
  enabled: false  // Disabled to allow full avatar responses
};

// Configuration storage key
const CONFIG_STORAGE_KEY = 'avatar_response_config';

/**
 * Get current response configuration
 */
export const getResponseConfig = (): ResponseConfig => {
  try {
    const stored = localStorage.getItem(CONFIG_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...DEFAULT_RESPONSE_CONFIG, ...parsed };
    }
  } catch (error) {
    console.warn('Failed to load response config from storage:', error);
  }
  return DEFAULT_RESPONSE_CONFIG;
};

/**
 * Update response configuration
 */
export const setResponseConfig = (config: Partial<ResponseConfig>): void => {
  try {
    const current = getResponseConfig();
    const updated = { ...current, ...config };
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(updated));
    console.log('Response config updated:', updated);
  } catch (error) {
    console.error('Failed to save response config:', error);
  }
};

/**
 * Trim response text based on configuration
 * Trims at word boundaries to avoid breaking words mid-character
 */
export const trimResponse = (text: string, config?: ResponseConfig): string => {
  const activeConfig = config || getResponseConfig();
  
  if (!activeConfig.enabled || !text) {
    return text;
  }

  if (text.length <= activeConfig.maxCharacters) {
    return text;
  }

  let trimmed = text.substring(0, activeConfig.maxCharacters);
  
  if (activeConfig.trimAtWordBoundary) {
    // Find the last space character to trim at word boundary
    const lastSpaceIndex = trimmed.lastIndexOf(' ');
    if (lastSpaceIndex > 0) {
      trimmed = trimmed.substring(0, lastSpaceIndex);
    }
    // Remove any trailing punctuation that might look odd
    trimmed = trimmed.replace(/[,.;:!?]+$/, '');
  }

  console.log(`Response trimmed from ${text.length} to ${trimmed.length} characters`);
  return trimmed;
};

/**
 * Preset configurations for common use cases
 */
export const RESPONSE_PRESETS = {
  SHORT: { maxCharacters: 60, trimAtWordBoundary: true, enabled: true },
  MEDIUM: { maxCharacters: 80, trimAtWordBoundary: true, enabled: true },
  STANDARD: { maxCharacters: 100, trimAtWordBoundary: true, enabled: true },
  DISABLED: { maxCharacters: 100, trimAtWordBoundary: true, enabled: false }
} as const;