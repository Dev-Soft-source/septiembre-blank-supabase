
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export async function logNotificationResult(
  submissionId: string,
  recipientEmail: string,
  status: 'success' | 'error',
  details: string
): Promise<void> {
  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
      
      await supabase
        .from('notification_logs')
        .insert({
          submission_id: submissionId,
          recipient_email: recipientEmail,
          notification_type: 'join_us_submission',
          status,
          details
        });
    }
  } catch (logError) {
    console.error("[" + new Date().toISOString() + "] Failed to log notification result:", logError);
  }
}
