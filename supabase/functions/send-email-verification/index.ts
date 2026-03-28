import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { getEmailConfirmationTemplate, generateEmailHtml, getUserLanguage, type SupportedLanguage } from "../_shared/emailTemplates.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface VerificationEmailRequest {
  email: string;
  confirmationUrl: string;
  language?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Handle GET requests for testing
  if (req.method === "GET") {
    return new Response(
      JSON.stringify({ 
        status: "send-email-verification function is live", 
        method: "POST",
        expectedBody: { email: "string", confirmationUrl: "string", language: "optional" }
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed. Use POST." }),
      { 
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }

  try {
    console.log("send-email-verification function called");
    
    const { email, confirmationUrl, language }: VerificationEmailRequest = await req.json();

    if (!email || !confirmationUrl) {
      console.log("Missing required data:", { email: !!email, confirmationUrl: !!confirmationUrl });
      return new Response(
        JSON.stringify({ error: "Email and confirmation URL are required" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    console.log("Processing verification email for:", email);

    // Use the new multi-language template system
    const userLanguage = getUserLanguage(language);
    const emailContent = getEmailConfirmationTemplate(userLanguage, confirmationUrl);
    const html = generateEmailHtml(emailContent);

    console.log("Sending verification email to:", email);

    const { data, error } = await resend.emails.send({
      from: "Hotel-living.com <contact@hotel-living.com>",
      to: [email],
      subject: emailContent.subject,
      html: html,
    });

    if (error) {
      console.error("Error sending verification email:", error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { 
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    console.log("Verification email sent successfully:", data);
    return new Response(
      JSON.stringify({ success: true, messageId: data?.id }),
      { 
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  } catch (error: any) {
    console.error("Error in send-email-verification function:", error);
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