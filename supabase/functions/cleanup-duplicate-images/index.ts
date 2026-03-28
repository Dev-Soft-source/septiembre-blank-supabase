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
    console.log('Starting duplicate image cleanup process')

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Find duplicate images
    const { data: duplicateImages, error: duplicateError } = await supabase
      .rpc('get_duplicate_images')

    if (duplicateError) {
      console.error('Error finding duplicates:', duplicateError)
      // If the RPC doesn't exist, find duplicates manually
      const { data: allImages } = await supabase
        .from('hotel_images')
        .select('id, image_url, hotel_id, is_main')
        .order('created_at', { ascending: true })

      if (!allImages) {
        throw new Error('Could not fetch hotel images')
      }

      // Group by image_url to find duplicates
      const imageGroups = new Map<string, typeof allImages>()
      
      for (const image of allImages) {
        if (!imageGroups.has(image.image_url)) {
          imageGroups.set(image.image_url, [])
        }
        imageGroups.get(image.image_url)!.push(image)
      }

      // Find groups with more than one image (duplicates)
      const duplicates = Array.from(imageGroups.entries())
        .filter(([_, images]) => images.length > 1)

      let removedCount = 0

      for (const [imageUrl, images] of duplicates) {
        console.log(`Found ${images.length} duplicates for image: ${imageUrl}`)
        
        // Keep the first one (oldest), remove the rest
        const toRemove = images.slice(1)
        
        for (const image of toRemove) {
          const { error: deleteError } = await supabase
            .from('hotel_images')
            .delete()
            .eq('id', image.id)

          if (deleteError) {
            console.error(`Error removing duplicate image ${image.id}:`, deleteError)
          } else {
            console.log(`Removed duplicate image ${image.id} from hotel ${image.hotel_id}`)
            removedCount++
          }
        }
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          duplicatesFound: duplicates.length,
          imagesRemoved: removedCount,
          message: `Cleanup complete. Removed ${removedCount} duplicate images.`
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Duplicate cleanup completed',
        data: duplicateImages 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in cleanup-duplicate-images function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
