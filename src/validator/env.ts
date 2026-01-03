import { z } from 'zod'

export const EnvSchema = z.object({
  PORT: z.string().default('5000'),
  HOST: z.string().default('localhost'),
  APP_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DEBUG: z
    .string()
    .transform((v) => v === 'true')
    .default(true),
  Your_Name: z.string(),
  YOUR_EMAIL: z.email(),
  YOUR_PASSWORD: z.string(),
  LOG_LEVEL: z.string().default('debug'),
  GROQ_API_KEY: z.string(),

  CORS_ENABLED: z
    .string()
    .transform((v) => v === 'true')
    .default(true),
  RATE_LIMIT_ENABLED: z
    .string()
    .transform((v) => v === 'true')
    .default(false),
  ENABLE_RATE_LIMITING: z
    .string()
    .transform((v) => v === 'true')
    .default(false),

  JWT_SECRET: z.string(),
  JWT_EXPIRATION: z.string().default('7d'),

  DB_HOST: z.string(),
  DB_PORT: z.string(),
  DB_NAME: z.string(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_CONNECTION_STRING: z.string(),

  REDIS_HOST: z.string(),
  REDIS_PORT: z.string(),
  REDIS_PASSWORD: z.string(),

  UPLOAD_DIR: z.string(),
  TEMP_DIR: z.string(),
  MAX_FILE_SIZE: z.string(),

  ENCRYPTION_KEY: z.string(),

  SERVER_HMAC_SECRET: z.string(),

  GOOGLE_API_KEY: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  BACKEND_URL: z.string().default('http://localhost:5000'),
})
