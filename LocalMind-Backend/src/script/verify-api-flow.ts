import axios from 'axios'
import mongoose from 'mongoose'
import User from '../api/v1/user/user.model'
import mongooseConection from '../config/mongoose.connection'

const API_URL = 'http://localhost:5000/api/v1'
const TEST_EMAIL = 'api-reset-test@example.com'
const OLD_PASS = 'OldPassword123!'
const NEW_PASS = 'NewStrongPassword123!'

async function run() {
  try {
    // 0. Connect to DB to check tokens later
    const { env } = await import('../constant/env.constant')
    console.log('🔌 Connecting to DB...')
    await mongoose.connect(env.DB_CONNECTION_STRING)
    console.log('✅ Connected to DB')

    // 1. Signup
    console.log('1️⃣ Signing up...')
    try {
      await axios.post(`${API_URL}/auth/signup`, {
        firstName: 'Test',
        email: TEST_EMAIL,
        password: OLD_PASS,
        birthPlace: 'City',
        location: 'Loc',
        role: 'user',
      })
      console.log('✅ Signup successful')
    } catch (e: any) {
      if (e.response?.status === 409) console.log('⚠️ User already exists, proceeding...')
      else throw e
    }

    // 2. Forgot Password
    console.log('2️⃣ Requesting Password Reset...')
    await axios.post(`${API_URL}/auth/forgot-password`, { email: TEST_EMAIL })
    console.log('✅ Forgot Password request sent')

    // 3. Get Token from DB (simulation of email link)
    console.log('3️⃣ Fetching token from DB...')
    const user = await User.findOne({ email: TEST_EMAIL }).select('+resetPasswordToken')
    if (!user || !user.resetPasswordToken) throw new Error('Token not generated in DB')

    // Note: In DB we store hashed token. But for reset endpoint we need the UNHASHED token.
    // Wait, my service implementation:
    // Service: const resetToken = crypto.randomBytes(32).toString('hex')
    // Service: user.resetPasswordToken = crypto.createHash('sha256').update(resetToken)
    // Sending email: resetToken (unhashed)
    //
    // CRITICAL: We cannot get the unhashed token from DB! It is hashed!
    // I need to intercept the console log or...
    // Actually, for this test to work without email, I typically need the unhashed token.
    // Since I can't reverse the hash, I cannot test step 4 fully automated unless I mock the email sender to save the token somewhere accessible, OR simply assume if Step 2 returns 200 and DB has a hash, it's "working" enough for backend logic.
    //
    // BUT, I can temporarily modify the service to return the token for testing? No, bad practice.
    // I will check if the DB has `resetPasswordToken` set. That verifies the "Forgot" part worked.
    // To verify "Reset", I can manually generate a token, hash it, save to DB, and then call the API with the unhashed one.

    console.log('✅ Token hash found in DB. Verifying Reset Flow by injecting known token...')

    const crypto = await import('crypto')
    const knownToken = 'my-secret-test-token-123'
    const hashedKnownToken = crypto.createHash('sha256').update(knownToken).digest('hex')

    await User.updateOne(
      { email: TEST_EMAIL },
      {
        resetPasswordToken: hashedKnownToken,
        resetPasswordExpire: new Date(Date.now() + 10 * 60 * 1000),
      }
    )

    // 4. Reset Password
    console.log('4️⃣ Resetting password with known token...')
    await axios.post(`${API_URL}/auth/reset-password/${knownToken}`, { password: NEW_PASS })
    console.log('✅ Password reset successful')

    // 5. Login with New Password
    console.log('5️⃣ Logging in with new password...')
    const loginRes = await axios.post(`${API_URL}/user/login`, {
      email: TEST_EMAIL,
      password: NEW_PASS,
    })
    console.log('✅ Login successful! Token:', loginRes.data?.data?.token ? 'Received' : 'Missing')

    // Cleanup
    await User.deleteOne({ email: TEST_EMAIL })
    console.log('🧹 Cleanup complete')
  } catch (error: any) {
    console.error('❌ Error Details:', JSON.stringify(error.response?.data || error, null, 2))
    console.error('❌ Stack:', error.stack)
  } finally {
    await mongoose.disconnect()
    process.exit()
  }
}

run()
