import { IUser } from '../src/api/v1/user/user.type'

declare module 'express' {
  export interface Request {
    user?: IUser
  }
}
