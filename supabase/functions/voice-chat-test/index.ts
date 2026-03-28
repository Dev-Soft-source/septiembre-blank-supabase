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

interface VoiceChatTestRequest {
  avatarId: string;
  language: string;
  audioData?: string;
}

// Test text responses for each language
const TEST_RESPONSES = {
  es: "Hola, este es un mensaje de prueba en español. El sistema de voz está funcionando correctamente.",
  en: "Hello, this is a test message in English. The voice system is working correctly.",
  pt: "Olá, esta é uma mensagem de teste em português. O sistema de voz está funcionando corretamente.",
  ro: "Salut, acesta este un mesaj de test în română. Sistemul vocal funcționează corect."
} as const;

// Avatar voice mapping for testing
const AVATAR_VOICE_MAPPING: Record<string, { voice: string; pitch: number; speakingRate: number }> = {
  antonio: { voice: "es-ES-Wavenet-B", pitch: 0.8, speakingRate: 1.01 },
  luisa: { voice: "es-ES-Wavenet-C", pitch: 0.8, speakingRate: 1.01 },
  teresa: { voice: "es-MX-Wavenet-C", pitch: 1.1, speakingRate: 1.01 },
  john: { voice: "en-US-Wavenet-D", pitch: 1.0, speakingRate: 1.01 },
  maria: { voice: "es-MX-Wavenet-A", pitch: 1.1, speakingRate: 1.01 },
  ion: { voice: "ro-RO-Wavenet-A", pitch: 1.2, speakingRate: 1.01 },
  juan: { voice: "es-ES-Wavenet-G", pitch: 1.0, speakingRate: 1.01 },
  martin: { voice: "pt-BR-Neural2-B", pitch: 1.0, speakingRate: 1.01 }
};

