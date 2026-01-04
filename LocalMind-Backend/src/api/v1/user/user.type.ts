import { AllowedUserRoles } from './user.constant'

export type UserRole = (typeof AllowedUserRoles)[number]

export interface IUser {
  _id?: string
  firstName: string
  email: string
  password?: string
  role?: UserRole
  birthPlace: string
  location: string
  portfolioUrl?: string | null
  bio?: string | null
  apikey?: string | null
  model?: string | null
  modelApiKey?: string | null
  createdAt?: Date
  updatedAt?: Date
}
