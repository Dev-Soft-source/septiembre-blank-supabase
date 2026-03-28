
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { parseJoinUsPayload } from "./parseJoinUsPayload.ts";
import { processFiles } from "./fileProcessor.ts";
import { buildEmailHtml } from "./buildNotificationMessage.ts";
import { sendEmailNotification } from "./sendNotification.ts";
import { logNotificationResult } from "./utils.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse the payload and get submission data
    const { submission, supabase } = await parseJoinUsPayload(req);

    // Process files and prepare attachments
    const { files, attachments } = await processFiles(supabase, submission.id);

    // Build email HTML content
    const emailHtml = buildEmailHtml(submission, files);

    // Send email notification
    const emailResult = await sendEmailNotification(submission, emailHtml, attachments);

    // Log success
    await logNotificationResult(
      submission.id,
      submission.recipient_email,
      'success',
      `Email sent with ID: ${emailResult.id}. Attachments: ${attachments.length}`
    );

    console.log("[" + new Date().toISOString() + "] === EMAIL NOTIFICATION PROCESS COMPLETED SUCCESSFULLY ===");

    return new Response(JSON.stringify({ success: true, emailId: emailResult.id }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error) {
    console.error("[" + new Date().toISOString() + "] Error in send-join-us-notification:", error);

    // Log error to database if possible
    let submissionId = 'unknown';
    try {
      const payload = await req.clone().json();
      submissionId = payload.record?.id || 'unknown';
    } catch {
      // Failed to parse request again, use unknown
    }
    
    await logNotificationResult(
      submissionId,
      'unknown',
      'error',
      error instanceof Error ? error.message : String(error)
    );

    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : String(error) 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
