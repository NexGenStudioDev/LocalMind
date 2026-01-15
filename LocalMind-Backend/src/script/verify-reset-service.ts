import mongoose from 'mongoose'
import userService from '../api/v1/user/user.service'
import User from '../api/v1/user/user.model'
import { env } from '../constant/env.constant'
import mongooseConection from '../config/mongoose.connection'

const verifyPasswordReset = async () => {
  try {
    console.log('🔌 Connecting to DB...')
    await mongooseConection()

    const testEmail = 'verify-reset@example.com'

    // 1. Create a test user if not exists
    let user = await User.findOne({ email: testEmail })
    if (!user) {
      console.log('👤 Creating test user...')
      user = await User.create({
        firstName: 'Test',
        email: testEmail,
        password: 'Password123!',
        birthPlace: 'TestCity',
        location: 'TestLoc',
        role: 'user',
      })
    }

    console.log(`📧 Requesting password reset for ${testEmail}...`)
    // 2. Call service method (this should trigger email sending and DB update)
    await userService.forgotPassword(testEmail)

    // 3. Verify DB update
    const updatedUser = await User.findOne({ email: testEmail }).select(
      '+resetPasswordToken +resetPasswordExpire'
    )

    if (updatedUser?.resetPasswordToken && updatedUser?.resetPasswordExpire) {
      console.log('✅ SUCCESS: Reset token and expiry set in DB!')
      console.log('🔑 Hashed Token:', updatedUser.resetPasswordToken)
      console.log('⏳ Expires At:', updatedUser.resetPasswordExpire)
    } else {
      console.error('❌ FAILURE: Token not set in DB.')
    }

    // Clean up
    await User.deleteOne({ email: testEmail })
    console.log('🧹 Test user cleaned up.')
  } catch (error) {
    console.error('❌ Error during verification:', error)
  } finally {
    await mongoose.disconnect()
    process.exit()
  }
}

verifyPasswordReset()
