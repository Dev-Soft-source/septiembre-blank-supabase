import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DetectionRequest {
  content: {
    name?: string;
    description?: string;
    ideal_guests?: string;
    atmosphere?: string;
    perfect_location?: string;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openAIKey = Deno.env.get('OPENAI_API_KEY');

    if (!openAIKey) {
      throw new Error('OpenAI API key not configured');
    }

    const body: DetectionRequest = await req.json();
    const { content } = body;

    // Combine all content for language detection
    const textToAnalyze = Object.values(content)
      .filter(value => value && value.trim().length > 0)
      .join(' ')
      .substring(0, 500); // Limit text length for efficiency

    if (!textToAnalyze) {
      // Default to English if no content
      return new Response(
        JSON.stringify({ language: 'en', confidence: 0.5 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create language detection prompt
    const prompt = `Analyze the following hotel content and determine the language. Respond with ONLY the language code (en, es, pt, or ro).

Text to analyze: "${textToAnalyze}"

Language code:`;

    // Call OpenAI API for language detection
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'You are a language detection expert. Respond with only the language code: en (English), es (Spanish), pt (Portuguese), or ro (Romanian).' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.1,
        max_tokens: 10,
      }),
    });

    if (!openAIResponse.ok) {
      throw new Error(`OpenAI API error: ${openAIResponse.status}`);
    }

    const openAIData = await openAIResponse.json();
    const detectedLanguage = openAIData.choices[0].message.content.trim().toLowerCase();

    // Validate detected language
    const supportedLanguages = ['en', 'es', 'pt', 'ro'];
    const language = supportedLanguages.includes(detectedLanguage) ? detectedLanguage : 'en';

    console.log(`Language detected: ${language} for content: ${textToAnalyze.substring(0, 100)}...`);

    return new Response(
      JSON.stringify({ 
        language: language,
        confidence: language === detectedLanguage ? 0.9 : 0.5
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Language detection error:', error);
    
    // Fallback to English on error
    return new Response(
      JSON.stringify({ 
        language: 'en',
        confidence: 0.3,
        error: error.message
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});