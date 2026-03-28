
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  console.log('=== Fix Hotel Associations ===');

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get the specific user ID to assign hotels to
    const targetUserId = '6f7f4f70-fed4-4f6e-9e31-91d415b53a93';

    // Find hotels with missing owner_id
    const { data: orphanedHotels, error: selectError } = await supabase
      .from('hotels')
      .select('*')
      .is('owner_id', null)
      .order('created_at', { ascending: false });

    if (selectError) {
      throw new Error(`Error fetching orphaned hotels: ${selectError.message}`);
    }

    console.log(`Found ${orphanedHotels?.length || 0} hotels without owner association`);

    if (!orphanedHotels || orphanedHotels.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'No orphaned hotels found',
          hotels_fixed: 0
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update all orphaned hotels to assign them to the target user
    const { data: updatedHotels, error: updateError } = await supabase
      .from('hotels')
      .update({ 
        owner_id: targetUserId,
        updated_at: new Date().toISOString()
      })
      .is('owner_id', null)
      .select();

    if (updateError) {
      throw new Error(`Error updating hotel associations: ${updateError.message}`);
    }

    console.log(`Successfully updated ${updatedHotels?.length || 0} hotels`);

    // Log each fixed hotel
    updatedHotels?.forEach(hotel => {
      console.log(`Fixed hotel: "${hotel.name}" (ID: ${hotel.id}) - now owned by user ${targetUserId}`);
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully fixed ${updatedHotels?.length || 0} hotel associations`,
        hotels_fixed: updatedHotels?.length || 0,
        fixed_hotels: updatedHotels?.map(h => ({ id: h.id, name: h.name })) || []
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error fixing hotel associations:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
})
