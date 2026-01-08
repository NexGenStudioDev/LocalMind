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

  async getAdminStats() {
    try {
      const totalUsers = await User.countDocuments()
      const adminUsers = await User.countDocuments({ role: 'admin' })
      const regularUsers = await User.countDocuments({ role: 'user' })
      const creatorUsers = await User.countDocuments({ role: 'creator' })

      const recentUsers = await User.find()
        .select('firstName email role createdAt')
        .sort({ createdAt: -1 })
        .limit(10)

      return {
        totalUsers,
        adminUsers,
        regularUsers,
        creatorUsers,
        recentUsers,
      }
    } catch (err: any) {
      throw new Error(err.message)
    }
  }
}
export default new userService()
