import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PDFData {
  name?: string;
  country?: string;
  city?: string;
  contact_email?: string;
  contact_name?: string;
  contact_phone?: string;
  address?: string;
  description?: string;
  property_type?: string;
  category?: number;
  total_rooms?: number;
  price_per_month?: number;
  [key: string]: any;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { submissionId } = await req.json()

    if (!submissionId) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Submission ID is required' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log(`Processing PDF submission: ${submissionId}`)

    // In a real implementation, you would:
    // 1. Fetch the PDF file from storage or email system
    // 2. Use a PDF parsing service (like Adobe PDF Services, PDFShift, or similar)
    // 3. Extract structured data using OCR or form field extraction
    // 4. Map the extracted data to your hotel registration format

    // For now, we'll simulate PDF processing with mock data
    const simulatedPDFData: PDFData = {
      name: `Hotel Extracted from PDF ${submissionId}`,
      country: 'Spain',
      city: 'Barcelona',
      contact_email: `hotel-${submissionId}@example.com`,
      contact_name: 'Hotel Manager',
      contact_phone: '+34 123 456 789',
      address: '123 Beach Street',
      description: 'Beautiful beachside hotel extracted from PDF form',
      property_type: 'Hotel',
      category: 4,
      total_rooms: 50,
      price_per_month: 2500,
      stay_lengths: [8, 15, 22, 29],
      meals_offered: ['breakfast', 'lunch', 'dinner'],
      available_months: ['June', 'July', 'August', 'September'],
      features_hotel: {
        'wifi': true,
        'parking': true,
        'pool': true,
        'spa': false,
        'restaurant': true
      },
      features_room: {
        'air_conditioning': true,
        'tv': true,
        'minibar': true,
        'balcony': true,
        'safe': true
      }
    }

    // Generate availability packages (8, 15, 22, 29 days × category × room types)
    const availabilityPackages = []
    const durations = [8, 15, 22, 29]
    const roomTypes = ['double', 'single']
    const startDate = new Date()
    startDate.setMonth(startDate.getMonth() + 2) // Start 2 months from now

    for (const duration of durations) {
      for (const roomType of roomTypes) {
        const endDate = new Date(startDate)
        endDate.setDate(startDate.getDate() + duration - 1)

        // Calculate price based on category and duration
        const categoryMultiplier = simulatedPDFData.category || 3
        const durationMultiplier = duration / 8 // Base multiplier for 8 days
        const roomTypeMultiplier = roomType === 'single' ? 0.8 : 1.0
        const basePrice = (simulatedPDFData.price_per_month || 2000) * durationMultiplier * roomTypeMultiplier * (categoryMultiplier / 3)

        availabilityPackages.push({
          start_date: startDate.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0],
          duration_days: duration,
          total_rooms: Math.ceil((simulatedPDFData.total_rooms || 10) / 2), // Half rooms per package
          available_rooms: Math.ceil((simulatedPDFData.total_rooms || 10) / 2),
          occupancy_mode: roomType,
          base_price_usd: Math.round(basePrice),
          current_price_usd: Math.round(basePrice)
        })

        // Move start date forward for next package
        startDate.setDate(startDate.getDate() + duration + 7) // 7 days gap between packages
      }
    }

    console.log(`Generated ${availabilityPackages.length} availability packages`)

    // Call the submit_hotel_registration function with source_origin = 'pdf_form'
    const { data: registrationResult, error: registrationError } = await supabase.rpc('submit_hotel_registration', {
      hotel_data: simulatedPDFData,
      availability_packages: availabilityPackages,
      hotel_images: [],
      hotel_themes: ['Beach', 'Urban', 'Luxury'], // Default themes for PDF submissions
      hotel_activities: ['Swimming', 'Restaurant', 'WiFi'],
      dev_mode: false,
      source_origin_param: 'pdf_form'
    })

    if (registrationError) {
      console.error('Hotel registration error:', registrationError)
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Hotel registration failed: ${registrationError.message || registrationError}` 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (!registrationResult?.success) {
      console.error('Registration failed:', registrationResult)
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: registrationResult?.error?.message || 'Hotel registration failed' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log(`Successfully created hotel from PDF: ${registrationResult.hotel_id}`)

    return new Response(
      JSON.stringify({ 
        success: true, 
        hotelId: registrationResult.hotel_id,
        hotelData: {
          name: simulatedPDFData.name,
          country: simulatedPDFData.country,
          city: simulatedPDFData.city
        },
        packagesCreated: availabilityPackages.length,
        message: 'PDF processed and hotel created successfully'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('PDF processing error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})