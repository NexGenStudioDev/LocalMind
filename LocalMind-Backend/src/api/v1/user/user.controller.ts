import { Request, Response } from "express";
import { ZodError } from "zod";
import { userLoginSchema, userRegisterSchema } from "./user.validator";
import userService from "./user.service";
import { SendResponse } from "../../../utils/SendResponse.utils";
import UserUtils from "./user.utils";
import { IUser } from "./user.type";
import jwt from "jsonwebtoken";
import UserConstant from "./user.constant";
import { StatusConstant } from "../../../constant/Status.constant";
import { th } from "zod/v4/locales";
import User from "./user.model";

class UserController {


  constructor() {
    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
    this.profile = this.profile.bind(this);
    this.apiEndPointCreater = this.apiEndPointCreater.bind(this);
    this.getApiKey = this.getApiKey.bind(this);
  }

  private setHeaderToken(res: Response, token: string): void {
    res.setHeader("Authorization", `Bearer ${token}`);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
  }


  async register(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = await userRegisterSchema.parseAsync(req.body);

      if (!req.body.password) {
        throw new Error(UserConstant.PASSWORD_REQUIRED);
      }

      const user = await userService.createUser(validatedData);

      const { password, ...userObj } = user; 

      const token = UserUtils.generateToken({
        userId: String(user._id),
        email: user.email,
        role: user.role,
      });

      this.setHeaderToken(res, token);

      SendResponse.success(
        res,
        UserConstant.CREATE_USER_SUCCESS,
        { userObj, token },
        201,
      );
    } catch (err: any) {

      SendResponse.error(res, err.message || UserConstant.CREATE_USER_FAILED, 500, err);

    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = userLoginSchema.parse(req.body);

      const user = await UserUtils.findByEmailandCheckPassword(validatedData);

      const token = UserUtils.generateToken({
        userId: user.userObj._id || "",
        email: user.userObj.email,
        role: user.userObj.role,
      });

      this.setHeaderToken(res, token);

      SendResponse.success(res, UserConstant.LOGIN_USER_SUCCESS, { user, token }, StatusConstant.OK);

    } catch (err: any) {
      SendResponse.error(res, err.message || UserConstant.INVALID_CREDENTIALS, 401, err);
    }
  }

  async profile(req: Request, res: Response): Promise<void> {
    try {
    
      const token =  req.headers.authorization?.split(" ")[1] || req.cookies?.token;

      if (!token) {
        throw new Error(UserConstant.TOKEN_MISSING);
      }


      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
        userId: string;
      };


      const user = await UserUtils.findById(decoded.userId);

      if (!user) {
        throw new Error(UserConstant.USER_NOT_FOUND);
      }

      const userObj: Partial<IUser> = { ...user };
      delete userObj.password;

      SendResponse.success(res, UserConstant.USER_PROFILE_SUCCESS, userObj, 200);
    } catch (err: any) {
      if (err.name === "JsonWebTokenError") {
        SendResponse.error(res, UserConstant.INVALID_TOKEN, 401);
      } else {
        SendResponse.error(
          res,
          err.message || UserConstant.USER_PROFILE_FAILED,
          500,
          err,
        );
      }
    }
  }

  async apiEndPointCreater(req: Request, res: Response): Promise<void> {
    try {
console.log('Generating API key for user:', req.user);

      if (!req.user) {
          throw new Error(UserConstant.INVALID_INPUT);
      }

      const apiKey = await userService.apiKeyCreater(req.user as IUser);

      SendResponse.success(
        res,
       UserConstant.GENERATE_API_KEY_SUCCESS,
        { apiKey },
        200,
      );
    } catch (err: any) {
  
      SendResponse.error(
        res,
        err.message || UserConstant.GENERATE_API_KEY_FAILED,
        500,
        err,
      );
    }
  }
 async getApiKey(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?._id;
      if (!userId) {
        throw new Error(UserConstant.INVALID_INPUT);
      }

      const user = await UserUtils.findById(userId);


      if (!user || !user.apikey) {
        throw new Error(UserConstant.API_KEY_NOT_FOUND);
      }

      const maskedKey = UserUtils.maskApiKey(user.apikey);

      SendResponse.success(res, UserConstant.API_KEY_FETCHED, { apiKey: maskedKey }, 200);
    } catch (err: any) {
      SendResponse.error(res, err.message || UserConstant.SERVER_ERROR, 500, err);
    }
  }
  
  async requestRevealCode(req: Request, res: Response): Promise<Response> {
    try {
      const userId = req.user?._id;
      const userEmail = req.user?.email;

      if (!userId || !userEmail) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }

      // Send verification code and store in user document
      const result = await userService.sendApiKeyRevealCode(userId, userEmail);

      if (!result.success) {
        return res.status(500).json({
          success: false,
          message: result.message
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Verification code sent to your email',
        expiresIn: 300 // 5 minutes
      });

    } catch (error) {
      console.error('[UserController] Error requesting reveal code:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to send verification code'
      });
    }
  }
 async revealApiKey(req: Request, res: Response): Promise<Response> {
    try {
      const userId = req.user?._id;
      const { verificationCode } = req.body;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }
      console.log('Received verification code:', verificationCode);

      if (!verificationCode) {
        return res.status(400).json({
          success: false,
          message: 'Verification code is required'
        });
      }

      // Verify the code
      const isValid = await userService.verifyCode(userId, verificationCode);
 

      if (!isValid) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or expired verification code'
        });
      }

      // Get user's API key
      const user = await User.findById(userId).select('apikey');

      if (!user || !user.apikey) {
        return res.status(404).json({
          success: false,
          message: 'API key not found'
        });
      }

    

      return res.status(200).json({
        success: true,
        apiKey: user.apikey,
        message: 'API key revealed successfully'
      });

    } catch (error) {
      console.error('[UserController] Error revealing API key:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to reveal API key'
      });
    }
  }

}

export default new UserController();
