
import { JoinUsSubmission, ProcessedFile } from "./types.ts";

export async function sendEmailNotification(
  submission: JoinUsSubmission, 
  emailHtml: string, 
  attachments: ProcessedFile[]
): Promise<any> {
  const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
  
  if (!RESEND_API_KEY) {
    throw new Error("Missing RESEND_API_KEY");
  }

  console.log("[" + new Date().toISOString() + "] Email content prepared, attachments:", attachments.length);

  // Send email via Resend
  console.log("[" + new Date().toISOString() + "] Sending email to:", submission.recipient_email);

  const emailPayload = {
    from: "Hotel Living <contact@hotel-living.com>", // Updated to use verified domain
    to: submission.recipient_email,
    reply_to: submission.email,
    subject: `New Join Us Application: ${submission.name}`,
    html: emailHtml,
    ...(attachments.length > 0 && { attachments })
  };

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(emailPayload),
  });

  console.log("[" + new Date().toISOString() + "] Resend API response status:", response.status);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Resend API error: ${response.status} ${errorText}`);
  }

  const emailResult = await response.json();
  console.log("[" + new Date().toISOString() + "] ✅ Email successfully sent:", emailResult);

  return emailResult;
}
