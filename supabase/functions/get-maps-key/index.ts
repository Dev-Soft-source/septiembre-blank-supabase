
// This Edge Function retrieves the Google Maps API key from environment variables
// and returns it to the client in a consistent format.

import { serve } from "https://deno.land/std@0.131.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json"
};

console.log("Hello from get-maps-key Edge Function!");

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Get API key from Edge Function environment variables
    const apiKey = Deno.env.get("GOOGLE_MAPS_API_KEY");
    
    console.log("API key lookup result:", apiKey ? "Found API key" : "API key not defined");
    
    if (!apiKey) {
      console.error("GOOGLE_MAPS_API_KEY not defined in Edge Function environment");
      return new Response(
        JSON.stringify({ 
          error: "API key not configured on server",
          message: "Please configure the GOOGLE_MAPS_API_KEY in the Supabase Edge Function secrets"
        }),
        { 
          status: 500,
          headers: corsHeaders
        }
      );
    }
    
    // Return the API key with both naming conventions for maximum compatibility
    console.log("Successfully returning API key to client");
    return new Response(
      JSON.stringify({ 
        key: apiKey,
        apiKey: apiKey
      }),
      { 
        status: 200,
        headers: corsHeaders
      }
    );
  } catch (error) {
    console.error("Error in get-maps-key Edge Function:", error);
    return new Response(
      JSON.stringify({ 
        error: "Internal server error retrieving API key",
        details: error.message
      }),
      { 
        status: 500,
        headers: corsHeaders
      }
    );
  }
});
