import jwt, { SignOptions } from 'jsonwebtoken'
import { env } from '../../../constant/env.constant'
import { IUser } from './user.type'
import User from './user.model'
import * as argon2 from 'argon2'
import UserConstant from './user.constant'

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

  public static verifyToken(token: string): IUser | null {
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
      const userObj: IUser = user.toObject()
      delete (userObj as { password?: string }).password
      delete (userObj as { createdAt?: Date }).createdAt
      delete (userObj as { updatedAt?: Date }).updatedAt
      delete (userObj as { __v?: number }).__v

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
    return user
  }

  public static async passwordHash(password: string): Promise<string> {
    return await argon2.hash(password)
  }

  public static async findUserByEmail(email: string): Promise<Partial<IUser> | null> {
    const user = await User.findOne({ email })
    if (!user) return null
    const userObj = user.toObject() as IUser
    delete (userObj as { password?: string }).password
    delete (userObj as { createdAt?: Date }).createdAt
    delete (userObj as { updatedAt?: Date }).updatedAt
    delete (userObj as { __v?: number }).__v
    return userObj
  }

  private static async passwordMatching({
    dbPass,
    userPass,
  }: {
    dbPass: string
    userPass: string
  }): Promise<boolean> {
    return await argon2.verify(dbPass, userPass)
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
