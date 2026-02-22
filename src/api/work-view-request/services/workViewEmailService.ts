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
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;',
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * Send a "Private Viewing Access Request" notification email via AWS SES.
 */
export async function sendWorkViewRequestEmail(data: {
    name: string;
    email: string;
    workName: string;
    message?: string;
}) {
    const { name, email, workName, message } = data;

    const recipientEmail = process.env.RECIPIENT_EMAIL || process.env.FROM_EMAIL || 'recipient@example.com';
    const fromEmail = process.env.FROM_EMAIL || 'noreply@example.com';
    const companyName = process.env.COMPANY_NAME || 'Shadowine';
    const companyAddress = process.env.COMPANY_ADDRESS || '';
    const websiteUrl = process.env.WEBSITE_URL || '#';
    const privacyPolicyUrl = process.env.PRIVACY_POLICY_URL || '#';
    const dashboardUrl = process.env.DASHBOARD_URL || '#';

    const emailSubject = `Private Work View Request — ${workName} from ${name}`;

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
      .header h1 { margin: 0 0 8px; font-size: 22px; color: white; }
      .header p { margin: 0; font-size: 14px; color: #aaa; letter-spacing: 0.5px; }
      .badge { display: inline-block; background: #ffffff18; border: 1px solid #ffffff30; border-radius: 20px; padding: 4px 14px; font-size: 13px; color: #e0e0e0; margin-top: 12px; }
      .body { padding: 30px 20px; }
      .greeting { margin-bottom: 25px; font-size: 16px; color: #333; }
      .work-highlight { background: #f5f5f5; border-left: 4px solid #0a0a0a; border-radius: 4px; padding: 14px 18px; margin-bottom: 28px; font-size: 15px; }
      .work-highlight span { font-weight: bold; color: #0a0a0a; }
      .details-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
      .details-table tr { border-bottom: 1px solid #e0e0e0; }
      .details-table tr:last-child { border-bottom: none; }
      .details-table td { padding: 14px 0; vertical-align: top; }
      .detail-label { font-weight: normal; color: #6c757d; text-transform: uppercase; font-size: 11px; letter-spacing: 0.6px; width: 30%; padding-right: 20px; }
      .detail-value { color: #333; font-size: 15px; width: 70%; }
      .detail-value a { color: #007bff; text-decoration: underline; }
      .action-note { background: #fffbea; border: 1px solid #ffe58f; border-radius: 6px; padding: 14px 18px; font-size: 14px; color: #7d6608; margin-bottom: 28px; }
      .button-container { text-align: center; margin: 28px 0; }
      .button { display: inline-block; background-color: #0a0a0a; color: #ffffff !important; padding: 12px 32px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 15px; }
      .footer { background-color: #f8f8f8; padding: 28px 20px; text-align: center; border-top: 1px solid #e0e0e0; }
      .company-name { font-weight: bold; font-size: 15px; margin-bottom: 8px; color: #333; }
      .company-address { font-size: 13px; color: #666; margin-bottom: 14px; }
      .disclaimer { font-size: 12px; color: #666; margin-bottom: 16px; }
      .footer-links a { color: #007bff; text-decoration: none; font-size: 13px; margin: 0 10px; }
      .footer-links span { color: #999; }
      .copyright { font-size: 11px; color: #999; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 14px; }
    </style>
  </head>
  <body>
    <div class="email-wrapper">
      <div class="header">
        <h1>Private Viewing Access Request</h1>
        <p>Someone wants to view restricted work</p>
        <div class="badge">🔒 Private Work</div>
      </div>

      <div class="body">
        <div class="greeting">
          Hello Team,<br><br>
          A visitor has requested private viewing access for one of your works.
          Please review their details and decide whether to grant access.
        </div>

        <div class="work-highlight">
          Requested Work: <span>${escapeHtml(workName)}</span>
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
          ${message ? `
          <tr>
            <td class="detail-label">MESSAGE</td>
            <td class="detail-value">${escapeHtml(message).replace(/\n/g, '<br>')}</td>
          </tr>` : ''}
        </table>

        <div class="action-note">
          ⚡ Reply directly to this email to share the secure viewing link, or manage this request in the dashboard.
        </div>

        <div class="button-container">
          <a href="${escapeHtml(dashboardUrl)}" class="button">View in Dashboard</a>
        </div>
      </div>

      <div class="footer">
        <div class="company-name">${escapeHtml(companyName)}</div>
        ${companyAddress ? `<div class="company-address">${escapeHtml(companyAddress)}</div>` : ''}
        <div class="disclaimer">This notification was triggered by a private work access request on your website.</div>
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
Private Viewing Access Request

Hello Team,

A visitor has requested private viewing access for one of your works.

REQUESTED WORK: ${workName}
NAME: ${name}
EMAIL: ${email}
${message ? `MESSAGE:\n${message}` : ''}

Reply directly to this email to share the secure viewing link, or manage in the dashboard.

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
        return await sesClient.send(command);
    } catch (error: any) {
        console.error('SES Error (work-view-request):', error);
        throw new Error(`Failed to send email: ${error.message}`);
    }
}
