
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
    const { hotelId, city, country, style, hotelName, forceRefresh = false } = await req.json()

    if (!hotelId) {
      throw new Error('Hotel ID is required')
    }

    console.log(`Fetching images for hotel: ${hotelName} in ${city}, ${country}`)

    const unsplashAccessKey = Deno.env.get('UNSPLASH_ACCESS_KEY')
    if (!unsplashAccessKey) {
      throw new Error('Unsplash Access Key not configured')
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Check if hotel already has images (unless forcing refresh)
    const { data: existingImages } = await supabase
      .from('hotel_images')
      .select('id')
      .eq('hotel_id', hotelId)

    if (!forceRefresh && existingImages && existingImages.length > 0) {
      console.log(`Hotel ${hotelId} already has ${existingImages.length} images, skipping auto-population`)
      return new Response(
        JSON.stringify({ message: 'Hotel already has images', imageCount: existingImages.length }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get all existing image URLs across all hotels to prevent duplicates
    const { data: allExistingImages } = await supabase
      .from('hotel_images')
      .select('image_url')

    const existingImageUrls = new Set(allExistingImages?.map(img => img.image_url) || [])
    console.log(`Found ${existingImageUrls.size} existing images across all hotels`)

    // Enhanced search queries with more variety
    const baseQueries = [
      `${city} ${country} hotel luxury`,
      `${city} boutique accommodation`,
      `${style} hotel ${country}`,
      `luxury hotel room ${city}`,
      `hotel interior design ${style}`,
      `${country} hospitality architecture`,
      `elegant hotel lobby ${city}`,
      `premium accommodation ${country}`,
      `hotel restaurant fine dining`,
      `spa wellness hotel ${city}`,
      `hotel pool terrace ${country}`,
      `boutique hotel bedroom`,
      `luxury travel ${city}`,
      `hotel bar lounge ${country}`,
      `premium hospitality design`
    ]

    // Add randomization for more variety
    const shuffledQueries = baseQueries.sort(() => Math.random() - 0.5)
    
    const imageUrls: string[] = []
    let queryIndex = 0
    let attempts = 0
    const maxAttempts = 25
    const targetImages = 8

    while (imageUrls.length < targetImages && queryIndex < shuffledQueries.length && attempts < maxAttempts) {
      const query = shuffledQueries[queryIndex]
      const imagesNeeded = Math.min(3, targetImages - imageUrls.length)
      
      console.log(`Searching Unsplash for: "${query}" (need ${imagesNeeded} images, attempt ${attempts + 1})`)

      try {
        // Add random page parameter for more variety
        const page = Math.floor(Math.random() * 3) + 1
        const response = await fetch(
          `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=30&page=${page}&orientation=landscape&order_by=relevant`,
          {
            headers: {
              'Authorization': `Client-ID ${unsplashAccessKey}`,
            }
          }
        )

        if (response.ok) {
          const data = await response.json()
          const newUrls = data.results
            .filter((photo: any) => 
              photo.urls?.regular && 
              !imageUrls.includes(photo.urls.regular) &&
              !existingImageUrls.has(photo.urls.regular) &&
              photo.width >= 800 && // Ensure minimum quality
              photo.height >= 600
            )
            .map((photo: any) => photo.urls.regular)
            .slice(0, imagesNeeded)
          
          imageUrls.push(...newUrls)
          console.log(`Found ${newUrls.length} new unique images from query: "${query}"`)
          
          // Update the global set to prevent immediate reuse
          newUrls.forEach(url => existingImageUrls.add(url))
        } else {
          console.warn(`Unsplash API error for query "${query}":`, response.status)
        }
      } catch (error) {
        console.warn(`Error fetching images for query "${query}":`, error)
      }

      queryIndex++
      attempts++
      
      // If we've gone through all queries but still need more images, restart with different parameters
      if (queryIndex >= shuffledQueries.length && imageUrls.length < targetImages && attempts < maxAttempts) {
        queryIndex = 0
        // Add more generic queries for variety
        shuffledQueries.push(
          `luxury accommodation interior`,
          `premium hotel design`,
          `elegant hospitality space`,
          `modern hotel architecture`,
          `boutique travel experience`
        )
      }
    }

    if (imageUrls.length === 0) {
      throw new Error('No unique images could be fetched from Unsplash')
    }

    console.log(`Successfully fetched ${imageUrls.length} unique images for hotel ${hotelId}`)

    // If force refresh, remove existing images first
    if (forceRefresh && existingImages && existingImages.length > 0) {
      await supabase
        .from('hotel_images')
        .delete()
        .eq('hotel_id', hotelId)
    }

    // Insert images into database
    const imageRecords = imageUrls.map((url, index) => ({
      hotel_id: hotelId,
      image_url: url,
      is_main: index === 0, // First image is main
    }))

    const { data: insertedImages, error: insertError } = await supabase
      .from('hotel_images')
      .insert(imageRecords)
      .select()

    if (insertError) {
      throw new Error(`Database error: ${insertError.message}`)
    }

    // Update hotel's main_image_url
    const { error: updateError } = await supabase
      .from('hotels')
      .update({ main_image_url: imageUrls[0] })
      .eq('id', hotelId)

    if (updateError) {
      console.warn(`Could not update hotel main image: ${updateError.message}`)
    }

    console.log(`Successfully populated ${imageUrls.length} unique images for hotel ${hotelId}`)

    return new Response(
      JSON.stringify({ 
        success: true, 
        imageCount: imageUrls.length,
        images: insertedImages,
        refreshed: forceRefresh
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in fetch-hotel-images function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
