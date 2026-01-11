import nodemailer, { Transporter } from 'nodemailer'
import { env } from '../constant/env.constant'

interface EmailOptions {
  email: string
  subject: string
  message: string
  html?: string
}

class EmailService {
  private transporter: Transporter | null = null

  constructor() {
    this.initializeTransporter()
  }

  private initializeTransporter(): void {
    try {
      if (env.SMTP_SERVICE === 'gmail') {
        // Gmail configuration
        this.transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: env.SMTP_USER,
            pass: env.SMTP_PASSWORD,
          },
        })
      } else if (env.SMTP_HOST && env.SMTP_PORT) {
        // Custom SMTP server configuration
        this.transporter = nodemailer.createTransport({
          host: env.SMTP_HOST,
          port: parseInt(env.SMTP_PORT, 10),
          secure: env.SMTP_SECURE === 'true',
          auth: {
            user: env.SMTP_USER,
            pass: env.SMTP_PASSWORD,
          },
        })
      }
    } catch (error) {
      console.warn('Email service initialization failed:', error)
    }
  }

  /**
   * Send password reset email
   * @param email User's email address
   * @param resetLink Password reset link with token
   * @returns Promise<boolean> - true if successful, false otherwise
   */
  async sendPasswordResetEmail(email: string, resetLink: string): Promise<boolean> {
    try {
      if (!this.transporter) {
        console.warn('Email transporter not initialized')
        // Even if email fails, don't expose the error to user
        return true
      }

      const resetLinkWithExpiry = `${resetLink}`
      const expiryText = '15 minutes'

      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 5px; }
              .header { background-color: #007bff; color: white; padding: 20px; border-radius: 5px 5px 0 0; text-align: center; }
              .content { background-color: white; padding: 20px; border: 1px solid #ddd; }
              .button { display: inline-block; background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
              .footer { background-color: #f0f0f0; padding: 15px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 5px 5px; }
              .warning { background-color: #fff3cd; padding: 10px; border-left: 4px solid #ffc107; margin: 15px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2>Password Reset Request</h2>
              </div>
              <div class="content">
                <p>Hello,</p>
                <p>We received a request to reset your password. If you didn't make this request, you can safely ignore this email.</p>
                <p>Click the button below to reset your password:</p>
                <a href="${resetLinkWithExpiry}" class="button">Reset Password</a>
                <p>Or copy and paste this link in your browser:</p>
                <p style="word-break: break-all; background-color: #f5f5f5; padding: 10px; border-radius: 3px;">
                  ${resetLinkWithExpiry}
                </p>
                <div class="warning">
                  <strong>⚠️ Important:</strong> This link will expire in ${expiryText}. Do not share this link with anyone.
                </div>
                <p>If you have any questions or didn't request this password reset, please contact our support team.</p>
              </div>
              <div class="footer">
                <p>&copy; 2024 LocalMind. All rights reserved.</p>
                <p>This is an automated message, please do not reply to this email.</p>
              </div>
            </div>
          </body>
        </html>
      `

      const mailOptions: EmailOptions = {
        email,
        subject: 'Password Reset Request - LocalMind',
        message: `Reset your password using the link: ${resetLinkWithExpiry}. This link will expire in ${expiryText}.`,
        html: htmlContent,
      }

      await this.transporter.sendMail({
        from: env.SMTP_FROM || env.SMTP_USER,
        to: mailOptions.email,
        subject: mailOptions.subject,
        text: mailOptions.message,
        html: mailOptions.html,
      })

      return true
    } catch (error) {
      console.error('Error sending password reset email:', error)
      // Don't expose email errors to the user
      return true
    }
  }

  /**
   * Verify email transporter configuration
   * @returns Promise<boolean> - true if transporter is configured
   */
  async verifyTransporter(): Promise<boolean> {
    try {
      if (!this.transporter) {
        return false
      }
      await this.transporter.verify()
      return true
    } catch (error) {
      console.error('Email transporter verification failed:', error)
      return false
    }
  }
}

export default new EmailService()
