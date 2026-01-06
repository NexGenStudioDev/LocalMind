import { sendEmail } from '../utils/email'
import { env } from '../constant/env.constant'

const testEmailSending = async () => {
  console.log('📧 Testing Email Sending...')
  console.log('SMTP Host:', process.env.SMTP_HOST || '(defaulting to ethereal)')
  console.log('SMTP Port:', process.env.SMTP_PORT || '(defaulting to 587)')
  console.log('SMTP User:', process.env.SMTP_USER ? '***' : '(missing)')

  try {
    await sendEmail({
      email: 'rohanrathod.dev@gmail.com',
      subject: 'Test Email',
      message: 'This is a test email to verify SMTP configuration.',
    })
    console.log('✅ Email sent successfully!')
  } catch (error: any) {
    console.error('❌ Failed to send email.')
    console.error('Error Message:', error.message)
    console.error('Error Code:', error.code)
    console.error('Error Command:', error.command)
    console.error('Full Error:', JSON.stringify(error, null, 2))
  }
}

testEmailSending()
