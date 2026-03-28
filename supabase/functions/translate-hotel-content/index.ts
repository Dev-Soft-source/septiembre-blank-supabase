import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TranslationRequest {
  hotelId: string;
  targetLanguage: 'es' | 'pt' | 'ro' | 'en';
  sourceLanguage?: 'es' | 'pt' | 'ro' | 'en';
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
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const openAIKey = Deno.env.get('OPENAI_API_KEY');

    if (!openAIKey) {
      throw new Error('OpenAI API key not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body: TranslationRequest = await req.json();
    const { hotelId, targetLanguage, sourceLanguage = 'en', content } = body;

    console.log(`Starting translation for hotel ${hotelId} from ${sourceLanguage} to ${targetLanguage}`);

    // Check if translation already exists
    const { data: existingTranslation } = await supabase
      .from('hotel_translations')
      .select('id')
      .eq('hotel_id', hotelId)
      .eq('language_code', targetLanguage)
      .single();

    if (existingTranslation) {
      console.log(`Translation for ${hotelId} to ${targetLanguage} already exists`);
      return new Response(
        JSON.stringify({ success: true, message: 'Translation already exists' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Prepare content for translation
    const contentToTranslate = Object.entries(content)
      .filter(([_, value]) => value && value.trim().length > 0)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n\n');

    if (!contentToTranslate) {
      throw new Error('No content to translate');
    }

    // Language mappings for OpenAI
    const languageNames = {
      'es': 'Spanish',
      'pt': 'Portuguese', 
      'ro': 'Romanian',
      'en': 'English'
    };

    const targetLanguageName = languageNames[targetLanguage];
    const sourceLanguageName = languageNames[sourceLanguage];

    // Create translation prompt
    const prompt = `You are a professional hotel translator. Translate the following hotel content from ${sourceLanguageName} to ${targetLanguageName}. 

IMPORTANT RULES:
1. Maintain the same format: "key: value" on each line
2. Keep the same keys (name, description, ideal_guests, atmosphere, perfect_location)
3. Translate ONLY the values, not the keys
4. Preserve the marketing tone and appeal
5. Make it sound natural and appealing to ${targetLanguageName} speakers
6. If a field is empty or missing, leave it empty

Content to translate:
${contentToTranslate}

Response format should be exactly:
name: [translated name]
description: [translated description]
ideal_guests: [translated ideal guests]
atmosphere: [translated atmosphere]
perfect_location: [translated perfect location]`;

    // Call OpenAI API
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a professional hotel content translator specializing in tourism and hospitality marketing.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });

    if (!openAIResponse.ok) {
      throw new Error(`OpenAI API error: ${openAIResponse.status}`);
    }

    const openAIData = await openAIResponse.json();
    const translatedContent = openAIData.choices[0].message.content;

    // Parse translated content
    const translations: Record<string, string> = {};
    const lines = translatedContent.split('\n');
    
    for (const line of lines) {
      const colonIndex = line.indexOf(':');
      if (colonIndex > 0) {
        const key = line.substring(0, colonIndex).trim();
        const value = line.substring(colonIndex + 1).trim();
        
        // Map keys to database column names
        switch (key) {
          case 'name':
            translations.translated_name = value;
            break;
          case 'description':
            translations.translated_description = value;
            break;
          case 'ideal_guests':
            translations.translated_ideal_guests = value;
            break;
          case 'atmosphere':
            translations.translated_atmosphere = value;
            break;
          case 'perfect_location':
            translations.translated_perfect_location = value;
            break;
        }
      }
    }

    // Insert translation into database
    const { error: insertError } = await supabase
      .from('hotel_translations')
      .upsert({
        hotel_id: hotelId,
        language_code: targetLanguage,
        translated_name: translations.translated_name || null,
        translated_description: translations.translated_description || null,
        translated_ideal_guests: translations.translated_ideal_guests || null,
        translated_atmosphere: translations.translated_atmosphere || null,
        translated_perfect_location: translations.translated_perfect_location || null,
        translation_status: 'completed',
        auto_generated: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (insertError) {
      console.error('Error inserting translation:', insertError);
      throw new Error(`Database insertion failed: ${insertError.message}`);
    }

    console.log(`Translation completed successfully for hotel ${hotelId} to ${targetLanguage}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Translation to ${targetLanguage} completed successfully`,
        translations: translations
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Translation error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Translation failed'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});