import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-correlation-id',
};

// Structured logging for edge function
function jlog(level: "info" | "error", scope: string, data: Record<string, unknown>) {
  const entry = { ts: new Date().toISOString(), level, scope, ...data };
  console[level === "error" ? "error" : "log"](JSON.stringify(entry));
}

interface TtsRequest {
  text: string;
  avatarId: string;
  language: string;
  voiceName: string;
}

// Language-specific voice assignments with native pronunciation
const VOICE_BY_LANGUAGE_GENDER: Record<string, { male: string; female: string }> = {
  'es-ES': { male: 'es-ES-Neural2-B', female: 'es-ES-Neural2-C' },
  'en-US': { male: 'en-US-Neural2-D', female: 'en-US-Neural2-F' },
  'pt-BR': { male: 'pt-BR-Neural2-B', female: 'pt-BR-Neural2-C' },
  'ro-RO': { male: 'ro-RO-Wavenet-A', female: 'ro-RO-Wavenet-A' }
};

// Avatar configurations with age-based pitch and specific speaking rates
const AVATAR_CONFIG: Record<string, { age: number; gender: 'male' | 'female'; pitch: number; speakingRate: number }> = {
  antonio: { age: 65, gender: 'male', pitch: -2.00, speakingRate: 0.95 },
  luisa: { age: 65, gender: 'female', pitch: -2.00, speakingRate: 0.95 },
  john: { age: 22, gender: 'male', pitch: 2.00, speakingRate: 1.05 },
  teresa: { age: 50, gender: 'female', pitch: 0.00, speakingRate: 1.00 },
  juan: { age: 35, gender: 'male', pitch: 0.00, speakingRate: 1.00 },
  ion: { age: 21, gender: 'male', pitch: 2.00, speakingRate: 1.05 },
  maria: { age: 55, gender: 'female', pitch: -1.00, speakingRate: 0.90 },
  martin: { age: 40, gender: 'male', pitch: 0.00, speakingRate: 1.00 }
};

// Get voice configuration for avatar with language-specific native voices
function getVoiceConfigForAvatar(avatarId: string, language: string = 'es'): { voice: string; pitch: number; speakingRate: number; languageCode: string; gender: string } {
  const config = AVATAR_CONFIG[avatarId];
  if (!config) {
    return { voice: "es-ES-Neural2-B", pitch: 0.0, speakingRate: 1.00, languageCode: "es-ES", gender: "MALE" };
  }

  // Set appropriate language code based on requested language
  let languageCode = "es-ES";
  if (language === 'en') {
    languageCode = "en-US";
  } else if (language === 'pt') {
    languageCode = "pt-BR";
  } else if (language === 'ro') {
    languageCode = "ro-RO";
  } else {
    languageCode = "es-ES";
  }

  // Get language-specific voice based on gender
  const voicesByGender = VOICE_BY_LANGUAGE_GENDER[languageCode];
  const voice = voicesByGender ? voicesByGender[config.gender] : 'es-ES-Neural2-B';
  const gender = config.gender.toUpperCase();
  
  return {
    voice,
    pitch: config.pitch,
    speakingRate: config.speakingRate,
    languageCode,
    gender
  };
}

serve(async (req) => {
  const correlationId = req.headers.get("X-Correlation-Id") ?? crypto.randomUUID();
  const t0 = Date.now();

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, avatarId, language, voiceName }: TtsRequest = await req.json();

    if (!text) {
      throw new Error('Text is required');
    }

    const GOOGLE_TTS_API_KEY = Deno.env.get('GOOGLE_TTS_API_KEY');
    if (!GOOGLE_TTS_API_KEY) {
      throw new Error('GOOGLE_TTS_API_KEY is not configured');
    }

    // Use the mapped voice configuration for the avatar
    const voiceConfig = getVoiceConfigForAvatar(avatarId, language);

    jlog("info", "tts.google.request", {
      correlationId,
      avatarId,
      voiceId: voiceConfig.voice,
      lang: voiceConfig.languageCode,
      pitch: voiceConfig.pitch,
      speakingRate: voiceConfig.speakingRate,
      textLen: text.length,
      service: "google-cloud-neural"
    });

    // Prepare the Google Cloud TTS request with specific voice settings
    const ttsPayload = {
      input: {
        text: text
      },
      voice: {
        languageCode: voiceConfig.languageCode,
        name: voiceConfig.voice,
        ssmlGender: voiceConfig.gender
      },
      audioConfig: {
        audioEncoding: "MP3",
        sampleRateHertz: 24000,
        speakingRate: voiceConfig.speakingRate,
        pitch: voiceConfig.pitch,
        volumeGainDb: 0.0
      }
    };

    jlog("info", "tts.google.api_call", {
      correlationId,
      voiceName: voiceConfig.voice,
      textLen: text.length
    });

    const ttsResponse = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${GOOGLE_TTS_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ttsPayload),
    });

    if (!ttsResponse.ok) {
      const errorText = await ttsResponse.text();
      jlog("error", "tts.google.api_error", {
        correlationId,
        status: ttsResponse.status,
        voiceName: voiceConfig.voice,
        err: errorText
      });
      throw new Error(`Google Cloud TTS API error: ${ttsResponse.status} ${errorText}`);
    }

    const ttsData = await ttsResponse.json();

    if (!ttsData.audioContent) {
      jlog("error", "tts.google.no_audio", {
        correlationId,
        hasAudioContent: false,
        message: "Google Cloud TTS did not return audio content",
        ttsModel: "google-cloud-neural",
        voiceId: voiceConfig.voice,
        language: voiceConfig.languageCode,
        textLength: text.length
      });
      throw new Error('Google Cloud TTS did not return audio content');
    }

    const rtMs = Date.now() - t0;
    jlog("info", "tts.google.ok", {
      correlationId,
      hasAudioContent: true,
      rtMs,
      avatarId,
      voiceId: voiceConfig.voice,
      language: voiceConfig.languageCode
    });

    return new Response(
      JSON.stringify({ 
        audioContent: ttsData.audioContent,
        voiceUsed: voiceConfig.voice,
        languageCode: voiceConfig.languageCode
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    const rtMs = Date.now() - t0;
    jlog("error", "tts.google.error", {
      correlationId,
      rtMs,
      message: error.message
    });
    
    console.error('Error in google-cloud-tts function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});