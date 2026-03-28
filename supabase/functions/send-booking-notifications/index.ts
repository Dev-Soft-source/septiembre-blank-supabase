import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";
import { 
  getUserLanguage, 
  getBookingCreatedTemplate, 
  getBookingCancelledTemplate, 
  generateEmailHtml,
  type SupportedLanguage
} from "../_shared/emailTemplates.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "https://pgdzrvdwgoomjnnegkcn.supabase.co";
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload = await req.json();
    // Expect shape similar to Postgres trigger http_post: { type, table, schema, record, old_record? }
    const eventType: string = payload?.type || "";
    const record = payload?.record || {};

    const bookingId: string = record?.id;
    const userId: string | null = record?.user_id ?? null;
    const hotelId: string | null = record?.hotel_id ?? null;
    const checkIn: string | undefined = record?.check_in || record?.checkIn;
    const checkOut: string | undefined = record?.check_out || record?.checkOut;
    const totalPriceUsd: number | undefined = record?.total_price;
    const status: string | undefined = record?.status;

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    // Fetch guest email
    let guestEmail: string | null = null;
    if (userId) {
      const { data: authUser, error: authErr } = await supabase.auth.admin.getUserById(userId);
      if (authErr) console.warn("BOOKING_NOTIFY: error fetching user email", authErr);
      guestEmail = authUser?.user?.email ?? null;
    }

    // Fetch hotel email and name
    let hotelEmail: string | null = null;
    let hotelName: string | undefined = undefined;
    if (hotelId) {
      const { data: hotelRow, error: hotelErr } = await supabase
        .from('hotels')
        .select('contact_email, name')
        .eq('id', hotelId)
        .maybeSingle();
      if (hotelErr) console.warn("BOOKING_NOTIFY: error fetching hotel email", hotelErr);
      hotelEmail = (hotelRow as any)?.contact_email ?? null;
      hotelName = (hotelRow as any)?.name ?? undefined;
    }

    // Determine preferred language for guest (from profile or default en)
    let lang: SupportedLanguage = 'en';
    if (userId) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('preferred_language')
        .eq('id', userId)
        .maybeSingle();
      lang = getUserLanguage((profile as any)?.preferred_language);
    }

    const isCancellation = eventType === 'UPDATE' && status === 'cancelled';

    // Build email contents
    const params = { bookingId, checkIn, checkOut, totalPriceUsd, hotelName } as const;
    const guestTemplate = isCancellation 
      ? getBookingCancelledTemplate(lang, params)
      : getBookingCreatedTemplate(lang, params);

    // Hotels likely prefer English by default; but try to match guest language
    const hotelTemplate = isCancellation 
      ? getBookingCancelledTemplate(lang, params)
      : getBookingCreatedTemplate(lang, params);

    const guestHtml = generateEmailHtml(guestTemplate);
    const hotelHtml = generateEmailHtml(hotelTemplate);

    const from = "Hotel Living <contact@hotel-living.com>";
    const results: any[] = [];

    if (guestEmail) {
      const { data, error } = await resend.emails.send({
        from,
        to: [guestEmail],
        subject: guestTemplate.subject,
        html: guestHtml,
      });
      results.push({ target: 'guest', ok: !error, data, error });
    }

    if (hotelEmail) {
      const { data, error } = await resend.emails.send({
        from,
        to: [hotelEmail],
        subject: hotelTemplate.subject,
        html: hotelHtml,
      });
      results.push({ target: 'hotel', ok: !error, data, error });
    }

    console.log('BOOKING_NOTIFY_RESULTS', { bookingId, isCancellation, results });

    return new Response(JSON.stringify({ success: true, bookingId }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error in send-booking-notifications:', error);
    return new Response(JSON.stringify({ error: error?.message || 'Internal error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});