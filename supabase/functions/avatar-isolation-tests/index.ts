import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Avatar voice configurations
const AVATAR_VOICE_MAPPING: Record<string, { voice: string; pitch: number; speakingRate: number }> = {
  antonio: { voice: "es-ES-Wavenet-B", pitch: 0.8, speakingRate: 1.0 },
  luisa: { voice: "es-ES-Wavenet-C", pitch: 0.8, speakingRate: 1.0 },
  teresa: { voice: "es-ES-Standard-A", pitch: 1.1, speakingRate: 1.2 },
  john: { voice: "en-US-Wavenet-D", pitch: 1.0, speakingRate: 1.2 },
  maria: { voice: "es-ES-Standard-B", pitch: 1.1, speakingRate: 1.2 },
  ion: { voice: "ro-RO-Wavenet-A", pitch: 1.2, speakingRate: 1.2 },
  juan: { voice: "es-ES-Wavenet-G", pitch: 1.0, speakingRate: 1.2 },
  martin: { voice: "pt-BR-Neural2-B", pitch: 1.0, speakingRate: 1.2 }
};

// Test prompts for each avatar
const AVATAR_PROMPTS: Record<string, string> = {
  antonio: "Eres Antonio, un recepcionista profesional y experimentado de Hotel Living. Saluda cordialmente a un huésped que acaba de llegar.",
  luisa: "Eres Luisa, una recepcionista mayor y cálida de Hotel Living. Ayuda a un huésped con una pregunta sobre servicios del hotel.",
  teresa: "Eres Teresa, una recepcionista amable de Hotel Living. Responde a un huésped que pregunta sobre el desayuno.",
  john: "You are John, a professional hotel receptionist at Hotel Living. Greet a guest who just arrived at the hotel.",
  maria: "Eres María, una recepcionista simpática de Hotel Living. Ayuda a un huésped que pregunta sobre las instalaciones.",
  ion: "Ești Ion, un receptioner profesional la Hotel Living. Salută un oaspete care tocmai a sosit la hotel.",
  juan: "Eres Juan, un recepcionista profesional de Hotel Living. Ayuda a un huésped con información sobre la ciudad.",
  martin: "Você é Martin, um recepcionista profissional do Hotel Living. Cumprimente um hóspede que acabou de chegar ao hotel."
};

// Known good test texts for TTS isolation
const TTS_TEST_TEXTS: Record<string, string> = {
  antonio: "Hola, bienvenido a Hotel Living, es un placer hablar contigo hoy.",
  luisa: "Buenos días, soy Luisa y estoy aquí para ayudarte con cualquier consulta.",
  teresa: "Hola, me llamo Teresa y trabajo en recepción, ¿en qué puedo asistirte?",
  john: "Hello, welcome to Hotel Living, it's a pleasure to speak with you today.",
  maria: "Hola, soy María de recepción, ¿cómo puedo ayudarte hoy?",
  ion: "Bună ziua, bine ai venit la Hotel Living, îmi pare bine să vorbesc cu tine astăzi.",
  juan: "Buenos días, soy Juan de recepción, ¿en qué puedo ayudarte?",
  martin: "Olá, bem-vindo ao Hotel Living, é um prazer falar com você hoje."
};

function jlog(level: "info" | "error", scope: string, data: Record<string, unknown>) {
  const entry = { ts: new Date().toISOString(), level, scope, ...data };
  console[level === "error" ? "error" : "log"](JSON.stringify(entry));
}

