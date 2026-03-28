
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { fetchAffinitiesFromDB } from "./fetchAffinitiesFromDB.ts";
import { formatAffinityData } from "./formatAffinityData.ts";
import { validateAffinityRequest } from "./validateAffinityRequest.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate the request
    const validationResult = await validateAffinityRequest(req);
    if (!validationResult.isValid) {
      return new Response(JSON.stringify({ error: validationResult.error }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Fetch affinities from database
    const affinities = await fetchAffinitiesFromDB();

    // Format the data for response
    const formattedData = formatAffinityData(affinities);

    return new Response(JSON.stringify(formattedData), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error) {
    console.error("Error in get-affinities function:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Internal server error" 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
