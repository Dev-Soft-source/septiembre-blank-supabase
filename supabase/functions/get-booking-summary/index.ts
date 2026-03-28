
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { fetchBookingData } from "./fetchBookingData.ts";
import { calculateBookingSummary } from "./calculateBookingSummary.ts";
import { validateBookingRequest } from "./validateBookingRequest.ts";
import { formatBookingResponse } from "./formatBookingResponse.ts";

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
    const validationResult = await validateBookingRequest(req);
    if (!validationResult.isValid) {
      return new Response(JSON.stringify({ error: validationResult.error }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Extract booking parameters from the validated request
    const { bookingId, userId, hotelId, checkIn, checkOut } = validationResult.data;

    // Fetch booking data from database
    const bookingData = await fetchBookingData({
      bookingId,
      userId,
      hotelId,
      checkIn,
      checkOut
    });

    if (!bookingData) {
      return new Response(JSON.stringify({ error: "Booking not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Calculate booking summary
    const summary = calculateBookingSummary(bookingData);

    // Format the response
    const formattedResponse = formatBookingResponse(summary);

    return new Response(JSON.stringify(formattedResponse), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error) {
    console.error("Error in get-booking-summary function:", error);
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
