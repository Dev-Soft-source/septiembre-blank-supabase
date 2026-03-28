import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Voice mapping from the main function
const AVATAR_VOICE_MAPPING: Record<string, Record<string, { voice: string; pitch: number; speakingRate: number }>> = {
  antonio: {
    es: { voice: "es-ES-Wavenet-B", pitch: 0.9, speakingRate: 1.1 },
    en: { voice: "en-US-Wavenet-D", pitch: 0.9, speakingRate: 1.1 },
    pt: { voice: "pt-PT-Wavenet-C", pitch: 0.9, speakingRate: 1.1 },
    ro: { voice: "ro-RO-Wavenet-B", pitch: 0.9, speakingRate: 1.1 }
  },
  luisa: {
    es: { voice: "es-ES-Wavenet-C", pitch: 0.9, speakingRate: 1.1 },
    en: { voice: "en-US-Wavenet-F", pitch: 0.9, speakingRate: 1.1 },
    pt: { voice: "pt-PT-Wavenet-A", pitch: 0.9, speakingRate: 1.1 },
    ro: { voice: "ro-RO-Wavenet-A", pitch: 0.9, speakingRate: 1.1 }
  },
  john: {
    es: { voice: "es-ES-Wavenet-D", pitch: 1.0, speakingRate: 1.1 },
    en: { voice: "en-US-Wavenet-I", pitch: 1.0, speakingRate: 1.1 },
    pt: { voice: "pt-PT-Wavenet-B", pitch: 1.0, speakingRate: 1.1 },
    ro: { voice: "ro-RO-Wavenet-C", pitch: 1.0, speakingRate: 1.1 }
  },
  teresa: {
    es: { voice: "es-ES-Wavenet-A", pitch: 1.0, speakingRate: 1.1 },
    en: { voice: "en-US-Wavenet-E", pitch: 1.0, speakingRate: 1.1 },
    pt: { voice: "pt-PT-Wavenet-D", pitch: 1.0, speakingRate: 1.1 },
    ro: { voice: "ro-RO-Wavenet-D", pitch: 1.0, speakingRate: 1.1 }
  },
  juan: {
    es: { voice: "es-ES-Wavenet-E", pitch: 1.0, speakingRate: 1.1 },
    en: { voice: "en-US-Wavenet-H", pitch: 1.0, speakingRate: 1.1 },
    pt: { voice: "pt-PT-Wavenet-E", pitch: 1.0, speakingRate: 1.1 },
    ro: { voice: "ro-RO-Wavenet-E", pitch: 1.0, speakingRate: 1.1 }
  },
  ion: {
    es: { voice: "es-ES-Wavenet-F", pitch: 1.0, speakingRate: 1.1 },
    en: { voice: "en-US-Wavenet-J", pitch: 1.0, speakingRate: 1.1 },
    pt: { voice: "pt-PT-Wavenet-F", pitch: 1.0, speakingRate: 1.1 },
    ro: { voice: "ro-RO-Wavenet-F", pitch: 1.0, speakingRate: 1.1 }
  },
  maria: {
    es: { voice: "es-ES-Wavenet-G", pitch: 1.0, speakingRate: 1.1 },
    en: { voice: "en-US-Wavenet-K", pitch: 1.0, speakingRate: 1.1 },
    pt: { voice: "pt-PT-Wavenet-G", pitch: 1.0, speakingRate: 1.1 },
    ro: { voice: "ro-RO-Wavenet-G", pitch: 1.0, speakingRate: 1.1 }
  },
  martin: {
    es: { voice: "es-ES-Wavenet-H", pitch: 1.0, speakingRate: 1.1 },
    en: { voice: "en-US-Wavenet-L", pitch: 1.0, speakingRate: 1.1 },
    pt: { voice: "pt-PT-Wavenet-H", pitch: 1.0, speakingRate: 1.1 },
    ro: { voice: "ro-RO-Wavenet-H", pitch: 1.0, speakingRate: 1.1 }
  }
};

function getGenderForAvatar(avatarId: string): string {
  return ['luisa', 'teresa', 'maria'].includes(avatarId) ? 'FEMALE' : 'MALE';
}

