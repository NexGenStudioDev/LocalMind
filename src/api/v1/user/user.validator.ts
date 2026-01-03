import { z } from 'zod'
import UserConstant from './user.constant'

export const userRegisterSchema = z.object({
  name: z.string().trim().min(1, UserConstant.NAME_REQUIRED),

  role: z
  .enum(['user', 'admin', 'creator'] as const)
  .refine(
    role => ['user', 'admin', 'creator'].includes(role),
    { message: UserConstant.INVALID_ROLE }
  ),

  email: z.string().email(UserConstant.INVALID_CREDENTIALS).toLowerCase(),

  password: z
    .string()
    .min(8, UserConstant.PASSWORD_MIN_LENGTH)
    .max(20, UserConstant.PASSWORD_MAX_LENGTH)
    .regex(/[A-Z]/, UserConstant.PASSWORD_UPPERCASE_REQUIRED)
    .regex(/[a-z]/, UserConstant.PASSWORD_LOWERCASE_REQUIRED)
    .regex(/[0-9]/, UserConstant.PASSWORD_NUMBER_REQUIRED)
    .regex(/[@$!%*?&]/, UserConstant.PASSWORD_SPECIAL_CHAR_REQUIRED),

  portfolioUrl: z.string().url(UserConstant.INVALID_URL).optional(),

  bio: z.string().max(300, UserConstant.BIO_MAX_LENGTH).optional(),
})

export const userLoginSchema = z.object({
  email: z.string().email(UserConstant.INVALID_CREDENTIALS).toLowerCase(),
  password: z.string(),
})
