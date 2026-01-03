export interface IUser {
  _id?: string | undefined
  name?: string | null
  email: string
  password?: string
  role?: string
  apikey?: string | null
  model?: string | null
  modelApiKey?: string | null
}
