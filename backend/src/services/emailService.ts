import nodemailer from 'nodemailer';
import { logger } from '../utils/logger';

interface EmailOptions {
  to:       string;
  subject:  string;
  template: string;
  vars:     Record<string, string>;
}

const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST   ?? 'smtp.gmail.com',
  port:   Number(process.env.SMTP_PORT ?? 587),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const templates: Record<string, (vars: Record<string, string>) => { html: string; text: string }> = {
  welcome: vars => ({
    html: `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#0f172a;color:#f1f5f9;border-radius:16px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#0ea5e9,#0369a1);padding:40px;text-align:center;">
          <h1 style="color:white;font-size:28px;margin:0;">Welcome to Craftpack Solution</h1>
          <p style="color:rgba(255,255,255,0.8);margin-top:8px;">Ethiopia's Premium Packaging Partner</p>
        </div>
        <div style="padding:40px;">
          <p style="font-size:16px;color:#cbd5e1;">Hi ${vars.name},</p>
          <p style="color:#94a3b8;line-height:1.7;">
            Thank you for creating your Craftpack Solution account. Please verify your email address to get started.
          </p>
          <div style="text-align:center;margin:32px 0;">
            <a href="${vars.verifyUrl}" style="display:inline-block;background:#0ea5e9;color:white;padding:14px 32px;border-radius:10px;text-decoration:none;font-weight:600;font-size:15px;">
              Verify Email Address
            </a>
          </div>
          <p style="color:#64748b;font-size:13px;">This link expires in 24 hours. If you didn't create an account, please ignore this email.</p>
        </div>
        <div style="background:#020617;padding:24px;text-align:center;">
          <p style="color:#475569;font-size:12px;margin:0;">© 2024 Craftpack Solution · Addis Ababa, Ethiopia</p>
        </div>
      </div>
    `,
    text: `Welcome ${vars.name}! Verify your email: ${vars.verifyUrl}`,
  }),

  'reset-password': vars => ({
    html: `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#0f172a;color:#f1f5f9;border-radius:16px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#f59e0b,#d97706);padding:40px;text-align:center;">
          <h1 style="color:white;font-size:28px;margin:0;">Reset Your Password</h1>
        </div>
        <div style="padding:40px;">
          <p>Hi ${vars.name},</p>
          <p style="color:#94a3b8;">You requested a password reset. Click the button below:</p>
          <div style="text-align:center;margin:32px 0;">
            <a href="${vars.resetUrl}" style="display:inline-block;background:#f59e0b;color:#0f172a;padding:14px 32px;border-radius:10px;text-decoration:none;font-weight:600;font-size:15px;">
              Reset Password
            </a>
          </div>
          <p style="color:#64748b;font-size:13px;">This link expires in 30 minutes. If you didn't request a reset, please ignore this email.</p>
        </div>
      </div>
    `,
    text: `Reset your password: ${vars.resetUrl}`,
  }),

  'order-confirmed': vars => ({
    html: `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#0f172a;color:#f1f5f9;border-radius:16px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#10b981,#059669);padding:40px;text-align:center;">
          <h1 style="color:white;">Order Confirmed! 🎉</h1>
          <p style="color:rgba(255,255,255,0.8);">Order #${vars.orderNumber}</p>
        </div>
        <div style="padding:40px;">
          <p>Hi ${vars.name},</p>
          <p style="color:#94a3b8;">Your order has been confirmed and is being prepared for production. Estimated delivery: ${vars.estimatedDelivery}.</p>
          <p><strong>Total: ${vars.total}</strong></p>
          <div style="text-align:center;margin:24px 0;">
            <a href="${vars.orderUrl}" style="display:inline-block;background:#10b981;color:white;padding:14px 32px;border-radius:10px;text-decoration:none;font-weight:600;">
              Track Your Order
            </a>
          </div>
        </div>
      </div>
    `,
    text: `Order ${vars.orderNumber} confirmed. Track at ${vars.orderUrl}`,
  }),

  'quote-received': vars => ({
    html: `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#0f172a;color:#f1f5f9;border-radius:16px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#6366f1,#4f46e5);padding:40px;text-align:center;">
          <h1 style="color:white;">Quote Request Received</h1>
        </div>
        <div style="padding:40px;">
          <p>Hi ${vars.name},</p>
          <p style="color:#94a3b8;">We've received your quote request and our team will respond within 24 hours.</p>
          <p>Reference: <strong>${vars.quoteId}</strong></p>
        </div>
      </div>
    `,
    text: `Quote received. Ref: ${vars.quoteId}. We'll respond within 24 hours.`,
  }),
};

export async function sendEmail({ to, subject, template, vars }: EmailOptions): Promise<void> {
  const tmpl = templates[template];
  if (!tmpl) {
    logger.warn(`Email template '${template}' not found`);
    return;
  }

  const { html, text } = tmpl(vars);

  try {
    await transporter.sendMail({
      from:    `"Craftpack Solution" <${process.env.SMTP_FROM ?? 'noreply@craftpacksolution.com'}>`,
      to,
      subject,
      html,
      text,
    });
    logger.info(`Email sent to ${to}: ${subject}`);
  } catch (err) {
    logger.error(`Failed to send email to ${to}:`, err);
    throw err;
  }
}
