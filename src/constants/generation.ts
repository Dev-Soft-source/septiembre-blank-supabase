// LLM generation configuration with enhanced quality parameters
export const LLM_GENERATION = {
  temperature: 1.2,
  frequency_penalty: 0.35,
  presence_penalty: 0.15,
  top_p: 1
} as const;

// Chat completion settings - optimized for enhanced responses  
export const CHAT_CONFIG = {
  max_tokens: 250,  // Increased for 25-second playback limit
  model: "gpt-4o",  // Changed from gpt-4o-mini to gpt-4o for higher quality
  temperature: 1.2, // Reduced from 1.85 to 1.2 for better coherence
  frequency_penalty: 0.35,
  presence_penalty: 0.15,
  top_p: 1
} as const;