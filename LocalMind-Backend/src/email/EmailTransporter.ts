import nodemailer from 'nodemailer';

export class EmailTransporter {
  private static transporter: nodemailer.Transporter | null = null;

  /**
   * Get or create email transporter
   */
  static getTransporter(): nodemailer.Transporter {
    if (!this.transporter) {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });
    }
    return this.transporter;
  }

  /**
   * Verify transporter connection
   */
  static async verifyConnection(): Promise<boolean> {
    try {
      const transporter = this.getTransporter();
      await transporter.verify();
      console.log('✓ Email transporter verified successfully');
      return true;
    } catch (error) {
      console.error('✗ Email transporter verification failed:', error);
      return false;
    }
  }
}