import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
  
  // Health check response
  const healthStatus = {
    ok: !!GEMINI_API_KEY,
    model: "gemini-1.5-pro",
    timestamp: new Date().toISOString(),
    services: {
      gemini: !!GEMINI_API_KEY,
      cors: true,
      environment: Deno.env.get("DENO_DEPLOYMENT_ID") ? "production" : "development"
    }
  };

  // Test Gemini API if key is available
  if (GEMINI_API_KEY) {
    try {
      const testResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: "Test connection" }] }],
          generationConfig: { maxOutputTokens: 10 }
        })
      });
      
      healthStatus.services.gemini = testResponse.ok;
    } catch {
      healthStatus.services.gemini = false;
    }
  }

  return new Response(JSON.stringify(healthStatus), {
    status: healthStatus.ok ? 200 : 503,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});