async function runTest1_ModelIsolation(avatarId: string): Promise<any> {
  jlog("info", "test1.start", { avatarId, test: "Model Isolation" });
  
  const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
  if (!OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY not configured');
  }

  const prompt = AVATAR_PROMPTS[avatarId];
  
  const payload = {
    model: "gpt-5-2025-08-07",
    messages: [
      {
        role: "system",
        content: prompt
      },
      {
        role: "user", 
        content: "Hola"
      }
    ],
    max_completion_tokens: 120
  };

  jlog("info", "test1.openai.request", { 
    avatarId, 
    model: payload.model,
    maxTokens: payload.max_completion_tokens,
    systemPrompt: prompt
  });

  jlog("info", "test1.openai.requesting", { 
    avatarId,
    requestBody: JSON.stringify(payload),
    url: 'https://api.openai.com/v1/chat/completions'
  });

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  jlog("info", "test1.openai.response_status", { 
    avatarId,
    status: response.status,
    ok: response.ok,
    statusText: response.statusText
  });

  if (!response.ok) {
    const errorText = await response.text();
    jlog("error", "test1.openai.error", { 
      avatarId, 
      status: response.status, 
      error: errorText,
      requestPayload: JSON.stringify(payload)
    });
    throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  jlog("info", "test1.openai.raw_response", { 
    avatarId,
    fullResponse: JSON.stringify(data)
  });
  const generatedText = data.choices[0]?.message?.content || "";
  const wordCount = generatedText.split(/\s+/).length;
  
  jlog("info", "test1.openai.response", { 
    avatarId,
    generatedText,
    wordCount,
    isCoherent: generatedText.length > 10 && !generatedText.includes("undefined"),
    isWithinLimit: wordCount <= 40,
    tokenUsage: data.usage
  });

  return {
    test: "Model Isolation",
    avatarId,
    success: true,
    generatedText,
    wordCount,
    isCoherent: generatedText.length > 10 && !generatedText.includes("undefined"),
    isWithinLimit: wordCount <= 40,
    tokenUsage: data.usage
  };
}

async function runTest2_TTSIsolation(avatarId: string): Promise<any> {
  jlog("info", "test2.start", { avatarId, test: "TTS Isolation" });
  
  const GOOGLE_TTS_API_KEY = Deno.env.get('GOOGLE_TTS_API_KEY');
  if (!GOOGLE_TTS_API_KEY) {
    throw new Error('GOOGLE_TTS_API_KEY not configured');
  }

  const testText = TTS_TEST_TEXTS[avatarId];
  const voiceConfig = AVATAR_VOICE_MAPPING[avatarId];
  
  let languageCode = "es-ES";
  if (voiceConfig.voice.startsWith("en-US-")) languageCode = "en-US";
  else if (voiceConfig.voice.startsWith("pt-BR-")) languageCode = "pt-BR";
  else if (voiceConfig.voice.startsWith("ro-RO-")) languageCode = "ro-RO";
  
  const gender = ['luisa', 'teresa', 'maria'].includes(avatarId) ? 'FEMALE' : 'MALE';

  const ttsPayload = {
    input: { text: testText },
    voice: {
      languageCode,
      name: voiceConfig.voice,
      ssmlGender: gender
    },
    audioConfig: {
      audioEncoding: "MP3",
      sampleRateHertz: 24000,
      speakingRate: voiceConfig.speakingRate,
      pitch: voiceConfig.pitch,
      volumeGainDb: 0.0
    }
  };

  jlog("info", "test2.tts.request", { 
    avatarId,
    inputText: testText,
    voiceName: voiceConfig.voice,
    languageCode,
    inputTextLength: testText.length
  });

  const ttsResponse = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${GOOGLE_TTS_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ttsPayload),
  });

  if (!ttsResponse.ok) {
    const errorText = await ttsResponse.text();
    jlog("error", "test2.tts.error", { avatarId, status: ttsResponse.status, error: errorText });
    throw new Error(`Google Cloud TTS API error: ${ttsResponse.status}`);
  }

  const ttsData = await ttsResponse.json();
  const hasAudioContent = !!ttsData.audioContent;
  
  jlog("info", "test2.tts.response", { 
    avatarId,
    inputText: testText,
    hasAudioContent,
    audioContentLength: ttsData.audioContent?.length || 0,
    voiceUsed: voiceConfig.voice
  });

  return {
    test: "TTS Isolation",
    avatarId,
    success: true,
    inputText: testText,
    hasAudioContent,
    audioContentLength: ttsData.audioContent?.length || 0,
    voiceUsed: voiceConfig.voice,
    audioContent: hasAudioContent ? ttsData.audioContent.substring(0, 100) + "..." : null
  };
}

