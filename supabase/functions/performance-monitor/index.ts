import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Health check with 2s timeout
    const startTime = performance.now();
    const { data, error } = await Promise.race([
      supabase.from('hotels').select('id').limit(1),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 2000))
    ]);
    
    const responseTime = performance.now() - startTime;
    const isHealthy = !error && responseTime < 700;

    const metrics = {
      responseTime: Math.round(responseTime),
      isHealthy,
      timestamp: new Date().toISOString(),
      alerts: responseTime > 700 ? ['High response time detected'] : []
    };

    console.log('Performance check:', metrics);

    return new Response(JSON.stringify({ success: true, metrics }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});