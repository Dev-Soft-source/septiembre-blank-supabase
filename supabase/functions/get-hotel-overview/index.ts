
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { fetchHotelData } from "./fetchHotelData.ts";
import { calculateOverviewStats } from "./calculateOverviewStats.ts";
import { validateHotelRequest } from "./validateHotelRequest.ts";
import { formatOverviewResponse } from "./formatOverviewResponse.ts";

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
    // Validate the incoming request
    const validationResult = await validateHotelRequest(req);
    if (!validationResult.isValid) {
      return new Response(JSON.stringify({ error: validationResult.error }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const { hotelId } = validationResult.data;

    // Fetch comprehensive hotel data
    const hotelData = await fetchHotelData(hotelId);

    if (!hotelData) {
      return new Response(JSON.stringify({ error: "Hotel not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Calculate overview statistics
    const stats = calculateOverviewStats(hotelData);

    // Format the final response
    const formattedResponse = formatOverviewResponse(hotelData, stats);

    return new Response(JSON.stringify(formattedResponse), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error) {
    console.error("Error in get-hotel-overview function:", error);
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
