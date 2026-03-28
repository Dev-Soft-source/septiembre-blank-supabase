// Avatar voice assignments for Google Cloud Neural TTS
// All conversational flows now use Google Cloud Text-to-Speech API

export type AvatarId = 'antonio' | 'luisa' | 'john' | 'teresa' | 'juan' | 'ion' | 'maria' | 'martin';

// Language-specific voice assignments with native pronunciation
export const VOICE_BY_LANGUAGE_GENDER: Record<string, { male: string; female: string }> = {
  'es-ES': {
    male: 'es-ES-Neural2-B',
    female: 'es-ES-Neural2-C'
  },
  'en-US': {
    male: 'en-US-Neural2-D',
    female: 'en-US-Neural2-F'
  },
  'pt-BR': {
    male: 'pt-BR-Neural2-B',
    female: 'pt-BR-Neural2-C'
  },
  'ro-RO': {
    male: 'ro-RO-Neural2-A', 
    female: 'ro-RO-Neural2-B'
  }
};

// Avatar configurations with age-based pitch and specific speaking rates
export const AVATAR_CONFIG_BY_ID: Record<AvatarId, { age: number; gender: 'male' | 'female'; pitch: number; speakingRate: number }> = {
  antonio: { age: 65, gender: 'male', pitch: -3.60, speakingRate: 0.95 }, // 20% lower pitch (-2.00 * 1.2 = -2.40, adjusted to -3.60 for noticeable difference)
  luisa: { age: 65, gender: 'female', pitch: -2.00, speakingRate: 0.95 },
  john: { age: 22, gender: 'male', pitch: 2.00, speakingRate: 1.05 },
  teresa: { age: 50, gender: 'female', pitch: 0.00, speakingRate: 1.00 },
  juan: { age: 35, gender: 'male', pitch: 0.00, speakingRate: 1.00 },
  ion: { age: 21, gender: 'male', pitch: 2.00, speakingRate: 1.05 },
  maria: { age: 55, gender: 'female', pitch: -1.00, speakingRate: 0.90 },
  martin: { age: 40, gender: 'male', pitch: 0.00, speakingRate: 1.00 }
};

// Language fallback mapping for Google Cloud Neural2 TTS
export const LANGUAGE_FALLBACK_VOICES: Record<string, string> = {
  'es': 'en-US-Neural2-J',
  'en': 'en-US-Neural2-J', 
  'pt': 'en-US-Neural2-J',
  'ro': 'en-US-Neural2-J'
};

// Google Cloud Neural2 TTS Configuration
export const TTS_CONFIG = {
  languageCode: 'es-ES',
  ssmlGender: 'NEUTRAL',
  audioEncoding: 'MP3',
  sampleRateHertz: 24000,
  speakingRate: 1.00,
  pitch: 0.00
} as const;

// Language code mapping for Neural2 voices
export const LANGUAGE_CODE_MAPPING: Record<string, string> = {
  'es': 'es-ES',
  'en': 'en-US',
  'pt': 'pt-BR',
  'ro': 'ro-RO'
};

// Map exact folder names from Supabase
const folderNameMap: Record<AvatarId, string> = {
  antonio: 'ANTONIO',
  luisa: 'LUISA',
  john: 'JOHN',
  teresa: 'TERESA',
  juan: 'JUAN',
  ion: 'ION',
  maria: 'MARIA',
  martin: 'MARTIN'
};

// Map exact language suffixes as in Supabase for each avatar (corrected to match actual files)
const avatarLanguageMap: Record<AvatarId, Record<string, string>> = {
  antonio: {
    'es': 'ANTONIO-ESPAOL',
    'en': 'ANTONIO-ENGLISH',
    'pt': 'ANTONIO-PORTUGUES',
    'ro': 'ANTONIO-ROMANA'
  },
  ion: {
    'es': 'ION-ESPAL',
    'en': 'ION-ENGLISH',
    'pt': 'ION-PORTUGUES',
    'ro': 'ION-ROMANA'
  },
  john: {
    'es': 'JOHN-ESPAOL',
    'en': 'JOHN-ENGLISH',
    'pt': 'JOHN-PORTUGUES',
    'ro': 'JOHN-ROMANA'
  },
  juan: {
    'es': 'JUAN',
    'en': 'JUAN-ENGLISH',
    'pt': 'JUAN-PORTUGUES',
    'ro': 'JUAN-ROMANA'
  },
  luisa: {
    'es': 'LUISA-ESPAOL',
    'en': 'LUISA-INGLES',
    'pt': 'LUISA-PORTUGES',
    'ro': 'LUISA-ROMANA'
  },
  maria: {
    'es': 'MARIA-ESPAOL',
    'en': 'MARIA-ENGLISH',
    'pt': 'MARIA-PORTUGES',
    'ro': 'MARIA-ROMANA'
  },
  martin: {
    'es': 'MARTIN-ESPAOL',
    'en': 'MARTIN-ING',
    'pt': 'MARTIN-PORTUGUES',
    'ro': 'MARTIN-ROMANA'
  },
  teresa: {
    'es': 'TERESA-ESPAOL',
    'en': 'TERESA-INGLES',
    'pt': 'TERESA-PORTUGUES',
    'ro': 'TERESA-ROMANA'
  }
};

// Build the intro audio path with exact match to Supabase (with fallback system)
export const getIntroAudioPath = (avatarId: AvatarId, languageCode: string): string => {
  const folderName = folderNameMap[avatarId];
  const langSuffix = avatarLanguageMap[avatarId]?.[languageCode] || avatarLanguageMap[avatarId]?.['es'];
  return `${folderName}/${langSuffix}.${languageCode}.wav`;
};

// Get all available language paths for an avatar (for fallback system)
export const getAvailableAudioPaths = (avatarId: AvatarId): string[] => {
  const folderName = folderNameMap[avatarId];
  const languageMap = avatarLanguageMap[avatarId];
  if (!languageMap) return [];
  
  return Object.entries(languageMap).map(([lang, suffix]) => 
    `${folderName}/${suffix}.${lang}.wav`
  );
};

// Helper to get voice configuration for avatar (deprecated - use getAvatarVoiceConfig)
export const getAvatarVoice = (avatarId: string): string => {
  const config = AVATAR_CONFIG_BY_ID[avatarId as AvatarId];
  return config ? VOICE_BY_LANGUAGE_GENDER['es-ES'][config.gender] : LANGUAGE_FALLBACK_VOICES['es'];
};

// Helper to get complete voice configuration with language-specific voices
export const getAvatarVoiceConfig = (avatarId: string, language: string = 'es') => {
  const config = AVATAR_CONFIG_BY_ID[avatarId as AvatarId];
  if (!config) {
    return {
      voice: 'es-ES-Neural2-B',
      pitch: 0.00,
      speakingRate: 1.00,
      languageCode: 'es-ES',
      gender: 'MALE'
    };
  }

  const languageCode = LANGUAGE_CODE_MAPPING[language] || 'es-ES';
  const voicesByGender = VOICE_BY_LANGUAGE_GENDER[languageCode];
  const voice = voicesByGender ? voicesByGender[config.gender] : 'es-ES-Neural2-B';
  
  return {
    voice,
    pitch: config.pitch,
    speakingRate: config.speakingRate,
    languageCode,
    gender: config.gender.toUpperCase()
  };
};
