
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { JoinUsSubmission } from "./types.ts";

export async function parseJoinUsPayload(req: Request) {
  console.log("[" + new Date().toISOString() + "] === STARTING EMAIL NOTIFICATION PROCESS ===");

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  const payload = await req.json();
  console.log("[" + new Date().toISOString() + "] Processing payload");

  const submission = payload.record as JoinUsSubmission;
  console.log("[" + new Date().toISOString() + "] Processing submission ID:", submission.id);

  // Initialize Supabase client with service role key
  const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

  // Log notification attempt
  console.log("[" + new Date().toISOString() + "] Logging notification attempt...");
  const { error: logError } = await supabase
    .from('notification_logs')
    .insert({
      submission_id: submission.id,
      recipient_email: submission.recipient_email,
      notification_type: 'join_us_submission',
      status: 'attempting'
    });

  if (logError) {
    console.error("[" + new Date().toISOString() + "] Failed to log notification attempt:", logError);
  }

  return { submission, supabase };
}
