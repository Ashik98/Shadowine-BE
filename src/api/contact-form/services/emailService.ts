import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const sesClient = new SESClient({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
});

function escapeHtml(text: string): string {
    const map: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * Send a contact form email via AWS SES.
 */
export async function sendEmail(data: {
    name: string;
    email: string;
    phone?: string;
    message: string;
    subject?: string;
}) {
    const { name, email, phone, message, subject: formSubject } = data;

    const recipientEmail = process.env.RECIPIENT_EMAIL || process.env.FROM_EMAIL || 'recipient@example.com';
    const fromEmail = process.env.FROM_EMAIL || 'noreply@example.com';

    const companyName = process.env.COMPANY_NAME || 'Shadowine';
    const companyAddress = process.env.COMPANY_ADDRESS || '';
    const websiteUrl = process.env.WEBSITE_URL || '#';
    const privacyPolicyUrl = process.env.PRIVACY_POLICY_URL || '#';
    const dashboardUrl = process.env.DASHBOARD_URL || '#';

    const emailSubject = `New Contact Form Submission from ${name}`;
    const displaySubject = formSubject || phone || 'N/A';

    const htmlBody = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f0f4f8; margin: 0; padding: 20px; }
      .email-wrapper { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
      .header { background-color: #0a0a0a; color: white; padding: 30px 20px; text-align: center; }
      .header h1 { margin: 0; font-size: 24px; color: white; }
      .body { padding: 30px 20px; }
      .greeting { margin-bottom: 25px; font-size: 16px; }
      .details-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
      .details-table tr { border-bottom: 1px solid #e0e0e0; }
      .details-table tr:last-child { border-bottom: none; }
      .details-table td { padding: 15px 0; vertical-align: top; }
      .detail-label { font-weight: normal; color: #6c757d; text-transform: uppercase; font-size: 12px; letter-spacing: 0.5px; width: 30%; padding-right: 20px; }
      .detail-value { color: #333; font-size: 16px; width: 70%; }
      .detail-value a { color: #007bff; text-decoration: underline; }
      .button-container { text-align: center; margin: 30px 0; }
      .button { display: inline-block; background-color: #0a0a0a; color: #ffffff !important; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 16px; }
      .footer { background-color: #f8f8f8; padding: 30px 20px; text-align: center; border-top: 1px solid #e0e0e0; }
      .company-name { font-weight: bold; font-size: 16px; margin-bottom: 10px; color: #333; }
      .company-address { font-size: 14px; color: #666; margin-bottom: 15px; }
      .disclaimer { font-size: 12px; color: #666; margin-bottom: 20px; }
      .footer-links a { color: #007bff; text-decoration: none; font-size: 14px; margin: 0 10px; }
      .footer-links span { color: #999; margin: 0 5px; }
      .copyright { font-size: 11px; color: #999; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 15px; }
    </style>
  </head>
  <body>
    <div class="email-wrapper">
      <div class="header">
        <h1>New Contact Form Submission</h1>
      </div>
      <div class="body">
        <div class="greeting">
          Hello Team,<br><br>
          You have received a new message from the website contact form.<br>
          Below are the details of the submission:
        </div>
        <table class="details-table">
          <tr>
            <td class="detail-label">NAME</td>
            <td class="detail-value">${escapeHtml(name)}</td>
          </tr>
          <tr>
            <td class="detail-label">EMAIL</td>
            <td class="detail-value"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td>
          </tr>
          <tr>
            <td class="detail-label">SUBJECT</td>
            <td class="detail-value">${escapeHtml(displaySubject)}</td>
          </tr>
          <tr>
            <td class="detail-label">MESSAGE</td>
            <td class="detail-value">${escapeHtml(message).replace(/\n/g, '<br>')}</td>
          </tr>
        </table>
        <div class="button-container">
          <a href="${escapeHtml(dashboardUrl)}" class="button">View in Dashboard</a>
        </div>
      </div>
      <div class="footer">
        <div class="company-name">${escapeHtml(companyName)}</div>
        ${companyAddress ? `<div class="company-address">${escapeHtml(companyAddress)}</div>` : ''}
        <div class="disclaimer">You are receiving this because a form was submitted on your website.</div>
        <div class="footer-links">
          <a href="${escapeHtml(websiteUrl)}">Visit Website</a>
          <span>•</span>
          <a href="${escapeHtml(privacyPolicyUrl)}">Privacy Policy</a>
        </div>
        <div class="copyright">&copy; ${new Date().getFullYear()} ${escapeHtml(companyName.toUpperCase())}. ALL RIGHTS RESERVED.</div>
      </div>
    </div>
  </body>
</html>`;

    const textBody = `
New Contact Form Submission

Hello Team,

You have received a new message from the website contact form.

NAME: ${name}
EMAIL: ${email}
SUBJECT: ${displaySubject}
MESSAGE:
${message}

---
${companyName}
${companyAddress}
    `.trim();

    const params = {
        Source: fromEmail,
        Destination: { ToAddresses: [recipientEmail] },
        Message: {
            Subject: { Data: emailSubject, Charset: 'UTF-8' },
            Body: {
                Html: { Data: htmlBody, Charset: 'UTF-8' },
                Text: { Data: textBody, Charset: 'UTF-8' },
            },
        },
        ReplyToAddresses: [email],
    };

    try {
        const command = new SendEmailCommand(params);
        const result = await sesClient.send(command);
        return result;
    } catch (error: any) {
        console.error('SES Error:', error);
        throw new Error(`Failed to send email: ${error.message}`);
    }
}