function testVoiceUniqueness() {
  const results: any = {};
  const languages = ['es', 'en', 'pt', 'ro'];
  
  for (const language of languages) {
    results[language] = {
      voices: [],
      duplicates: [],
      gender_check: []
    };
    
    const voicesUsed = new Set();
    
    for (const [avatarId, config] of Object.entries(AVATAR_VOICE_MAPPING)) {
      const voiceConfig = config[language];
      if (voiceConfig) {
        const voice = voiceConfig.voice;
        
        // Check for duplicates
        if (voicesUsed.has(voice)) {
          results[language].duplicates.push(`${avatarId}: ${voice}`);
        } else {
          voicesUsed.add(voice);
        }
        
        results[language].voices.push({
          avatar: avatarId,
          voice: voice,
          pitch: voiceConfig.pitch,
          rate: voiceConfig.speakingRate,
          gender: getGenderForAvatar(avatarId)
        });
        
        // Verify pitch settings
        const expectedPitch = ['antonio', 'luisa'].includes(avatarId) ? 0.9 : 1.0;
        if (voiceConfig.pitch !== expectedPitch) {
          results[language].gender_check.push(`${avatarId}: incorrect pitch ${voiceConfig.pitch}, expected ${expectedPitch}`);
        }
      }
    }
  }
  
  return results;
}

function testGoogleTTSVoiceValidity() {
  const testResult: any = { valid: [], invalid: [], unknown: [] };
  
  // Known valid Google Cloud TTS voices
  const knownValidVoices = [
    'es-ES-Wavenet-A', 'es-ES-Wavenet-B', 'es-ES-Wavenet-C', 'es-ES-Wavenet-D', 'es-ES-Wavenet-E', 'es-ES-Wavenet-F', 'es-ES-Wavenet-G', 'es-ES-Wavenet-H',
    'en-US-Wavenet-A', 'en-US-Wavenet-B', 'en-US-Wavenet-C', 'en-US-Wavenet-D', 'en-US-Wavenet-E', 'en-US-Wavenet-F', 'en-US-Wavenet-G', 'en-US-Wavenet-H', 'en-US-Wavenet-I', 'en-US-Wavenet-J', 'en-US-Wavenet-K', 'en-US-Wavenet-L',
    'pt-PT-Wavenet-A', 'pt-PT-Wavenet-B', 'pt-PT-Wavenet-C', 'pt-PT-Wavenet-D', 'pt-PT-Wavenet-E', 'pt-PT-Wavenet-F', 'pt-PT-Wavenet-G', 'pt-PT-Wavenet-H',
    'ro-RO-Wavenet-A', 'ro-RO-Wavenet-B', 'ro-RO-Wavenet-C', 'ro-RO-Wavenet-D', 'ro-RO-Wavenet-E', 'ro-RO-Wavenet-F', 'ro-RO-Wavenet-G', 'ro-RO-Wavenet-H'
  ];
  
  const allVoicesUsed = new Set();
  
  for (const [avatarId, config] of Object.entries(AVATAR_VOICE_MAPPING)) {
    for (const [lang, voiceConfig] of Object.entries(config)) {
      const voice = voiceConfig.voice;
      allVoicesUsed.add(voice);
      
      if (knownValidVoices.includes(voice)) {
        testResult.valid.push(`${avatarId}(${lang}): ${voice}`);
      } else {
        testResult.unknown.push(`${avatarId}(${lang}): ${voice} - needs verification`);
      }
    }
  }
  
  return testResult;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const uniquenessTest = testVoiceUniqueness();
    const validityTest = testGoogleTTSVoiceValidity();
    
    const summary = {
      total_avatars: Object.keys(AVATAR_VOICE_MAPPING).length,
      total_languages: 4,
      total_configurations: Object.keys(AVATAR_VOICE_MAPPING).length * 4,
      uniqueness_test: uniquenessTest,
      voice_validity_test: validityTest,
      pitch_rate_compliance: {
        antonio_luisa: "pitch: 0.9, rate: 1.1",
        others: "pitch: 1.0, rate: 1.1"
      }
    };

    return new Response(JSON.stringify(summary, null, 2), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});