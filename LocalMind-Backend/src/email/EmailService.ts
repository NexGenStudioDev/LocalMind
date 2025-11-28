import { EmailTransporter } from './EmailTransporter';
import { EmailTemplates } from './EmailTemplates';

export class EmailService {
  
  /**
   * Send API key reveal verification email
   */
  static async sendApiKeyRevealEmail(to: string, code: string): Promise<void> {
    const transporter = EmailTransporter.getTransporter();
    const html = EmailTemplates.apiKeyRevealTemplate(code);

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@yourapp.com',
      to,
      subject: 'API Key Reveal Verification Code',
      html
    };

    await transporter.sendMail(mailOptions);
  }

  /**
   * Send password reset email
   */
  static async sendPasswordResetEmail(to: string, code: string): Promise<void> {
    const transporter = EmailTransporter.getTransporter();
    const html = EmailTemplates.passwordResetTemplate(code);

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@yourapp.com',
      to,
      subject: 'Password Reset Verification Code',
      html
    };

    await transporter.sendMail(mailOptions);
  }
}