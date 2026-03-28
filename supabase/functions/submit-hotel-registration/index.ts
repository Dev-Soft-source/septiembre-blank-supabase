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
    const { hotel_data, availability_packages, hotel_images, hotel_themes, hotel_activities, dev_mode } = await req.json();
    
    // Detect if we're in development mode
    const isDevelopment = dev_mode || 
      req.headers.get('host')?.includes('lovableproject.com') ||
      req.headers.get('host')?.includes('localhost');

    let currentUserId = null;

    // Get authentication header
    const authHeader = req.headers.get('authorization');
    if (authHeader) {
      // Try to get user from session
      const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
      currentUserId = user?.id;
    }

    // Development mode: Handle missing authentication
    if (!currentUserId && isDevelopment) {
      console.log('[DEV MODE] No authenticated user, creating development user');
      
      // Check if we have any existing development profile we can use
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('role', 'hotel_owner')
        .or('first_name.eq.Development,first_name.like.Dev%')
        .limit(1)
        .single();

      if (existingProfile) {
        // Verify this user exists in auth.users
        const { data: authUser } = await supabase.auth.admin.getUserById(existingProfile.id);
        
        if (authUser.user) {
          currentUserId = existingProfile.id;
          console.log(`[DEV MODE] Reusing existing development user: ${currentUserId}`);
        } else {
          console.log(`[DEV MODE] Profile exists but no auth.users record, will create new user`);
        }
      }

      // If still no user, create a new development user
      if (!currentUserId) {
        const devEmail = `dev-hotel-${Date.now()}@example.com`;
        const devPassword = 'devpassword123';
        
        console.log(`[DEV MODE] Creating new auth user with email: ${devEmail}`);
        
        // Create auth user
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: devEmail,
          password: devPassword,
          email_confirm: true,
          user_metadata: {
            role: 'hotel',
            first_name: 'Development',
            last_name: 'User'
          }
        });

        if (authError) {
          throw new Error(`Failed to create auth user: ${authError.message}`);
        }

        currentUserId = authData.user.id;
        console.log(`[DEV MODE] Created auth user with ID: ${currentUserId}`);

        // Create or update profile
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: currentUserId,
            role: 'hotel_owner',
            is_hotel_owner: true,
            first_name: 'Development',
            last_name: 'User'
          });

        if (profileError) {
          console.error(`[DEV MODE] Profile creation error:`, profileError);
          // Continue anyway, the trigger should handle profile creation
        } else {
          console.log(`[DEV MODE] Successfully created profile for user: ${currentUserId}`);
        }
      }
    }

    // Authentication check
    if (!currentUserId) {
      return new Response(
        JSON.stringify({
          success: false,
          error: {
            code: 'AUTH_REQUIRED',
            message: {
              en: 'Please log in to continue',
              es: 'Por favor inicia sesión para continuar',
              pt: 'Por favor faça login para continuar',
              ro: 'Vă rugăm să vă conectați pentru a continua'
            }
          }
        }),
        { 
          status: 401, 
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders 
          } 
        }
      );
    }

    // Call the database function with the authenticated user context
    const { data, error } = await supabase.rpc('submit_hotel_registration', {
      hotel_data,
      availability_packages: availability_packages || [],
      hotel_images: hotel_images || [],
      hotel_themes: hotel_themes || [],
      hotel_activities: hotel_activities || [],
      dev_mode: isDevelopment,
      source_origin_param: 'online_form'
    });

    if (error) {
      throw error;
    }

    // FIX: Call admin notification function with enhanced logging
    if (data?.success && data?.hotel_id) {
      try {
        console.log('[ADMIN-NOTIFICATION] Hotel registration successful, triggering admin notification');
        console.log('[ADMIN-NOTIFICATION] Hotel ID:', data.hotel_id);
        
        // Get hotel data for notification
        const { data: hotelData, error: fetchError } = await supabase
          .from('hotels')
          .select('name, city, country, contact_email, owner_id, property_type, contact_name, contact_phone')
          .eq('id', data.hotel_id)
          .single();

        if (fetchError) {
          console.error('[ADMIN-NOTIFICATION] Error fetching hotel data:', fetchError);
          throw fetchError;
        }

        if (hotelData) {
          console.log('[ADMIN-NOTIFICATION] Fetched hotel data:', hotelData);
          
          const { data: notificationResult, error: notificationError } = await supabase.functions.invoke('notify-admin-on-hotel-submission', {
            body: {
              type: 'INSERT',
              record: {
                id: data.hotel_id,
                name: hotelData.name,
                city: hotelData.city,
                country: hotelData.country,
                contact_email: hotelData.contact_email,
                contact_name: hotelData.contact_name,
                contact_phone: hotelData.contact_phone,
                owner_id: hotelData.owner_id,
                property_type: hotelData.property_type,
                status: 'pending',
                created_at: new Date().toISOString()
              }
            }
          });
          
          if (notificationError) {
            console.error('[ADMIN-NOTIFICATION] Admin notification error:', notificationError);
          } else {
            console.log('[ADMIN-NOTIFICATION] Admin notification sent successfully:', notificationResult);
          }
        } else {
          console.error('[ADMIN-NOTIFICATION] No hotel data found for ID:', data.hotel_id);
        }
      } catch (notificationError) {
        console.error('[ADMIN-NOTIFICATION] Failed to send admin notification:', notificationError);
        // Don't fail the hotel registration if notification fails
      }
    } else {
      console.log('[ADMIN-NOTIFICATION] No admin notification triggered - registration failed or no hotel ID');
    }

    // Return success response
    return new Response(
      JSON.stringify(data),
      { 
        status: 200, 
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders 
        } 
      }
    );

  } catch (err) {
    console.error("Hotel registration error:", err);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: {
            en: 'A technical error occurred. Please try again later.',
            es: 'Ocurrió un error técnico. Por favor inténtalo más tarde.',
            pt: 'Ocorreu um erro técnico. Por favor tente novamente mais tarde.',
            ro: 'A apărut o eroare tehnică. Vă rugăm să încercați din nou mai târziu.'
          },
          details: err.message
        }
      }),
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