import { Request, Response } from 'express'
import { userLoginSchema, userRegisterSchema } from './user.validator'
import userService from './user.service'
import { SendResponse } from '../../../utils/SendResponse.utils'
import UserUtils from './user.utils'
import { IUser } from './user.type'
import jwt from 'jsonwebtoken'
import UserConstant from './user.constant'
import { StatusConstant } from '../../../constant/Status.constant'
import { z } from 'zod'

class UserController {
  constructor() {
    this.register = this.register.bind(this)
    this.login = this.login.bind(this)
    this.profile = this.profile.bind(this)
    this.apiEndPointCreater = this.apiEndPointCreater.bind(this)
    this.getApiKey = this.getApiKey.bind(this)
  }

  private setHeaderToken(res: Response, token: string): void {
    res.setHeader('Authorization', `Bearer ${token}`)
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    })
  }

  async register(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = await userRegisterSchema.parseAsync(req.body)

      const user = await userService.createUser(validatedData)

      const userObj = user.toObject ? user.toObject() : {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      }

      // Generate token using MongoDB _id
      const token = UserUtils.generateToken({
        _id: String(user._id),
        email: user.email,
        role: user.role,
      })

      this.setHeaderToken(res, token)

      SendResponse.success(res, UserConstant.CREATE_USER_SUCCESS, { userObj }, 201)
    } catch (err: any) {
      if (err?.code === 11000) {
        SendResponse.error(
          res,
          UserConstant.EMAIL_ALREADY_EXISTS,
          StatusConstant.CONFLICT
        )
        return
      }

      if (err instanceof z.ZodError) {
        SendResponse.error(res, err.errors.map((e) => e.message).join(', '), StatusConstant.BAD_REQUEST)
        return
      }

      SendResponse.error(
        res,
        err.message || UserConstant.CREATE_USER_FAILED,
        StatusConstant.INTERNAL_SERVER_ERROR,
        err
      )
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = userLoginSchema.parse(req.body)

      const user = await UserUtils.findByEmailAndCheckPassword(validatedData)

      const token = UserUtils.generateToken({
        _id: user.userObj._id || '',
        email: user.userObj.email,
        role: user.userObj.role,
      })

      this.setHeaderToken(res, token)

      SendResponse.success(res, UserConstant.LOGIN_USER_SUCCESS, { user, token }, StatusConstant.OK)
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        SendResponse.error(res, err.errors.map((e) => e.message).join(', '), StatusConstant.BAD_REQUEST)
        return
      }
      SendResponse.error(res, err.message || UserConstant.INVALID_CREDENTIALS, 401, err)
    }
  }

  async profile(req: Request, res: Response): Promise<void> {
    try {
      // `userMiddleware` sets `req.user` when authenticated
      const userId = req.user?._id

      if (!userId) {
        throw new Error(UserConstant.TOKEN_MISSING)
      }

      const user = await UserUtils.findById(userId)

      if (!user) {
        throw new Error(UserConstant.USER_NOT_FOUND)
      }

      const userObj: Partial<IUser> = user.toObject ? user.toObject() : { ...user }
      delete userObj.password

      SendResponse.success(res, UserConstant.USER_PROFILE_SUCCESS, userObj, 200)
    } catch (err: any) {
      SendResponse.error(res, err.message || UserConstant.USER_PROFILE_FAILED, 500, err)
    }
  }

  async apiEndPointCreater(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        throw new Error(UserConstant.INVALID_INPUT)
      }

      const apiKey = await userService.apiKeyCreater(req.user as IUser)

      SendResponse.success(res, UserConstant.GENERATE_API_KEY_SUCCESS, { apiKey }, 200)
    } catch (err: any) {
      SendResponse.error(res, err.message || UserConstant.GENERATE_API_KEY_FAILED, 500, err)
    }
  }
  async getApiKey(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?._id

      if (!userId) {
        throw new Error(UserConstant.INVALID_INPUT)
      }

      const user = await UserUtils.findById(userId)

      if (!user || !user.apikey) {
        throw new Error(UserConstant.API_KEY_NOT_FOUND)
      }

      const maskedKey = UserUtils.maskApiKey(user.apikey)

      SendResponse.success(res, UserConstant.API_KEY_FETCHED, { apiKey: maskedKey }, 200)
    } catch (err: any) {
      SendResponse.error(res, err.message || UserConstant.SERVER_ERROR, 500, err)
    }
  }
}

export default new UserController()
