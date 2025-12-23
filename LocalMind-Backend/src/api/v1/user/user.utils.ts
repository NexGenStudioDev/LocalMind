import jwt, { SignOptions } from 'jsonwebtoken'
import { env } from '../../../constant/env.constant'
import { IUser } from './user.type'
import User from './user.model'
import bcrypt from 'bcrypt'
import * as argon2 from 'argon2'
import UserConstant, { PasswordConfig } from './user.constant'

export interface JwtPayload {
  userId: string
  email: string
  role?: string | undefined
}

class UserUtils {
  private static readonly JWT_SECRET: string = env.JWT_SECRET
  private static readonly EXPIRES_IN: string | number = env.JWT_EXPIRATION

  public static generateToken(payload: JwtPayload): string {
    return jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: this.EXPIRES_IN,
    } as SignOptions)
  }

  public static verifyToken(token: string): Partial<IUser> | null {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET)

      if (typeof decoded === 'object' && decoded !== null) {
        return {
          email: decoded.email as string,
          _id: decoded.userId as string,
          role: decoded.role as string,
        }
      }

      return null
    } catch {
      return null
    }
  }

  public static async findByEmailandCheckPassword(data: IUser) {
    try {
      const user = await User.findOne({ email: data.email }).select('+password')

      if (!user) {
        throw new Error(UserConstant.USER_NOT_FOUND)
      }

      if (!user.password) {
        throw new Error(UserConstant.PASSWORD_UNDEFINED)
      }
      if (!data.password) {
        throw new Error(UserConstant.PASSWORD_UNDEFINED)
      }
      const PassMatch = await this.passwordMatching({
        dbPass: user.password,
        userPass: data.password,
      })

      if (!PassMatch) {
        throw new Error(UserConstant.INVALID_PASSWORD)
      }
      const userObj = this.sanitizeUser(user)

      if (!userObj) {
        throw new Error(UserConstant.USER_NOT_FOUND)
      }

      const token = this.generateToken({
        userId: String(user._id),
        email: user.email,
        role: user.role,
      })

      return { userObj, token }
    } catch (err: any) {
      if (err instanceof Error) {
        throw err
      }
      throw new Error(UserConstant.DATABASE_FIND_USER_ERROR)
    }
  }

  public static async findById(userId: string): Promise<IUser | null> {
    const user = await User.findById(userId)
    return this.sanitizeUser(user) as IUser | null
  }

  public static async passwordHash(password: string): Promise<string> {
    return bcrypt.hash(password, PasswordConfig.saltRounds)
  }

  public static async findUserByEmail(email: string): Promise<Partial<IUser> | null> {
    const user = await User.findOne({ email })
    return this.sanitizeUser(user)
  }

  private static async passwordMatching({
    dbPass,
    userPass,
  }: {
    dbPass: string
    userPass: string
  }): Promise<boolean> {
    const isBcryptMatch = await bcrypt.compare(userPass, dbPass)
    if (isBcryptMatch) return true

    try {
      return await argon2.verify(dbPass, userPass)
    } catch {
      return false
    }
  }
  public static sanitizeUser(user: IUser | null): Partial<IUser> | null {
    if (!user) return null
    const userObj = typeof (user as any).toObject === 'function' ? (user as any).toObject() : { ...user }

    delete (userObj as { password?: string }).password
    delete (userObj as { __v?: number }).__v
    delete (userObj as { apikey?: string | null }).apikey
    delete (userObj as { modelApiKey?: string | null }).modelApiKey
    return userObj as Partial<IUser>
  }
  public static maskApiKey(apiKey: string): string {
    if (!apiKey || apiKey.length < 8) return '*'
    const visibleStart = apiKey.slice(0, 4)
    const visibleEnd = apiKey.slice(-4)
    const masked = '*'.repeat(apiKey.length - 8)
    return `${visibleStart}${masked}${visibleEnd}`
  }
}

export default UserUtils
