import User from './user.model'
import { IUser } from './user.type'
import UserUtils from './user.utils'
import crypto from 'crypto'
import { env } from '../../../constant/env.constant'

const SERVER_HMAC_SECRET: string = env.SERVER_HMAC_SECRET || 'fallback_super_secret_key'

const generateRawKey = (): Promise<string> => {
  return Promise.resolve(crypto.randomBytes(32).toString('hex'))
}

const hasedRawKey = (rawKey: string): Promise<string> => {
  return Promise.resolve(
    crypto.createHmac('sha256', String(SERVER_HMAC_SECRET)).update(String(rawKey)).digest('hex')
  )
}

const createKeyPair = async () => {
  const raw = await generateRawKey()
  const hashed = await hasedRawKey(raw)
  return { raw, hashed }
}

import { sendEmail } from '../../../utils/email'
import UserConstant from './user.constant'

// ... existing code ...

class userService {
  async createUser(data: IUser) {
    const hashPassword = await UserUtils.passwordHash(String(data.password))
    const user = await User.create({
      ...data,
      password: hashPassword,
      role: data.role || 'user',
      portfolioUrl: data.portfolioUrl ?? null,
      bio: data.bio ?? null,
    })
    return user
  }

  async apiKeyCreater(data: IUser): Promise<string | undefined> {
    try {
      const { raw, hashed } = await createKeyPair()

      await User.findOneAndUpdate(
        { email: data.email },
        {
          apikey: hashed,
        }
      )
      return raw
    } catch (err: any) {
      throw new Error(err.message)
    }
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await User.findOne({ email })
    if (!user) {
      // For security, do not reveal that the user does not exist
      return
    }

    // Generate token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    const resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    user.resetPasswordToken = resetPasswordToken
    user.resetPasswordExpire = resetPasswordExpire
    await user.save()

    // Construct reset URL (frontend URL)
    // NOTE: In production, FRONTEND_URL should be in env
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'
    const resetUrl = `${frontendUrl}/reset-password/${resetToken}`

    try {
      await sendEmail({
        email: user.email,
        subject: 'Password Reset Request',
        message: resetUrl,
      })
    } catch {
      user.resetPasswordToken = null
      user.resetPasswordExpire = null
      await user.save()
      throw new Error(UserConstant.FAILED_TO_SEND_EMAIL)
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    // Hash the token to compare with DB
    const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex')

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    })

    if (!user) {
      throw new Error(UserConstant.INVALID_TOKEN) // Or generic "Invalid token"
    }

    // Set new password
    user.password = await UserUtils.passwordHash(newPassword)
    user.resetPasswordToken = null
    user.resetPasswordExpire = null

    await user.save()
  }
}
export default new userService()
