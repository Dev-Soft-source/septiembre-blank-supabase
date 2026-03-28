import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req: Request): Promise<Response> => {
  console.log("✅ DUPLICATE CONTACT FORM FUNCTION - Method:", req.method);
  console.log("🚀 Timestamp:", new Date().toISOString());
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    console.log("🔧 Handling CORS preflight");
    return new Response(null, { 
      status: 200,
      headers: corsHeaders 
    });
  }

  if (req.method !== "POST") {
    console.log("❌ Method not allowed:", req.method);
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { 
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }

  try {
    console.log("📨 Processing duplicate contact form submission");
    
    const body = await req.json();
    console.log("📝 Form data:", { 
      name: body.name, 
      email: body.email, 
      department: body.department 
    });

    const { name, email, department, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      console.error("⚠️ Missing required fields");
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Name, email, and message are required" 
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    console.log("✅ Validation passed, sending email to grand_soiree@yahoo.com");

    // Send email using Resend to grand_soiree@yahoo.com
    const emailResponse = await resend.emails.send({
      from: "Hotel Living Contact <onboarding@resend.dev>",
      to: ["grand_soiree@yahoo.com"],
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Department:</strong> ${department || 'Not specified'}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p><small>Submitted at: ${new Date().toISOString()}</small></p>
      `,
    });

    console.log("📧 Email sent successfully to grand_soiree@yahoo.com:", emailResponse);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Contact form submitted and email sent successfully!"
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
    
  } catch (error: any) {
    console.error("💥 Function error:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: "Failed to send email: " + error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});