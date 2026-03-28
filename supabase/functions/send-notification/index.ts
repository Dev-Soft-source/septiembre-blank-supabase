
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationRequest {
  type: 'booking' | 'review' | 'message';
  recipient: string;
  data: Record<string, any>;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify JWT is now enabled in config.toml, so we can access the user via req.auth
    const claims = req.auth?.claims;
    const userId = claims?.sub;
    
    if (!userId) {
      return new Response(
        JSON.stringify({ error: "Unauthorized - Authentication required" }),
        { 
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const { type, recipient, data }: NotificationRequest = await req.json();

    // In a real implementation, you would connect to an email service
    // like SendGrid, Resend, or Amazon SES here
    
    console.log(`User ${userId} sending ${type} notification to ${recipient}`, data);
    
    // For demonstration, we'll just log and return a success response
    // In production, add your email service API call here
    
    // Example structure for email content
    const emailContent = {
      booking: {
        subject: "New Booking Confirmation",
        body: `Your booking at ${data.hotelName} from ${data.checkIn} to ${data.checkOut} has been confirmed.`
      },
      review: {
        subject: "New Review Received",
        body: `You received a ${data.rating}-star review for ${data.hotelName}.`
      },
      message: {
        subject: "New Message Received",
        body: `You received a message from ${data.sender}: "${data.message}"`
      }
    };
    
    // Simulate email sending
    const result = {
      success: true,
      messageId: `msg_${Date.now()}`,
      recipient,
      emailContent: emailContent[type]
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error("Error in send-notification function:", error);
    
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error" 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
