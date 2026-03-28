
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Create the cron job to run every 12 hours
    const { data, error } = await supabase.rpc('cron_schedule', {
      job_name: 'auto-populate-hotel-images',
      schedule: '0 */12 * * *', // Every 12 hours at minute 0
      command: `
        select
          net.http_post(
            url:='https://pgdzrvdwgoomjnnegkcn.supabase.co/functions/v1/auto-populate-images',
            headers:='{"Content-Type": "application/json", "Authorization": "Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}"}'::jsonb,
            body:='{"automated": true}'::jsonb
          ) as request_id;
      `
    })

    if (error) {
      throw error
    }

    console.log('Cron job set up successfully')

    return new Response(
      JSON.stringify({ 
        message: 'Auto image population cron job set up successfully',
        schedule: 'Every 12 hours',
        jobName: 'auto-populate-hotel-images'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error setting up cron job:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
