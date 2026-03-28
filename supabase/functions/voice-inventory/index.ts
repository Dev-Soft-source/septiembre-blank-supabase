import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VoiceInfo {
  name: string;
  displayName: string;
  gender: string;
  languageCode: string;
  naturalSampleRateHertz: number;
}

interface TestedVoice {
  voiceName: string;
  displayName: string;
  detectedGender: string;
  languageCode: string;
  supportedLanguages: string[];
  testResults: {
    [languageCode: string]: {
      text: string;
      audioBase64: string;
      success: boolean;
      error?: string;
    };
  };
  isMultilingual: boolean;
  recommended: boolean;
}

const TEST_PHRASES = {
  'es': 'Hola, soy un avatar de Hotel Living. ¿Cómo estás hoy?',
  'en': 'Hello, I am a Hotel Living avatar. How are you today?',
  'pt': 'Olá, eu sou um avatar do Hotel Living. Como está hoje?',
  'ro': 'Salut, sunt un avatar Hotel Living. Cum te simți astăzi?'
};

// Predefined list of Google Cloud TTS voices to test (bypassing ListVoices API)
const PREDEFINED_VOICES: VoiceInfo[] = [
  // Spanish voices
  { name: 'es-ES-Wavenet-B', displayName: 'Spanish (Spain) Male B', gender: 'MALE', languageCode: 'es-ES', naturalSampleRateHertz: 24000 },
  { name: 'es-ES-Wavenet-C', displayName: 'Spanish (Spain) Female C', gender: 'FEMALE', languageCode: 'es-ES', naturalSampleRateHertz: 24000 },
  { name: 'es-ES-Wavenet-D', displayName: 'Spanish (Spain) Female D', gender: 'FEMALE', languageCode: 'es-ES', naturalSampleRateHertz: 24000 },
  { name: 'es-ES-Wavenet-E', displayName: 'Spanish (Spain) Male E', gender: 'MALE', languageCode: 'es-ES', naturalSampleRateHertz: 24000 },
  { name: 'es-ES-Wavenet-F', displayName: 'Spanish (Spain) Female F', gender: 'FEMALE', languageCode: 'es-ES', naturalSampleRateHertz: 24000 },
  { name: 'es-ES-Wavenet-G', displayName: 'Spanish (Spain) Male G', gender: 'MALE', languageCode: 'es-ES', naturalSampleRateHertz: 24000 },
  { name: 'es-ES-Standard-A', displayName: 'Spanish (Spain) Female A', gender: 'FEMALE', languageCode: 'es-ES', naturalSampleRateHertz: 22050 },
  { name: 'es-ES-Standard-B', displayName: 'Spanish (Spain) Male B', gender: 'MALE', languageCode: 'es-ES', naturalSampleRateHertz: 22050 },
  { name: 'es-ES-Neural2-A', displayName: 'Spanish (Spain) Neural Female A', gender: 'FEMALE', languageCode: 'es-ES', naturalSampleRateHertz: 24000 },
  { name: 'es-ES-Neural2-B', displayName: 'Spanish (Spain) Neural Male B', gender: 'MALE', languageCode: 'es-ES', naturalSampleRateHertz: 24000 },
  
  // English voices
  { name: 'en-US-Wavenet-A', displayName: 'English (US) Male A', gender: 'MALE', languageCode: 'en-US', naturalSampleRateHertz: 24000 },
  { name: 'en-US-Wavenet-B', displayName: 'English (US) Male B', gender: 'MALE', languageCode: 'en-US', naturalSampleRateHertz: 24000 },
  { name: 'en-US-Wavenet-C', displayName: 'English (US) Female C', gender: 'FEMALE', languageCode: 'en-US', naturalSampleRateHertz: 24000 },
  { name: 'en-US-Wavenet-D', displayName: 'English (US) Male D', gender: 'MALE', languageCode: 'en-US', naturalSampleRateHertz: 24000 },
  { name: 'en-US-Wavenet-E', displayName: 'English (US) Female E', gender: 'FEMALE', languageCode: 'en-US', naturalSampleRateHertz: 24000 },
  { name: 'en-US-Wavenet-F', displayName: 'English (US) Female F', gender: 'FEMALE', languageCode: 'en-US', naturalSampleRateHertz: 24000 },
  { name: 'en-US-Wavenet-G', displayName: 'English (US) Female G', gender: 'FEMALE', languageCode: 'en-US', naturalSampleRateHertz: 24000 },
  { name: 'en-US-Wavenet-H', displayName: 'English (US) Female H', gender: 'FEMALE', languageCode: 'en-US', naturalSampleRateHertz: 24000 },
  { name: 'en-US-Wavenet-I', displayName: 'English (US) Male I', gender: 'MALE', languageCode: 'en-US', naturalSampleRateHertz: 24000 },
  { name: 'en-US-Wavenet-J', displayName: 'English (US) Male J', gender: 'MALE', languageCode: 'en-US', naturalSampleRateHertz: 24000 },
  
  // Portuguese voices
  { name: 'pt-PT-Wavenet-A', displayName: 'Portuguese (Portugal) Female A', gender: 'FEMALE', languageCode: 'pt-PT', naturalSampleRateHertz: 24000 },
  { name: 'pt-PT-Wavenet-B', displayName: 'Portuguese (Portugal) Male B', gender: 'MALE', languageCode: 'pt-PT', naturalSampleRateHertz: 24000 },
  { name: 'pt-PT-Wavenet-C', displayName: 'Portuguese (Portugal) Male C', gender: 'MALE', languageCode: 'pt-PT', naturalSampleRateHertz: 24000 },
  { name: 'pt-PT-Wavenet-D', displayName: 'Portuguese (Portugal) Female D', gender: 'FEMALE', languageCode: 'pt-PT', naturalSampleRateHertz: 24000 },
  { name: 'pt-BR-Neural2-A', displayName: 'Portuguese (Brazil) Neural Female A', gender: 'FEMALE', languageCode: 'pt-BR', naturalSampleRateHertz: 24000 },
  { name: 'pt-BR-Neural2-B', displayName: 'Portuguese (Brazil) Neural Male B', gender: 'MALE', languageCode: 'pt-BR', naturalSampleRateHertz: 24000 },
  { name: 'pt-BR-Neural2-C', displayName: 'Portuguese (Brazil) Neural Female C', gender: 'FEMALE', languageCode: 'pt-BR', naturalSampleRateHertz: 24000 },
  
  // Romanian voices
  { name: 'ro-RO-Wavenet-A', displayName: 'Romanian Male A', gender: 'MALE', languageCode: 'ro-RO', naturalSampleRateHertz: 24000 },
  { name: 'ro-RO-Standard-A', displayName: 'Romanian Female A', gender: 'FEMALE', languageCode: 'ro-RO', naturalSampleRateHertz: 22050 }
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const GOOGLE_CLOUD_API_KEY = Deno.env.get('GOOGLE_CLOUD_API_KEY');
    
    if (!GOOGLE_CLOUD_API_KEY) {
      throw new Error('Google Cloud API key not found');
    }

    console.log('🔍 Starting voice inventory process using predefined voice list...');

    // Use predefined voices instead of API discovery (bypasses permission issues)
    const allVoices = PREDEFINED_VOICES;
    console.log(`📋 Using ${allVoices.length} predefined voices`);

    // All predefined voices are already relevant for our target languages
    const relevantVoices = allVoices;
    console.log(`🎯 Testing ${relevantVoices.length} voices across all target languages`);

    // Step 2: Test each voice with all 4 languages
    const testedVoices: TestedVoice[] = [];

    for (const voice of relevantVoices) {
      console.log(`🧪 Testing voice: ${voice.name}`);
      
      const testedVoice: TestedVoice = {
        voiceName: voice.name,
        displayName: voice.displayName,
        detectedGender: voice.gender?.toLowerCase() || 'unknown',
        languageCode: voice.languageCode,
        supportedLanguages: [],
        testResults: {},
        isMultilingual: false,
        recommended: false
      };

      // Test with each language
      for (const [langCode, testText] of Object.entries(TEST_PHRASES)) {
        const ttsLanguageCode = langCode === 'es' ? 'es-ES' : 
                               langCode === 'en' ? 'en-US' :
                               langCode === 'pt' ? 'pt-PT' : 'ro-RO';

        try {
          const ttsRequest = {
            input: { text: testText },
            voice: {
              languageCode: ttsLanguageCode,
              name: voice.name,
            },
            audioConfig: {
              audioEncoding: 'MP3',
              sampleRateHertz: 24000,
              pitch: 1.0,
              speakingRate: 1.1
            },
          };

          const ttsResponse = await fetch(
            `https://texttospeech.googleapis.com/v1/text:synthesize?key=${GOOGLE_CLOUD_API_KEY}`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(ttsRequest),
            }
          );

          if (ttsResponse.ok) {
            const ttsResult = await ttsResponse.json();
            
            testedVoice.testResults[langCode] = {
              text: testText,
              audioBase64: ttsResult.audioContent || '',
              success: true
            };
            
            testedVoice.supportedLanguages.push(langCode);
            console.log(`✅ ${voice.name} works with ${langCode.toUpperCase()}`);
          } else {
            const errorText = await ttsResponse.text();
            testedVoice.testResults[langCode] = {
              text: testText,
              audioBase64: '',
              success: false,
              error: errorText
            };
            console.log(`❌ ${voice.name} failed with ${langCode.toUpperCase()}: ${errorText}`);
          }
        } catch (error) {
          testedVoice.testResults[langCode] = {
            text: testText,
            audioBase64: '',
            success: false,
            error: error.message
          };
          console.log(`❌ ${voice.name} error with ${langCode.toUpperCase()}: ${error.message}`);
        }

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Determine if voice is multilingual (supports at least 3 of our 4 languages)
      testedVoice.isMultilingual = testedVoice.supportedLanguages.length >= 3;
      
      // Recommend voices that are multilingual and have clear gender
      testedVoice.recommended = testedVoice.isMultilingual && 
                               ['male', 'female'].includes(testedVoice.detectedGender);

      testedVoices.push(testedVoice);
    }

    // Step 3: Generate summary and recommendations
    const maleVoices = testedVoices.filter(v => v.detectedGender === 'male' && v.recommended);
    const femaleVoices = testedVoices.filter(v => v.detectedGender === 'female' && v.recommended);
    const multilingualVoices = testedVoices.filter(v => v.isMultilingual);

    const summary = {
      totalVoicesFound: allVoices.length,
      relevantVoices: relevantVoices.length,
      testedVoices: testedVoices.length,
      multilingualVoices: multilingualVoices.length,
      recommendedMaleVoices: maleVoices.length,
      recommendedFemaleVoices: femaleVoices.length,
      timestamp: new Date().toISOString()
    };

    console.log('📊 Voice inventory complete:', summary);

    return new Response(JSON.stringify({
      success: true,
      summary,
      testedVoices,
      recommendedAssignments: {
        maleVoices: maleVoices.slice(0, 5), // Top 5 male voices
        femaleVoices: femaleVoices.slice(0, 5), // Top 5 female voices
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Voice inventory error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});