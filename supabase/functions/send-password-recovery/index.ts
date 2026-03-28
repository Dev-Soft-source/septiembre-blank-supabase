import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { getPasswordRecoveryTemplate, generateEmailHtml, getUserLanguage, type SupportedLanguage } from "../_shared/emailTemplates.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PasswordRecoveryRequest {
  email: string;
  resetUrl: string;
  language?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, resetUrl, language }: PasswordRecoveryRequest = await req.json();

    if (!email || !resetUrl) {
      return new Response(
        JSON.stringify({ error: "Email and reset URL are required" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Use the new multi-language template system
    const userLanguage = getUserLanguage(language);
    const emailContent = getPasswordRecoveryTemplate(userLanguage, resetUrl);
    const html = generateEmailHtml(emailContent);

    const { data, error } = await resend.emails.send({
      from: "Hotel Living <contact@hotel-living.com>", // Verified domain
      to: [email],
      subject: emailContent.subject,
      html: html,
    });

    if (error) {
      console.error("Error sending password recovery email:", error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { 
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    console.log("Password recovery email sent successfully:", data);
    return new Response(
      JSON.stringify({ success: true, messageId: data?.id }),
      { 
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  } catch (error: any) {
    console.error("Error in send-password-recovery function:", error);
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