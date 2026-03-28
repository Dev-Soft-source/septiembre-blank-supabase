import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Resend } from "npm:resend@2.0.0";
import { getPasswordRecoveryTemplate, generateEmailHtml, getUserLanguage, type SupportedLanguage } from "../_shared/emailTemplates.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PasswordResetRequest {
  email: string;
  language?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, language }: PasswordResetRequest = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Create Supabase client
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

    console.log("Creating password reset token for:", email);

    // Create password reset token using our custom function
    const { data: tokenData, error: tokenError } = await supabase
      .rpc('create_password_reset_token', { p_email: email });

    if (tokenError) {
      console.error("Error creating reset token:", tokenError);
      return new Response(
        JSON.stringify({ error: tokenError.message }),
        { 
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    const token = tokenData;
    const resetUrl = `https://ca48e511-da23-4c95-9913-59cb1724cacc.lovableproject.com/reset-password?token=${token}`;

    console.log("Reset URL generated:", resetUrl);

    // Use our custom email template
    const userLanguage = getUserLanguage(language);
    const emailContent = getPasswordRecoveryTemplate(userLanguage, resetUrl);
    const html = generateEmailHtml(emailContent);

    // Send via Resend
    const { data, error } = await resend.emails.send({
      from: "Hotel-living.com <contact@hotel-living.com>",
      to: [email],
      subject: emailContent.subject,
      html: html,
    });

    if (error) {
      console.error("Error sending password reset email:", error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { 
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    console.log("Password reset email sent successfully:", data);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Password reset email sent",
        messageId: data?.id 
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  } catch (error: any) {
    console.error("Error in custom-password-reset function:", error);
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