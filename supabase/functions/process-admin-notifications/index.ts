import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const getEmailTemplate = (userEmail: string, role: string, userName: string) => {
  const roleNames = {
    traveler: 'Usuario / User',
    hotel_owner: 'Propietario de Hotel / Hotel Owner',
    association: 'Asociación / Association',
    promoter: 'Promotor / Promoter',
    leader: 'Líder Living / Group Leader'
  };
  
  const roleName = roleNames[role as keyof typeof roleNames] || role;
  
  return {
    subject: `Nueva Registración Hotel-living.com: ${roleName}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Nueva Registración</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #7E26A6 0%, #5D0080 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Hotel-living.com</h1>
            <p style="color: white; margin: 10px 0 0 0;">Nueva Registración</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); border: 1px solid #ddd;">
            <h2 style="color: #7E26A6; margin-top: 0;">Nueva registración recibida</h2>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Email:</strong> ${userEmail}</p>
              <p><strong>Nombre:</strong> ${userName}</p>
              <p><strong>Rol:</strong> ${roleName}</p>
              <p><strong>Fecha:</strong> ${new Date().toLocaleString('en-US', { timeZone: 'UTC' })}</p>
            </div>
            
            <p style="margin-bottom: 0; font-size: 14px; color: #666;">
              Este email se envía automáticamente cuando se completa una nueva registración.<br>
              <strong>El equipo de Hotel-living.com</strong>
            </p>
          </div>
        </body>
      </html>
    `
  };
};

const serve_handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Processing admin notifications...");
    
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase configuration");
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get unprocessed admin notifications
    const { data: notifications, error: selectError } = await supabase
      .from('admin_notifications')
      .select('*')
      .eq('event_type', 'new_user_registration')
      .is('processed_at', null)
      .order('created_at', { ascending: true })
      .limit(10);
    
    if (selectError) {
      console.error("Error fetching notifications:", selectError);
      throw selectError;
    }
    
    if (!notifications || notifications.length === 0) {
      return new Response(
        JSON.stringify({ success: true, processed: 0, message: "No pending notifications" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    console.log(`Found ${notifications.length} notifications to process`);
    
    let processed = 0;
    const adminEmail = "grand_soiree@yahoo.com";
    
    for (const notification of notifications) {
      try {
        const details = notification.details || {};
        const userEmail = details.email || 'unknown@email.com';
        const role = details.role || 'unknown';
        const userName = details.name || 'Usuario';
        
        console.log(`Processing notification for: ${userEmail}, role: ${role}`);
        
        const emailData = getEmailTemplate(userEmail, role, userName);
        
        // Add retry logic with rate limiting handling
        let emailSent = false;
        let retryCount = 0;
        const maxRetries = 3;
        
        while (!emailSent && retryCount < maxRetries) {
          try {
            const { error: emailError } = await resend.emails.send({
              from: "Hotel-living.com <contact@hotel-living.com>",
              to: [adminEmail],
              subject: emailData.subject,
              html: emailData.html,
            });
            
            if (emailError) {
              // Check if it's a rate limit error
              if (emailError.name === 'rate_limit_exceeded') {
                retryCount++;
                if (retryCount < maxRetries) {
                  console.log(`Rate limit hit, waiting before retry ${retryCount}/${maxRetries}`);
                  // Wait progressively longer: 2s, 4s, 8s
                  await new Promise(resolve => setTimeout(resolve, 2000 * Math.pow(2, retryCount - 1)));
                  continue;
                } else {
                  console.error("Max retries reached for rate limit, skipping notification");
                  break;
                }
              } else {
                console.error("Error sending email:", emailError);
                break;
              }
            } else {
              emailSent = true;
            }
          } catch (sendError) {
            console.error("Unexpected error sending email:", sendError);
            retryCount++;
            if (retryCount < maxRetries) {
              await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
            }
          }
        }
        
        if (!emailSent) {
          console.error("Failed to send email after retries, skipping notification");
          continue;
        }
        
        // Mark as processed
        const { error: updateError } = await supabase
          .from('admin_notifications')
          .update({ processed_at: new Date().toISOString() })
          .eq('id', notification.id);
        
        if (updateError) {
          console.error("Error updating notification:", updateError);
          continue;
        }
        
        processed++;
        console.log(`Successfully processed notification for ${userEmail}`);
        
        // Add a small delay between notifications to respect rate limits
        if (processed < notifications.length) {
          await new Promise(resolve => setTimeout(resolve, 600)); // 600ms = ~1.6 requests/second
        }
        
      } catch (notificationError) {
        console.error("Error processing individual notification:", notificationError);
        continue;
      }
    }
    
    return new Response(
      JSON.stringify({ success: true, processed, total: notifications.length }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    
  } catch (error: any) {
    console.error("Error in process-admin-notifications:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(serve_handler);