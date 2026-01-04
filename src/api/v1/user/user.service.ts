import User from './user.model'
import { IUser } from './user.type'
import UserUtils from './user.utils'
import crypto from 'crypto'
import { env } from '../../../constant/env.constant'

const SERVER_HMAC_SECRET: string = env.SERVER_HMAC_SECRET

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
}
export default new userService()
