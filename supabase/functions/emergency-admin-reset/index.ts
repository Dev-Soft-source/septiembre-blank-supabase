import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Resend } from "npm:resend@2.0.0";
import { getPasswordRecoveryTemplate, generateEmailHtml, getUserLanguage, type SupportedLanguage } from "../_shared/emailTemplates.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AdminResetRequest {
  adminEmail: string;
  emergencyKey: string;
  language?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { adminEmail, emergencyKey, language }: AdminResetRequest = await req.json();

    // Emergency key validation (you should set this in Supabase secrets)
    const expectedKey = Deno.env.get("EMERGENCY_ADMIN_KEY") || "HOTEL_LIVING_EMERGENCY_2024";
    
    if (!emergencyKey || emergencyKey !== expectedKey) {
      console.error("Invalid emergency key provided");
      return new Response(
        JSON.stringify({ error: "Invalid emergency key" }),
        { 
          status: 401, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    if (!adminEmail) {
      return new Response(
        JSON.stringify({ error: "Admin email is required" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Create Supabase admin client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    console.log("Verifying admin user:", adminEmail);

    // First, get the user ID from auth.users using the email
    const { data: userData, error: userError } = await supabase.auth.admin.listUsers();
    
    if (userError) {
      console.error("Error fetching users:", userError);
      return new Response(
        JSON.stringify({ error: "Error verifying user" }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    const user = userData.users.find(u => u.email === adminEmail);
    
    if (!user) {
      console.error("User not found:", adminEmail);
      return new Response(
        JSON.stringify({ error: "User not found" }),
        { 
          status: 404, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Now verify the user is actually an admin using their UUID
    const { data: adminData, error: adminError } = await supabase
      .from('admin_users')
      .select('id')
      .eq('id', user.id)
      .single();

    if (adminError || !adminData) {
      console.error("Admin verification failed:", adminError);
      return new Response(
        JSON.stringify({ error: "User is not a valid administrator" }),
        { 
          status: 403, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    console.log("Admin verified, generating password reset link");

    // Generate password reset link using admin service role
    // Get the current origin from the request or use environment variable
    const origin = req.headers.get('origin') || req.headers.get('referer')?.split('/').slice(0, 3).join('/') || 'https://ca48e511-da23-4c95-9913-59cb1724cacc.lovableproject.com';
    
    const { data: resetData, error: resetError } = await supabase.auth.admin.generateLink({
      type: 'recovery',
      email: adminEmail,
      options: {
        redirectTo: `${origin}/admin-login`
      }
    });

    if (resetError) {
      console.error("Error generating reset link:", resetError);
      return new Response(
        JSON.stringify({ error: resetError.message }),
        { 
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    const resetUrl = resetData.properties?.action_link || '';
    console.log("Reset URL generated:", resetUrl);

    // Use our custom email template
    const userLanguage = getUserLanguage(language);
    const emailContent = getPasswordRecoveryTemplate(userLanguage, resetUrl);
    const html = generateEmailHtml({
      ...emailContent,
      subject: `🚨 EMERGENCY: ${emailContent.subject}`,
      content: emailContent.content + `
        <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <strong>⚠️ Emergency Admin Password Reset</strong><br>
          This is an emergency password reset initiated with the emergency key.
        </div>
      `
    });

    // Send via Resend
    const { data, error } = await resend.emails.send({
      from: "Hotel Living Emergency <contact@hotel-living.com>",
      to: [adminEmail],
      subject: `🚨 EMERGENCY: ${emailContent.subject}`,
      html: html,
    });

    if (error) {
      console.error("Error sending emergency reset email:", error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { 
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    console.log("Emergency admin reset email sent successfully:", data);
    
    // Log the emergency access for security audit
    await supabase
      .from('admin_logs')
      .insert({
        admin_id: adminEmail,
        action: 'emergency_password_reset',
        details: { 
          timestamp: new Date().toISOString(),
          ip: req.headers.get('x-forwarded-for') || 'unknown',
          user_agent: req.headers.get('user-agent') || 'unknown'
        }
      })
      .select();

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Emergency password reset email sent",
        messageId: data?.id 
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  } catch (error: any) {
    console.error("Error in emergency-admin-reset function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);