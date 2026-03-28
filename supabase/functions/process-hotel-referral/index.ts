
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.33.1";

// Set CORS headers for browser requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": 
    "authorization, x-client-info, apikey, content-type",
};

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get("SUPABASE_URL") || "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
);

// Request handler
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the request payload (newly registered hotel)
    const { hotelId, contactEmail } = await req.json();
    
    if (!hotelId || !contactEmail) {
      return new Response(
        JSON.stringify({ error: "Hotel ID and contact email are required" }),
        { 
          status: 400, 
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders 
          } 
        }
      );
    }

    // Find any matching referrals that are still valid (not expired)
    const { data: referrals, error: referralError } = await supabase
      .from("hotel_referrals")
      .select("*")
      .eq("contact_email", contactEmail)
      .eq("referral_type", "three_free_nights")
      .eq("reward_status", "pending")
      .gte("expiration_date", new Date().toISOString())
      .order("created_at", { ascending: false });

    if (referralError) {
      throw referralError;
    }

    if (!referrals || referrals.length === 0) {
      // No valid referrals found
      return new Response(
        JSON.stringify({ message: "No valid referrals found for this registration" }),
        { 
          status: 200, 
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders 
          } 
        }
      );
    }

    // Get the most recent valid referral
    const validReferral = referrals[0];

    // Update the referral status to "completed"
    const { error: updateError } = await supabase
      .from("hotel_referrals")
      .update({ 
        reward_status: "completed",
        reward_granted_at: new Date().toISOString(),
        registered_hotel_id: hotelId
      })
      .eq("id", validReferral.id);

    if (updateError) {
      throw updateError;
    }

    // Create a reward entry for the user (in a hypothetical user_rewards table)
    // Note: This table would need to be created separately if it doesn't exist
    try {
      await supabase.from("user_rewards").insert({
        user_id: validReferral.user_id,
        reward_type: "free_nights",
        quantity: 3,
        referral_id: validReferral.id,
        status: "granted",
        hotel_id: hotelId,
        expires_at: new Date(Date.now() + (365 * 24 * 60 * 60 * 1000)).toISOString() // 1 year expiration
      });
    } catch (rewardError) {
      // If the table doesn't exist yet, log the error but continue
      console.error("Error creating reward (user_rewards table may not exist yet):", rewardError);
    }

    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Referral processed successfully, three free nights granted to referrer",
        referralId: validReferral.id,
        userId: validReferral.user_id
      }),
      { 
        status: 200, 
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders 
        } 
      }
    );
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { 
        status: 500, 
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders 
        } 
      }
    );
  }
});
