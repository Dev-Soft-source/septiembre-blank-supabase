import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    console.log('🔄 Starting hotel dataset export...')

    // Query all approved hotels
    const { data: hotels, error: hotelsError } = await supabase
      .from('hotels')
      .select('id, name, price_per_month')
      .eq('status', 'approved')
      .order('name')

    if (hotelsError) {
      console.error('❌ Hotels query error:', hotelsError)
      throw hotelsError
    }

    console.log(`✅ Found ${hotels.length} approved hotels`)

    // Query all existing packages
    const { data: packages, error: packagesError } = await supabase
      .from('availability_packages')
      .select('hotel_id, duration_days, base_price_usd, current_price_usd')
      .in('hotel_id', hotels.map(h => h.id))

    if (packagesError) {
      console.error('❌ Packages query error:', packagesError)
      throw packagesError
    }

    console.log(`✅ Found ${packages.length} existing packages`)

    // Generate CSV data with actual database content
    const csvRows = []
    const csvHeaders = ['Hotel Name', 'Duration (Days)', 'Meal Plan', 'Double Room Price (USD)', 'Single Room Price (USD)']
    
    csvRows.push(csvHeaders.join(','))

    hotels.forEach(hotel => {
      const hotelPackages = packages.filter(p => p.hotel_id === hotel.id)
      
      if (hotelPackages.length === 0) {
        // Hotel has no packages
        csvRows.push([
          `"${hotel.name}"`,
          'No packages',
          'No meal plan data',
          'No pricing',
          'No pricing'
        ].join(','))
      } else {
        // Hotel has packages - use actual data
        hotelPackages.forEach(pkg => {
          const doublePrice = pkg.current_price_usd || pkg.base_price_usd || 'No pricing'
          const singlePrice = doublePrice !== 'No pricing' ? Math.round(doublePrice * 1.5) : 'No pricing'
          
          csvRows.push([
            `"${hotel.name}"`,
            pkg.duration_days || 'Unknown duration',
            'No meal plan data', // Meal plans aren't stored in packages table
            doublePrice,
            singlePrice
          ].join(','))
        })
      }
    })

    const csvContent = csvRows.join('\n')
    console.log(`✅ Generated CSV with ${csvRows.length - 1} data rows`)

    // Save to Supabase Storage
    const fileName = 'hotel-packages-dataset.csv'
    const filePath = fileName
    
    const { error: uploadError } = await supabase.storage
      .from('excel-calculators')
      .upload(filePath, csvContent, {
        contentType: 'text/csv',
        upsert: true
      })

    if (uploadError) {
      console.error('❌ Storage upload error:', uploadError)
      throw uploadError
    }

    // Get public URL
    const { data: publicData } = supabase.storage
      .from('excel-calculators')
      .getPublicUrl(filePath)

    const publicUrl = publicData.publicUrl
    console.log(`✅ File saved to storage: ${publicUrl}`)

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Hotel dataset exported successfully',
        downloadUrl: publicUrl,
        storagePath: filePath,
        stats: {
          totalHotels: hotels.length,
          totalPackages: packages.length,
          totalRecords: csvRows.length - 1,
          fileName: fileName
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('❌ Export failed:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        message: 'Failed to export hotel dataset'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})