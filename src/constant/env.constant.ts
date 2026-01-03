import dotenv from 'dotenv'
dotenv.config()

import { EnvSchema } from '../validator/env'

export const env = EnvSchema.parse(process.env)
