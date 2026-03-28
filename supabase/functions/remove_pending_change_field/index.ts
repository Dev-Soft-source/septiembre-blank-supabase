
// remove_pending_change_field Edge Function
// Removes a specific field from the pending_changes JSONB column of a hotel

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const { hotel_id, field_name } = await req.json();
    
    if (!hotel_id || !field_name) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters: hotel_id and field_name are required" }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400 
        }
      );
    }
    
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );
    
    console.log(`Removing field '${field_name}' from hotel ${hotel_id} pending_changes`);
    
    // Get the current pending_changes
    const { data: hotelData, error: getError } = await supabaseClient
      .from('hotels')
      .select('pending_changes')
      .eq('id', hotel_id)
      .single();
      
    if (getError) {
      console.error("Error fetching hotel data:", getError);
      throw getError;
    }
    
    if (!hotelData?.pending_changes) {
      return new Response(
        JSON.stringify({ message: "No pending changes found" }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    // Remove the specified field from pending_changes
    const updatedPendingChanges = { ...hotelData.pending_changes };
    delete updatedPendingChanges[field_name];
    
    // Update the hotel record with the modified pending_changes
    const { error: updateError } = await supabaseClient
      .from('hotels')
      .update({ pending_changes: updatedPendingChanges })
      .eq('id', hotel_id);
      
    if (updateError) {
      console.error("Error updating pending_changes:", updateError);
      throw updateError;
    }
    
    // If no more pending changes, reset the status to 'approved' if it was 'pending'
    if (Object.keys(updatedPendingChanges).length === 0) {
      const { error: statusError } = await supabaseClient
        .from('hotels')
        .update({ 
          status: 'approved',
          pending_changes: null // Clear the entire column if empty
        })
        .eq('id', hotel_id)
        .eq('status', 'pending'); // Only update if current status is pending
        
      if (statusError) {
        console.error("Error resetting hotel status:", statusError);
        // Don't throw, as the main operation succeeded
      }
    }
    
    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
    
  } catch (error) {
    console.error("Function error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
});
