import nodemailer from 'nodemailer'

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

interface EmailOptions {
  email: string
  subject: string
  message: string
}

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  // Define email options
  const mailOptions = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Password Reset Request</h2>
        <p>You requested a password reset. Please click the link below to reset your password:</p>
        <a href="${options.message}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
        <p>If you did not request this, please ignore this email.</p>
        <p>This link will expire in 10 minutes.</p>
      </div>
    `,
  }

  // MOCK EMAIL SERVICE (Development Mode)
  // In production, ensure SMTP_HOST is securely configured.
  if (!process.env.SMTP_HOST || process.env.NODE_ENV === 'development') {
    console.log('==================================================')
    console.log('📧 MOCK EMAIL SERVICE (No Real Email Sent)')
    console.log(`To: ${options.email}`)
    console.log(`Subject: ${options.subject}`)
    console.log('--- Message Content ---')
    console.log(options.message)
    console.log('==================================================')
    return
  }

  // Send email
  try {
    const info = await transporter.sendMail(mailOptions)
    console.log(`📧 Email sent: ${info.messageId}`)
    // Preview URL only valid when using Ethereal
    if (process.env.SMTP_HOST?.includes('ethereal')) {
      console.log(`📧 Preview URL: ${nodemailer.getTestMessageUrl(info)}`)
    }
  } catch (error) {
    console.error('❌ Error sending email:', error)
    // Fallback to console log if sending fails
    console.log('⚠️ Fallback: Logging email to console due to send failure.')
    console.log(`Reset Link: ${options.message}`)
    // Do not throw error so the flow continues
  }
}
