import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload = await req.json();
    console.log("🚨 AUTH HOOK: Processing auth event");

    // Allow default Supabase email processing to proceed - no custom logic
    console.log("✅ Auth hook: allowing default Supabase processing only");
    
    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Auth hook processed - default Supabase behavior only"
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
    
  } catch (error: any) {
    console.error("💥 ERROR IN AUTH HOOK:", error);
    
    // Return success to prevent blocking default behavior
    return new Response(
      JSON.stringify({ 
        success: true, 
        error: error.message,
        message: "Hook processed with error, allowing default behavior"
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});