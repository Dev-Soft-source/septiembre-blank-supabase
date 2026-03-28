import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("notify-admin-on-hotel-submission function called");
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const resendKey = Deno.env.get('RESEND_API_KEY');

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { type, record } = await req.json();
    
    console.log('Hotel submission notification trigger:', { type, hotel_id: record?.id });

    // Only process INSERT operations for new hotel submissions
    if (type !== 'INSERT') {
      return new Response(
        JSON.stringify({ success: true, message: 'Not a new submission, no notification needed' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const hotelId = record?.id;
    const hotelName = record?.name || 'Unnamed Hotel';
    const ownerId = record?.owner_id;

    if (!hotelId || !ownerId) {
      throw new Error('Missing hotel ID or owner ID');
    }

    console.log("Processing hotel submission:", { hotelId, hotelName, ownerId });

    // Get owner information
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(ownerId);
    
    if (userError) {
      console.error('Error fetching user data:', userError);
    }

    const userEmail = userData?.user?.email || 'Unknown';
    const userName = userData?.user?.user_metadata?.first_name 
      ? `${userData.user.user_metadata.first_name} ${userData.user.user_metadata.last_name || ''}`.trim()
      : 'Hotel Owner';

    // Log to admin_messages table
    const { error: logError } = await supabase
      .from('admin_messages')
      .insert({
        user_id: ownerId,
        subject: `New Hotel Submission - ${hotelName}`,
        message: `
🏨 NEW HOTEL SUBMISSION RECEIVED

Hotel Details:
- Name: ${hotelName}
- Hotel ID: ${hotelId}
- Submission Date: ${new Date().toISOString()}

Owner Information:
- Name: ${userName}
- Email: ${userEmail}
- User ID: ${ownerId}

Property Details:
- Country: ${record?.country || 'Not specified'}
- City: ${record?.city || 'Not specified'}
- Property Type: ${record?.property_type || 'Not specified'}
- Status: ${record?.status || 'pending'}

Contact Information:
- Contact Name: ${record?.contact_name || 'Not provided'}
- Contact Email: ${record?.contact_email || 'Not provided'}
- Contact Phone: ${record?.contact_phone || 'Not provided'}

Action Required:
Please review this hotel submission in the admin panel and approve or reject it.

View in admin panel: https://hotel-living.com/admin/hotels/${hotelId}
        `,
        status: 'pending'
      });

    if (logError) {
      console.error('Error logging to admin_messages:', logError);
    } else {
      console.log('Successfully logged hotel submission to admin_messages');
    }

    // Send email notification if Resend is configured
    if (resendKey) {
      try {
        console.log("Sending admin email notification...");
        
        const resend = new Resend(resendKey);
        const adminEmail = "grand_soiree@yahoo.com";

        const { error: emailError } = await resend.emails.send({
          from: "Hotel Living <contact@hotel-living.com>",
          to: [adminEmail],
          subject: `🏨 New Hotel Submission - ${hotelName}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #7c3aed;">🏨 New Hotel Submission Received</h2>
              
              <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0;">Hotel Details</h3>
                <p><strong>Name:</strong> ${hotelName}</p>
                <p><strong>Hotel ID:</strong> ${hotelId}</p>
                <p><strong>Country:</strong> ${record?.country || 'Not specified'}</p>
                <p><strong>City:</strong> ${record?.city || 'Not specified'}</p>
                <p><strong>Property Type:</strong> ${record?.property_type || 'Not specified'}</p>
              </div>

              <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0;">Owner Information</h3>
                <p><strong>Name:</strong> ${userName}</p>
                <p><strong>Email:</strong> ${userEmail}</p>
                <p><strong>User ID:</strong> ${ownerId}</p>
              </div>

              <div style="background: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0;">Contact Information</h3>
                <p><strong>Contact Name:</strong> ${record?.contact_name || 'Not provided'}</p>
                <p><strong>Contact Email:</strong> ${record?.contact_email || 'Not provided'}</p>
                <p><strong>Contact Phone:</strong> ${record?.contact_phone || 'Not provided'}</p>
              </div>

              <div style="background: #fee2e2; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0;">⚡ Action Required</h3>
                <p>Please review this hotel submission in the admin panel and approve or reject it.</p>
                <a href="https://hotel-living.com/admin/hotels/${hotelId}" style="background: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 10px;">
                  Review in Admin Panel
                </a>
              </div>

              <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
                Submission received on ${new Date().toLocaleString()}
              </p>
            </div>
          `,
        });

        if (emailError) {
          console.error('Error sending admin email:', emailError);
        } else {
          console.log('Admin notification email sent successfully');
        }
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
      }
    } else {
      console.log("Resend API key not configured, skipping email notification");
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Admin notification sent for hotel submission: ${hotelName}`,
        hotel_id: hotelId
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Admin notification error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Failed to send admin notification'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});