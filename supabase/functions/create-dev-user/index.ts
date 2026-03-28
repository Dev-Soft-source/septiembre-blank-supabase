import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.33.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("[DEV-USER] Function invoked");

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !serviceRoleKey) {
      console.error("[DEV-USER] Missing environment variables");
      return new Response(
        JSON.stringify({ error: "Missing environment configuration" }),
        { 
          status: 500, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      );
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false }
    });

    let requestBody;
    try {
      requestBody = await req.json();
    } catch (parseError) {
      console.error("[DEV-USER] Failed to parse request body:", parseError);
      return new Response(
        JSON.stringify({ error: "Invalid JSON in request body" }),
        { 
          status: 400, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      );
    }

    const { sessionId, getSession = false, email: requestedEmail } = requestBody;

    if (!sessionId) {
      console.error("[DEV-USER] Missing sessionId");
      return new Response(
        JSON.stringify({ error: "Session ID is required" }),
        { 
          status: 400, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      );
    }

    // Check if we're in development mode (Lovable environment)
    const host = req.headers.get('host') || '';
    const referer = req.headers.get('referer') || '';
    const origin = req.headers.get('origin') || '';
    const isDevelopment = origin.includes('lovableproject.com') || 
                         origin.includes('localhost') ||
                         host.includes('lovableproject.com') || 
                         host.includes('localhost') || 
                         referer.includes('lovableproject.com') ||
                         referer.includes('localhost');

    console.log(`[DEV-USER] Host: ${host}, Referer: ${referer}, Origin: ${origin}, IsDev: ${isDevelopment}`);

    if (!isDevelopment) {
      console.error("[DEV-USER] Not in development environment");
      return new Response(
        JSON.stringify({ error: "Development mode user creation is only available in development environments" }),
        { 
          status: 403, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      );
    }

    // If requesting session for existing user, handle that first
    if (getSession && requestedEmail) {
      console.log(`[DEV-USER] Generating session for existing user: ${requestedEmail}`);
      
      // Find existing user by email
      const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
      if (listError) {
        console.error('[DEV-USER] Error listing users:', listError);
        return new Response(
          JSON.stringify({ error: "Failed to find existing user" }),
          { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      const existingUser = users.find(u => u.email === requestedEmail);
      if (!existingUser) {
        console.error(`[DEV-USER] User not found with email: ${requestedEmail}`);
        return new Response(
          JSON.stringify({ error: "User not found" }),
          { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // Generate session for existing user
      const { data: sessionData, error: sessionError } = await supabase.auth.admin.generateLink({
        type: 'magiclink',
        email: requestedEmail,
      });

      if (sessionError || !sessionData.properties?.access_token) {
        console.error('[DEV-USER] Error generating session:', sessionError);
        return new Response(
          JSON.stringify({ error: "Failed to generate session" }),
          { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      return new Response(
        JSON.stringify({ 
          success: true,
          session: {
            access_token: sessionData.properties.access_token,
            refresh_token: sessionData.properties.refresh_token || '',
            user: existingUser
          }
        }),
        { 
          status: 200, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      );
    }

    const userId = crypto.randomUUID();
    const timestamp = Date.now();
    const email = `dev-hotel-${timestamp}@example.com`;
    const password = `DevPass123!${timestamp}`;

    console.log(`[DEV-USER] Creating development user with ID: ${userId}, Email: ${email}`);

    // Create auth.users entry directly using admin functions
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true,
      user_metadata: {
        first_name: "Development",
        last_name: "User",
        role: "hotel_owner",
        created_by: "dev-mode"
      }
    });

    if (authError) {
      console.error('[DEV-USER] Error creating auth user:', authError);
      return new Response(
        JSON.stringify({ 
          error: "Failed to create development user in auth system",
          details: authError.message 
        }),
        { 
          status: 500, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      );
    }

    if (!authUser?.user?.id) {
      console.error('[DEV-USER] Auth user creation returned no user');
      return new Response(
        JSON.stringify({ error: "Auth user creation failed - no user returned" }),
        { 
          status: 500, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      );
    }

    console.log(`[DEV-USER] Successfully created auth user:`, authUser.user.id);

    // Check if profile already exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', authUser.user.id)
      .single();

    if (existingProfile) {
      console.log('[DEV-USER] Profile already exists, reusing existing profile');
    } else {
      // Create new profile only if it doesn't exist
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authUser.user.id,
          first_name: "Development",
          last_name: "User",
          role: "hotel_owner",
          is_hotel_owner: true
        });

      if (profileError) {
        console.error('[DEV-USER] Error creating profile:', profileError);
        // Try to clean up the auth user if profile creation fails
        try {
          await supabase.auth.admin.deleteUser(authUser.user.id);
          console.log('[DEV-USER] Cleaned up auth user after profile error');
        } catch (cleanupError) {
          console.error('[DEV-USER] Failed to cleanup auth user after profile error:', cleanupError);
        }
        
        return new Response(
          JSON.stringify({ 
            error: "Failed to create development user profile",
            details: profileError.message 
          }),
          { 
            status: 500, 
            headers: { "Content-Type": "application/json", ...corsHeaders } 
          }
        );
      }
    }

    console.log(`[DEV-USER] Successfully created profile for user:`, authUser.user.id);

    // Generate session token for immediate use in tests
    const { data: sessionData, error: sessionError } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email: email,
    });

    if (sessionError) {
      console.error('[DEV-USER] Error generating session:', sessionError);
      // Still return success as user was created, just without session
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        userId: authUser.user.id,
        email: email,
        password: password,
        session: sessionData?.properties ? {
          access_token: sessionData.properties.access_token,
          refresh_token: sessionData.properties.refresh_token || '',
          user: authUser.user
        } : null,
        message: "Development user created successfully"
      }),
      { 
        status: 200, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      }
    );

  } catch (error) {
    console.error("[DEV-USER] Unexpected error:", error);
    return new Response(
      JSON.stringify({ 
        error: "Internal server error", 
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      }
    );
  }
});