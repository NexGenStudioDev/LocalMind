import { Request, Response, NextFunction } from 'express'
import { SendResponse } from '../../../utils/SendResponse.utils'
import UserUtils from './user.utils'
import { IUser } from './user.type'
import UserConstant from './user.constant'
class UserMiddleware {
  async middleware(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const token = req.headers.authorization?.split(' ')[1] || req.cookies?.token

      if (!token) {
        throw new Error(UserConstant.TOKEN_MISSING)
      }

      const decodedData: Partial<IUser> | null = UserUtils.verifyToken(token)

      if (!decodedData) {
        throw new Error(UserConstant.INVALID_TOKEN)
      }

      req.user = decodedData
      return next()
    } catch (err: any) {
      SendResponse.error(res, err.message || UserConstant.SERVER_ERROR, 500)
    }
  }

  async adminMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const token = req.headers.authorization?.split(' ')[1] || req.cookies?.token

      if (!token) {
        throw new Error(UserConstant.TOKEN_MISSING)
      }

      const decodedData: Partial<IUser> | null = UserUtils.verifyToken(token)

      if (!decodedData) {
        throw new Error(UserConstant.INVALID_TOKEN)
      }

      if (decodedData.role !== 'admin') {
        throw new Error(UserConstant.ADMIN_ONLY)
      }

      req.user = decodedData
      return next()
    } catch (err: any) {
      SendResponse.error(res, err.message || UserConstant.SERVER_ERROR, err.message === UserConstant.ADMIN_ONLY ? 403 : 500)
    }
  }
}

export default new UserMiddleware()
