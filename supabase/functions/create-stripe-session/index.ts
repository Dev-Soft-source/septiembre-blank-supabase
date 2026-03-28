import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { packageId, hotelId, bookingData, totalPrice, successUrl, cancelUrl } = await req.json();

    // Validate required fields
    if (!packageId || !hotelId || !bookingData || !totalPrice) {
      throw new Error('Missing required booking information');
    }

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Initialize Supabase with service role key
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Get package details for validation
    const { data: packageData, error: packageError } = await supabaseService
      .from('availability_packages')
      .select('*')
      .eq('id', packageId)
      .single();

    if (packageError || !packageData) {
      throw new Error('Package not found');
    }

    // Check availability before creating Stripe session
    const { data: availabilityCheck, error: availabilityError } = await supabaseService.rpc('check_package_availability_enhanced', {
      p_package_id: packageId,
      p_rooms_needed: bookingData.roomsToReserve
    });

    if (availabilityError || !availabilityCheck) {
      throw new Error('Selected rooms are no longer available');
    }

    // Get hotel details
    const { data: hotelData, error: hotelError } = await supabaseService
      .from('hotels')
      .select('name')
      .eq('id', hotelId)
      .single();

    if (hotelError || !hotelData) {
      throw new Error('Hotel not found');
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `${hotelData.name} - ${bookingData.roomsToReserve} Room(s)`,
              description: `Stay from ${packageData.start_date} to ${packageData.end_date}`,
            },
            unit_amount: Math.round(totalPrice * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl || `${req.headers.get("origin")}/booking-success/{CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${req.headers.get("origin")}/booking-failed`,
      metadata: {
        packageId,
        hotelId,
        roomsToReserve: bookingData.roomsToReserve.toString(),
        guestName: bookingData.guestName,
        guestEmail: bookingData.guestEmail,
        guestPhone: bookingData.guestPhone || '',
      },
    });

    // Create pending booking record
    const { data: booking, error: bookingError } = await supabaseService
      .from('bookings')
      .insert({
        hotel_id: hotelId,
        package_id: packageId,
        check_in: packageData.start_date,
        check_out: packageData.end_date,
        total_price: Math.round(totalPrice),
        status: 'pending',
        payment_status: 'pending',
        stripe_session_id: session.id,
      })
      .select()
      .single();

    if (bookingError) {
      throw new Error('Failed to create booking record');
    }

    console.log(`Created Stripe session ${session.id} for booking ${booking.id}`);

    return new Response(JSON.stringify({ 
      sessionId: session.id,
      sessionUrl: session.url,
      bookingId: booking.id 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error: any) {
    console.error('Stripe session creation error:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to create payment session' 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});