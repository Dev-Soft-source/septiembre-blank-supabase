
import { JoinUsSubmission, JoinUsFile } from "./types.ts";

export function buildEmailHtml(submission: JoinUsSubmission, files: JoinUsFile[]): string {
  let emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>New Join Us Application</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        h2 {
          color: #8017B0;
          border-bottom: 1px solid #eee;
          padding-bottom: 10px;
        }
        .info-section {
          margin-bottom: 20px;
        }
        .label {
          font-weight: bold;
        }
        .files-section {
          background-color: #f9f9f9;
          padding: 15px;
          border-radius: 4px;
          margin-top: 20px;
        }
        a {
          color: #8017B0;
          text-decoration: none;
        }
        a:hover {
          text-decoration: underline;
        }
      </style>
    </head>
    <body>
      <h2>New Join Us Application</h2>
      <div class="info-section">
        <p><span class="label">Name:</span> ${submission.name}</p>
        <p><span class="label">Email:</span> <a href="mailto:${submission.email}">${submission.email}</a></p>
        <p><span class="label">Date:</span> ${new Date(submission.created_at).toLocaleString()}</p>
      </div>
      <div class="info-section">
        <p><span class="label">Message:</span></p>
        <p>${submission.message.replace(/\n/g, '<br>')}</p>
      </div>`;

  if (files && files.length > 0) {
    emailHtml += `
      <div class="files-section">
        <h3>Attached Files:</h3>
        <ul>`;

    for (const file of files) {
      emailHtml += `<li>${file.file_name} (${(file.file_size / 1024).toFixed(1)} KB)</li>`;
    }

    emailHtml += `</ul></div>`;
  }

  emailHtml += `</body></html>`;

  return emailHtml;
}
