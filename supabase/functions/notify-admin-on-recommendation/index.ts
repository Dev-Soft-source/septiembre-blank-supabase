import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const payload = await req.json();
    const record = payload?.record ?? {};
    const referralId = record?.id;
    const hotelName = record?.hotel_name ?? 'Unknown Hotel';
    const userId = record?.user_id ?? null;

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY environment variable is not set");

    const adminEmail = "grand_soiree@yahoo.com";
    const preferredFrom = Deno.env.get("RESEND_FROM_EMAIL") || "Hotel Living <contact@hotel-living.com>";
    const fallbackFrom = "Lovable <onboarding@resend.dev>";

    // Dedupe per user + event
    const event = 'hotel_recommended';
    if (userId) {
      const { error: dedupeErr } = await supabaseAdmin
        .from('admin_notification_events')
        .insert({ user_id: userId, event });
      if (dedupeErr) {
        const msg = dedupeErr.message || '';
        if (dedupeErr.code === '23505' || msg.includes('duplicate')) {
          console.log('DEDUPE_SKIP', { user_id: userId, event, referralId });
          return new Response(JSON.stringify({ success: true, message: 'DEDUPE_SKIP' }), {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        throw dedupeErr;
      }
    } else {
      console.warn('Missing user_id on hotel recommendation; proceeding without dedupe', { referralId });
    }

    // Fetch profile and email for logging
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('first_name, last_name, role')
      .eq('id', userId)
      .maybeSingle();
    const { data: authUserRes } = userId ? await supabaseAdmin.auth.admin.getUserById(userId) : { data: null } as any;
    const recommenderEmail = authUserRes?.user?.email ?? 'unknown';
    const role = profile?.role ?? 'user';
    const userName = profile?.first_name
      ? `${profile.first_name} ${profile.last_name || ''}`.trim()
      : (userId || 'Unknown User');

    console.log('ADMIN_NOTIFY_PREP', {
      recipient: adminEmail,
      role,
      email: recommenderEmail,
      event,
      referralId,
      userId,
    });

    const html = `
      <h2>New Hotel Recommendation</h2>
      <p><strong>Hotel Name:</strong> ${hotelName}</p>
      <p><strong>Referral ID:</strong> ${referralId}</p>
      <p><strong>Submitted By:</strong> ${userName} (${recommenderEmail})</p>
      <p><strong>User Role:</strong> ${role}</p>
      <p><strong>Submitted At:</strong> ${new Date().toLocaleString()}</p>
    `;

    const sendViaResend = async (from: string) => {
      const resp = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${RESEND_API_KEY}` },
        body: JSON.stringify({ from, to: adminEmail, subject: `Hotel recommendation: ${hotelName}`, html })
      });
      let json: any = null; try { json = await resp.json(); } catch (_) {}
      return { resp, json };
    };

    const first = await sendViaResend(preferredFrom);
    console.log('Resend status (preferred):', first.resp.status);
    if (!first.resp.ok) {
      console.warn('Preferred sender failed, retrying with fallback...', first.json);
      const second = await sendViaResend(fallbackFrom);
      console.log('Resend status (fallback):', second.resp.status);
      console.log('Admin notification (fallback) result:', second.json);
      if (!second.resp.ok) throw new Error(`Resend failed fallback: ${JSON.stringify(second.json)}`);
      console.log('RESEND_DELIVERED (fallback)', second.json?.id ?? second.json);
    } else {
      console.log('Admin notification result:', first.json);
      console.log('RESEND_DELIVERED', first.json?.id ?? first.json);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error('Error in notify-admin-on-recommendation:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal error' }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
