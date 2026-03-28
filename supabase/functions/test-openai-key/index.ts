import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!openAIApiKey) {
      return new Response(JSON.stringify({ 
        error: 'OpenAI API key not configured',
        configured: false,
        message: 'Please add OPENAI_API_KEY to Supabase Edge Function secrets'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // EMERGENCY AVATAR TEST: Test with the same parameters as avatar chat
    console.log('EMERGENCY DEBUG: Testing OpenAI with avatar-like request...');
    console.log('EMERGENCY DEBUG: API key length:', openAIApiKey.length);
    console.log('EMERGENCY DEBUG: API key format check:', openAIApiKey.startsWith('sk-'));
    
    const testMessage = "As a personality test, respond as María (63, serene art lover) would about Hotel-Living in exactly one sentence.";
    
    const requestPayload = {
      model: 'gpt-4.1-2025-04-14',
      messages: [
        { 
          role: 'system', 
          content: 'You are María, 63 years old, a serene retired woman passionate about art, yoga, and philosophy. Respond briefly about Hotel-Living from your perspective.' 
        },
        { role: 'user', content: testMessage }
      ],
      max_tokens: 100,
      temperature: 0.7,
    };
    
    console.log('EMERGENCY DEBUG: Request payload:', JSON.stringify(requestPayload, null, 2));
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestPayload),
    });

    console.log('EMERGENCY DEBUG: Response status:', response.status);
    console.log('EMERGENCY DEBUG: Response ok:', response.ok);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('EMERGENCY DEBUG: Error response body:', errorText);
      
      // Handle specific error cases
      if (response.status === 429) {
        return new Response(JSON.stringify({ 
          error: 'OpenAI API Quota Exceeded',
          details: 'Your OpenAI account has reached its usage limit. Please check your billing and usage at https://platform.openai.com/usage',
          quota_exceeded: true,
          configured: true,
          working: false,
          message: '❌ OpenAI API quota exceeded - Please add credits to your OpenAI account'
        }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      if (response.status === 401) {
        return new Response(JSON.stringify({ 
          error: 'OpenAI API Authentication Error',
          details: 'Invalid API key or authentication failed',
          configured: false,
          working: false,
          message: '❌ OpenAI API key is invalid or expired'
        }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      return new Response(JSON.stringify({ 
        error: `OpenAI API Error: ${response.status}`,
        details: errorText,
        configured: true,
        working: false,
        debug_info: {
          api_key_present: !!openAIApiKey,
          api_key_length: openAIApiKey?.length,
          request_payload: requestPayload
        }
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    console.log('EMERGENCY DEBUG: Success response:', JSON.stringify(data, null, 2));
    
    const testResponse = data.choices[0]?.message?.content;
    const isPersonalityResponse = testResponse && (
      testResponse.toLowerCase().includes('maría') || 
      testResponse.toLowerCase().includes('maria') ||
      testResponse.toLowerCase().includes('art') ||
      testResponse.toLowerCase().includes('yoga') ||
      testResponse.toLowerCase().includes('serene')
    );
    
    return new Response(JSON.stringify({ 
      success: true,
      configured: true,
      working: true,
      test_response: testResponse || 'No content',
      personality_test_passed: isPersonalityResponse,
      message: isPersonalityResponse ? 
        '✅ OpenAI API is working correctly with personality responses!' :
        '⚠️ OpenAI API works but personality responses may need debugging',
      debug_info: {
        full_response: data,
        model_used: 'gpt-4.1-2025-04-14',
        test_type: 'avatar_personality_simulation'
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(JSON.stringify({ 
      error: error.message,
      configured: false,
      working: false
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});