import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '../.env') });
dotenv.config();

export interface EmailSendResult {
  success: boolean;
  provider: 'resend' | 'sendgrid' | 'smtp' | 'none';
  requestId?: string;
  error?: string;
}

/**
 * Send transactional Email OTP via Resend API, SendGrid API, or SMTP
 * Never log actual OTP digits or API credentials.
 */
export async function sendEmailOtp(email: string, otp: string): Promise<EmailSendResult> {
  const normalizedEmail = email.trim().toLowerCase();
  console.log(`[EMAIL OTP] Request received for: ${normalizedEmail}`);

  const resendKey = process.env.RESEND_API_KEY?.trim();
  const sendgridKey = process.env.SENDGRID_API_KEY?.trim();
  const smtpHost = process.env.SMTP_HOST?.trim();
  const smtpUser = process.env.SMTP_USER?.trim();
  const smtpPass = process.env.SMTP_PASSWORD?.trim();
  const fromEmail = process.env.FROM_EMAIL?.trim() || 'Aura AI <noreply@auraai.app>';

  const subject = 'Your Aura AI verification code';
  const textBody = `Your Aura AI verification code is:\n\n${otp}\n\nThis code expires in 10 minutes.\n\nIf you did not request this code, you can ignore this email.`;
  const htmlBody = `
    <div style="font-family: Arial, sans-serif; background-color: #04040a; color: #ffffff; padding: 32px; border-radius: 16px; max-width: 500px; margin: 0 auto;">
      <h2 style="color: #ec4899; margin-top: 0;">Aura AI Verification</h2>
      <p style="color: #d1d5db; font-size: 16px;">Your 6-digit verification code is:</p>
      <div style="background-color: #111827; border: 1px solid #ec4899; border-radius: 12px; padding: 16px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #38bdf8; margin: 24px 0;">
        ${otp}
      </div>
      <p style="color: #9ca3af; font-size: 14px;">This code expires in 10 minutes.</p>
      <p style="color: #6b7280; font-size: 12px; margin-bottom: 0;">If you did not request this code, you can safely ignore this email.</p>
    </div>
  `;

  // 1. RESEND API PROVIDER
  if (resendKey) {
    console.log('[EMAIL OTP] Provider selected: Resend API');
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromEmail.includes('<') ? fromEmail : `Aura AI <${fromEmail}>`,
          to: [normalizedEmail],
          subject: subject,
          text: textBody,
          html: htmlBody,
        }),
      });

      const responseData = await response.json().catch(() => ({}));
      console.log(`[EMAIL OTP] Provider response status: ${response.status}`);

      if (response.ok) {
        console.log(`[EMAIL OTP] Delivery accepted. Request ID: ${responseData.id || 'resend_ok'}`);
        return {
          success: true,
          provider: 'resend',
          requestId: responseData.id || 'resend_ok',
        };
      } else {
        const errMsg = responseData.message || responseData.error || `HTTP ${response.status}`;
        console.error(`[EMAIL OTP] Delivery failed. Provider status: ${response.status}, Error: ${errMsg}`);
        return {
          success: false,
          provider: 'resend',
          error: errMsg,
        };
      }
    } catch (err: any) {
      console.error('[EMAIL OTP] Resend API request exception:', err?.message || err);
      return {
        success: false,
        provider: 'resend',
        error: err?.message || 'Resend API network request failed',
      };
    }
  }

  // 2. SENDGRID API PROVIDER
  if (sendgridKey) {
    console.log('[EMAIL OTP] Provider selected: SendGrid API');
    try {
      const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${sendgridKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: normalizedEmail }] }],
          from: { email: fromEmail.includes('<') ? fromEmail.replace(/.*<|>/g, '') : fromEmail, name: 'Aura AI' },
          subject: subject,
          content: [
            { type: 'text/plain', value: textBody },
            { type: 'text/html', value: htmlBody },
          ],
        }),
      });

      console.log(`[EMAIL OTP] Provider response status: ${response.status}`);
      if (response.status >= 200 && response.status < 300) {
        const msgId = response.headers.get('x-message-id') || 'sendgrid_ok';
        console.log(`[EMAIL OTP] Delivery accepted. Request ID: ${msgId}`);
        return {
          success: true,
          provider: 'sendgrid',
          requestId: msgId,
        };
      } else {
        const errText = await response.text().catch(() => '');
        console.error(`[EMAIL OTP] Delivery failed. Provider status: ${response.status}, Error: ${errText}`);
        return {
          success: false,
          provider: 'sendgrid',
          error: errText || `SendGrid error HTTP ${response.status}`,
        };
      }
    } catch (err: any) {
      console.error('[EMAIL OTP] SendGrid API request exception:', err?.message || err);
      return {
        success: false,
        provider: 'sendgrid',
        error: err?.message || 'SendGrid API request failed',
      };
    }
  }

  // 3. SMTP PROVIDER
  if (smtpHost && smtpUser && smtpPass) {
    console.log('[EMAIL OTP] Provider selected: SMTP');
    // Note: Standard SMTP requires nodemailer socket transport
    console.warn('[EMAIL OTP] SMTP configuration detected, but Nodemailer transport package is not installed.');
  }

  // NO CONFIG TRANSACTIONAL EMAIL PROVIDER AVAILABLE
  console.warn('[EMAIL OTP] Delivery failed: No email provider configuration found (RESEND_API_KEY, SENDGRID_API_KEY, or SMTP credentials).');
  return {
    success: false,
    provider: 'none',
    error: 'No transactional email provider credentials configured on server environment.',
  };
}
