
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

// Initialize Resend with API key
const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

// Set CORS headers for browser requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": 
    "authorization, x-client-info, apikey, content-type",
};

interface ReferralEmailPayload {
  referralId: string;
  hotelName: string;
  contactName: string;
  contactEmail: string;
  userFullName: string;
  referralType?: "three_free_nights" | "recommendation";
  expirationDate?: string;
}

// Request handler
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the request payload
    const { 
      referralId, 
      hotelName, 
      contactName, 
      contactEmail, 
      userFullName, 
      referralType = "recommendation",
      expirationDate 
    } = await req.json() as ReferralEmailPayload;
    
    if (!contactEmail) {
      return new Response(
        JSON.stringify({ error: "Contact email is required" }),
        { 
          status: 400, 
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders 
          } 
        }
      );
    }

    // Create email content based on referral type
    let emailContent;
    let emailSubject;

    if (referralType === "three_free_nights") {
      // Email for the Three Free Nights program with 15-day deadline
      const formattedExpirationDate = expirationDate 
        ? new Date(expirationDate).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          }) 
        : "15 days";

      emailContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #7a0486; margin-bottom: 20px;">🎉 Special Invitation from ${userFullName}!</h1>
          
          <p><strong>${userFullName}</strong> has personally referred your hotel to join Hotel Living's exclusive platform.</p>
          <p>Your hotel has been selected because of its exceptional quality and service that align perfectly with our platform's standards.</p>
          
          <p style="margin-top: 25px;"><strong>🎁 Three Free Nights Referral Program:</strong></p>
          <p>If your hotel registers on our platform by <strong>${formattedExpirationDate}</strong>, ${userFullName} will receive three free nights as a reward for this successful referral.</p>
          
          <p style="margin-top: 25px;">👉 <strong>Register your hotel here to complete the referral:</strong><br>
          <a href="https://hotelliving.com/hotels" style="color: #7a0486;">Hotel Living – Join as a Hotel Partner</a></p>
          
          <p style="margin-top: 25px;">We're excited about the possibility of featuring your exceptional property on our platform!</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
            <p>Hotel Living - Exceptional Long-Term Stays</p>
            <p>Referral ID: ${referralId}</p>
          </div>
        </div>
      `;
      emailSubject = `${userFullName} has referred ${hotelName} to Hotel Living (Three Free Nights Program)`;
    } else {
      // Standard recommendation email
      emailContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #7a0486; margin-bottom: 20px;">🎉 Congratulations!</h1>
          
          <p>One of your excellent clients, <strong>${userFullName}</strong>, has recently recommended your hotel to be featured on Hotel Living.</p>
          <p>Their appreciation for your service inspired us to reach out and personally invite you to join our platform.</p>
          
          <p>We'd love for you to discover what Hotel Living offers — a curated space for long-term thematic stays, ideal for outstanding hotels like yours.</p>
          
          <p style="margin-top: 25px;">👉 <strong>Learn more and register your hotel here:</strong><br>
          <a href="https://hotelliving.com/hotels" style="color: #7a0486;">Hotel Living – Discover Hotels</a></p>
          
          <p style="margin-top: 25px;">Congratulations again on earning your client's enthusiastic recommendation!</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
            <p>Hotel Living - Exceptional Long-Term Stays</p>
            <p>Recommendation ID: ${referralId}</p>
          </div>
        </div>
      `;
      emailSubject = `${hotelName} Has Been Recommended to Hotel Living!`;
    }

    // Send the email
    const { data, error } = await resend.emails.send({
      from: "Hotel Living <contact@hotel-living.com>",
      to: [contactEmail],
      subject: emailSubject,
      html: emailContent,
    });

    if (error) {
      console.error("Error sending email:", error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { 
          status: 500, 
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders 
          } 
        }
      );
    }

    // Log success and return response
    console.log(`Email sent successfully to ${contactEmail} for hotel ${hotelName}`);
    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Referral email sent successfully",
        data
      }),
      { 
        status: 200, 
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders 
        } 
      }
    );
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
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
