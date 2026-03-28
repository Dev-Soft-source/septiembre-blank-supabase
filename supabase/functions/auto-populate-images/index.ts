
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
    console.log('Starting automated image population process')

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Check current hour's usage
    const currentHour = new Date().toISOString().slice(0, 13) // YYYY-MM-DDTHH
    
    const { data: usageData } = await supabase
      .from('api_usage_tracking')
      .select('requests_count')
      .eq('service', 'unsplash')
      .eq('hour_key', currentHour)
      .single()

    const currentUsage = usageData?.requests_count || 0
    const maxRequestsPerHour = 40
    const requestsPerHotel = 10
    const maxHotelsThisRun = Math.floor((maxRequestsPerHour - currentUsage) / requestsPerHotel)

    console.log(`Current hour: ${currentHour}, Usage: ${currentUsage}/${maxRequestsPerHour}, Can process: ${maxHotelsThisRun} hotels`)

    if (maxHotelsThisRun <= 0) {
      console.log('API limit reached for this hour, skipping')
      return new Response(
        JSON.stringify({ 
          message: 'API limit reached for this hour', 
          currentUsage,
          maxRequestsPerHour 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Find hotels without images
    const { data: hotelsWithoutImages } = await supabase
      .from('hotels')
      .select('id, name, city, country, style')
      .eq('status', 'approved')
      .is('main_image_url', null)
      .limit(maxHotelsThisRun)

    if (!hotelsWithoutImages || hotelsWithoutImages.length === 0) {
      console.log('No hotels found that need images')
      return new Response(
        JSON.stringify({ message: 'No hotels need images' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Found ${hotelsWithoutImages.length} hotels needing images`)

    const results = []
    for (const hotel of hotelsWithoutImages) {
      try {
        console.log(`Processing hotel: ${hotel.name} (${hotel.id})`)
        
        // Call the existing fetch-hotel-images function
        const { data: imageResult, error: imageError } = await supabase.functions.invoke('fetch-hotel-images', {
          body: {
            hotelId: hotel.id,
            city: hotel.city,
            country: hotel.country,
            style: hotel.style || 'luxury',
            hotelName: hotel.name
          }
        })

        if (imageError) {
          console.error(`Error fetching images for hotel ${hotel.id}:`, imageError)
          results.push({
            hotelId: hotel.id,
            hotelName: hotel.name,
            success: false,
            error: imageError.message,
            imageCount: 0
          })
        } else {
          console.log(`Successfully processed images for hotel ${hotel.id}`)
          results.push({
            hotelId: hotel.id,
            hotelName: hotel.name,
            success: true,
            error: null,
            imageCount: imageResult?.imageCount || 0
          })
        }
      } catch (error) {
        console.error(`Exception processing hotel ${hotel.id}:`, error)
        results.push({
          hotelId: hotel.id,
          hotelName: hotel.name,
          success: false,
          error: error.message,
          imageCount: 0
        })
      }
    }

    // Update usage tracking
    const newUsage = currentUsage + (hotelsWithoutImages.length * requestsPerHotel)
    await supabase
      .from('api_usage_tracking')
      .upsert({
        service: 'unsplash',
        hour_key: currentHour,
        requests_count: newUsage,
        updated_at: new Date().toISOString()
      })

    const successCount = results.filter(r => r.success).length
    const errorCount = results.filter(r => !r.success).length

    console.log(`Completed processing: ${successCount} successful, ${errorCount} errors`)

    return new Response(
      JSON.stringify({
        message: 'Auto image population completed',
        processedHotels: hotelsWithoutImages.length,
        successCount,
        errorCount,
        apiUsage: {
          currentHour,
          requestsUsed: newUsage,
          maxRequests: maxRequestsPerHour
        },
        results
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in auto-populate-images function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
