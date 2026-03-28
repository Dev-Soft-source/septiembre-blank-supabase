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
    const { sessionId } = await req.json();

    if (!sessionId) {
      throw new Error('Session ID is required');
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

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (!session) {
      throw new Error('Payment session not found');
    }

    // Find the booking record
    const { data: booking, error: bookingError } = await supabaseService
      .from('bookings')
      .select('*')
      .eq('stripe_session_id', sessionId)
      .single();

    if (bookingError || !booking) {
      throw new Error('Booking not found');
    }

    // Check payment status
    const isPaymentSuccessful = session.payment_status === 'paid';
    
    if (isPaymentSuccessful && booking.payment_status !== 'completed') {
      // Payment was successful, update booking and reserve rooms
      
      // First, check if rooms are still available
      const { data: availabilityCheck, error: availabilityError } = await supabaseService.rpc('check_package_availability_enhanced', {
        p_package_id: booking.package_id,
        p_rooms_needed: parseInt(session.metadata?.roomsToReserve || '1')
      });

      if (availabilityError || !availabilityCheck) {
        // Rooms no longer available - refund payment
        console.error(`Rooms no longer available for booking ${booking.id}. Payment will need to be refunded.`);
        
        // Update booking status to failed
        await supabaseService
          .from('bookings')
          .update({
            status: 'cancelled',
            payment_status: 'refund_required',
            updated_at: new Date().toISOString(),
          })
          .eq('id', booking.id);

        return new Response(JSON.stringify({
          success: false,
          error: 'Rooms no longer available. Refund required.',
          booking: { ...booking, status: 'cancelled', payment_status: 'refund_required' }
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        });
      }

      // Reserve the rooms
      const { data: reservationSuccess, error: reservationError } = await supabaseService.rpc('reserve_package_rooms_enhanced', {
        p_package_id: booking.package_id,
        p_rooms_to_reserve: parseInt(session.metadata?.roomsToReserve || '1')
      });

      if (reservationError || !reservationSuccess) {
        console.error(`Failed to reserve rooms for booking ${booking.id}:`, reservationError);
        
        // Update booking status to failed
        await supabaseService
          .from('bookings')
          .update({
            status: 'cancelled',
            payment_status: 'refund_required',
            updated_at: new Date().toISOString(),
          })
          .eq('id', booking.id);

        return new Response(JSON.stringify({
          success: false,
          error: 'Failed to reserve rooms. Refund required.',
          booking: { ...booking, status: 'cancelled', payment_status: 'refund_required' }
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        });
      }

      // Update booking to confirmed
      const { data: updatedBooking, error: updateError } = await supabaseService
        .from('bookings')
        .update({
          status: 'confirmed',
          payment_status: 'completed',
          payment_timestamp: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', booking.id)
        .select()
        .single();

      if (updateError) {
        console.error(`Failed to update booking ${booking.id}:`, updateError);
        throw new Error('Failed to update booking status');
      }

      console.log(`Successfully confirmed booking ${booking.id} with payment ${sessionId}`);

      return new Response(JSON.stringify({
        success: true,
        paymentStatus: 'completed',
        booking: updatedBooking,
        sessionData: {
          paymentStatus: session.payment_status,
          customerEmail: session.customer_details?.email,
          amountTotal: session.amount_total,
        }
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });

    } else if (!isPaymentSuccessful) {
      // Payment failed or cancelled
      await supabaseService
        .from('bookings')
        .update({
          status: 'cancelled',
          payment_status: 'failed',
          updated_at: new Date().toISOString(),
        })
        .eq('id', booking.id);

      return new Response(JSON.stringify({
        success: false,
        paymentStatus: session.payment_status,
        booking: { ...booking, status: 'cancelled', payment_status: 'failed' }
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Payment already processed
    return new Response(JSON.stringify({
      success: true,
      paymentStatus: booking.payment_status,
      booking: booking
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error: any) {
    console.error('Payment verification error:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to verify payment' 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});