/**
 * Email Service
 *
 * Handles sending emails through various providers
 */

import { emailTemplates, EmailTemplateType } from "./email-templates";

interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

interface SendTemplateEmailOptions {
  to: string | string[];
  template: EmailTemplateType;
  data: Record<string, any>;
  subject: string;
}

class EmailService {
  private from: string;
  private enabled: boolean;

  constructor() {
    // Default from address
    this.from = process.env.EMAIL_FROM || "notifications@wavelaunchstudio.com";

    // Email is enabled if provider is configured
    this.enabled = this.isConfigured();
  }

  /**
   * Check if email service is properly configured
   */
  private isConfigured(): boolean {
    // Check for various email provider configurations
    const hasResend = !!process.env.RESEND_API_KEY;
    const hasSendGrid = !!process.env.SENDGRID_API_KEY;
    const hasSmtp = !!(
      process.env.SMTP_HOST &&
      process.env.SMTP_PORT &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS
    );

    return hasResend || hasSendGrid || hasSmtp;
  }

  /**
   * Send an email using the configured provider
   */
  async sendEmail({ to, subject, html, text, from }: EmailOptions): Promise<boolean> {
    try {
      // If email service is not configured, log to console (development mode)
      if (!this.enabled) {
        console.log("📧 Email (Development Mode):");
        console.log("  To:", to);
        console.log("  Subject:", subject);
        console.log("  From:", from || this.from);
        console.log("  HTML Length:", html.length, "characters");

        // In development, we consider it "sent"
        return true;
      }

      // Production: Use configured email provider
      const provider = this.getProvider();

      switch (provider) {
        case "resend":
          return await this.sendViaResend({ to, subject, html, text, from });
        case "sendgrid":
          return await this.sendViaSendGrid({ to, subject, html, text, from });
        case "smtp":
          return await this.sendViaSmtp({ to, subject, html, text, from });
        default:
          console.warn("No email provider configured");
          return false;
      }
    } catch (error) {
      console.error("Failed to send email:", error);
      return false;
    }
  }

  /**
   * Send an email using a template
   */
  async sendTemplateEmail({
    to,
    template,
    data,
    subject,
  }: SendTemplateEmailOptions): Promise<boolean> {
    try {
      const templateFn = emailTemplates[template];
      if (!templateFn) {
        throw new Error(`Template "${template}" not found`);
      }

      const html = templateFn(data);

      return await this.sendEmail({
        to,
        subject,
        html,
      });
    } catch (error) {
      console.error("Failed to send template email:", error);
      return false;
    }
  }

  /**
   * Get the configured email provider
   */
  private getProvider(): "resend" | "sendgrid" | "smtp" | null {
    if (process.env.RESEND_API_KEY) return "resend";
    if (process.env.SENDGRID_API_KEY) return "sendgrid";
    if (process.env.SMTP_HOST) return "smtp";
    return null;
  }

  /**
   * Send email via Resend
   */
  private async sendViaResend(options: EmailOptions): Promise<boolean> {
    try {
      const { Resend } = await import('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);

      const { data, error } = await resend.emails.send({
        from: options.from || this.from,
        to: Array.isArray(options.to) ? options.to : [options.to],
        subject: options.subject,
        html: options.html,
        text: options.text,
      });

      if (error) {
        console.error('Resend error:', error);
        return false;
      }

      console.log('Email sent via Resend:', data?.id);
      return true;
    } catch (error) {
      console.error('Resend send error:', error);
      return false;
    }
  }

  /**
   * Send email via SendGrid
   */
  private async sendViaSendGrid(options: EmailOptions): Promise<boolean> {
    try {
      const sgMail = await import('@sendgrid/mail');
      sgMail.default.setApiKey(process.env.SENDGRID_API_KEY || '');

      await sgMail.default.send({
        to: options.to,
        from: options.from || this.from,
        subject: options.subject,
        html: options.html,
        text: options.text,
      });

      console.log('Email sent via SendGrid');
      return true;
    } catch (error) {
      console.error('SendGrid send error:', error);
      return false;
    }
  }

  /**
   * Send email via SMTP
   */
  private async sendViaSmtp(options: EmailOptions): Promise<boolean> {
    // Implementation for SMTP
    // Install: npm install nodemailer
    // import nodemailer from 'nodemailer';

    console.log("Sending via SMTP:", options.subject);

    // Placeholder - would use nodemailer
    // const transporter = nodemailer.createTransport({
    //   host: process.env.SMTP_HOST,
    //   port: parseInt(process.env.SMTP_PORT || '587'),
    //   secure: process.env.SMTP_SECURE === 'true',
    //   auth: {
    //     user: process.env.SMTP_USER,
    //     pass: process.env.SMTP_PASS,
    //   },
    // });

    // await transporter.sendMail({
    //   from: options.from || this.from,
    //   to: options.to,
    //   subject: options.subject,
    //   html: options.html,
    //   text: options.text,
    // });

    return true;
  }

  /**
   * Send bulk emails (with rate limiting)
   */
  async sendBulkEmails(
    emails: SendTemplateEmailOptions[]
  ): Promise<{ sent: number; failed: number }> {
    let sent = 0;
    let failed = 0;

    for (const email of emails) {
      const success = await this.sendTemplateEmail(email);
      if (success) {
        sent++;
      } else {
        failed++;
      }

      // Rate limiting: wait 100ms between emails
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    return { sent, failed };
  }

  /**
   * Check if email service is enabled
   */
  isEnabled(): boolean {
    return this.enabled;
  }
}

// Export singleton instance
export const emailService = new EmailService();

/**
 * Helper function to send notification emails
 */
export async function sendNotificationEmail(
  userId: string,
  template: EmailTemplateType,
  data: Record<string, any>,
  subject: string
): Promise<boolean> {
  try {
    // In a real implementation, fetch user's email and preferences
    // For now, this is a placeholder
    const userEmail = data.recipientEmail || "user@example.com";

    return await emailService.sendTemplateEmail({
      to: userEmail,
      template,
      data,
      subject,
    });
  } catch (error) {
    console.error("Failed to send notification email:", error);
    return false;
  }
}
