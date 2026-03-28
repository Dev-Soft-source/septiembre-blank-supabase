import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BookingCommissionRecord {
  id: string;
  booking_id: string;
  referred_by: string;
  commission_usd: number;
  commission_percent: number; // stored as decimal (e.g., 0.04)
  created_at?: string;
}

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  let record: BookingCommissionRecord | null = null;
  let statusCode = 500;
  let responseId: string | null = null;

  try {
    const payload = await req.json();
    record = payload?.record as BookingCommissionRecord;

    if (!record || !record.id || !record.booking_id) {
      return new Response(
        JSON.stringify({ error: "Invalid payload: missing record data" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!RESEND_API_KEY) {
      throw new Error("Missing RESEND_API_KEY");
    }

    // Build email content
    const recipient = "grand_soiree@yahoo.com";
    const percentDisplay = (record.commission_percent * 100).toFixed(2) + "%";
    const amountDisplay = `$${Number(record.commission_usd).toFixed(2)}`;

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>New Booking Commission Created</h2>
        <p>A new commission has been generated. Details below:</p>
        <table cellpadding="6" cellspacing="0" border="0" style="border-collapse: collapse;">
          <tr><td><strong>Booking ID:</strong></td><td>${record.booking_id}</td></tr>
          <tr><td><strong>Commission ID:</strong></td><td>${record.id}</td></tr>
          <tr><td><strong>Referred By:</strong></td><td>${record.referred_by || "N/A"}</td></tr>
          <tr><td><strong>Commission USD:</strong></td><td>${amountDisplay}</td></tr>
          <tr><td><strong>Commission Percent:</strong></td><td>${percentDisplay}</td></tr>
          <tr><td><strong>Created At:</strong></td><td>${record.created_at || new Date().toISOString()}</td></tr>
        </table>
      </div>
    `;

    // Send email via Resend (using fetch to avoid external deps)
    const emailPayload = {
      from: "Hotel Living <contact@hotel-living.com>",
      to: recipient,
      subject: `New Booking Commission: ${record.booking_id}`,
      html: emailHtml,
    };

    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailPayload),
    });

    statusCode = emailRes.status;

    if (!emailRes.ok) {
      const errText = await emailRes.text();
      throw new Error(`Resend API error: ${emailRes.status} ${errText}`);
    }

    const emailJson = await emailRes.json();
    responseId = emailJson?.id ?? null;

    // Log notification result to DB (service role bypasses RLS)
    if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
      await supabase.from("commission_notification_logs").insert({
        booking_id: record.booking_id,
        booking_commission_id: record.id,
        recipient_email: recipient,
        referred_by: record.referred_by,
        commission_usd: record.commission_usd,
        status_code: statusCode,
        response_id: responseId,
      });
    }

    return new Response(
      JSON.stringify({ success: true, emailId: responseId }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error) {
    console.error("[notify-admin-commission-created] Error:", error);

    // Best-effort logging of failure
    try {
      if (record && SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
        await supabase.from("commission_notification_logs").insert({
          booking_id: record.booking_id,
          booking_commission_id: record.id,
          recipient_email: "grand_soiree@yahoo.com",
          referred_by: record.referred_by,
          commission_usd: record.commission_usd,
          status_code: statusCode || 500,
          response_id: responseId,
        });
      }
    } catch (logErr) {
      console.error("[notify-admin-commission-created] Failed to log error:", logErr);
    }

    return new Response(
      JSON.stringify({ success: false, error: (error as Error).message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
