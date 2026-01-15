import crypto from 'crypto'
import User from '../api/v1/user/user.model'
import { IUser } from '../api/v1/user/user.type'
import { ResetPasswordConfig } from '../api/v1/user/user.constant'
import bcrypt from 'bcrypt'

class PasswordResetService {
  /**
   * Generate a secure random token for password reset
   * @returns {string} Random hex token
   */
  private generateResetToken(): string {
    return crypto.randomBytes(ResetPasswordConfig.tokenLength).toString('hex')
  }

  /**
   * Hash a reset token using SHA256
   * @param token - The token to hash
   * @returns {string} Hashed token
   */
  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex')
  }

  /**
   * Initiate password reset process
   * @param email - User's email address
   * @returns {Promise<string | null>} Raw token (to send in email) or null if user not found
   */
  async initiatePasswordReset(email: string): Promise<string | null> {
    try {
      const user = await User.findOne({ email: email.toLowerCase() })

      // Don't reveal if email exists or not
      if (!user) {
        return null
      }

      // Generate raw token
      const rawToken = this.generateResetToken()

      // Hash token before storing
      const hashedToken = this.hashToken(rawToken)

      // Set expiry time (15 minutes from now)
      const expiryTime = new Date(Date.now() + ResetPasswordConfig.expiryMinutes * 60 * 1000)

      // Update user with hashed token and expiry
      await User.findByIdAndUpdate(user._id, {
        resetPasswordToken: hashedToken,
        resetPasswordExpire: expiryTime,
      })

      // Return raw token to send in email
      return rawToken
    } catch (error) {
      console.error('Error in initiatePasswordReset:', error)
      throw error
    }
  }

  /**
   * Verify and validate reset token
   * @param token - Raw token from email link
   * @returns {Promise<IUser | null>} User object if token is valid, null otherwise
   */
  async verifyResetToken(token: string): Promise<IUser | null> {
    try {
      // Hash the incoming token
      const hashedToken = this.hashToken(token)

      // Find user with matching token and valid expiry
      const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpire: { $gt: new Date() }, // Token must not be expired
      }).select('+resetPasswordToken +resetPasswordExpire')

      return user || null
    } catch (error) {
      console.error('Error in verifyResetToken:', error)
      return null
    }
  }

  /**
   * Reset password using verified token
   * @param token - Raw token from email link
   * @param newPassword - New password (should be validated before calling this)
   * @returns {Promise<boolean>} True if password reset successful
   */
  async resetPassword(token: string, newPassword: string): Promise<boolean> {
    try {
      // Hash the incoming token
      const hashedToken = this.hashToken(token)

      // Find user with matching token and valid expiry
      const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpire: { $gt: new Date() },
      }).select('+resetPasswordToken +resetPasswordExpire')

      if (!user) {
        return false
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10)

      // Update password and clear reset fields
      await User.findByIdAndUpdate(user._id, {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpire: null,
      })

      return true
    } catch (error) {
      console.error('Error in resetPassword:', error)
      return false
    }
  }

  /**
   * Clear reset token for a user (useful after successful reset)
   * @param userId - User ID
   * @returns {Promise<boolean>}
   */
  async clearResetToken(userId: string): Promise<boolean> {
    try {
      await User.findByIdAndUpdate(userId, {
        resetPasswordToken: null,
        resetPasswordExpire: null,
      })
      return true
    } catch (error) {
      console.error('Error in clearResetToken:', error)
      return false
    }
  }
}

export default new PasswordResetService()
