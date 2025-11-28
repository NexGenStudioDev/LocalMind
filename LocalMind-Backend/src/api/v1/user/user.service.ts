import User from "./user.model";
import { IUser } from "./user.type";
import UserUtils from "./user.utils";
import { EmailService } from "../../../email/EmailService";
import crypto from "crypto";
import { env } from "../../../constant/env.constant";

const SERVER_HMAC_SECRET: string =
  env.SERVER_HMAC_SECRET || "fallback_super_secret_key";

const generateRawKey = (): Promise<string> => {
  return Promise.resolve(crypto.randomBytes(32).toString("hex"));
};

const hasedRawKey = (rawKey: string): Promise<string> => {
  return Promise.resolve(
    crypto
      .createHmac("sha256", String(SERVER_HMAC_SECRET))
      .update(String(rawKey))
      .digest("hex"),
  );
};

const createKeyPair = async () => {
  const raw = await generateRawKey();
  const hashed = await hasedRawKey(raw);
  return { raw, hashed };
};

class userService {
  async createUser(data: IUser) {
    const hashPassword = await UserUtils.passwordHash(String(data.password));
    const user = await User.create({
      ...data,
      password: hashPassword,
    });
    return user;
  }

  async apiKeyCreater(data: IUser): Promise<string | undefined> {
    try {
      const { raw, hashed } = await createKeyPair();

  

      await User.findOneAndUpdate(
        { email: data.email },
        {
          apikey: hashed,
        },
      );
      return raw;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

   async sendApiKeyRevealCode(userId: string, email: string): Promise<{ success: boolean; message: string }> {
    try {
      // Generate 6-digit code
      const verificationCode = crypto.randomInt(100000, 999999).toString();
      
      // Hash the code using SHA-256
      const hashedCode = UserUtils.hashCode(verificationCode);

      // Set expiry time (5 minutes from now)
      const expiryTime = new Date(Date.now() + 5 * 60 * 1000);

      // Update user document with OTP and expiry
      await User.findByIdAndUpdate(userId, {
        otp: hashedCode,
        otpExpiresAt: expiryTime
      });

      // Send email with plain verification code
      await  EmailService.sendApiKeyRevealEmail(email, verificationCode);

      return {
        success: true,
        message: 'Verification code sent successfully'
      };
    } catch (error) {
      console.error('[VerificationService] Error sending code:', error);
      return {
        success: false,
        message: 'Failed to send verification code'
      };
    }
  }


  async verifyCode(userId: string, code: string): Promise<boolean> {
    try {
      // Hash the provided code
      const hashedCode =  UserUtils.hashCode(code);

      // Get user with OTP fields
      const user = await User.findById(userId).select('+otp +otpExpiresAt');

      if (!user) {
        return false;
      }

      // Check if OTP exists and hasn't expired
      if (!user.otp || !user.otpExpiresAt) {
        return false;
      }

      // Check if expired
      if (new Date() > user.otpExpiresAt) {
        // Clear expired OTP
        await User.findByIdAndUpdate(userId, {
          otp: null,
          otpExpiresAt: null
        });
        return false;
      }

      // Compare hashed codes
      if (user.otp !== hashedCode) {
        return false;
      }

      // Clear OTP after successful verification (one-time use)
      await User.findByIdAndUpdate(userId, {
        otp: null,
        otpExpiresAt: null
      });

      return true;
    } catch (error) {
      console.error('[VerificationService] Error verifying code:', error);
      return false;
    }
  }

}
export default new userService();