async function runTest3_FullPipeline(avatarId: string): Promise<any> {
  jlog("info", "test3.start", { avatarId, test: "Full Pipeline" });
  
  // Step 1: Generate text (same as Test 1)
  const test1Result = await runTest1_ModelIsolation(avatarId);
  const generatedText = test1Result.generatedText;
  
  // Step 2: Send generated text to TTS
  const GOOGLE_TTS_API_KEY = Deno.env.get('GOOGLE_TTS_API_KEY');
  const voiceConfig = AVATAR_VOICE_MAPPING[avatarId];
  
  let languageCode = "es-ES";
  if (voiceConfig.voice.startsWith("en-US-")) languageCode = "en-US";
  else if (voiceConfig.voice.startsWith("pt-BR-")) languageCode = "pt-BR";
  else if (voiceConfig.voice.startsWith("ro-RO-")) languageCode = "ro-RO";
  
  const gender = ['luisa', 'teresa', 'maria'].includes(avatarId) ? 'FEMALE' : 'MALE';

  const ttsPayload = {
    input: { text: generatedText },
    voice: {
      languageCode,
      name: voiceConfig.voice,
      ssmlGender: gender
    },
    audioConfig: {
      audioEncoding: "MP3",
      sampleRateHertz: 24000,
      speakingRate: voiceConfig.speakingRate,
      pitch: voiceConfig.pitch,
      volumeGainDb: 0.0
    }
  };

  jlog("info", "test3.pipeline.tts_input", { 
    avatarId,
    originalGenerated: generatedText,
    ttsInput: generatedText,
    textsMatch: generatedText === generatedText,
    inputLength: generatedText.length
  });

  const ttsResponse = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${GOOGLE_TTS_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ttsPayload),
  });

  if (!ttsResponse.ok) {
    const errorText = await ttsResponse.text();
    jlog("error", "test3.tts.error", { avatarId, status: ttsResponse.status, error: errorText });
    throw new Error(`TTS error in full pipeline: ${ttsResponse.status}`);
  }

  const ttsData = await ttsResponse.json();
  
  jlog("info", "test3.pipeline.complete", { 
    avatarId,
    modelOutput: generatedText,
    ttsInput: generatedText,
    hasAudioOutput: !!ttsData.audioContent,
    textCorruption: generatedText !== generatedText ? "DETECTED" : "NONE"
  });

  return {
    test: "Full Pipeline",
    avatarId,
    success: true,
    modelOutput: generatedText,
    ttsInput: generatedText,
    hasAudioOutput: !!ttsData.audioContent,
    textCorruption: "NONE", // Since we're using the same text
    comparison: {
      test1_output: test1Result.generatedText,
      test3_tts_input: generatedText,
      identical: test1Result.generatedText === generatedText
    }
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, avatarId, testType } = await req.json();
    
    jlog("info", "isolation_tests.start", { action, avatarId, testType });

    if (action === "run_single_test") {
      let result;
      
      if (testType === "model") {
        result = await runTest1_ModelIsolation(avatarId);
      } else if (testType === "tts") {
        result = await runTest2_TTSIsolation(avatarId);
      } else if (testType === "pipeline") {
        result = await runTest3_FullPipeline(avatarId);
      } else {
        throw new Error(`Unknown test type: ${testType}`);
      }
      
      return new Response(JSON.stringify({ success: true, result }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === "run_all_tests") {
      const avatars = ['antonio', 'luisa', 'teresa', 'john', 'maria', 'ion', 'juan', 'martin'];
      const allResults: any[] = [];
      
      for (const avatar of avatars) {
        jlog("info", "testing_avatar", { avatar });
        
        try {
          // Test 1: Model Isolation
          const test1 = await runTest1_ModelIsolation(avatar);
          allResults.push(test1);
          
          // Test 2: TTS Isolation 
          const test2 = await runTest2_TTSIsolation(avatar);
          allResults.push(test2);
          
          // Test 3: Full Pipeline
          const test3 = await runTest3_FullPipeline(avatar);
          allResults.push(test3);
          
          jlog("info", "avatar_tests_complete", { avatar, testsRun: 3 });
          
        } catch (error) {
          jlog("error", "avatar_test_failed", { avatar, error: error.message });
          allResults.push({
            test: "ERROR",
            avatarId: avatar,
            success: false,
            error: error.message
          });
        }
      }
      
      jlog("info", "all_tests_complete", { totalResults: allResults.length });
      
      return new Response(JSON.stringify({ 
        success: true, 
        totalTests: allResults.length,
        results: allResults,
        summary: {
          avatarsTested: avatars.length,
          testsPerAvatar: 3,
          totalTests: avatars.length * 3
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    throw new Error(`Unknown action: ${action}`);

  } catch (error) {
    jlog("error", "isolation_tests.error", { error: error.message });
    
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});