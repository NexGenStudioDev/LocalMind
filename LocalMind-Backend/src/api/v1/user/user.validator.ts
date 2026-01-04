import { z } from 'zod'
import UserConstant, { AllowedUserRoles, BioConfig, PasswordConfig } from './user.constant'

const passwordSchema = z
  .string()
  .min(PasswordConfig.minLength, UserConstant.PASSWORD_MIN_LENGTH)
  .max(PasswordConfig.maxLength, UserConstant.PASSWORD_MAX_LENGTH)
  .regex(/[A-Z]/, UserConstant.PASSWORD_UPPERCASE_REQUIRED)
  .regex(/[a-z]/, UserConstant.PASSWORD_LOWERCASE_REQUIRED)
  .regex(/[0-9]/, UserConstant.PASSWORD_NUMBER_REQUIRED)
  .regex(/[@$!%*?&]/, UserConstant.PASSWORD_SPECIAL_CHAR_REQUIRED)

const roleSchema = z.enum(AllowedUserRoles, {
  errorMap: () => ({ message: UserConstant.INVALID_ROLE }),
})

const portfolioUrlSchema = z
  .string()
  .trim()
  .url(UserConstant.INVALID_PORTFOLIO_URL)
  .max(2048, UserConstant.INVALID_PORTFOLIO_URL)
  .optional()

export const userRegisterSchema = z
  .object({
    firstName: z.string().trim().min(1, UserConstant.FIRST_NAME_REQUIRED),
    role: roleSchema.default('user'),
    email: z.string().email(UserConstant.INVALID_CREDENTIALS).toLowerCase(),
    birthPlace: z.string().trim().min(1, UserConstant.BIRTH_PLACE_REQUIRED),
    location: z.string().trim().min(1, UserConstant.LOCATION_REQUIRED),
    password: passwordSchema,
    portfolioUrl: portfolioUrlSchema,
    bio: z.string().trim().max(BioConfig.maxLength, UserConstant.BIO_TOO_LONG).optional(),
  })
  .strict()

export const userLoginSchema = z
  .object({
    email: z.string().email(UserConstant.INVALID_CREDENTIALS).toLowerCase(),
    password: z.string(),
  })
  .strict()
