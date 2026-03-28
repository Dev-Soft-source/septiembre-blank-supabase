import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const sqlFiles = [
      'hotels_rows.sql',
      'hotel_images_rows.sql',
      'hotel_themes_rows.sql', 
      'hotel_activities_rows.sql',
      'hotel_translations_rows.sql',
      'availability_packages_rows.sql'
    ];

    const results = [];

    for (const fileName of sqlFiles) {
      console.log(`Reading ${fileName}...`);
      
      // Read SQL file from storage
      const { data: fileData, error: fileError } = await supabase.storage
        .from('Hotel-Data')
        .download(fileName);

      if (fileError) {
        console.error(`Error reading ${fileName}:`, fileError);
        results.push({ file: fileName, error: fileError.message });
        continue;
      }

      const sqlContent = await fileData.text();
      console.log(`Executing SQL from ${fileName}...`);
      
      // Execute SQL using raw query
      const { data, error } = await supabase.rpc('exec_sql', { 
        sql_query: sqlContent 
      });

      if (error) {
        console.error(`Error executing ${fileName}:`, error);
        results.push({ file: fileName, error: error.message });
      } else {
        console.log(`Successfully executed ${fileName}`);
        results.push({ file: fileName, success: true, result: data });
      }
    }

    return new Response(JSON.stringify({ 
      success: true,
      message: "SQL files processing completed",
      results: results
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error) {
    console.error("Error in execute-sql-from-storage function:", error);
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