function getVoiceConfigForAvatar(avatarId: string, language: string = 'es'): { voice: string; pitch: number; speakingRate: number; languageCode: string; gender: string } {
  const config = AVATAR_VOICE_MAPPING[avatarId];
  if (!config) {
    return { voice: "es-ES-Wavenet-D", pitch: 1.0, speakingRate: 1.01, languageCode: "es-ES", gender: "MALE" };
  }

  let finalVoice = config.voice;
  let languageCode = "es-ES";

  // Extract language code from pre-configured voice name
  if (config.voice.startsWith("en-US-")) {
    languageCode = "en-US";
    finalVoice = config.voice;
  } else if (config.voice.startsWith("pt-BR-")) {
    languageCode = "pt-BR";
    finalVoice = config.voice;
  } else if (config.voice.startsWith("ro-RO-")) {
    languageCode = "ro-RO";
    finalVoice = config.voice;
  } else if (config.voice.startsWith("es-MX-")) {
    languageCode = "es-MX";
    finalVoice = config.voice;
  } else {
    languageCode = "es-ES";
    finalVoice = config.voice;
  }

  // Adapt to requested language if different
  if (language !== languageCode.split('-')[0]) {
    if (language === 'en') {
      languageCode = "en-US";
      const isFemale = ['luisa', 'teresa', 'maria'].includes(avatarId);
      finalVoice = isFemale ? "en-US-Wavenet-C" : "en-US-Wavenet-D";
    } else if (language === 'pt') {
      languageCode = "pt-BR";
      const isFemale = ['luisa', 'teresa', 'maria'].includes(avatarId);
      finalVoice = isFemale ? "pt-BR-Neural2-A" : "pt-BR-Neural2-B";
    } else if (language === 'ro') {
      languageCode = "ro-RO";
      finalVoice = "ro-RO-Wavenet-A";
    } else {
      languageCode = "es-ES";
      const isFemale = ['luisa', 'teresa', 'maria'].includes(avatarId);
      finalVoice = isFemale ? "es-ES-Wavenet-C" : "es-ES-Wavenet-B";
    }
  }

  const gender = ['luisa', 'teresa', 'maria'].includes(avatarId) ? 'FEMALE' : 'MALE';
  
  return {
    voice: finalVoice,
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
    jlog("info", "test.start", { correlationId, stage: "request_received" });

    const { avatarId, language, audioData }: VoiceChatTestRequest = await req.json();

    jlog("info", "test.params", {
      correlationId,
      avatarId,
      language,
      hasAudioData: !!audioData,
      audioDataLength: audioData?.length || 0
    });

    const GOOGLE_TTS_API_KEY = Deno.env.get('GOOGLE_TTS_API_KEY');
    
    if (!GOOGLE_TTS_API_KEY) {
      jlog("error", "test.config", { correlationId, error: "GOOGLE_TTS_API_KEY is not configured" });
      throw new Error('GOOGLE_TTS_API_KEY is not configured');
    }

    jlog("info", "test.config", { correlationId, stage: "api_key_verified" });

    // Get test text for the specified language
    const testText = TEST_RESPONSES[language as keyof typeof TEST_RESPONSES] || TEST_RESPONSES.es;
    jlog("info", "test.text", { correlationId, language, testText, stage: "test_text_selected" });

    // Get voice configuration for avatar
    const voiceConfig = getVoiceConfigForAvatar(avatarId, language);
    jlog("info", "test.voice_config", {
      correlationId,
      avatarId,
      voiceId: voiceConfig.voice,
      languageCode: voiceConfig.languageCode,
      pitch: voiceConfig.pitch,
      speakingRate: voiceConfig.speakingRate,
      gender: voiceConfig.gender,
      stage: "voice_config_generated"
    });

    // Skip ChatGPT processing - use fixed test text directly
    jlog("info", "test.bypass_chatgpt", { correlationId, stage: "chatgpt_bypassed" });

    // Generate audio using Google Cloud TTS with specific voice settings
    const ttsPayload = {
      input: {
        text: testText
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

    jlog("info", "test.tts_request", {
      correlationId,
      payload: ttsPayload,
      stage: "tts_request_prepared"
    });

    const ttsResponse = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${GOOGLE_TTS_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ttsPayload),
    });

    jlog("info", "test.tts_response", {
      correlationId,
      status: ttsResponse.status,
      ok: ttsResponse.ok,
      stage: "tts_response_received"
    });

    if (!ttsResponse.ok) {
      const errorText = await ttsResponse.text();
      jlog("error", "test.tts_error", {
        correlationId,
        status: ttsResponse.status,
        voiceName: voiceConfig.voice,
        error: errorText,
        stage: "tts_api_error"
      });
      throw new Error(`Google Cloud TTS API error: ${ttsResponse.status} - ${errorText}`);
    }

    const ttsData = await ttsResponse.json();

    if (!ttsData.audioContent) {
      jlog("error", "test.no_audio", {
        correlationId,
        hasAudioContent: false,
        stage: "tts_no_audio_content"
      });
      
      return new Response(
        JSON.stringify({
          success: false,
          error: "No audio content generated",
          response: testText,
          stage: "tts_no_audio_content"
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const rtMs = Date.now() - t0;
    jlog("info", "test.success", {
      correlationId,
      rtMs,
      hasAudio: true,
      audioContentLength: ttsData.audioContent.length,
      stage: "test_completed_successfully"
    });

    return new Response(
      JSON.stringify({
        success: true,
        response: testText,
        transcribedText: "Test audio input (3 seconds)",
        audioContent: ttsData.audioContent,
        testMetadata: {
          avatarId,
          language,
          voiceUsed: voiceConfig.voice,
          processingTimeMs: rtMs,
          stage: "test_success"
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    const rtMs = Date.now() - t0;
    jlog("error", "test.error", {
      correlationId,
      rtMs,
      error: error.message,
      stage: "test_failed"
    });

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        stage: "test_failed",
        processingTimeMs: rtMs
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});